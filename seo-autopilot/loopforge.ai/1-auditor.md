# Stage 1: Auditor (baseline), 2026-10-17

Data source: crawl of the local repo only. Search Console is not connected, so rankings, impressions, CTR and indexing are "needs GSC". Core Web Vitals are not measured (site not deployed at a known URL).

Domain assumption: `https://loopforge.ai`. That domain currently serves a GoDaddy placeholder. If the site lives elsewhere, replace `https://loopforge.ai` in index.html, terms.html, robots.txt, sitemap.xml and llms.txt.

| Check | Google health (before) | AI-search health (before) |
|---|---|---|
| Title / meta description | Title 80 chars (truncated in SERP) | n/a |
| Canonical | Missing | Missing |
| robots.txt | Missing | Missing (no AI crawler rules) |
| sitemap.xml | Missing | n/a |
| llms.txt | n/a | Missing |
| Structured data | 1 ProfessionalService block; `priceRange` claimed prices the page doesn't show | No FAQ / Organization entity |
| Citable answer passages | n/a | None: no FAQ, no direct "what is / how much / how long" answers |
| OG image | Relative URL (breaks on most platforms) | n/a |
| Headings | One h1; card titles used h3/h4 out of order | Same |
| Rankings, CTR, indexing | needs GSC | needs GSC |
| Core Web Vitals | not measured | n/a |

## 5 biggest problems (impact = traffic at stake x ease)
1. No answer content for buyer questions (cost, timeline, what an AI voice agent is): AI engines had nothing to cite. **Fixed**: 7-question FAQ + matching FAQPage schema.
2. No robots.txt / sitemap.xml: crawlers had no map and no explicit AI-crawler permission. **Fixed**.
3. No canonical, relative OG image. **Fixed**.
4. Weak entity signals (no Organization schema, no llms.txt). **Fixed**: Organization + WebSite + ProfessionalService + FAQPage graph, llms.txt.
5. Schema `priceRange` contradicted the visible page and terms ("no fixed prices"). **Removed**.

## 2026-10-17 update
- Work section replaced by Projects: 7 live client sites with screenshots, outbound links and an ItemList (WebSite) schema entry; llms.txt lists them.

## Not done (needs input)
- Stage 2 (AI-search spy) needs the 5 top buying questions from the business and a deployed URL.
- Stage 3 (keyword engine) needs GSC data.
