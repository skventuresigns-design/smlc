// --- GLOBAL DATA STORE ---
let globalNewsData = [];

// --- UTILITY: Format Money ---
function formatMoney(text) {
    if (!text) return "";
    return text.replace(/(\$\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span style="white-space: nowrap; font-weight: bold;">$1</span>');
}

// --- MODAL CONTROLS (Kept for Town Pages if needed) ---
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

// --- INJECT MODAL SYSTEM ---
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

    const summaryContainer = document.getElementById('town-summaries');
    const fullContainer = document.getElementById('full-news-container');

    const jsonUrl = `https://www.supportmylocalcommunity.com/local-news/news_data.json?v=${new Date().getTime()}`;

    fetch(jsonUrl).then(res => res.json()).then(data => {
        const filteredData = data.filter(item => {
            const clayKeywords = ["flora", "clay city", "xenia", "louisville", "iola", "clay county", "sailor springs", "bible grove"];
            const textBlob = (item.title + " " + item.full_story).toLowerCase();
            return clayKeywords.some(k => textBlob.includes(k)) && !item.title.includes("Fairfield");
        });

        globalNewsData = filteredData;

        // --- TOWN SUMMARIES (Shows "Read Full Story" button) ---
        if (summaryContainer) {
            summaryContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const teaser = item.full_story ? item.full_story.substring(0, 500) : "Summary not available.";
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border-radius:12px; margin-bottom:15px; object-fit: cover;">` : '';
                summaryContainer.innerHTML += `
                    <div class="summary-box" style="margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
                        <h3>${formatMoney(item.title)}</h3>
                        ${imgHTML}
                        <p>${formatMoney(teaser)}...</p>
                        <button style="background:#333; color:#fff; padding:10px; border:none; cursor:pointer;" onclick="window.location.href='/local-news.html#${item.id}'">Read Full Story</button>
                    </div>`;
            });
        } 
        
        // --- HUB PAGE (Full Stories - NO BUTTON) ---
        if (fullContainer) {
            fullContainer.innerHTML = ''; 
            filteredData.forEach(item => {
                const imgHTML = item.image ? `<img src="${item.image}" style="width:100%; border-radius:12px; margin-bottom:20px; object-fit: cover;">` : '';
                fullContainer.innerHTML += `
                    <article id="${item.id}" class="full-story-display" style="border-bottom: 2px solid #333; padding-bottom: 40px; margin-bottom: 40px;">
                        <h1 style="font-size:2.5rem; margin-bottom:10px;">${formatMoney(item.title)}</h1>
                        <p style="font-style:italic; color:#666;">${item.date}</p>
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
            }, 500);
        }
    });
});

function openWeatherTab() { window.open("https://www.accuweather.com/en/us/flora/62839/weather-forecast/332851", "_top"); }
