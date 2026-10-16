# Stage 4: Fixer (applied directly in repo), 2026-10-17

| Fix | Where |
|---|---|
| Title "AI Voice Agents for Clinics, Gyms & Salons \| Loopforge" (54 chars) | index.html `<title>` |
| Meta description (151 chars) | index.html |
| Canonical, absolute OG/Twitter image, og:locale | index.html, terms.html |
| JSON-LD graph: Organization, WebSite, ProfessionalService + OfferCatalog, FAQPage | index.html `<head>` |
| Visible FAQ (7 Q&As, same text as the schema) | index.html `#faq` |
| Citable answer block: hero lede + FAQ answers lead with the direct answer | index.html |
| robots.txt allowing search + AI answer crawlers, training crawlers flagged | /robots.txt |
| sitemap.xml | /sitemap.xml |
| llms.txt | /llms.txt |
| Semantic landmarks, one h1, ordered h2/h3, skip link | index.html |

## Plain-English deploy notes
- **robots.txt** tells crawlers what they may read; lives at `site.com/robots.txt`.
- **llms.txt** is a "menu" for AI engines describing the site; lives at `site.com/llms.txt`. Optional; Google ignores it, some AI tools read it.
- **Schema (JSON-LD)** labels content ("this is an FAQ") in the page `<head>`. If you edit an FAQ answer on the page, edit the matching schema answer too.

## After deploy
1. Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
2. Validate with Google's Rich Results Test.
3. Create a 1200x630 social image and point `og:image` at it (currently the square logo).
4. Create a Google Business Profile so "AI voice agent near me" style searches can find you.
