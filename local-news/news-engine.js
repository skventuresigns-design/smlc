/* === SECTION: File Header & Config === */
// Active Version: v1.2.1 | Timestamp: 2026-08-03_19:25:00
// CSS / JS Imports: ?v=20260803_192500
// Description: Local News Engine - Firestore Direct Target (/local_news)

function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

/* Complete Clay County IL Towns, Unincorporated Communities, & Townships */
const CLAY_TOWNS = [
    // Cities & Villages
    "flora", "louisville", "clay city", "xenia", "iola", "sailor springs",
    // Unincorporated Communities
    "bible grove", "ingraham", "hord", "hoosier", "oskaloosa", "wendelin", "bethel", "riffle",
    // Civil Townships
    "blair", "harter", "larkinsburg", "pixley", "songer", "stanford"
];

/* Local matching phrases for regional feeds */
const CLAY_COUNTY_IL_KEYWORDS = [
    "clay county", "state news", "illinois news", "wnoi", "troop 9", "isp troop 9"
];

/* Explicit Out-of-State Clay County phrases ONLY */
const OUT_OF_STATE_CLAY_REGEX = /\bclay\s+county\s*,?\s*(ia|fl|mn|ms|nc|al|ks|ne|iowa|florida|minnesota|mississippi)\b/i;

// Removes "© Copyright..." text from WNOI
function cleanStoryBody(storyText) {
    if (!storyText) return "";
    return storyText
        .replace(/[\u00a9\u24b8\u2122]?\s*Copyright\s+\d{4},?\s*WNOI[\s\S]*/gi, '')
        .trim();
}

// Determines Location tag using exact word boundary matching
function resolveStoryLocation(item) {
    if (item.location) return item.location; // Use JSON location if present

    const textBlob = `${item.title || ""} ${item.full_story || ""}`.toLowerCase();
    
    for (const town of CLAY_TOWNS) {
        const regex = new RegExp(`\\b${town}\\b`, 'i');
        if (regex.test(textBlob)) {
            return town.replace(/\b\w/g, char => char.toUpperCase());
        }
    }
    return "Clay County";
}

// Appends UTM parameters to external links
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

// Filter logic that allows local IL feeds without requiring explicit "IL" state text
function isClayCountyArticle(item) {
    const titleText = (item.title || "").toLowerCase();
    const bodyText = (item.full_story || "").toLowerCase();
    const fullText = `${titleText} ${bodyText} ${item.location || ""}`.toLowerCase();
    
    // 1. HARD BLOCK: Drop if explicitly referencing another state's Clay County (e.g. "Clay County, IA")
    if (OUT_OF_STATE_CLAY_REGEX.test(fullText)) {
        return false;
    }

    // 2. CHECK TOWNS (Using strict word boundaries so "flora" doesn't hit on "floral")
    const matchesTown = CLAY_TOWNS.some(town => {
        const regex = new RegExp(`\\b${town}\\b`, 'i');
        return regex.test(fullText);
    });
    
    if (matchesTown) return true;

    // 3. CHECK GENERAL KEYWORDS ("clay county", "wnoi", "state news")
    const matchesKeyword = CLAY_COUNTY_IL_KEYWORDS.some(kw => fullText.includes(kw));
    if (matchesKeyword) return true;

    // 4. FALLBACK FOR LOCAL RSS FEEDS:
    const sourceName = (item.source || item.feed_name || item.name || "").toLowerCase();
    if (sourceName.includes("wnoi") || sourceName.includes("flora city")) {
        return true;
    }

    return false;
}

/**
 * PUSH FILTERED NEWS TO FIRESTORE
 * Target Collection: /local_news/
 */
async function pushNewsToFirestore(articles) {
    // Note: Line reference - expects SDK window binding from HTML header
    if (!window.db || !window.setDoc || !window.doc) {
        console.warn("Firestore SDK not initialized on window context. Skipping push.");
        return;
    }

    console.log(`Pushing ${articles.length} filtered Clay County articles to Firestore collection: /local_news...`);
    
    let successCount = 0;
    for (const item of articles) {
        try {
            // Generate clean document ID (e.g. "news_104_flora_fire_dept")
            const cleanTitle = (item.title || "story").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
            const docId = `news_${item.id || Date.now()}_${cleanTitle}`;

            // Line 118: Collection reference changed to 'local_news'
            const newsDocRef = window.doc(window.db, "local_news", docId);

            await window.setDoc(newsDocRef, {
                id: item.id || docId,
                title: item.title || "",
                location: item.location || "Clay County",
                full_story: item.full_story || "",
                date: item.date || new Date().toISOString(),
                image: item.image || "",
                link: item.link || "",
                updatedAt: new Date().toISOString()
            }, { merge: true }); // Merge preserves any existing custom attributes in Firestore

            successCount++;
        } catch (err) {
            console.error(`Error saving story ID ${item.id} to Firestore:`, err);
        }
    }
    console.log(`Successfully synced ${successCount} articles to Firestore collection: /local_news`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    const jsonUrl = `https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl)
        .then(res => res.json())
        .then(async data => {
            // DYNAMIC INJECTION: Adds "location", cleans text, adds UTM to links
            const processedData = data.map(item => {
                const locationTag = resolveStoryLocation(item);
                const cleanedStory = cleanStoryBody(item.full_story);
                const utmLink = appendUTMParameters(item.link);

                return {
                    ...item,
                    location: locationTag,     // Adds "location" property
                    full_story: cleanedStory,  // Cleans copyright text
                    link: utmLink              // Adds UTMs
                };
            });

            // Filter down to allowed articles
            const filteredData = processedData.filter(isClayCountyArticle);

            // AUTOMATED FIRESTORE SYNC (Pushes to /local_news)
            await pushNewsToFirestore(filteredData);

            // MODE A: FRONT PAGE GRID
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
            
            // MODE B: HUB PAGE ARTICLES
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
