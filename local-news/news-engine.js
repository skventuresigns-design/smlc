/* === SECTION: File Header & Config === */
// Active Version: v1.0.5 | Timestamp: 2026-07-26_17:45:00
// Description: Local News JSON Processor - Complete Clay County Location & Township Filtering Matrix

// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

// Master location array: Cities, Villages, Townships, and County/State catch-alls
const CLAY_COUNTY_LOCATIONS = [
    // Cities & Villages
    "flora", "louisville", "clay city", "xenia", "iola", "sailor springs",
    // Civil Townships
    "bible grove", "blair", "harter", "hoosier", "larkinsburg", 
    "oskaloosa", "pixley", "songer", "stanford",
    // Regional & County Catch-Alls
    "clay county", "state news", "illinois news"
];

/**
 * Strict Filter Function
 * Returns true ONLY if the article mentions an allowed town, township, or county tag.
 * Automatically drops articles mentioning Fairfield or out-of-county areas like Olney.
 */
function isClayCountyArticle(item) {
    const title = (item.title || "").toLowerCase();
    const story = (item.full_story || "").toLowerCase();
    const location = (item.location || "").toLowerCase();
    const textBlob = `${title} ${story} ${location}`;

    // Exclusion Rule: Explicitly hide anything containing Fairfield in the title or body
    if (textBlob.includes("fairfield")) {
        return false;
    }

    // Strict Inclusion Rule: Must contain at least one Clay County town/township/keyword
    return CLAY_COUNTY_LOCATIONS.some(place => textBlob.includes(place));
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            // Apply strict filtering matrix
            const filteredData = data.filter(isClayCountyArticle);

            // --- MODE A: SMLC FRONT PAGE (Side-by-Side Flexing Grid) ---
            if (summaryContainer) {
                summaryContainer.style.display = "grid";
                summaryContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
                summaryContainer.style.gap = "30px";
                summaryContainer.style.padding = "20px";
                summaryContainer.innerHTML = ''; 

                if (filteredData.length === 0) {
                    summaryContainer.innerHTML = `<p style="text-align:center; grid-column:1/-1; font-style:italic; color:#666;">No local Clay County dispatches found.</p>`;
                }

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}">` : '';
                    
                    summaryContainer.innerHTML += `
                        <div class="full-story-display">
                            <h1>${formatMoney(item.title)}</h1>
                            <p style="font-size: 0.8rem; font-weight: bold; color: #777;">${item.date || ''}</p>
                            ${imgHTML}
                            <div class="story-body">${formatMoney(item.full_story)}</div>
                            <button class="news-read-more-btn" 
                                    onclick="window.location.href='https://www.supportmylocalcommunity.com/local-news/index.html#${item.id}'">
                                Read Full Story
                            </button>
                        </div>`;
                });
            } 
            
            // --- MODE B: HUB PAGE (Full Articles) ---
            if (fullContainer) {
                fullContainer.innerHTML = ''; 

                if (filteredData.length === 0) {
                    fullContainer.innerHTML = `<p style="text-align:center; font-style:italic; color:#666;">No local Clay County dispatches found.</p>`;
                }

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';
                    fullContainer.innerHTML += `
                        <article id="${item.id}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Times New Roman', serif;">
                            <h1 style="font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                            <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date || ''}</p>
                            ${imgHTML}
                            <div class="story-body-full" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(item.full_story)}</div>
                        </article>`;
                });

                setTimeout(() => {
                    const hashId = window.location.hash.substring(1); 
                    if (hashId) {
                        const el = document.getElementById(hashId);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 600);
            }
        })
        .catch(err => console.error("Error loading news JSON pipeline:", err));
});

function openWeatherTab() { 
    window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); 
}
