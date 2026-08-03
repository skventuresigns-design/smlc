/* === SECTION: File Header & Config === */
// Active Version: v1.2.4 | Timestamp: 2026-08-03_19:45:00
// CSS / JS Imports: ?v=20260803_194500
// Description: Local News Engine - Universal Copyright Removal & Full Description Preservation

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

/* Local matching phrases for regional feeds, schools, & sports */
const CLAY_COUNTY_IL_KEYWORDS = [
    // General County & Regional News
    "clay county", "state news", "illinois news", "wnoi", "troop 9", "isp troop 9",
    
    // North Clay Schools & Athletics
    "north clay", "nc cardinals", "north clay cardinals", "north clay indians",
    
    // Flora Schools & Athletics
    "floyd henson", "floyd henson jr high", "floyd henson junior high", 
    "flora wolves", "flora lady wolves", "flora unit 35",
    
    // Clay City Schools & Athletics
    "clay city wolves", "clay city lady wolves", "clay city cusd", "clay city school"
];

/* Explicit Out-of-State Clay County phrases ONLY */
const OUT_OF_STATE_CLAY_REGEX = /\bclay\s+county\s*,?\s*(ia|fl|mn|ms|nc|al|ks|ne|iowa|florida|minnesota|mississippi)\b/i;

/**
 * REFINED CLEANER:
 * Strips out any line or phrase containing the word "copyright".
 */
function cleanStoryBody(storyText) {
    if (!storyText) return "";
    return storyText
        // Removes anything saying "copyright..." up to the end of the sentence/line
        .replace(/(?:[\u00a9\u24b8\u2122]|&copy;)?\s*copyright[^\.\n]*\.?/gi, '')
        .trim();
}

/**
 * FULL STORY EXTRACTOR:
 * Checks full_story, description, and content so no text is dropped.
 */
function extractFullStoryText(item) {
    const rawText = item.full_story || item.description || item.content || "";
    return cleanStoryBody(rawText);
}

// Determines Location tag using exact word boundary matching
function resolveStoryLocation(item) {
    if (item.location) return item.location; 

    const textBlob = `${item.title || ""} ${item.full_story || ""} ${item.description || ""}`.toLowerCase();
    
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
    const bodyText = (item.full_story || item.description || "").toLowerCase();
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
 * PUSH FULL UNTRUNCATED NEWS TO FIRESTORE
 * Target Collection: /local_news/
 */
async function pushNewsToFirestore(articles) {
    if (!window.db || !window.setDoc || !window.doc) {
        console.warn("Firestore SDK not initialized on window context. Skipping push.");
        return;
    }

    console.log(`Pushing ${articles.length} full Clay County articles to Firestore collection: /local_news...`);
    
    let successCount = 0;
    for (const item of articles) {
        try {
            const cleanTitle = (item.title || "story").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
            const docId = `news_${item.id || Date.now()}_${cleanTitle}`;

            const newsDocRef = window.doc(window.db, "local_news", docId);

            await window.setDoc(newsDocRef, {
                id: item.id || docId,
                title: item.title || "",
                location: item.location || "Clay County",
                full_story: item.full_story || "", // Pushes full description with all copyright mentions hidden
                date: item.date || new Date().toISOString(),
                image: item.image || "",
                link: item.link || "",
                updatedAt: new Date().toISOString()
            }, { merge: true });

            successCount++;
        } catch (err) {
            console.error(`Error saving story ID ${item.id} to Firestore:`, err);
        }
    }
    console.log(`Successfully synced ${successCount} untruncated articles to Firestore collection: /local_news`);
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    const jsonUrl = `https://raw.githubusercontent.com/skventuresigns-design/smlc/main/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl)
        .then(res => res.json())
        .then(async data => {
            // DYNAMIC INJECTION: Extracts full text while removing anything that says "copyright"
            const processedData = data.map(item => {
                const fullText = extractFullStoryText(item);
                const locationTag = resolveStoryLocation(item);
                const utmLink = appendUTMParameters(item.link);

                return {
                    ...item,
                    location: locationTag,
                    full_story: fullText, 
                    link: utmLink
                };
            });

            // Filter down to allowed articles
            const filteredData = processedData.filter(isClayCountyArticle);

            // FIRESTORE SYNC: Pushes complete text to /local_news
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
                            <div class="story-body" style="white-space: pre-wrap; word-break: break-word; overflow: visible; max-height: none;">${formatMoney(item.full_story)}</div>
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
                            <div class="story-body-full" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap; word-break: break-word; overflow: visible; max-height: none;">${formatMoney(item.full_story)}</div>
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
