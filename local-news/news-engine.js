/**
 * FINAL NEWS-ENGINE.JS - Automated & Filtered for Clay County
 */

const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";

// Approved local sources
const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il"
];

// Strict local town filter
const localTowns = ["flora", "clay city", "louisville", "xenia", "sailor springs", "iola", "bible grove"];

document.addEventListener('DOMContentLoaded', () => loadLocalNews());

async function loadLocalNews() {
    const container = document.getElementById('full-news-feed');
    if(!container) return;

    try {
        const fetchPromises = sources.map(url => fetch(FEED_SERVICE + encodeURIComponent(url)).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
        let allArticles = [];
        results.forEach(data => { if (data.status === 'ok') allArticles = [...allArticles, ...data.items]; });

        // STRICT FILTER: Keyword must be in the TITLE to stop national news clutter
        const filtered = allArticles.filter(a => {
            const title = a.title.toLowerCase();
            return localTowns.some(town => title.includes(town)) || title.includes("clay county");
        });

        if (filtered.length === 0) {
            container.innerHTML = "<p style='text-align:center; font-style:italic;'>No new local stories for Clay County today.</p>";
            return;
        }

        container.innerHTML = '';
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'story-card';
            
            // Removes external redirect text to keep info on your page
            let cleanSnippet = item.description.split('The post')[0]; 
            
            card.innerHTML = `
                <p style="font-size:0.7rem; color:#666; margin-bottom:5px;">LATEST LOCAL REPORT</p>
                <h2>${item.title}</h2>
                <div style="line-height:1.6; color:#333;">${cleanSnippet}</div>
                <hr style="border:0; border-top:1px solid #eee; margin:15px 0;">
                <p style="font-size:0.8rem; color:#0c0b82; font-weight:bold;">Reported by ${item.author || "Local Source"}</p>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>News temporarily unavailable.</p>";
    }
}
