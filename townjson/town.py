import json
import os
import requests
import time
import re
from bs4 import BeautifulSoup
from datetime import datetime

# CONFIGURATION
BASE_DIR = 'townjson' # Folder containing your existing .json files
MASTER_URL = "https://en.wikipedia.org/wiki/Template:Clay_County,_Illinois"

def get_town_links():
    """Extracts all town/community links from the Clay County navigation template."""
    response = requests.get(MASTER_URL, headers={'User-Agent': 'Mozilla/5.0'})
    soup = BeautifulSoup(response.text, 'html.parser')
    links = []
    
    # Target all links within the navigation box
    for a in soup.select('div.navbox a'):
        href = a.get('href')
        if href and href.startswith('/wiki/') and not href.startswith('/wiki/Template'):
            # Only pick links that look like town pages
            links.append("https://en.wikipedia.org" + href)
    return set(links) # Return unique set of URLs

def process_town(url):
    """Scrapes a single town page and updates its matching local JSON file."""
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Determine town name from URL to match filename
        town_name = url.split('/')[-1].replace('_', ' ').replace(',_Illinois', '')
        filename = f"{town_name.lower().replace(' ', '_')}.json"
        filepath = os.path.join(BASE_DIR, filename)
        
        # Only process if we already have a JSON file for this town
        if not os.path.exists(filepath):
            return

        # Scrape history section
        history_header = soup.find(id="History")
        if not history_header:
            return

        new_events = []
        for sibling in history_header.find_parent().find_next_siblings():
            if sibling.name == 'h2': break
            if sibling.name == 'p':
                text = sibling.get_text()
                # Simple regex to find years in the text
                years = re.findall(r'\b(18|19|20)\d{2}\b', text)
                for year in years:
                    new_events.append({"year": int(year), "event": "Historical event noted", "description": text[:100] + "..."})

        # Load, Compare, and Append
        with open(filepath, 'r+') as f:
            data = json.load(f)
            existing_events = {e['event'] for e in data['history']}
            
            updated = False
            for event in new_events:
                if event['event'] not in existing_events:
                    data['history'].append(event)
                    updated = True
            
            if updated:
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()
                print(f"Updated {filename}")
                
    except Exception as e:
        print(f"Error processing {url}: {e}")

if __name__ == "__main__":
    town_urls = get_town_links()
    for url in town_urls:
        process_town(url)
        time.sleep(2) # Be polite to Wikipedia
