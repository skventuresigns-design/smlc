// This is your live Google Script URL
const BULLETIN_URL = "https://script.google.com/macros/s/AKfycbz_nol3WlVM6_8FKN1V2aVeW5jZRa54gWs13lVEHVhx07xpzjMmedBd5vRdVyPiSemopA/exec";

async function loadEvents() {
    const list = document.getElementById('event-list');
    try {
        const response = await fetch(BULLETIN_URL);
        const events = await response.json();

        if (events && events.length > 0) {
            list.innerHTML = '';
            events.slice(-5).reverse().forEach(item => {
                
                const eventDateObj = new Date(item.date);
                const friendlyDate = isNaN(eventDateObj) ? item.date : eventDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                
                const gDate = isNaN(eventDateObj) ? "" : eventDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "").split("T")[0];
                const gCalLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(item.name)}&dates=${gDate}/${gDate}&details=${encodeURIComponent(item.details || 'Local Event')}&location=${encodeURIComponent(item.location)}&sf=true&output=xml`;

                const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${item.name}\nLOCATION:${item.location}\nDTSTART:${gDate}\nDTEND:${gDate}\nDESCRIPTION:${item.details || 'Local Event'}\nEND:VEVENT\nEND:VCALENDAR`;
                const icsData = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);

                const div = document.createElement('div');
                div.className = 'event-item';
                div.innerHTML = `
                    <div class="event-date">${friendlyDate}</div>
                    <div class="event-title">${item.name}</div>
                    <div style="font-size: 14px; line-height: 1.4; color:#333;">
                        <strong>Location:</strong> ${item.location} <br> 
                        <strong>Time:</strong> ${item.time}
                    </div>
                    <div class="cal-links">
                        <span>Add to:</span>
                        <a href="${gCalLink}" target="_blank" class="cal-text-link">Google</a>
                        <span style="color:#777; margin: 0 5px;">|</span>
                        <a href="${icsData}" download="event.ics" class="cal-text-link">Apple / Outlook</a>
                    </div>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = "<p style='text-align:center; padding: 20px;'>No upcoming events on the wire.</p>";
        }
    } catch (e) {
        list.innerHTML = "<p style='text-align:center; padding: 20px;'>Wire connection error.</p>";
    }
}

document.addEventListener('DOMContentLoaded', loadEvents);
