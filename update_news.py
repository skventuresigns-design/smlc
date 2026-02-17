import httpx
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# The data file is now inside the local-news folder
DATA_FILE = "local-news/news_data.json"

def scrape_wnoi():
    stories = []
    try:
        resp = httpx.get("https://www.wnoi.com/feed/", timeout=10)
        soup = BeautifulSoup(resp.text, 'xml')
        for item in soup.find_all('item'):
            stories.append({
                "id": item.link.text,
                "title": item.title.text,
                "date": item.pubDate.text,
                "full_story": item.description.text,
                "link": item.link.text
            })
    except: pass
    return stories

def scrape_wsiu():
    stories = []
    try:
        resp = httpx.get("https://www.wsiu.org/local-news.rss", timeout=10)
        soup = BeautifulSoup(resp.text, 'xml')
        for item in soup.find_all('item'):
            stories.append({
                "id": item.link.text,
                "title": item.title.text,
                "date": item.pubDate.text,
                "full_story": item.description.text,
                "link": item.link.text
            })
    except: pass
    return stories

# Load existing
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, "r") as f:
        existing = json.load(f)
else:
    existing = []

# Update and Save
all_news = scrape_wnoi() + scrape_wsiu()
# Simple duplicate check by ID
existing_ids = {s['id'] for s in existing}
for s in all_news:
    if s['id'] not in existing_ids:
        existing.insert(0, s)

with open(DATA_FILE, "w") as f:
    json.dump(existing[:50], f, indent=4)
