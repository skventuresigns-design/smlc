import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# Directory containing your town JSON files
DATA_DIR = 'townjson'

def get_wikipedia_events(town_name):
    """
    Scrapes a basic history section from Wikipedia.
    Note: You may need to customize this based on the exact 
    HTML structure of the town's Wikipedia page.
    """
    url = f"https://en.wikipedia.org/wiki/{town_name.replace(' ', '_')},_Illinois"
    response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    if response.status_code != 200:
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    # Logic to find 'History' section and extract events
    # This is a placeholder for your specific parsing logic
    new_events = [] 
    return new_events

def update_files():
    for filename in os.listdir(DATA_DIR):
        if filename.endswith('.json'):
            filepath = os.path.join(DATA_DIR, filename)
            
            with open(filepath, 'r+') as f:
                data = json.load(f)
                
                # Get current event list to prevent duplicates
                existing_events = {e['event'] for e in data['history']}
                current_year = datetime.now().year
                
                # Fetch new data
                new_data = get_wikipedia_events(data['town'])
                
                updated = False
                for event in new_data:
                    # Append if new AND date is in the past
                    if event['event'] not in existing_events:
                        if int(event['year']) < current_year:
                            data['history'].append(event)
                            updated = True
                
                if updated:
                    f.seek(0)
                    json.dump(data, f, indent=2)
                    f.truncate()
                    print(f"Updated {filename}")

if __name__ == "__main__":
    update_files()
