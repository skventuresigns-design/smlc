/**
 * FINAL NEWS-ENGINE.JS - Automated & Filtered for Clay County
 */

const FEED_SERVICE = "https://api.rss2json.com/v1/api.json?rss_url=";

// The 3 sources you approved
const sources = [
    "https://www.wfiwradio.com/feed/",
    "https://southernillinoisnow.com/feed/",
    "https://patch.com/feeds/aol/illinois/flora-il"
];

// Your specific local keywords
const localKeywords = ["clay county", "flora", "louisville", "clay city", "xenia", "iola", "sailor springs"];

document.addEventListener('DOMContentLoaded', () => {
    loadLocalNews();
});

async function loadLocalNews() {
    const container = document.getElementById('full-news-feed');
    if(!container) return;

    try {
        let allArticles = [];

        // 1. Fetch from all sources at once
        const fetchPromises = sources.map(url => fetch(FEED_SERVICE + encodeURIComponent(url)).then(res => res.json()));
        const results = await Promise.all(fetchPromises);

        results.forEach(data => {
            if (data.status === 'ok') {
                allArticles = [...allArticles, ...data.items];
            }
        });

        // 2. FILTER: Only keep stories that mention your specific towns or county
        const filteredNews = allArticles.filter(article => {
            const content = (article.title + article.description + (article.content || "")).toLowerCase();
            return localKeywords.some(keyword => content.includes(keyword));
        });

        // 3. SORT: Newest stories first
        filteredNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        renderNews(filteredNews);

    } catch (error) {
        container.innerHTML = "<p class='status-msg'>Error connecting to local sources. Please refresh.</p>";
    }
}

function renderNews(articles) {
    const container = document.getElementById('full-news-feed');
    if (articles.length === 0) {
        container.innerHTML = "<p class='status-msg'>No new local stories found for Clay County today.</p>";
        return;
    }

    container.innerHTML = ''; 
    articles.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'full-story-display';
        card.id = `story-${index}`; 

        const img = item.enclosure?.link || item.thumbnail || "";

        card.innerHTML = `
            <p style="color:#666; font-weight:bold; text-transform:uppercase; font-size:0.75rem; margin-bottom:5px;">
                ${new Date(item.pubDate).toLocaleDateString()} | LOCAL UPDATE
            </p>
            <h2 style="margin-top:0; font-family:serif; font-size:1.8rem; color:#0c0b82;">${item.title}</h2>
            ${img ? `<img src="${img}" style="width:100%; border-radius:8px; margin-bottom:15px; max-height:400px; object-fit:cover;">` : ''}
            <div class="story-body" style="font-size:1.15rem; line-height:1.7;">${item.description}</div>
            <a href="${item.link}" target="_blank" style="display:inline-block; margin-top:15px; color:#cc0000; font-weight:bold; text-decoration:none;">READ FULL STORY AT SOURCE →</a>
        `;
        container.appendChild(card);
    });
}
