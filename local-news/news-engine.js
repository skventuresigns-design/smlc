const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";
const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il"
];
const localKeywords = ["clay county", "flora", "louisville", "clay city", "xenia", "iola"];

document.addEventListener('DOMContentLoaded', () => loadLocalNews());

async function loadLocalNews() {
    const container = document.getElementById('full-news-feed');
    try {
        const fetchPromises = sources.map(url => fetch(FEED_SERVICE + encodeURIComponent(url)).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
        let allArticles = [];
        results.forEach(data => { if (data.status === 'ok') allArticles = [...allArticles, ...data.items]; });

        const filtered = allArticles.filter(a => {
            const content = (a.title + a.description).toLowerCase();
            return localKeywords.some(k => content.includes(k));
        });

        if (filtered.length === 0) {
            container.innerHTML = "<p class='status-msg'>No new stories for Clay County in the last 24 hours.</p>";
            return;
        }

        container.innerHTML = '';
        filtered.forEach((item, i) => {
            const card = document.createElement('div');
            card.className = 'full-story-display';
            card.id = `story-${i}`; // ID for the auto-scroll logic
            card.innerHTML = `
                <p style="font-weight:bold; color:#666; font-size:0.8rem;">${new Date(item.pubDate).toLocaleDateString()} | LOCAL NEWS</p>
                <h2 style="margin:5px 0 15px 0; font-family:serif;">${item.title}</h2>
                <div class="story-body">${item.description}</div>
                <a href="${item.link}" target="_blank" style="color:#cc0000; font-weight:bold; text-decoration:none; display:block; margin-top:10px;">Full Story Source →</a>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p class='status-msg'>Unable to connect to news feeds.</p>";
    }
}
