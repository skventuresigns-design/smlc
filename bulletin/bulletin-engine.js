/**
 * BULLETIN-ENGINE.JS - Automated Community Calendar
 */
const EVENT_RSS = "https://api.rss2json.com/v1/api.json?rss_url=https://southernillinoisnow.com/events/feed/";

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

async function loadEvents() {
    const list = document.getElementById('event-list');
    try {
        const response = await fetch(EVENT_RSS);
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            list.innerHTML = '';
            // Show the top 5 upcoming events
            data.items.slice(0, 5).forEach(item => {
                const event = document.createElement('div');
                event.className = 'event-item';
                
                // Format the date nicely
                const eventDate = new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                event.innerHTML = `
                    <div class="event-date">${eventDate}</div>
                    <div class="event-title"><strong>${item.title}</strong></div>
                    <div style="font-size: 0.9rem; color: #555;">${item.description.substring(0, 100)}...</div>
                `;
                list.appendChild(event);
            });
        } else {
            list.innerHTML = "<p style='text-align:center;'>No upcoming events listed for this week.</p>";
        }
    } catch (error) {
        list.innerHTML = "<p style='text-align:center;'>Bulletin temporarily offline.</p>";
    }
}
