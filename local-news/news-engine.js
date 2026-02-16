const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";
const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il"
];

const localTowns = ["flora", "clay city", "louisville", "xenia", "sailor springs", "iola", "bible grove", "clay county"];

document.addEventListener('DOMContentLoaded', () => loadLocalNews());

async function loadLocalNews() {
    const container = document.getElementById('full-news-feed');
    try {
        const fetchPromises = sources.map(url => fetch(FEED_SERVICE + encodeURIComponent(url)).then(res => res.json()));
        const results = await Promise.all(fetchPromises);
        let allArticles = [];
        results.forEach(data => { if (data.status === 'ok') allArticles = [...allArticles, ...data.items]; });

        // Sort by date
        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        container.innerHTML = '';
        allArticles.forEach(item => {
            const content = (item.title + " " + (item.description || "")).toLowerCase();
            const isLocal = localTowns.some(town => content.includes(town));
            
            // Only show Illinois/Local news
            if (isLocal || content.includes("illinois")) {
                const card = document.createElement('div');
                card.className = 'story-card';
                
                // Clean the text so it fits the card
                let snippet = item.description.split('The post')[0];

                card.innerHTML = `
                    <p style="font-weight:bold; font-size:0.7rem; color:${isLocal ? '#cc0000' : '#666'};">
                        ${isLocal ? '★ LOCAL REPORT' : 'STATE NEWS'} | ${new Date(item.pubDate).toLocaleDateString()}
                    </p>
                    <h2>${item.title}</h2>
                    <div style="font-size:1rem; line-height:1.5;">${snippet}</div>
                    <div style="margin-top:10px; border-top:1px solid #eee; padding-top:10px;">
                        <a href="${item.link}" target="_blank" style="color:#0c0b82; font-weight:bold; text-decoration:none;">
                           VIEW FULL REPORT →
                        </a>
                    </div>
                `;
                container.appendChild(card);
            }
        });
    } catch (e) { container.innerHTML = "<p>News temporarily unavailable.</p>"; }
}
