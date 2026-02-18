// --- GLOBAL DATA STORE ---
let globalNewsData = [];

// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

// --- MODAL SYSTEM (Kept for compatibility) ---
window.openNewsModal = function(id) {
    const item = globalNewsData.find(i => i.id === id);
    if (!item) return;
    document.getElementById('modalTitle').innerHTML = formatMoney(item.title);
    document.getElementById('modalDate').innerText = item.date;
    const imgEl = document.getElementById('modalImg');
    if (item.image) { imgEl.src = item.image; imgEl.style.display = 'block'; } else { imgEl.style.display = 'none'; }
    document.getElementById('modalBody').innerHTML = formatMoney(item.full_story);
    document.getElementById('newsModal').style.display = "block";
    document.body.style.overflow = "hidden";
}

window.closeNewsModal = function() {
    document.getElementById('newsModal').style.display = "none";
    document.body.style.overflow = "auto";
}

function injectModalSystem() {
    if (document.getElementById('newsModal')) return;
    const style = document.createElement('style');
    style.innerHTML = `
        .news-modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.7); }
        .news-modal-content { background-color: #fdfbf7; margin: 5% auto; padding: 40px; border: 1px solid #333; width: 90%; max-width: 800px; position: relative; box-shadow: 10px 10px 0px rgba(0,0,0,0.3); font-family: 'Merriweather', serif; }
        .news-close-btn { color: #000; float: right; font-size: 40px; font-weight: bold; cursor: pointer; line-height: 0.6; }
        .news-modal-title { margin-top: 0; color: #111; font-size: 2.2rem; font-family: 'Playfair Display', serif; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .news-modal-body { line-height: 1.8; font-size: 1.15rem; color: #222; white-space: pre-wrap; }
    `;
    document.head.appendChild(style);
    const modalHtml = `<div id="newsModal" class="news-modal"><div class="news-modal-content"><span class="news-close-btn" onclick="closeNewsModal()">&times;</span><h2 id="modalTitle" class="news-modal-title"></h2><p id="modalDate"></p><img id="modalImg" style="width:100%; max-height:400px; object-fit:contain; margin-bottom:20px;"><div id="modalBody" class="news-modal-body"></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

document.addEventListener('DOMContentLoaded', async () => {
    injectModalSystem();

    const summaryContainer = document.getElementById('town-summaries'); // SMLC Index
    const fullContainer = document.getElementById('full-news-container'); // News Hub

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs"];
            const textBlob = (item.title + " " + (item.full_story || "")).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        globalNewsData = filteredData;

        // --- MODE A: SMLC FRONT PAGE (Individual Clippings) ---
        if (summaryContainer) {
            summaryContainer.innerHTML = ''; 
            // Apply the grey background and padding to the news frame
            summaryContainer.style.backgroundColor = "#e5e5e5";
            summaryContainer.style.padding = "15px";

            filteredData.forEach(item => {
                const teaser = item.full_story ? item.full_story.substring(0, 500) : "Summary unavailable.";
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border:1px solid #ccc; margin-bottom:15px; filter: sepia(10%);">` : '';
                
                summaryContainer.innerHTML += `
                    <div class="news-clipping" style="background:#ffffff; padding:25px; margin-bottom:30px; border:1px solid #999; box-shadow:8px 8px 0px rgba(0,0,0,0.15); font-family: 'Merriweather', serif; text-align:left;">
                        <h3 style="font-family:'Playfair Display', serif; font-weight:900; font-size:1.8rem; border-bottom:2px solid #000; padding-bottom:8px; margin-top:0;">${formatMoney(item.title)}</h3>
                        <p style="font-size:0.85rem; color:#555; font-style:italic; margin:10px 0;">${item.date}</p>
                        ${imgHTML}
                        <p style="line-height:1.6; color:#222; font-size:1.05rem;">${formatMoney(teaser)}...</p>
                        <button style="background:#333; color:#fff; padding:12px; border:none; width:100%; cursor:pointer; font-weight:bold; margin-top:15px; text-transform:uppercase; font-family:'Playfair Display', serif; letter-spacing:1px;" 
                                onclick="window.location.href='/local-news/index.html#${item.id}'">
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
                    <article id="${item.id}" style="background:#fff; padding:30px; border-bottom:3px double #333; margin-bottom:40px; font-family: 'Merriweather', serif;">
                        <h1 style="font-family:'Playfair Display', serif; font-weight:900; font-size:2.8rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#666; margin-bottom:20px;">${item.date}</p>
                        ${imgHTML}
                        <div class="story-body" style="font-size: 1.25rem; line-height: 1.8; white-space: pre-wrap;">${formatMoney(item.full_story)}</div>
                    </article>`;
            });

            // Handle anchor scroll
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
