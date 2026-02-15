/**
 * UNIFIED NEWS ENGINE - CLAY COUNTY
 */

const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";

const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il",
    "https://www.effinghamradio.com/feed/" // Adding a regional backup that often covers Clay
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

        // Search both Title and Description for our local towns
        const filtered = allArticles.filter(a => {
            const searchArea = (a.title + " " + (a.description || "")).toLowerCase();
            return localTowns.some(town => searchArea.includes(town));
        });

        if (filtered.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding:40px; font-style:italic;'>No new local reports in the last 24 hours. We are continuing to monitor WNOW and local feeds.</p>";
            return;
        }

        container.innerHTML = '';
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'story-card';
            
            // Keeps the content on your site by removing the "Read more at..." links
            let cleanSnippet = item.description.split('The post')[0]; 
            
            card.innerHTML = `
                <p style="font-size:0.75rem; color:#666; font-weight:bold; margin-bottom:10px; text-transform:uppercase;">
                    ${new Date(item.pubDate).toLocaleDateString()} | LOCAL UPDATE
                </p>
                <h2>${item.title}</h2>
                <div style="line-height:1.7; color:#333; font-size:1.1rem;">${cleanSnippet}</div>
                <div style="margin-top:15px; padding-top:10px; border-top:1px solid #eee; font-size:0.85rem; color:#0c0b82;">
                    Source: ${item.author || "Regional News Wire"}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p style='text-align:center;'>News temporarily unavailable. Please refresh.</p>";
    }
}
