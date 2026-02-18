// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Identify which page we are on
    const summaryContainer = document.getElementById('town-summaries'); // For Town Pages
    const fullContainer = document.getElementById('full-news-container'); // For the Hub Page

    // 2. Fetch the Data
    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        // 3. Filter for Clay County
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs", "bible grove"];
            const textBlob = (item.title + " " + item.full_story).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        // 4. MODE A: Front Page / Town Site (Teasers)
        if (summaryContainer) {
            summaryContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const teaser = item.full_story ? item.full_story.substring(0, 500) : "Summary not available.";
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border-radius:12px; margin-bottom:15px; object-fit: cover;">` : '';
                
                summaryContainer.innerHTML += `
                    <div class="summary-box" style="margin-bottom: 40px; padding: 20px; background: #fff; border: 1px solid #ddd; box-shadow: 4px 4px 0px rgba(0,0,0,0.05);">
                        <h3 style="color: #0c0b82; margin-top:0;">${formatMoney(item.title)}</h3>
                        <p style="font-size:0.85rem; color:#777;">${item.date}</p>
                        ${imgHTML}
                        <p style="line-height:1.6; color:#333;">${formatMoney(teaser)}...</p>
                        <button style="background:#333; color:#fff; padding:10px 20px; border:none; cursor:pointer; font-weight:bold; text-transform:uppercase;" 
                                onclick="window.location.href='/local-news.html#${item.id}'">
                            Read Full Story
                        </button>
                    </div>`;
            });
        } 
        
        // 5. MODE B: News Hub Page (Full Articles)
        if (fullContainer) {
            fullContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border-radius:12px; margin-bottom:20px; object-fit: cover;">` : '';
                
                fullContainer.innerHTML += `
                    <article id="${item.id}" class="full-story-display" style="border-bottom: 3px double #333; padding-bottom: 50px; margin-bottom: 50px;">
                        <h1 style="font-size:2.8rem; margin-bottom:15px; font-family:'Playfair Display', serif;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#555; margin-bottom:20px;">Published: ${item.date}</p>
                        ${imgHTML}
                        <div class="story-body" style="font-size: 1.25rem; line-height: 1.9; white-space: pre-wrap; font-family:'Merriweather', serif;">
                            ${formatMoney(item.full_story)}
                        </div>
                    </article>`;
            });

            // Auto-scroll logic if coming from a Town Page
            setTimeout(() => {
                const hashId = window.location.hash.substring(1); 
                if (hashId) {
                    const el = document.getElementById(hashId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    });
});

function openWeatherTab() { window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); }
