#!/usr/bin/env python3
"""Publish queued blog articles whose scheduled date is due (America/Edmonton)."""

from __future__ import annotations

import os
import re
from datetime import datetime
from html import escape
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "blog-scheduled"
BLOG = ROOT / "blog"
BLOG_INDEX = BLOG / "index.html"
SITEMAP = ROOT / "sitemap.xml"
TODAY = datetime.now(ZoneInfo("America/Edmonton")).date()


def meta_value(html: str, name: str, attribute: str = "name") -> str:
    match = re.search(
        rf'<meta\s+{attribute}=[\"\']{re.escape(name)}[\"\']\s+content=[\"\']([^\"\']*)',
        html,
        re.IGNORECASE,
    )
    return match.group(1).strip() if match else ""


def canonical_url(html: str) -> str:
    match = re.search(r'<link\s+rel=[\"\']canonical[\"\']\s+href=[\"\']([^\"\']+)', html, re.I)
    return match.group(1).strip() if match else ""


def update_sitemap(urls_to_publish: list[str], publish_date: str, queued_urls: set[str]) -> None:
    sitemap = SITEMAP.read_text(encoding="utf-8")
    blocks = re.findall(r"\s*<url>.*?</url>", sitemap, flags=re.DOTALL)
    kept = []
    for block in blocks:
        loc_match = re.search(r"<loc>(.*?)</loc>", block, flags=re.DOTALL)
        loc = loc_match.group(1).strip() if loc_match else ""
        if loc in queued_urls:
            continue
        kept.append(block)

    for url in urls_to_publish:
        kept = [block for block in kept if (re.search(r"<loc>(.*?)</loc>", block, re.S) or [None, ""])[1].strip() != url]
        kept.append(
            "\n\t<url>\n"
            f"\t\t<loc>{escape(url)}</loc>\n"
            f"\t\t<lastmod>{publish_date}</lastmod>\n"
            "\t\t<changefreq>monthly</changefreq>\n"
            "\t\t<priority>0.8</priority>\n"
            "\t</url>"
        )

    sitemap = re.sub(r"\s*<url>.*?</url>", "", sitemap, flags=re.DOTALL)
    sitemap = sitemap.replace("</urlset>", "\n".join(kept) + "\n</urlset>")
    sitemap = re.sub(
        r"(<url>\s*<loc>https://virasatconcrete\.ca/blog/</loc>\s*<lastmod>)\d{4}-\d{2}-\d{2}(</lastmod>)",
        rf"\g<1>{publish_date}\2",
        sitemap,
        count=1,
    )
    SITEMAP.write_text(sitemap, encoding="utf-8")


def make_card(slug: str, title: str, description: str, publish_date: str) -> str:
    safe_title = escape(title)
    safe_description = escape(description)
    pretty_date = datetime.strptime(publish_date, "%Y-%m-%d").strftime("%B %-d, %Y")
    url = f"/blog/{slug}/"
    return (
        f'                    <article class="blog-card" data-publish-date="{publish_date}" '
        f'data-generated-slug="{escape(slug)}" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">\n'
        '                        <div style="background: #f8fafc; padding: 20px;">\n'
        '                            <span style="display: inline-block; background: #f97316; color: white; padding: 6px 12px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">Concrete Guide</span>\n'
        f'                            <h2 style="margin: 10px 0 0; font-size: 1.5rem;"><a href="{url}" style="color: #0f172a; text-decoration: none;">{safe_title}</a></h2>\n'
        '                        </div>\n'
        f'                        <div style="padding: 20px;"><p>{safe_description}</p><p style="margin: 15px 0 0; font-size: 0.9rem; color: #666;">{pretty_date}</p><a href="{url}" style="color: #f97316; text-decoration: none; font-weight: 600;">Read More →</a></div>\n'
        '                    </article>'
    )


def update_blog_index(new_cards: dict[str, str]) -> None:
    html = BLOG_INDEX.read_text(encoding="utf-8")
    start_marker = "                    <!-- AUTO-PUBLISHED POSTS: START -->"
    end_marker = "                    <!-- AUTO-PUBLISHED POSTS: END -->"
    if start_marker not in html or end_marker not in html:
        raise RuntimeError("Auto-published blog-card markers are missing from blog/index.html")

    start = html.index(start_marker) + len(start_marker)
    end = html.index(end_marker, start)
    section = html[start:end]
    cards = {
        match.group(1): match.group(0)
        for match in re.finditer(
            r'<article\b(?=[^>]*data-generated-slug=[\"\']([^\"\']+)[\"\'])[^>]*>.*?</article>',
            section,
            re.DOTALL,
        )
    }
    cards.update(new_cards)

    def card_date(card: str) -> str:
        match = re.search(r'data-publish-date=[\"\'](\d{4}-\d{2}-\d{2})', card)
        return match.group(1) if match else "0000-00-00"

    replacement = "\n" + "\n".join(
        cards[key] for key in sorted(cards, key=lambda key: (card_date(cards[key]), key), reverse=True)
    ) + "\n                    "
    BLOG_INDEX.write_text(html[:start] + replacement + html[end:], encoding="utf-8")


def main() -> None:
    due_urls: list[str] = []
    queue_urls: set[str] = set()
    generated_cards: dict[str, str] = {}
    published_count = 0

    for source in sorted(QUEUE.glob("*/index.html")):
        html = source.read_text(encoding="utf-8")
        canonical = canonical_url(html)
        if not canonical.startswith("https://virasatconcrete.ca/blog/"):
            continue
        queue_urls.add(canonical)
        date_match = re.search(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', html)
        if not date_match:
            continue
        scheduled_date = datetime.strptime(date_match.group(1), "%Y-%m-%d").date()
        if scheduled_date > TODAY:
            continue

        slug = canonical.rstrip("/").rsplit("/", 1)[-1]
        destination = BLOG / slug / "index.html"
        if destination.exists():
            existing = destination.read_text(encoding="utf-8")
            queued_title = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
            live_title = re.search(r"<h1[^>]*>(.*?)</h1>", existing, re.S | re.I)
            if queued_title and live_title and re.sub(r"\s+", " ", queued_title.group(1).strip()) == re.sub(r"\s+", " ", live_title.group(1).strip()):
                source.unlink()
                try:
                    source.parent.rmdir()
                except OSError:
                    pass
                due_urls.append(canonical)
            continue

        title_match = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
        title = re.sub(r"\s*\|\s*Virasat Concrete.*$", "", title_match.group(1).strip()) if title_match else slug.replace("-", " ").title()
        description = meta_value(html, "description")
        if not description:
            description = title

        actual_date = TODAY.isoformat()
        pretty_date = TODAY.strftime("%B %-d, %Y")
        html = re.sub(r'("datePublished"\s*:\s*")\d{4}-\d{2}-\d{2}("\s*,)', rf"\g<1>{actual_date}\2", html, count=1)
        html = re.sub(r'("dateModified"\s*:\s*")\d{4}-\d{2}-\d{2}("\s*[,}])', rf"\g<1>{actual_date}\2", html, count=1)
        html = re.sub(r"Published:\s*[A-Za-z]+\s+\d{1,2},\s+\d{4}", f"Published: {pretty_date}", html)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(html, encoding="utf-8")
        source.unlink()
        try:
            source.parent.rmdir()
        except OSError:
            pass
        due_urls.append(canonical)
        generated_cards[slug] = make_card(slug, title, description, actual_date)
        published_count += 1

    if due_urls:
        update_blog_index(generated_cards)

    # Remove queued URLs from the sitemap unless their article has actually gone live.
    if queue_urls:
        update_sitemap(due_urls, TODAY.isoformat(), queue_urls)

    print(f"Published {published_count} overdue/due blog post(s) for {TODAY.isoformat()}.")
    with open(os.environ.get("GITHUB_OUTPUT", "/dev/null"), "a", encoding="utf-8") as output:
        output.write(f"published={'true' if published_count else 'false'}\n")


if __name__ == "__main__":
    main()
