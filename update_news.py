import feedparser
import json
import uuid
import requests
from bs4 import BeautifulSoup

# The feeds you want to pull from
rss_feeds = [
    "https://www.wnoi.com/feed/",
    # Add more RSS links here in the future
]

def get_full_article(url):
    try:
        # Visit the actual news page
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Grab all paragraphs
        paragraphs = soup.find_all('p')
        
        # Filter for "real" paragraphs (longer than 60 chars) to avoid menu links
        story_parts = [p.get_text().strip() for p in paragraphs if len(p.get_text()) > 60]
        
        # Join them into a single story
        if story_parts:
            return "\n\n".join(story_parts)
    except Exception as e:
        print(f"Scrape failed for {url}: {e}")
    
    return None

all_news = []

for url in rss_feeds:
    feed = feedparser.parse(url)
    
    for entry in feed.entries:
        # Use the scraper to get the real story
        print(f"Fetching: {entry.title}")
        full_text = get_full_article(entry.link)
        
        # Fallback to the RSS description if the scraper fails
        if not full_text:
            full_text = entry.description if 'description' in entry else "No story content available."

        news_item = {
            "id": str(uuid.uuid4()),
            "title": entry.title,
            "full_story": full_text,
            "date": entry.published if 'published' in entry else "Recent",
            "image": entry.media_content[0]['url'] if 'media_content' in entry and entry.media_content else None,
            "link": entry.link
        }
        all_news.append(news_item)

# Sort by date (if possible) and keep the top 15
# Then save to your local-news folder
with open('local-news/news_data.json', 'w') as f:
    json.dump(all_news[:15], f, indent=4)

print("Successfully updated 15 news stories with full text.")
