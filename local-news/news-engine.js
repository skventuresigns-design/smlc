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

        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        container.innerHTML = '';
        allArticles.forEach(item => {
            const content = (item.title + " " + (item.description || "")).toLowerCase();
            const isLocal = localTowns.some(town => content.includes(town));
            
            if (isLocal || content.includes("illinois")) {
                const card = document.createElement('div');
                card.className = 'story-card';
                
                // This removes the "The post ... appeared first on" text
                let cleanText = item.description.split('The post')[0];

                card.innerHTML = `
                    <p style="font-weight:bold; font-size:0.7rem; color:#666; margin-bottom:5px;">
                        ${new Date(item.pubDate).toLocaleDateString()} | LOCAL REPORT
                    </p>
                    <h2>${item.title}</h2>
                    <div style="font-size:1.1rem; line-height:1.6; color:#333;">${cleanText}</div>
                    <p style="margin-top:15px; font-size:0.8rem; font-style:italic; color:#0c0b82;">
                        Report provided by local news wire.
                    </p>
                `;
                container.appendChild(card);
            }
        });
    } catch (e) { container.innerHTML = "<p>News temporarily unavailable.</p>"; }
}
