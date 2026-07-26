/* === SECTION: File Header & Config === */
// Active Version: v1.0.6 | Timestamp: 2026-07-26_17:50:00
// Description: Local News Processor - Location Tagging, WNOI Copyright Cleaner, & UTM Source Links

function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

// Master town array
const CLAY_TOWNS = [
    "flora", "louisville", "clay city", "xenia", "iola", "sailor springs",
    "bible grove", "blair", "harter", "hoosier", "larkinsburg", 
    "oskaloosa", "pixley", "songer", "stanford"
];

const CLAY_COUNTY_KEYWORDS = ["clay county", "state news", "illinois news"];

/**
 * Clean Copyright / Provider text from story body
 */
function cleanStoryBody(storyText) {
    if (!storyText) return "";
    // Regex removes "© Copyright..." or "Copyright..." notice from the source provider (WNOI / H & R Communications)
    return storyText
        .replace(/[\u00a9\u24b8\u2122]?\s*Copyright\s+\d{4},?\s*WNOI[\s\S]*/gi, '')
        .trim();
}

/**
 * Determine dynamic Location tag ("Louisville", "Flora", or "Clay County")
 */
function resolveStoryLocation(item) {
    const textBlob = `${item.title || ""} ${item.full_story || ""} ${item.location || ""}`.toLowerCase();
    
    // 1. Check for specific town
    for (const town of CLAY_TOWNS) {
        if (textBlob.includes(town)) {
            return town.replace(/\b\w/g, char => char.toUpperCase());
        }
    }
    
    // 2. Default to Clay County
    return "Clay County";
}

/**
 * Append UTM tracking parameters to source URLs
 */
function appendUTMParameters(url) {
    if (!url) return "#";
    try {
        const parsedUrl = new URL(url);
        parsedUrl.searchParams.set("utm_source", "SMLC_News");
        parsedUrl.searchParams.set("utm_medium", "article_click");
        parsedUrl.searchParams.set("utm_campaign", "local_news");
        return parsedUrl.toString();
    } catch (e) {
        // Fallback for relative or simple links
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}utm_source=SMLC_News&utm_medium=article_click&utm_campaign=local_news`;
    }
}

/**
 * Strict Inclusion Filter
 */
function isClayCountyArticle(item) {
    const textBlob = `${item.title || ""} ${item.full_story || ""} ${item.location || ""}`.toLowerCase();
    if (textBlob.includes("fairfield")) return false;
    
    const allLocations = [...CLAY_TOWNS, ...CLAY_COUNTY_KEYWORDS];
    return allLocations.some(place => textBlob.includes(place));
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            const filteredData = data.filter(isClayCountyArticle);

            // --- MODE A: SMLC FRONT PAGE (Grid View) ---
            if (summaryContainer) {
                summaryContainer.style.display = "grid";
                summaryContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
                summaryContainer.style.gap = "30px";
                summaryContainer.style.padding = "20px";
                summaryContainer.innerHTML = ''; 

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}">` : '';
                    const cleanedStory = cleanStoryBody(item.full_story);
                    const locationTag = resolveStoryLocation(item);

                    summaryContainer.innerHTML += `
                        <div class="full-story-display">
                            <span class="location-badge" style="background:#0056b3; color:#fff; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:3px; display:inline-block; margin-bottom:8px;">📍 ${locationTag}</span>
                            <h1>${formatMoney(item.title)}</h1>
                            <p style="font-size: 0.8rem; font-weight: bold; color: #777;">${item.date || ''}</p>
                            ${imgHTML}
                            <div class="story-body">${formatMoney(cleanedStory)}</div>
                            <button class="news-read-more-btn" 
                                    onclick="window.location.href='https://www.supportmylocalcommunity.com/local-news/index.html#${item.id}'">
                                Read Full Story
                            </button>
                        </div>`;
                });
            } 
            
            // --- MODE B: HUB PAGE (Full Articles View) ---
            if (fullContainer) {
                fullContainer.innerHTML = ''; 

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';
                    const cleanedStory = cleanStoryBody(item.full_story);
                    const locationTag = resolveStoryLocation(item);
                    const utmLink = appendUTMParameters(item.link);

                    fullContainer.innerHTML += `
                        <article id="${item.id}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Times New Roman', serif;">
                            <span class="location-badge" style="background:#0056b3; color:#fff; font-size:12px; font-weight:bold; padding:4px 10px; border-radius:3px; display:inline-block; margin-bottom:12px;">📍 ${locationTag}</span>
                            <h1 style="font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                            <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date || ''}</p>
                            ${imgHTML}
                            <div class="story-body-full" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(cleanedStory)}</div>
                            <div style="margin-top:20px;">
                                <a href="${utmLink}" target="_blank" style="color:#0258A3; font-weight:bold; font-size:1rem;">View Original Source &rarr;</a>
                            </div>
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
