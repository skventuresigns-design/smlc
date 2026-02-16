// Replace the URL below with YOUR Web App URL from Step 1
const SPREADSHEET_URL = "PASTE_YOUR_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => loadEvents());

async function loadEvents() {
    const list = document.getElementById('event-list');
    try {
        const response = await fetch(SPREADSHEET_URL);
        const events = await response.json();

        if (events.length > 0) {
            list.innerHTML = '';
            // We show the last 5 events submitted
            events.slice(-5).reverse().forEach(item => {
                const event = document.createElement('div');
                event.className = 'event-item';
                
                event.innerHTML = `
                    <div class="event-date">${item.date} | ${item.time}</div>
                    <div class="event-title"><strong>${item.name}</strong></div>
                    <div style="font-size: 0.9rem; color: #555;">${item.location}</div>
                `;
                list.appendChild(event);
            });
        } else {
            list.innerHTML = "<p style='text-align:center;'>Check back soon for new local events!</p>";
        }
    } catch (error) {
        list.innerHTML = "<p style='text-align:center;'>Bulletin offline. Please refresh.</p>";
    }
}
