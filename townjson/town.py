import json
from datetime import datetime

def update_town_json(filepath):
    # 1. Load your existing file
    with open(filepath, 'r+') as f:
        data = json.load(f)
        existing_events = [e['event'] for e in data['history']]
        
        # 2. Logic to fetch new data (e.g., from Wikipedia)
        new_data = fetch_wikipedia_history(data['town'])
        
        # 3. Safety Check: Only add if not already there AND date is in the past
        for event in new_data:
            if event['event'] not in existing_events:
                if datetime.strptime(str(event['year']), "%Y") < datetime.now():
                    data['history'].append(event)
        
        # 4. Save back to the same file
        f.seek(0)
        json.dump(data, f, indent=2)
        f.truncate()
