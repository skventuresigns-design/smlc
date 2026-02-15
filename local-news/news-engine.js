/**
 * NEWS-ENGINE.JS - Automated Clay County Aggregator
 */

const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";

// The 3 sources you approved
const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il"
];

// Keywords to keep the news local to Clay County
const localKeywords = ["clay county", "flora", "louisville", "clay city", "xenia", "sailor springs", "iola"];

document.addEventListener('DOMContentLoaded', () => {
    loadLocalNews();
});

async function loadLocalNews() {
    const container = document.getElementById('full-news-feed');
    if(!container) return;

    container.innerHTML = "<p class='status-msg'>Scanning local sources for Clay County updates...</p>";

    try {
        let allArticles = [];

        // Fetch from all sources at once
        const fetchPromises = sources.map(url => fetch(FEED_SERVICE + encodeURIComponent(url)).then(res => res.json()));
        const results = await Promise.all(fetchPromises);

        results.forEach(data => {
            if (data.status === 'ok') {
                allArticles = [...allArticles, ...data.items];
            }
        });

        // FILTER: Only keep stories relevant to your towns
        const filteredNews = allArticles.filter(article => {
            const content = (article.title + article.description + article.content).toLowerCase();
            return localKeywords.some(keyword => content.includes(keyword));
        });

        // SORT: Newest first
        filteredNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        renderNews(filteredNews);

    } catch (error) {
        container.innerHTML = "<p class='status-msg'>Error connecting to news sources. Please try again later.</p>";
    }
}

function renderNews(articles) {
    const container = document.getElementById('full-news-feed');
    if (articles.length === 0) {
        container.innerHTML = "<p class='status-msg'>No specific Clay County news found in the last 24 hours.</p>";
        return;
    }

    container.innerHTML = ''; 
    articles.forEach(item => {
        const card = document.createElement('div');
        card.className = 'full-story-display';
        const img = item.enclosure?.link || item.thumbnail || "";

        card.innerHTML = `
            <p style="color:#666; font-weight:bold; text-transform:uppercase; font-size:0.75rem; margin-bottom:5px;">
                ${new Date(item.pubDate).toLocaleDateString()} | CLAY COUNTY LOCAL
            </p>
            <h2 style="margin-top:0; font-family:serif; font-size:1.6rem; color:#0c0b82;">${item.title}</h2>
            ${img ? `<img src="${img}" style="width:100%; border-radius:8px; margin-bottom:15px; max-height:350px; object-fit:cover;">` : ''}
            <div class="story-body" style="font-size:1.1rem;">${item.description || "Click below to read the full local report."}</div>
            <a href="${item.link}" target="_blank" style="display:inline-block; margin-top:15px; color:#cc0000; font-weight:bold; text-decoration:none;">READ FULL STORY AT SOURCE →</a>
        `;
        container.appendChild(card);
    });
}
