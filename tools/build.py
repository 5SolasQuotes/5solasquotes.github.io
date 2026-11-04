#!/usr/bin/env python3
"""Rebuild the topic pages and everything that depends on quote tags.

Inputs (the only two files to edit):
  assets/tree.json          the topic tree: Part > Topic > Subtopic > fine tag
  assets/quotes-index.json  every quote; "tags" holds only tag slugs:
                            "topic", "topic/subtopic" or "topic/subtopic/fine"
Also read: tools/redirects.json (old URL -> new node, kept so old links work).

Run from anywhere:  python3 tools/build.py
"""
import json, os, re, glob, html, random, collections, unicodedata, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
esc = lambda s: html.escape(s, quote=True)
rd = lambda f: open(f, encoding='utf-8').read()
WROTE = set()
def wr(f, s):
    os.makedirs(os.path.dirname(f) or '.', exist_ok=True)
    if not os.path.exists(f) or rd(f) != s:
        open(f, 'w', encoding='utf-8').write(s)
    WROTE.add(f)
def qs(n): return f'{n} quotation' + ('' if n == 1 else 's')

TREE = json.load(open('assets/tree.json', encoding='utf-8'))
Q = json.load(open('assets/quotes-index.json', encoding='utf-8'))
BYID = {q['id']: q for q in Q}

# ---------------------------------------------------------------- the tree
PARTS = TREE['parts']
TOPIC, SUBT, FINE, PART_OF = {}, {}, {}, {}
for p in PARTS:
    for t in p['topics']:
        assert t['slug'] not in TOPIC, 'duplicate topic slug ' + t['slug']
        TOPIC[t['slug']] = t; PART_OF[t['slug']] = p
        for s in t['subtopics']:
            SUBT[t['slug'] + '/' + s['slug']] = s
            for f in s.get('fine', []):
                FINE[t['slug'] + '/' + s['slug'] + '/' + f['slug']] = f
POLEMICS = {t['slug'] for p in PARTS if p['slug'] == 'polemics' for t in p['topics']}
_names = collections.Counter(s['name'] for k, s in SUBT.items() if k.split('/')[0] not in POLEMICS)

def url(key):
    """site path of a node: 'part:x', 'topic', 'topic/sub', 'topic/sub/fine'"""
    if key.startswith('part:'): return f'topics/{key[5:]}.html'
    return f'topics/{key}.html'
def pill(key):
    """(name, url) shown on a quote for one of its tags"""
    b = key.split('/')
    if len(b) == 1: return TOPIC[b[0]]['name'], url(key)
    if len(b) == 3: return FINE[key]['name'], url('/'.join(b[:2]))
    n = SUBT[key]['name']
    if b[0] in POLEMICS or _names[n] > 1: n = TOPIC[b[0]]['name'] + ': ' + n
    return n, url(key)

# ------------------------------------------------- quote sets per node
SETS = collections.defaultdict(list)          # node key -> quotes (unique, index order)
def addto(k, q):
    if not SETS[k] or SETS[k][-1] is not q:
        if q not in SETS[k]: SETS[k].append(q)
errors = []
for q in Q:
    if not q.get('tags'): errors.append(f'{q["id"]}: no tags')
    for k in q.get('tags', []):
        b = k.split('/')
        if (len(b) == 1 and k not in TOPIC) or (len(b) == 2 and k not in SUBT) or (len(b) == 3 and k not in FINE) or len(b) > 3:
            errors.append(f'{q["id"]}: unknown tag "{k}"'); continue
        t = b[0]
        addto('part:' + PART_OF[t]['slug'], q); addto(t, q)
        if len(b) >= 2: addto('/'.join(b[:2]), q)
        if len(b) == 3: addto(k, q)
if errors: sys.exit('Tag errors:\n' + '\n'.join(errors))
N = lambda k: len(SETS.get(k, []))
# Every category in tree.json gets a page and a line in the outline, filled or not:
# empty ones show "No quotations filed here yet." and fill up when quotes are tagged to them.

# ------------------------------------------------------ shared markup
def page_shell(src, depth):
    """head and footer from a page at the given depth, with prefixes made generic"""
    p = '../' * depth
    h, f = src[:src.index('<main')], src[src.index('</main>'):]
    return h.replace(p, '{P}') if p else h, f.replace(p, '{P}') if p else f
SHELL_SRC = rd('topics/index.html')
HEAD, FOOT = page_shell(SHELL_SRC, 1)
def head(pre, title, desc):
    h = HEAD.replace('{P}', pre)
    h = re.sub(r'<title>.*?</title>', f'<title>{esc(title)} · 5 Solas Quotes</title>', h, count=1)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(desc)}">', h, count=1)
    if '<meta name="description"' not in h: h = h.replace('</title>', f'</title><meta name="description" content="{esc(desc)}">', 1)
    return h
def foot(pre): return FOOT.replace('{P}', pre)

def tags_html(q, pre, here=()):
    """where a quote is filed: plain text, no links (navigation lives in the outline, not on the quotes)"""
    ks = list(q['tags'])
    if here: ks = [k for k in ks if k in here] + [k for k in ks if k not in here]
    return ''.join(f'<span class="t{" here" if k in here else ""}">{esc(pill(k)[0])}</span>' for k in ks)
def render(q, pre, here=()):
    cap = f'— <a href="{pre}authors/{q["as_"]}.html">{esc(q["a"])}</a>, <cite>{esc(q["w"])}</cite>' + (f', {esc(q["l"])}' if q['l'] else '')
    plain = f'— {q["a"]}, {q["w"]}' + (f', {q["l"]}' if q['l'] else '')
    copy = esc(f'“{q["t"]}”\n\n{plain}')
    src = (f'<a class="src" href="{esc(q["u"])}" rel="noopener" target="_blank">Read it online · {esc(q["ul"])}</a>' if q['u']
           else '<span class="src none">No free online copy linked</span>')
    act = f'<button class="copy" data-copy="{copy}">Copy</button><a class="share" href="{esc(q["x"])}" target="_blank" rel="noopener">Share on X</a><a class="perma" href="{pre}quote/{q["id"]}.html">Permalink</a>{src}'
    return (f'<figure class="quote" id="q-{q["id"]}" data-kw="{esc(q.get("kw", ""))}">\n<blockquote><p>{esc(q["t"])}</p></blockquote>\n'
            f'<figcaption>{cap}</figcaption>\n<div class="meta">{tags_html(q, pre, here)}</div>\n<div class="actions">{act}</div>\n</figure>')
def subline(L):
    if not L: return ''
    na = len({q['as_'] for q in L})
    return f'<p class="sub">{qs(len(L))} from {na} author' + ('' if na == 1 else 's') + '</p>'
def line(depth, name, href, n, cur=False):
    """one line of an outline: name, dotted leader, count. The current page is bold plain text, every other line is a link."""
    cls = f'd{depth}' + (' cur' if cur else '') + (' nil' if n == 0 else '')
    nm = (f'<span class="n" aria-current="page">{esc(name)}</span>' if cur else f'<a class="n" href="{href}">{esc(name)}</a>')
    return f'<li class="{cls}">{nm}<span class="lead"></span><span class="c">{n}</span></li>'
def outline(lines, extra=''): return f'<ul class="toc{extra}">' + ''.join(lines) + '</ul>'

# ------------------------------------------------------ drill-down pages
def node_page(key):
    b = [] if key.startswith('part:') else key.split('/')
    depth = 1 + max(len(b) - 1, 0)
    pre = '../' * depth                      # to site root
    tp = '../' * (depth - 1)                 # to topics/
    H = lambda k: tp + url(k)[len('topics/'):]        # link to node k from this page
    part = PARTS_BY[key[5:]] if not b else PART_OF[b[0]]
    pk = 'part:' + part['slug']
    # breadcrumb: Topics > Part > Topic > Subtopic, the page you are on is plain text, nothing trails after it
    chain = [('Topics', tp + 'index.html')]
    if b: chain.append((part['name'], H(pk)))
    if len(b) >= 2: chain.append((TOPIC[b[0]]['name'], H(b[0])))
    if len(b) == 3: chain.append((SUBT['/'.join(b[:2])]['name'], H('/'.join(b[:2]))))
    name = part['name'] if not b else TOPIC[b[0]]['name'] if len(b) == 1 else SUBT[key]['name'] if len(b) == 2 else FINE[key]['name']
    crumbs = ' › '.join(f'<a href="{u}">{esc(n)}</a>' for n, u in chain) + f' › <span class="cur">{esc(name)}</span>'
    # outline: the current page in bold, its parent above it, what is under it indented
    if not b:
        L = [line(0, part['name'], '', N(pk), True)] + [line(1, t['name'], H(t['slug']), N(t['slug'])) for t in part['topics']]
    elif len(b) == 1:
        t = TOPIC[b[0]]
        L = [line(0, t['name'], '', N(b[0]), True)] + [line(1, s['name'], H(b[0] + '/' + s['slug']), N(b[0] + '/' + s['slug'])) for s in t['subtopics']]
    else:
        t = TOPIC[b[0]]; sk = '/'.join(b[:2])
        L = [line(0, t['name'], H(b[0]), N(b[0]))]
        for s in t['subtopics']:
            k = b[0] + '/' + s['slug']
            L.append(line(1, s['name'], H(k), N(k), k == key))
            if k == sk:
                L += [line(2, f['name'], H(k + '/' + f['slug']), N(k + '/' + f['slug']), k + '/' + f['slug'] == key) for f in s.get('fine', [])]
    here = {k for k in SETS if k == key or k.startswith(key + '/') or (not b and k.split('/')[0] in {t['slug'] for t in part['topics']})}
    if not b: here.discard(key)
    Q_ = SETS.get(key, [])
    desc = (' — '.join([name] + [c[0] for c in reversed(chain[1:])]) if b
            else f'{name}: ' + ', '.join(t['name'] for t in part['topics']))
    body = (f'<main class="wrap"><p class="crumbs">{crumbs}</p><h1>{esc(name)}</h1>{subline(Q_)}'
            + ('' if Q_ else '<p class="noq">No quotations filed here yet.</p>') + outline(L) + ''.join(render(q, pre, here) for q in Q_))
    wr(url(key), head(pre, name, desc) + body + foot(pre))
PARTS_BY = {p['slug']: p for p in PARTS}
GEN = set()
for p in PARTS:
    node_page('part:' + p['slug']); GEN.add(url('part:' + p['slug']))
    for t in p['topics']:
        node_page(t['slug']); GEN.add(url(t['slug']))
        for x in t['subtopics']:
            k = t['slug'] + '/' + x['slug']
            node_page(k); GEN.add(url(k))
            for f in x.get('fine', []):
                node_page(k + '/' + f['slug']); GEN.add(url(k + '/' + f['slug']))

# ------------------------------------------------------ topics index
s = rd('topics/index.html')
body = ('<main class="wrap"><h1>Topics</h1><p class="lede">Arranged in the order of the classic Reformed systematic theologies, '
        'from Prolegomena to Last Things, with Polemics last. Every part, topic and subtopic has its own page, filled or not; '
        'a quotation filed in several places is counted once.</p>'
        '<p class="jump">' + ' <span>·</span> '.join(f'<a href="#{p["slug"]}">{esc(p["name"])}</a>' for p in PARTS) + '</p>')
for p in PARTS:
    pk = 'part:' + p['slug']
    body += f'<h2 class="sect" id="{p["slug"]}"><a href="{p["slug"]}.html">{esc(p["name"])}</a> <span class="count">{N(pk)}</span></h2>'
    L = []
    for t in p['topics']:
        L.append(line(0, t['name'], f'{t["slug"]}.html', N(t['slug'])))
        L += [line(1, x['name'], f'{t["slug"]}/{x["slug"]}.html', N(t['slug'] + '/' + x['slug'])) for x in t['subtopics']]
    body += outline(L, ' all')
wr('topics/index.html', s[:s.index('<main')] + body + s[s.index('</main>'):]); GEN.add('topics/index.html')

# ------------------------------------------------------ authors
CORP = {'Bohemian Brethren','French Reformed Churches','Geneva translators','Particular Baptists','Reformed delegates at the Colloquy of Thorn','Synod of Debrecen','Synod of Dort','Westminster Assembly','Church of England','Church of Ireland','Scottish Reformers'}
SPECIAL = {'Pierre Du Moulin': 'du moulin', 'Louis Le Blanc': 'le blanc'}
def strip(x): return ''.join(ch for ch in unicodedata.normalize('NFD', x) if unicodedata.category(ch) != 'Mn').lower()
def akey(a):
    if a in CORP: return (strip(a), a)
    if a in SPECIAL: return (SPECIAL[a], a)
    p = re.split(r' & |, ', a)[0]
    p = re.sub(r' of [A-Z]\w+$', '', p) if p.split()[0] not in ('Athanasius', 'John') or 'Wamphray' in p else p
    if p.startswith('Athanasius'): return ('athanasius', a)
    return (strip(p.split()[-1]), a)
AUTH = collections.OrderedDict()
for q in Q: AUTH.setdefault(q['as_'], [q['a'], []])[1].append(q)
order = sorted(AUTH, key=lambda k: akey(AUTH[k][0]))
s = rd('authors/index.html')
letters = list(dict.fromkeys(akey(AUTH[k][0])[0][0].upper() for k in order))
body = '<h1>Authors</h1><p class="letters">' + ''.join(f'<a href="#L{L}">{L}</a>' for L in letters) + '</p>'
for L in letters:
    body += f'<h2 id="L{L}" class="letter">{L}</h2><ul class="index">' + ''.join(
        f'<li><a href="{k}.html">{esc(AUTH[k][0])}</a> <span class="count">{len(AUTH[k][1])}</span></li>' for k in order if akey(AUTH[k][0])[0][0].upper() == L) + '</ul>'
wr('authors/index.html', s[:s.find('<h1>Authors</h1>')] + body + s[s.find('</main>'):]); GEN.add('authors/index.html')
APT = rd('authors/ezekiel-hopkins.html')
for k in order:
    a, L = AUTH[k]; f = f'authors/{k}.html'
    works = '; '.join(f'<cite>{esc(w)}</cite>' for w in sorted({q['w'] for q in L}, key=lambda w: w.lower()))
    if os.path.exists(f): src = rd(f)
    else:
        m = re.search(r'<h1>(.*?)</h1>', APT); src = APT.replace(m.group(1), esc(a))
    src = re.sub(r'<title>.*? · 5 Solas Quotes</title>', f'<title>{esc(a)} · 5 Solas Quotes</title>', src, count=1)
    groups = collections.OrderedDict((p['slug'], []) for p in PARTS)
    for q in L: groups[PART_OF[q['tags'][0].split('/')[0]]['slug']].append(q)
    main = (f'<main class="wrap"><p class="crumbs"><a href="index.html">Authors</a> › <span class="cur">{esc(a)}</span></p><h1>{esc(a)}</h1><p class="sub">{qs(len(L))} · Works cited: {works}</p>'
            + ''.join(f'<h2 class="sect"><a href="../topics/{g}.html">{esc(PARTS_BY[g]["name"])}</a></h2>' + ''.join(render(q, '../') for q in G) for g, G in groups.items() if G))
    wr(f, src[:src.index('<main')] + main + src[src.index('</main>'):]); GEN.add(f)

# ------------------------------------------------------ new quote pages
QT = rd('quote/90b2694bf6.html')
for q in Q:
    f = f'quote/{q["id"]}.html'
    if os.path.exists(f): continue
    s = re.sub(r'<title>.*?</title>', f'<title>{esc(q["a"])}: {esc(q["t"][:60])}… · 5 Solas Quotes</title>', QT, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{esc(q["t"][:150])}">', s, count=1)
    k0 = q['tags'][0]; t0 = k0.split('/')[0]
    pool = [r for r in SETS['/'.join(k0.split('/')[:2])] if r is not q]
    if len(pool) < 4: pool += [r for r in SETS[t0] if r is not q and r not in pool]
    random.seed(q['id']); rel = random.sample(pool, min(4, len(pool)))
    i = s.find('<main class="wrap">') + len('<main class="wrap">'); j = s.find('</main>')
    s = s[:i] + render(q, '../') + ('<h2 class="sect">Related quotations</h2>' + ''.join(render(r, '../') for r in rel) if rel else '') + s[j:]
    wr(f, s); GEN.add(f)

# ------------------------------------------------------ home page
s = rd('index.html')
cards = ''.join(
    f'<a class="lcard{" pol" if p["slug"] == "polemics" else ""}" href="topics/{p["slug"]}.html"><span class="ln">{esc(p["name"])}</span>'
    f'<span class="lc">{qs(N("part:" + p["slug"]))}</span><span class="ls">{esc(", ".join(t["name"] for t in p["topics"]))}</span></a>'
    for p in PARTS)
s = re.sub(r'(<div class="cards">).*?(</div><p class="more">)', lambda m: m.group(1) + cards + m.group(2), s, count=1, flags=re.S)
top = sorted(AUTH, key=lambda k: (-len(AUTH[k][1]), akey(AUTH[k][0])))[:12]
s = re.sub(r'(<section><h2 class="sect">Authors</h2><ul class="index compact">).*?(</ul>)', lambda m: m.group(1) + ''.join(
    f'<li><a href="authors/{k}.html">{esc(AUTH[k][0])}</a> <span class="count">{len(AUTH[k][1])}</span></li>' for k in top) + m.group(2), s, count=1, flags=re.S)
s = re.sub(r'All \d+ authors →', f'All {len(AUTH)} authors →', s)
wr('index.html', s)

# ------------------------------------------------------ redirects for old URLs
RED = json.load(open('tools/redirects.json'))
def rel(frm, to):
    return os.path.relpath(to, os.path.dirname(frm) or '.')
for old, tgt in RED.items():
    if old in GEN: continue
    if tgt.startswith('='): dest = tgt[1:]
    else:
        dest = url(tgt)
    if dest == old: continue
    r = rel(old, dest)
    wr(old, f'<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={r}"><link rel="canonical" href="{r}"><title>Moved</title><a href="{r}">Moved here</a>\n')

# ------------------------------------------------------ every other page: tag pills + footer
FOOTER = f'{len(Q)} quotations · {len(TOPIC)} topics · {len(AUTH)} authors'
FIG = re.compile(r'(<figure class="quote" id="q-(\w+)"[^>]*>)(.*?)(</figure>)', re.S)
for f in glob.glob('**/*.html', recursive=True):
    s = rd(f)
    if 'http-equiv="refresh"' in s: continue
    o = s
    if f not in GEN:
        pre = '../' * f.count('/')
        def fix(m):
            q = BYID.get(m.group(2))
            if not q: return m.group(0)
            inner = re.sub(r'<div class="meta">.*?</div>', lambda _: f'<div class="meta">{tags_html(q, pre)}</div>', m.group(3), count=1, flags=re.S)
            return re.sub(r' data-pol="[^"]*"', '', m.group(1)) + inner + m.group(4)
        s = FIG.sub(fix, s)
    s = re.sub(r'\d+ quotations · \d+ topics · \d+ authors', FOOTER, s)
    # collection pages: breadcrumb ends on the page you are on, no dangling arrow
    s = re.sub(r'(<p class="crumbs"><a href="index.html">Collections</a>) ›</p>(<h1>)(.*?)(</h1>)',
               lambda m: f'{m.group(1)} › <span class="cur">{m.group(3)}</span></p>{m.group(2)}{m.group(3)}{m.group(4)}', s, count=1)
    if s != o: wr(f, s)
filled = lambda ks: sum(N(k) > 0 for k in ks)
print(f'{len(Q)} quotes; filled: parts {filled(["part:" + p["slug"] for p in PARTS])}/{len(PARTS)}, topics {filled(TOPIC)}/{len(TOPIC)}, '
      f'subtopics {filled(SUBT)}/{len(SUBT)}, fine {filled(FINE)}/{len(FINE)}; all shown; files written {len(WROTE)}')
