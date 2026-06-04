/* * NYT Timestamp: June 4, 2026, 2:57 PM EDT
 * NO STRIPPING, NO COMPRESSING, DON'T CHANGE WHAT I DIDN'T SAY TO CHANGE
 * * Modifications appended: 
 * - Migrated to gtag.js standard event pushing.
 * - Updated campaign variables and UTM paths for "Business Card" attribution.
 * - Added a 500ms timeout prior to redirect to ensure GA4 registers the event.
 */

async function skvBusinessCardRedirect() {
    try {
        // 1. Get Geo-data from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const area = (data.city + " " + data.region).toLowerCase();
        const zip = data.postal || "00000";
        
        // 2. Default campaign for Business Cards
        let campaign = "skv_business_card_master";

        // 3. S&K Specific Mapping Logic (Retained in case cards are handed out in targeted regions)
        if (area.includes("effingham") || area.includes("teutopolis")) {
            campaign = "skv_bc_effingham";
        } else if (area.includes("clay") || area.includes("flora") || area.includes("louisville")) {
            campaign = "skv_bc_clay_city";
        } else if (area.includes("marshall")) {
            campaign = "skv_bc_marshall";
        } else if (area.includes("oliver")) {
            campaign = "skv_bc_oliver";
        } else if (area.includes("desoto")) {
            campaign = "skv_bc_desoto";
        }

        // 4. GOOGLE ANALYTICS LOGGING (Custom Event for Business Cards)
        gtag('event', 'qr_scan_location', {
            'ad_type': 'skv_business_card',
            'card_location': campaign,
            'user_city': data.city,
            'user_zip': zip
        });

        // 5. FINAL REDIRECT (To S&K Venture Signs Website with Business Card UTMs)
        const finalUrl = `https://skventuresigns.com/?utm_source=business_card&utm_medium=qr&utm_campaign=${campaign}`;
        
        // Slight delay gives Google Analytics time to fire the event before leaving the page
        setTimeout(() => {
            window.location.replace(finalUrl);
        }, 500);

    } catch (err) {
        console.error("Tracking error:", err);
        // Fallback to S&K main site if IP fetch or tracking fails
        window.location.replace("https://skventuresigns.com/?utm_source=business_card&utm_medium=qr&utm_campaign=business_card_fallback");
    }
}

window.onload = skvBusinessCardRedirect;
