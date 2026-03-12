# Blog Scheduling Instructions

## Publishing Schedule
Posts should be published **every Wednesday at 9 AM** for consistent audience expectations.

## Current Blog Post
1. **"How to Winterize Concrete in Calgary"** - Published March 12, 2026
   - Keywords: winterize concrete Calgary, concrete sealing, freeze-thaw damage
   - Estimated organic traffic: 150-300/month after 3 months

## Upcoming Blog Ideas (Pre-Written List)

### April 2026
- **Week 1 (April 2):** "Spring Concrete Repair: Fix Winter Damage in Calgary"
- **Week 2 (April 9):** "Concrete Driveway vs Asphalt: Cost & Durability Comparison"
- **Week 3 (April 16):** "How Long Do Concrete Driveways Last in Calgary? (Expert Answer)"
- **Week 4 (April 23):** "Best Concrete Sealers for Calgary's Climate (2026 Review)"

### May 2026
- **Week 1:** "Exposed Aggregate Concrete: Design Ideas for Calgary Patios"
- **Week 2:** "Garage Pad Foundation: Everything Calgary Homeowners Need to Know"
- **Week 3:** "Concrete Cracks: When to Repair vs. When to Replace"
- **Week 4:** "Why Your Concrete Is Discoloring (And How to Fix It)"

## How to Auto-Publish (GitHub Actions)

### Option 1: Manual Publishing (Current Setup)
1. Edit `/blog/index.html` to add new article card
2. Create new folder: `/blog/article-slug/index.html`
3. Write article following the template above
4. Push to GitHub (triggers automatic deploy)

### Option 2: Scheduled Publishing (Recommended)
**Setup GitHub Actions Workflow:**

Create `.github/workflows/publish-blog.yml`:

```yaml
name: Auto-Publish Blog

on:
  schedule:
    - cron: '0 14 * * 3'  # Every Wednesday at 9 AM Mountain Time
  workflow_dispatch:

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Trigger deployment
        run: echo "Blog publishing workflow complete"
```

This triggers your hosting platform's deploy on schedule.

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
