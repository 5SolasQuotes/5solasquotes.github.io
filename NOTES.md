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
- Topics and Subtopics with no quotes are hidden (no page, not listed). They appear automatically when a quote is tagged to them.
- `topics/index.html` lists every visible Part, Topic and Subtopic with counts. The home page shows one card per Part.
- Polemics is its own Part, listed by opponent (Rome, Arminians, Socinians…). Every polemical quote is also filed under its doctrine, e.g. a quote against Trent on justification carries `justification/roman-justification` and `rome/justification`.
- Tags all look the same (plain grey pills). On a Part, Topic or Subtopic page, the tags belonging to that page are highlighted. Elsewhere nothing is highlighted. Polemics pills read "Opponent: Subtopic" (e.g. "Rome: Justification"); a subtopic name used in two topics is also prefixed with its topic.
- Old URLs (the earlier 15-category pages and older stubs) are redirect stubs to the nearest new page. The list is `tools/redirects.json`; keep it so old links never break.
- Baptism subtopics follow the tree. "Polemics › Anabaptists › Infant baptism" and "The Covenant of Grace › Children in the covenant" have no quotes and stay hidden. The old empty "Infant Baptism", "Believer's Baptism", "Mode of Baptism" and "Covenant Theology: Presbyterian View" entries never had pages, so there was nothing to redirect.
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
- `tools/build.py` turns these two files into the site: Part/Topic/Subtopic pages, the topics index, home cards, author pages and the authors index, new quote pages, tag pills on every other page, footers, and the old-URL redirects. It stops with a clear error if a tag slug is not in the tree. Search (`assets/site.js`) reads both JSON files in the browser, so tag names, topics and parts are all searchable.

## 5. Adding a quote
1. Add one entry to `assets/quotes-index.json` (copy an existing one). Give it a new 10-character hex `id`, and fill in the text, author (`a`, and `as_` = the author page slug), work, location, link and Share-on-X link (the FULL quote, see section 3).
2. Set `tags` to one or more slugs from `assets/tree.json`, main one first. A quote may carry tags in several topics. A polemical quote gets both its doctrine tag and its Polemics tag.
3. Run `python3 tools/build.py`. It creates the quote's permalink page and, if needed, the author's page, and updates counts everywhere. A Topic or Subtopic that was hidden appears as soon as it has a quote.
4. If a quote fits nowhere, tag the nearest Topic and add it to `REVIEW.md`. To add a new subtopic, add it to `assets/tree.json` in the right place first. Ask the owner before changing the tree.
5. Check the page locally, then commit and push.

## 6. About and links pages
- `about.html` is the real About page (no placeholder) and the single page for social links (the "Follow along" cards, `#follow`). `links.html` is only a redirect stub to `about.html`; keep it, because links.html is the URL in the owner's Instagram/TikTok/YouTube bios. The footer links only to About (no separate Follow link). Accounts: X main @5Solas2, X quotes @TheVSolas, Instagram @_5solas_, TikTok @5.solas, YouTube channel "5 Solas" (UCwxNfXDulo42MjBxGiiQR1w). Update the About cards if an account changes.

## 7. Collections
- Collections are only for specific curated studies (currently: God Does Not Put Evil into Men's Hearts, Concupiscence Is Truly Sin, Mary Is Not the Queen of Heaven). Broad subjects like Providence and Union with Christ are topics, not collections; their old collection URLs redirect to the topic pages.

## 8. Scope
- Quotations from across church history: most come from Reformed, Puritan, Lutheran and Particular Baptist writers, but there are also many others (church fathers, medieval writers, Arminians, Roman Catholics and other traditions) whenever they state a truth worth quoting; the home tagline, About text and meta descriptions say this.
