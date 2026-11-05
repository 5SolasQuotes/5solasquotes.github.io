# 5 Solas Quotes: notes for whoever works on this site next

Treat this folder as the source of truth. Do not regenerate the site from an older topic structure or old styling, or the changes below will be overwritten. If a generator builds the pages, update it to produce what is here, then continue from this version.

## 1. Branding and style
- The owner's logo (`assets/logo.png`, `logo-96.png`, `favicon.png`) is in the header, the home-page hero and the favicon. Keep it.
- Dark gold/orange theme by default, plus a light theme and a sun/moon toggle in the nav. The choice is saved in localStorage. Colors are CSS variables in `assets/style.css`; keep using the variables so both themes keep working.

## 2. Topics: the tree
- The topics follow the owner's tree (the order and divisions of Turretin, Heidegger, Mastricht, à Brakel, Witsius and the Westminster Confession). It has four levels: **Part → Topic → Subtopic → fine tag**. The whole tree lives in one file, `assets/tree.json`. Keep its order exactly; do not alphabetize, merge or drop entries.
- 11 Parts: Prolegomena; God; The Decrees and Works of God; The Covenant of Works, the Fall, and Sin; The Law and the Covenant of Grace; Christ; The Application of Redemption; The Church and the Means of Grace; Worship, the Christian Life, and Society; Last Things; Polemics. Parts are shown by name only (no Roman numerals, no topic numbers, no source codes).
- URLs, one per level:
  - Part: `topics/<part>.html`, all quotes in the Part plus a list of its Topics.
  - Topic: `topics/<topic>.html`, all quotes in the Topic plus a list of its Subtopics.
  - Subtopic: `topics/<topic>/<subtopic>.html`, only that Subtopic's quotes.
  - Fine tag (only once one is used): `topics/<topic>/<subtopic>/<fine>.html`.
  - Every page has clickable breadcrumbs (Topics › Part › Topic) and a count. A quote filed in several children is counted once in the parent.
- Topics and Subtopics with no quotes are still shown: each has a page that says "No quotations filed here yet." and a count of 0 in the outline.
- `topics/index.html` lists every visible Part, Topic and Subtopic with counts. The home page shows one card per Part.
- Polemics is its own Part, listed by opponent (Rome, Arminians, Socinians…). Every polemical quote is also filed under its doctrine, e.g. a quote against Trent on justification carries `justification/roman-justification` and `rome/justification`.
- Tags all look the same (plain grey pills). On a Part, Topic or Subtopic page, the tags belonging to that page are highlighted. Elsewhere nothing is highlighted. Polemics pills read "Opponent: Subtopic" (e.g. "Rome: Justification"); a subtopic name used in two topics is also prefixed with its topic.
- Old URLs (the earlier 15-category pages and older stubs) are redirect stubs to the nearest new page. The list is `tools/redirects.json`; keep it so old links never break.
- Baptism subtopics follow the tree. "Polemics › Anabaptists › Infant baptism" and "The Covenant of Grace › Children in the covenant" have no quotes yet; their pages show as empty. The old empty "Infant Baptism", "Believer's Baptism", "Mode of Baptism" and "Covenant Theology: Presbyterian View" entries never had pages, so there was nothing to redirect.
- `REVIEW.md` lists quotes that did not clearly fit a subtopic and were filed in the nearest place.

## 3. Sharing
- Share on X must carry the FULL quote: the quote, then author, work and location, then the permalink. Do not truncate it.

## 4. Data
- `assets/tree.json`: the tree. `{"parts":[{"slug","name","topics":[{"slug","name","subtopics":[{"slug","name","fine":[{"slug","name"}]}]}]}]}`. Slugs are kebab-case titles. Topic slugs are unique across the whole tree.
- `assets/quotes-index.json`: the master list of quotes. Each quote stores only its tag slugs in `tags`, main tag first:
  - `"justification/nature-of-justification"`: a subtopic (the usual case)
  - `"justification"`: the topic itself, when no subtopic fits
  - `"justification/nature-of-justification/<fine>"`: a fine tag
  - Parents (Topic, Part) are worked out from the tree, so never list them separately.
- Other quote fields: `id` (permalink id, never change it), `t` text, `a` author, `as_` author slug, `w` work, `l` location, `u`/`ul` free online copy link and label, `x` Share-on-X link, `kw`/`st` extra search words.
- `tools/build.py` turns these two files into the site: Part/Topic/Subtopic pages, the topics index, home cards, author pages and the authors index, new quote pages, plain-text "Filed under" tags on every other page, footers, and the old-URL redirects. It stops with a clear error if a tag slug is not in the tree. Search (`assets/site.js`) reads both JSON files in the browser, so tag names, topics and parts are all searchable.

## 5. Adding a quote
1. Add one entry to `assets/quotes-index.json` (copy an existing one). Give it a new 10-character hex `id`, and fill in the text, author (`a`, and `as_` = the author page slug), work, location, link and Share-on-X link (the FULL quote, see section 3).
2. Set `tags` to one or more slugs from `assets/tree.json`, main one first. A quote may carry tags in several topics. A polemical quote gets both its doctrine tag and its Polemics tag.
3. Run `python3 tools/build.py`. It creates the quote's permalink page and, if needed, the author's page, and updates counts everywhere. Every category already has a page, so nothing needs to be created or un-hidden: its count just goes up.
4. If a quote fits nowhere, tag the nearest Topic and add it to `REVIEW.md`. To add a new subtopic, add it to `assets/tree.json` in the right place first. Ask the owner before changing the tree.
5. Check the page locally, then commit and push.

## 6. About and links pages
- `about.html` is the real About page (no placeholder) and the single page for social links (the "Follow along" cards, `#follow`). `links.html` is only a redirect stub to `about.html`; keep it, because links.html is the URL in the owner's Instagram/TikTok/YouTube bios. The footer links only to About (no separate Follow link). Accounts: X main @5Solas2, X quotes @TheVSolas, Instagram @_5solas_, TikTok @5.solas, YouTube channel "5 Solas" (UCwxNfXDulo42MjBxGiiQR1w). Update the About cards if an account changes.

## 7. Collections
- Collections are only for specific curated studies (currently: God Does Not Put Evil into Men's Hearts, Concupiscence Is Truly Sin, Mary Is Not the Queen of Heaven). Broad subjects like Providence and Union with Christ are topics, not collections; their old collection URLs redirect to the topic pages.

## 8. Scope
- Quotations from across church history: most come from Reformed, Puritan, Lutheran and Particular Baptist writers, but there are also many others (church fathers, medieval writers, Arminians, Roman Catholics and other traditions) whenever they state a truth worth quoting; the home tagline, About text and meta descriptions say this.

## Re-tagging pass (2026-11-04)
All 718 quotations were re-filed by hand against the tree: one main tag (the doctrine the passage is actually about) first, then at most two or three secondary tags; polemics against Rome are filed under the doctrine and under `rome/…`. Tags with no support in the quotation's text were removed. Empty topics and subtopics are still shown, with a count of 0, until a quotation is filed there.

## Navigation and empty categories (2026-11-04)
- **Every category is always shown**, whether it has quotes or not (Part, Topic, Subtopic and fine tag: 11 / 64 / 366 / 1,043). An empty one has a page that says "No quotations filed here yet." and a count of 0 in the outline. Do not reintroduce hiding of empty nodes.
- **Navigation is a plain outline, not buttons or pills.** Each Part, Topic, Subtopic and fine page starts with `Topics › Part › Topic › Subtopic` (the current page is plain text, nothing trails after it), then an outline: the current page in bold with a left rule, its parent above it, its children indented underneath, each line `name ........ count`. A Subtopic page lists its sibling subtopics so you can switch without going back up, with the current subtopic's fine tags indented beneath it. A Topic or Part page shows everything under it in the quotes below the outline (broad first, then narrow by clicking a line).
- **Tags on quote cards are links** (see "Arrows and linked tags" below). The tag that matches the page you are on is darker.
- `topics/index.html` is the whole outline: every Part with every Topic and Subtopic, with a jump list of the Parts at the top.
- Markup lives in `tools/build.py` (`line()`, `outline()`, `node_page()`); styles are the `ul.toc`, `.crumbs .cur`, `.meta` and `p.noq` rules at the end of `assets/style.css`.
- Fixed an old bug in `assets/site.js`: the stylesheet link carries `?v=...`; path prefix is taken from the part before `assets/style.css`, and the same `?v=` is reused for `tree.json` / `quotes-index.json` / `authors.json` fetches so returning visitors get fresh quote data. `tools/build.py` stamps a fresh `?v=YYYYMMDD-githash` on every HTML `style.css` / `site.js` link each run — no manual bump.

## Justification re-worked (2026-11-04)
Justification now follows the old divines' causes and the points they debated: Nature; Forensic, Not Moral; Justification and Sanctification Distinguished; Efficient Cause; Meritorious Cause; Active and Passive Obedience Imputed; Formal Cause: Imputation; Instrumental Cause: Faith Alone; Faith Not Our Righteousness; Final Cause; Justification and Christ's Resurrection; Justification from Eternity; Paul and James; Justification in the Old Testament; Justification and Good Works; Fruits; Perseverance; Final Justification; The Article of a Standing or Falling Church; then the Roman errors (Roman Justification, Infused Righteousness, Merit of Congruity and Condignity, Twofold Justification and Its Increase). All 149 Justification quotes were re-filed against it; Final Cause, Resurrection, Justification from Eternity and Merit of Congruity are empty until quotes are added. The same treatment (more distinctions and the points under debate) can be applied to any other topic.

## Fine tags filled in (2026-11-04)
- Quotes are now filed into the fine tags, not only the subtopics. 628 of the 718 quotations carry at least one fine tag (1,105 fine-tag placements; 270 of the 862 fine tags have quotes). Filing a quote into a fine tag replaces its `topic/sub` tag with `topic/sub/fine` in place; a fine tag still counts toward its subtopic, topic and Part, and a quote is counted once in roll-ups.
- **Rule used:** give a fine tag only where one clearly fits; allow a second where both clearly fit; otherwise leave the quote on the subtopic. A subtopic count is therefore often larger than the sum of its fine tags: the remainder are quotes about the subtopic in general.
- Fine tags display everywhere as "Subtopic › Fine" (`pill()` in `tools/build.py`, `prep()` in `assets/site.js`), so a fine tag is never ambiguous when two subtopics share a name such as "Comfort in providence".
- To file a new quote, add the fine slug to its `tags` in `assets/quotes-index.json` (`topic/sub/fine`) instead of `topic/sub`, then run `python3 tools/build.py`.

## Every subtopic now has fine tags (2026-11-04)
- The last 48 subtopics that had no fine tags (The Father, Conditional Election, Pelagianism and Semi-Pelagianism, Deathbed Repentance, the Polemics subtopics against Socinians, Arminians, Amyraldians, Lutherans, Anabaptists, Antinomians, Quakers and modern errors, and others) were given 3 to 5 distinctions each, following the old divines. The tree now has 1,043 fine tags and no subtopic without any.
- 36 quotations that sat in those subtopics were filed into the new fine tags (same rule as before: only where one clearly fits). Most of the new fine tags are empty until quotations are added.
- Wording of the new Polemics fine tags is neutral (for example "Baptism of believers only", "Infants in the covenant") because the site quotes both sides.


## Arrows and linked tags (2026-11-04)
- **Outline is collapsible with native `<details>`/`<summary>`, no JS.** Markup is `<ul class="toc"><li class="dN [cur] [nil] [leaf]"><details [open]><summary><a class="r">name ..... count</a></summary><ul>…children…</ul></details></li>` (`row()`, `item()`, `outline()`, and `sub_item()` inside `node_page()` in `tools/build.py`). Tapping the name goes to that page; tapping the arrow (the `summary::before` chevron, `›`, rotated 90 degrees when open) opens or closes that branch in place without leaving the page. The line for the page you are on has no link, so tapping it folds or unfolds it. The branch on the path to the current page is open when the page loads; everything else is closed.
- **Every name in a quote's "Filed under" line is its own link.** A fine tag shows as two links, "Subtopic › Fine", each going to its own page (`tag_segs()` and `tags_html()` in `tools/build.py`; `M[k][3]` and `card()` in `assets/site.js`, used by search and "Quote of the moment"). The tag matching the current page is darker (`.t.here`).
- `topics/index.html` is the same outline for the whole tree: each Topic is a collapsed `details.locus`, and the "Expand all" / "Collapse all" text link (`#expand`, handler in `site.js`) opens or closes every one. `ul.toc .locus` in `style.css` strips the old card styling so it stays a plain outline.
- Styles: the `ul.toc` block and `.meta a` rules in `assets/style.css`. Asset `?v=` is stamped by `tools/build.py` on every build.

## Search page rebuilt with options (2026-11-04)
- `search.html` has a search box and an "Options" fold (a `<details>`, plain labelled dropdowns, no pills). Open by default on wide screens, closed on phones until an option is set; the heading shows "· N set" when options are on. Everything is kept in the URL (`?q=…&author=…&era=…`), so a search can be shared.
- **How it matches** (`assets/site.js`, the block that starts at `const fold=`): *Look in* (everything, quotation text, author, work and location, topics and keywords, Scripture references); *Match* (all words, any word, exact phrase); *Word forms* (similar forms = justify/justified/justification via `stem()` and `variants()`, whole words only, part of a word). Typed syntax also works: `"exact phrase"` and `-word` to leave a word out. Matching is accent-blind. Results are ranked (author, topic and quotation-text hits weigh differently) and the matching words, or the matching phrase, are highlighted.
- **Scripture references:** a query such as `Rom. 3:28`, `Psalm 51` or `1 Cor. 15:20-22` finds quotations whose text or location cites that passage (`refsOf()`, book names in `BKS`). If nothing cites the exact verse it offers the whole chapter.
- **Filters** (each dropdown shows live counts given the other choices, and lists only what has hits): Author, Topic (Part, Topic, Subtopic and fine tag, with dashes for depth), Work, Period, Length (short up to 40 words, medium 41 to 100, long over 100), Online copy. **Sort:** best match, author, work, oldest or newest period, shortest, longest, random. With no search words the page works as a filter browser. Results show 25 at a time with "Show 25 more" and "Show all". A search with no results offers the nearest alternatives (any word, part of a word, look in everything, clear filters).
- **Period** comes from `tools/author-periods.json` (author slug to `early`, `medieval`, `1500s`, `1600s`, `1700s`, `1800s` or `1900s`), which is edited by hand and means the century in which the author mainly wrote. `tools/build.py` writes `assets/authors.json` (sort order and period) from it on every build and prints any author that has no period yet; unplaced authors appear under "Not placed" (currently William Cooper). Add each new author's period when adding their quotations.
- Asset `?v=` is stamped by `tools/build.py` on every build (also cache-busts the JSON fetches via `site.js`).

## Authors listed last name first (2026-11-04)
- The Authors page (`authors/index.html`) and the search page's Author filter show names as "Last, First" ("Owen, John", "Brakel, Wilhelmus à", "Mastricht, Petrus van", "Du Moulin, Pierre"), sorted by that form. Each author page's heading, `<title>` and breadcrumb use the same form. Quote captions, quote-page titles, the author page description, the home page list and the Work filter keep the natural order ("John Owen").
- The form comes from `sort_name()` in `tools/build.py`: the last word goes first; a lower-case particle (de, van, à…) moves after the given name; a capitalised article (Du, Le) stays with the surname; Jr./Sr./II/III go at the end; with several authors only the first is turned round; church bodies and "X of Place" names (Athanasius of Alexandria) stay as they are. When the rule is wrong for a name, add the slug and the wanted form to `tools/author-names.json`.
- `assets/authors.json` is `{slug: [sort position, period, "Last, First"]}`. Search matches an author by either order.

## Attribution on two lines (2026-11-04)
- Every quote card (topic, author, collection and quote pages, search results, the home quote of the moment) shows the attribution on two left-aligned lines under the quote: "Author:" with the author linked to the author page, then "Work:" with the title and the place in it (chapter, page). One label, "Work:", is used for every item, including confessions, letters and sermons.
- Built by `caption()` in `tools/build.py` (also applied to existing quote, collection and home pages in the final pass) and by `card()` in `assets/site.js`; styles are the `.quote figcaption .by/.wk/.lbl` rules at the end of `assets/style.css`.
- "Read it online" stays in the button row. The Copy button still copies the one-line citation ("— John Owen, Work, p. 123").

## Submit a Quote (2026-11-05)
- `submit.html` is a visitor form (quotation, author, work, location, edition, link, how they found it, suggested topic, optional name/email). It is linked as "Submit" in the nav and "Submit a quote" in the footer on every page (added in the last loop of `tools/build.py`), and every Part/Topic/Subtopic page has a "Know a quotation for this topic? Submit it for review" line that prefills the topic (`submit.html?topic=...`).
- The site is static, so the form posts to Web3Forms (https://web3forms.com), which emails each submission to the owner. Nothing is published automatically. The access key is the `KEY` constant near the top of the script in `submit.html`; if it is empty the form tells visitors it is not switched on. The key is meant to be public.
- Review: check the quotation word for word against the source (the form records how the submitter found it). If accurate, add it to `assets/quotes-index.json` (section 5) and rebuild. If not, discard it.

## Bible reference links (2026-11-05)
Every page loads Literal Word's BibleTagger (`<script src="https://literalword.com/bible-tagger.js" data-version="ESV">`), added by tools/build.py. Bible references in quotes become links with a hover popup. To change the translation, edit `data-version` in build.py (NASB, LSB, ESV, NKJV, KJV) and rebuild.
