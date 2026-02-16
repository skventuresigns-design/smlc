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

        container.innerHTML = '';
        allArticles.forEach((item, index) => {
            const content = (item.title + " " + (item.description || "")).toLowerCase();
            if (localTowns.some(town => content.includes(town)) || content.includes("illinois")) {
                const card = document.createElement('div');
                card.className = 'story-card';
                let snippet = item.description.split('The post')[0];

                card.innerHTML = `
                    <p style="font-weight:bold; font-size:0.7rem; color:#666;">${new Date(item.pubDate).toLocaleDateString()}</p>
                    <h2>${item.title}</h2>
                    <div style="font-size:1rem; line-height:1.5;">${snippet}</div>
                    <div style="margin-top:10px; border-top:1px solid #eee; padding-top:10px;">
                        <a href="index.html?id=story-${index}" style="color:#0c0b82; font-weight:bold; text-decoration:none;">READ FULL STORY ON THIS PAGE →</a>
                    </div>
                `;
                container.appendChild(card);
            }
        });
    } catch (e) { container.innerHTML = "<p>News temporarily unavailable.</p>"; }
}
