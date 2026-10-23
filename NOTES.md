# 5 Solas Quotes: notes for whoever works on this site next

Treat this folder as the source of truth. Do not regenerate the site from an older topic structure or old styling, or the changes below will be overwritten. If a generator builds the pages, update it to produce what is here, then continue from this version.

## 1. Branding and style
- The owner's logo (`assets/logo.png`, `logo-96.png`, `favicon.png`) is in the header, the home-page hero and the favicon. Keep it.
- Dark gold/orange theme by default, plus a light theme and a sun/moon toggle in the nav. The choice is saved in localStorage. Colors are CSS variables in `assets/style.css`; keep using the variables so both themes keep working.

## 2. Topics
- 15 categories with subtopics, in classic loci order: Scripture, God, The Trinity, Decrees & Providence, Creation Angels & Man, The Fall & Sin, Covenant & Law, The Person of Christ, The Work of Christ, Salvation Applied, The Christian Life, The Church, Worship, Last Things, Polemics.
- URLs: `topics/<category>.html` and `topics/<category>/<subtopic>.html`. Old topic URLs are redirect stubs.
- Subtopics with no quotes show greyed out on `topics/index.html` with no page. A subtopic page is created once a quote is tagged to it.
- Every quote has a list of topics, with its main topic first. All tags look the same (plain grey pills). On a topic page, the tag for the topic you are viewing is highlighted gold, so it is always clear why the quote is there. On a category page, every tag in that category is highlighted. Elsewhere (home, authors, collections, search, quote pages) nothing is highlighted. Do not bring back the gold/grey/dashed tag colors or the tag key.
- Polemics tags (Rome: Mary, Rome: Saints, Rome: Images & Idolatry, Against Infant Baptism, etc.) are ordinary tags. A quote that mainly answers a specific error lists the polemics tag first, and also carries the doctrine tag.
- Include all views. Infant baptism and Presbyterian covenant theology quotes are allowed. There are separate subtopics for Believer's Baptism, Infant Baptism, Mode of Baptism, and Covenant Theology: Baptist View / Presbyterian View.

## 3. Sharing
- Share on X must carry the FULL quote: the quote, then author, work and location, then the permalink. Do not truncate it.

## 4. Data
- `assets/quotes-index.json` is the master list. Each quote's `tg` array is `[name, root-relative url, css class]`, main topic first (css class is just `tag`). Keep the quote ids, the permalink pages in `quote/`, and the search working.

## 5. Adding new quotes
- File each quote into these topics: a main topic first, then any secondary topics.
- If a quote does not fit any subtopic, tell the owner so they can decide on a new one.
- Before changing the structure or restyling, ask the owner first.

## 6. About and links pages
- `about.html` is the real About page (no placeholder). `links.html` is a link-tree style page for Instagram/TikTok/YouTube bios. Accounts: X main @5Solas2, X quotes @TheVSolas, Instagram @_5solas_, TikTok @5.solas, YouTube channel "5 Solas" (UCwxNfXDulo42MjBxGiiQR1w). Update both pages if an account changes.

## 7. Collections
- Collections are only for specific curated studies (currently: God Does Not Put Evil into Men's Hearts, Concupiscence Is Truly Sin, Mary Is Not the Queen of Heaven). Broad subjects like Providence and Union with Christ are topics, not collections; their old collection URLs redirect to the topic pages.

## 8. Scope
- Quotations from across church history: most come from Reformed, Puritan, Lutheran and Particular Baptist writers, but there are also many others (church fathers, medieval writers, Arminians, Roman Catholics and other traditions) whenever they state a truth worth quoting; the home tagline, About text and meta descriptions say this.
