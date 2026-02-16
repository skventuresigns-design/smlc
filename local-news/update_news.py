import httpx
import asyncio
import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from bs4 import BeautifulSoup
import os

# --- CONFIGURATION ---
NEWS_DATA_FILE = 'news_data.json'
SOURCES_FILE = 'sources.json'
TOWNS = ["Flora", "Louisville", "Clay City", "Xenia", "Iola", "Sailor Springs"]

def create_slug(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    return re.sub(r'\s+', '-', slug).strip('-')[:50]

async def get_full_content_and_image(url):
    result = {"body": "", "image": ""}
    try:
        async with httpx.AsyncClient() as client:
            headers = {'User-Agent': 'Mozilla/5.0'}
            resp = await client.get(url, timeout=10, follow_redirects=True)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                og_image = soup.find("meta", property="og:image")
                if og_image: result["image"] = og_image["content"]
                
                content = soup.find('div', class_='entry-content') or soup.find('article')
                if content:
                    for noise in content(['script', 'style', 'a']): noise.decompose()
                    result["body"] = content.get_text(separator='\n', strip=True)
    except: pass
    return result

async def process_news():
    # 1. Load Sources
    if not os.path.exists(SOURCES_FILE):
        print("Error: sources.json not found.")
        return
    with open(SOURCES_FILE, 'r') as f:
        all_sources = json.load(f)

    # 2. Load Existing Data
    existing_news = []
    if os.path.exists(NEWS_DATA_FILE):
        with open(NEWS_DATA_FILE, 'r', encoding='utf-8') as f:
            existing_news = json.load(f)
    
    seen_ids = {article['id'] for article in existing_news}
    new_count = 0

    async with httpx.AsyncClient() as client:
        for source in all_sources:
            try:
                resp = await client.get(source['url'], timeout=15)
                root = ET.fromstring(resp.content)
                for item in root.findall("./channel/item")[:15]:
                    title = item.find("title").text or ""
                    link = item.find("link").text or ""
                    slug = create_slug(title)

                    if slug in seen_ids: continue

                    data = await get_full_content_and_image(link)
                    # Filter for local towns
                    if any(town.lower() in (title + data["body"]).lower() for town in TOWNS):
                        existing_news.insert(0, {
                            "id": slug,
                            "title": title,
                            "image": data["image"],
                            "full_story": data["body"][:1000], # Keep it concise
                            "date": datetime.now().strftime("%Y-%m-%d"),
                            "tags": ["Local News"],
                            "link": link
                        })
                        seen_ids.add(slug)
                        new_count += 1
            except Exception as e:
                print(f"Failed to fetch {source['name']}: {e}")

    # 3. Save Updated Feed (Limit to last 50 stories to keep it fast)
    with open(NEWS_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(existing_news[:50], f, indent=4, ensure_ascii=False)
    
    print(f"Pipeline complete. Added {new_count} new local stories.")

if __name__ == "__main__":
    asyncio.run(process_news())
