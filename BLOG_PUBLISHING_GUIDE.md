# Blog Scheduling Instructions

## Publishing Schedule
The publishing automation checks the queue **daily at approximately 8:15 AM Mountain Standard Time / 9:15 AM Mountain Daylight Time**. Articles are released on or after their `datePublished` date using the `America/Edmonton` time zone.

## How Scheduled Publishing Works

1. Add a complete article at `blog-scheduled/<queue-name>/index.html`.
2. Set its canonical URL to the intended public route under `/blog/`.
3. Set the JSON-LD `datePublished` and `dateModified` fields to the release date. Keep the visible “Published” date in sync.
4. Ensure the intended `/blog/<slug>/` route does not already exist.
5. Commit and push the queued post and workflow changes to `main`.

The `Publish Due Blog Posts` GitHub Actions workflow checks the queue daily. When a date is due, it moves the post into `/blog/<slug>/`, updates the blog listing and sitemap, commits the update, and deploys the site. The queue folder remains disallowed in `robots.txt`; only public `/blog/` routes are published and indexed.

### Important GitHub setup

- Scheduled Actions only run when the workflow file is present on the default branch (`main`).
- In GitHub, enable Actions and allow the workflow to write repository contents. The workflow needs `contents: write` and GitHub Pages deployment permissions.
- After pushing a new schedule, open **Actions → Publish Due Blog Posts → Run workflow** once to verify it. Scheduled runs can be delayed by GitHub, so the workflow checks daily and catches up overdue posts on its next successful run.
- Do not add a URL to the sitemap while it is still queued; the publisher adds the live URL when it publishes.

## Content Calendar Template

| Date | Title | Keywords | Status |
|------|-------|----------|--------|
| Mar 12 | Winterize Concrete Calgary | winterize, freeze-thaw, sealing | ✅ Published |
| Apr 2 | Spring Concrete Repair | spring repair, damage, cracks | 📝 Writing |
| Apr 9 | Driveway Cost Comparison | concrete vs asphalt, cost | 📅 Planned |
| Apr 16 | Driveway Lifespan | lifespan, durability, maintenance | 📅 Planned |
| Apr 23 | Best Concrete Sealers | sealers, products, reviews | 📅 Planned |

## SEO Best Practices (Per Post)

1. **Title:** Include Calgary + main keyword (40-60 chars)
2. **Meta Description:** 150-160 chars, include CTA
3. **Headings:** H1 (once), H2 (3-5), H3 (5+) with keywords
4. **Images:** Add alt text with keyword + context
5. **Internal Links:** 3-5 links to service pages per post
6. **Schema:** Use NewsArticle + FAQs for snippets
7. **Length:** 1,200-2,500 words (Google favors depth)
8. **CTA:** Link to contact form or phone number

## Analytics to Track

- **Organic Traffic:** Which posts drive most visits?
- **Engagement:** Average time on page, scroll depth
- **Conversions:** How many blog readers request quotes?
- **Backlinks:** Which posts attract external links?
- **Rankings:** Track keyword positions monthly

## Tools to Use

1. **Scheduling Posts:** Google Calendar (reminder to publish)
2. **SEO Monitoring:** Google Search Console (free)
3. **Keyword Research:** Ubersuggest or Google Trends (free)
4. **Analytics:** Google Analytics (free)

---

## Next Steps

1. Push this first blog post and `/blog/index.html` to GitHub
2. Monitor performance in Google Search Console (takes 2-4 weeks to index)
3. Write next post (Spring Concrete Repair) for April 2 publishing
4. Set calendar reminder every Wednesday at 8:45 AM to publish

**Expected Results:**
- Month 1-2: 0-100 monthly organic visitors
- Month 3-4: 200-400 monthly organic visitors
- Month 6: 500-800 monthly organic visitors
- Month 12: 1,500-2,500 monthly organic visitors from blog alone
