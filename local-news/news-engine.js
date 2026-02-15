const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";

const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il",
    "https://www.thecentersquare.com/search/?f=rss&t=article&l=10&s=start_time&sd=desc&c[]=illinois",
    "https://webservices.illinois.gov/iisnewsrss/getfeed.aspx" // Illinois State News
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

        // SORT: Newest first
        allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        if (allArticles.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding:40px;'>News temporarily unavailable. Please refresh.</p>";
            return;
        }

        container.innerHTML = '';
        allArticles.forEach(item => {
            const card = document.createElement('div');
            card.className = 'story-card';
            
            const content = (item.title + " " + (item.description || "")).toLowerCase();
            const isLocal = localTowns.some(town => content.includes(town));
            
            // Only show stories that mention Illinois or our local towns
            if (isLocal || content.includes("illinois")) {
                let cleanSnippet = item.description.split('The post')[0].split('appeared first on')[0]; 
                
                card.innerHTML = `
                    <p class="${isLocal ? 'local-tag' : 'state-tag'}">
                        ${isLocal ? '★ LOCAL CLAY COUNTY REPORT' : 'ILLINOIS STATE NEWS'} | ${new Date(item.pubDate).toLocaleDateString()}
                    </p>
                    <h2>${item.title}</h2>
                    <div style="line-height:1.7; color:#333; font-size:1.1rem;">${cleanSnippet}</div>
                    <div style="margin-top:15px; padding-top:10px; border-top:1px solid #eee; font-size:0.85rem; color:#0c0b82;">
                        Source: ${item.author || "News Wire"}
                    </div>
                `;
                container.appendChild(card);
            }
        });
    } catch (e) {
        container.innerHTML = "<p style='text-align:center;'>Unable to load news. Please check connection.</p>";
    }
}
