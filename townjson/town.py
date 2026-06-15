import json
import os
import requests
import time
import re
from bs4 import BeautifulSoup
from datetime import datetime

# Directory containing your town JSON files
DATA_DIR = '.' 

def get_wikipedia_events(town_name):
    """Scrapes historical events from Wikipedia for a given town name."""
    # Maps specific town names to their specific Wikipedia URL structure if needed
    url_name = town_name.replace('-', '_').replace(' ', '_')
    url = f"https://en.wikipedia.org/wiki/{url_name},_Illinois"
    
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code != 200:
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        history_header = soup.find(id="History")
        if not history_header:
            return []

        events = []
        for sibling in history_header.find_parent().find_next_siblings():
            if sibling.name == 'h2': break
            if sibling.name == 'p':
                text = sibling.get_text()
                # Find years (4 digits)
                years = re.findall(r'\b(18|19|20)\d{2}\b', text)
                for year in years:
                    events.append({
                        "year": int(year), 
                        "event": "Event noted in Wikipedia", 
                        "description": text[:150] + "..."
                    })
        return events
    except Exception as e:
        print(f"Error fetching {town_name}: {e}")
        return []

def update_town_files():
    # Loop through every file in the directory
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json') and filename != 'town.py': # Ignore the script itself
            filepath = os.path.join(DATA_DIR, filename)
            
            # Extract town name from filename (e.g., 'bible-grove.json' -> 'Bible Grove')
            town_name = filename.replace('.json', '').replace('-', ' ').title()
            
            print(f"Processing: {town_name}...")
            new_events = get_wikipedia_events(town_name)
            
            if not new_events:
                continue

            with open(filepath, 'r+') as f:
                data = json.load(f)
                existing_events = {e['event'] for e in data.get('history', [])}
                
                updated = False
                for event in new_events:
                    if event['event'] not in existing_events:
                        data['history'].append(event)
                        updated = True
                
                if updated:
                    f.seek(0)
                    json.dump(data, f, indent=2)
                    f.truncate()
                    print(f"Successfully updated {filename}")
            
            time.sleep(2) # Be polite to Wikipedia

if __name__ == "__main__":
    update_town_files()
