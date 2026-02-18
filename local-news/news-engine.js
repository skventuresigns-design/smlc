// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); // Front Index
    const fullContainer = document.getElementById('full-news-container'); // Hub Page

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs", "bible grove"];
            const textBlob = (item.title + " " + item.full_story).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        // --- FRONT PAGE MODE (Individual Clippings) ---
        if (summaryContainer) {
            summaryContainer.style.backgroundColor = "#e5e5e5";
            summaryContainer.style.padding = "20px";
            summaryContainer.innerHTML = ''; 

            filteredData.forEach(item => {
                const teaser = item.full_story ? item.full_story.substring(0, 500) : "Summary not available.";
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:15px;">` : '';
                
                summaryContainer.innerHTML += `
                    <div class="news-clipping" style="background: #ffffff; padding: 25px; margin-bottom: 30px; border: 1px solid #bbb; box-shadow: 6px 6px 0px rgba(0,0,0,0.1); font-family: 'Times New Roman', serif;">
                        <h3 style="margin-top:0; font-size: 1.7rem; color: #111; border-bottom: 2px solid #333; padding-bottom: 5px;">${formatMoney(item.title)}</h3>
                        <p style="font-size: 0.8rem; color: #666; margin: 10px 0; font-weight: bold;">${item.date}</p>
                        ${imgHTML}
                        <p style="line-height: 1.6; font-size: 1.1rem; color: #222;">${formatMoney(teaser)}...</p>
                        <button style="background:#333; color:#fff; padding:12px; border:none; cursor:pointer; font-weight:bold; width: 100%; margin-top: 15px; font-family: sans-serif; letter-spacing: 1px;" 
                                onclick="window.location.href='https://www.supportmylocalcommunity.com/local-news/index.html#${item.id}'">
                            READ FULL STORY
                        </button>
                    </div>`;
            });
        } 
        
        // --- HUB PAGE MODE (Full Articles - Left as is) ---
        if (fullContainer) {
            fullContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';
                fullContainer.innerHTML += `
                    <article id="${item.id}" class="full-story-display" style="border-bottom: 2px solid #333; padding-bottom: 40px; margin-bottom: 40px; font-family: 'Times New Roman', serif;">
                        <h1 style="font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date}</p>
                        ${imgHTML}
                        <div class="story-body" style="font-size: 1.2rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(item.full_story)}</div>
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
    });
});

function openWeatherTab() { window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); }
