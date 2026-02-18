// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

document.addEventListener('DOMContentLoaded', async () => {
    const summaryContainer = document.getElementById('town-summaries'); 
    const fullContainer = document.getElementById('full-news-container'); 

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs"];
            const textBlob = (item.title + " " + (item.full_story || "")).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        // --- MODE A: SMLC FRONT PAGE (Side-by-Side Flexing Grid) ---
        if (summaryContainer) {
            // Apply your grid logic from the stylesheet to this container
            summaryContainer.style.display = "grid";
            summaryContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
            summaryContainer.style.gap = "30px";
            summaryContainer.style.padding = "20px";
            summaryContainer.innerHTML = ''; 

            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}">` : '';
                
                // Using your CSS classes: "full-story-display", "story-body", and "news-read-more-btn"
                summaryContainer.innerHTML += `
                    <div class="full-story-display">
                        <h1>${formatMoney(item.title)}</h1>
                        <p style="font-size: 0.8rem; font-weight: bold; color: #777;">${item.date}</p>
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
            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:20px;">` : '';
                fullContainer.innerHTML += `
                    <article id="${item.id}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Times New Roman', serif;">
                        <h1 style="font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date}</p>
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
    });
});

function openWeatherTab() { window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); }
