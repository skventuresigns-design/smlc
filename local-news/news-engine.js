// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

document.addEventListener('DOMContentLoaded', async () => {
    // These match the specific IDs in your index.html and local-news/index.html
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    // Full URL ensures the front page can find the data from the root folder
    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs"];
            const textBlob = (item.title + " " + (item.full_story || "")).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        // --- MODE A: FRONT PAGE (SMLC Index) ---
        if (summaryContainer) {
            summaryContainer.innerHTML = ''; 
            // Setting the requested background for the news area
            summaryContainer.style.backgroundColor = "#e5e5e5";
            summaryContainer.style.padding = "10px";

            filteredData.forEach(item => {
                const teaser = item.full_story ? item.full_story.substring(0, 500) : "Summary unavailable.";
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:15px; filter: sepia(10%);">` : '';
                
                summaryContainer.innerHTML += `
                    <div class="news-clipping" style="background:#ffffff; padding:25px; margin-bottom:35px; border:1px solid #999; box-shadow:8px 8px 0px rgba(0,0,0,0.15); font-family: 'Merriweather', serif; text-align:left; color:#000;">
                        <h3 style="margin-top:0; font-family:'Playfair Display', serif; font-weight:900; font-size:1.8rem; border-bottom:2px solid #000; padding-bottom:8px; line-height:1.2;">${formatMoney(item.title)}</h3>
                        <p style="font-size:0.85rem; font-weight:bold; margin:10px 0; font-style:italic; color:#555;">${item.date}</p>
                        ${imgHTML}
                        <p style="line-height:1.6; font-size:1.1rem;">${formatMoney(teaser)}...</p>
                        <button style="background:#333; color:#fff; padding:12px; border:none; width:100%; cursor:pointer; font-weight:bold; margin-top:15px; text-transform:uppercase; font-family:'Playfair Display', serif; letter-spacing:1px;" 
                                onclick="window.location.href='https://www.supportmylocalcommunity.com/local-news/index.html#${item.id}'">
                            Read Full Story
                        </button>
                    </div>`;
            });
        } 
        
        // --- MODE B: HUB PAGE (local-news/index.html) ---
        if (fullContainer) {
            fullContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';
                fullContainer.innerHTML += `
                    <article id="${item.id}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Merriweather', serif;">
                        <h1 style="font-family:'Playfair Display', serif; font-weight:900; font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date}</p>
                        ${imgHTML}
                        <div class="story-body" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(item.full_story)}</div>
                    </article>`;
            });

            // Logic to scroll to the article chosen on the front page
            setTimeout(() => {
                const hashId = window.location.hash.substring(1); 
                if (hashId) {
                    const el = document.getElementById(hashId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 600);
        }
    });
});

function openWeatherTab() { window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); }
