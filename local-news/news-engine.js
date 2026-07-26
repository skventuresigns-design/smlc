/* === SECTION: File Header & Config === */
// Active Version: v1.0.7 | Timestamp: 2026-07-26_18:00:00
// Description: Local News Processor - Dynamic Location Injector, Copyright Cleaner & UTM Builder

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
    return storyText
        .replace(/[\u00a9\u24b8\u2122]?\s*Copyright\s+\d{4},?\s*WNOI[\s\S]*/gi, '')
        .trim();
}

/**
 * Determine dynamic Location tag ("Louisville", "Flora", or "Clay County")
 */
function resolveStoryLocation(item) {
    // Check if the JSON already has a location property
    if (item.location) return item.location;

    const textBlob = `${item.title || ""} ${item.full_story || ""}`.toLowerCase();
    
    for (const town of CLAY_TOWNS) {
        if (textBlob.includes(town)) {
            return town.replace(/\b\w/g, char => char.toUpperCase());
        }
    }
    
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
            // STEP 1: Dynamically transform each JSON object in memory to ensure "location", clean text, and UTM link exist
            const processedData = data.map(item => {
                const locationTag = resolveStoryLocation(item);
                const cleanedStory = cleanStoryBody(item.full_story);
                const utmLink = appendUTMParameters(item.link);

                return {
                    ...item,
                    location: locationTag,       // <-- Directly attaches "location" key to object!
                    full_story: cleanedStory,   // <-- Cleaned text without WNOI copyright
                    link: utmLink               // <-- Updated link with UTM parameters
                };
            });

            // STEP 2: Filter out non-Clay County stories
            const filteredData = processedData.filter(isClayCountyArticle);

            // --- MODE A: SMLC FRONT PAGE (Grid View) ---
            if (summaryContainer) {
                summaryContainer.style.display = "grid";
                summaryContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
                summaryContainer.style.gap = "30px";
                summaryContainer.style.padding = "20px";
                summaryContainer.innerHTML = ''; 

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}">` : '';

                    summaryContainer.innerHTML += `
                        <div class="full-story-display" data-location="${item.location}">
                            <span class="location-badge" style="background:#0056b3; color:#fff; font-size:11px; font-weight:bold; padding:3px 8px; border-radius:3px; display:inline-block; margin-bottom:8px;">📍 ${item.location}</span>
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
            
            // --- MODE B: HUB PAGE (Full Articles View) ---
            if (fullContainer) {
                fullContainer.innerHTML = ''; 

                filteredData.forEach(item => {
                    const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';

                    fullContainer.innerHTML += `
                        <article id="${item.id}" data-location="${item.location}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Times New Roman', serif;">
                            <span class="location-badge" style="background:#0056b3; color:#fff; font-size:12px; font-weight:bold; padding:4px 10px; border-radius:3px; display:inline-block; margin-bottom:12px;">📍 ${item.location}</span>
                            <h1 style="font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                            <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date || ''}</p>
                            ${imgHTML}
                            <div class="story-body-full" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(item.full_story)}</div>
                            <div style="margin-top:20px;">
                                <a href="${item.link}" target="_blank" style="color:#0258A3; font-weight:bold; font-size:1rem;">View Original Source &rarr;</a>
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
