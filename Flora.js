/* Timestamp: 2026-06-04 18:22:31 (New York Time) */

const syncChannel = new BroadcastChannel('kevin_master_sync_channel');

const defaultPreferences = {
    theme: 'bright', 
    font: 'sans-serif',
    outline: '#000000',
    maps_app: 'google',
    phone_app: 'cellular',
    lang: 'en'
};

const fallbackFloraAds = [
    { title: "Flora Chamber Coupons", url: "https://ourflora.com/coupons", imgUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80" },
    { title: "Clay County History", url: "https://supportmylocalcommunity.com/clay-county", imgUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" },
    { title: "Library Online Portal", url: "https://florail.govoffice2.com/library", imgUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" },
    { title: "Business Directory", url: "https://clay-county-business-directory.supportmylocalcommunity.com", imgUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80" },
    { title: "Active Showroom", url: "https://www.supportmylocalcommunity.com", imgUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" }
];

function getCookie(name) {
    const val = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return val ? decodeURIComponent(val.pop()) : '';
}

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
}

let currentTheme = getCookie('user_theme') || defaultPreferences.theme;
let currentFont = getCookie('user_font') || defaultPreferences.font;
let currentOutline = getCookie('user_outline') || defaultPreferences.outline;
let currentLang = getCookie('user_lang') || defaultPreferences.lang;

const dictionary = {
    en: {
        sec1_title: "5. Master Portal Dashboard",
        sec1_body: "Welcome Kevin to your responsive stack manager. All sections are stacked vertically on top of each other dynamically, conforming to your precise aspect configurations and custom branding schemas. Adjust styling from the collapsible settings window to see parameters dynamically adjust.",
        sec2_title: "6. Squad Registry",
        sec2_body: "Our active operations hub contains profile information and coordination assets for: Seth (Fluffy, Phoenix_Darkfire), Ray (OneLIVIDMAN), TJ (Darkwing69420), Marc (ElucidatorVah), JCrow207, and UnicornBunnyShiv. Use settings options to test Cross-Tab communications dynamically.",
        sec3_title: "7. Billboard Scaling Models",
        sec3_body: "Sign production models must be scaled carefully. We handle structural layouts mapping to standard display surfaces: 8x16, 5x10, 6x12 (2:1 System), 6x14 (~2.33:1 System), and 43-inch Television Matrix (16:9 System).",
        sec4_title: "8. Active Gallery (Lightbox Enabled)",
        sec4_body: "Click on any visual board representation below to load the immersive high-definition lightbox viewer.",
        sec6_title: "10. Direct Routing Communications",
        sec6_body: "Test deep routing integration handlers by clicking our communication links below. System will automatically map requests using chosen application settings.",
        sec7_title: "11. Dynamic Character Translation Console",
        sec7_body: "This interface shows dynamic character updates when transitioning system languages. Outlines dynamically adapt based on font rendering guidelines.",
        translated_sample: "Current language: English. Perfect rendering applied.",
        sec8_title: "12. Inter-Tab Sync State",
        sec8_body: "Open this web portal in a secondary browser window. Any settings changes will instantly propagate across all active targets via the Broadcast Channel.",
        sec9_title: "13. Cookie & State Storage Inspector",
        sec10_title: "14. Operations Ledger",
        sec10_body: "Compilation verification: 100% responsive, high-contrast text outlines, adaptive auto-night checks, and full multi-tab system synchronization.",
        sec4_flora_title: "Discover Flora's Vibrant Community",
        sec4_flora_body: "Join us in supporting local businesses and dive into the exciting events happening in Flora, IL. Experience the warmth of our community and make unforgettable memories.",
        sec4_flora_sub: "Thank you for reading this post, don't forget to subscribe!",
        sec5_heritage_title: "Flora Illinois Rich Heritage",
        sec5_heritage_p1: "Flora, IL was established in 1854 by Samuel White, who donated land to the City of Flora for several buildings and the city park. The City Park, at that time called the Public Square, is present day Library Park where Flora Public Library is located.",
        sec5_heritage_sub: "Flora Library",
        sec5_heritage_p2: "The Flora Public Library is located in Library Park at 216 North Main Street.  The 9,285 square foot facility was completed in 1992 and dedicated in March 1993.  This spacious, modern building replaced the Flora Carnegie Library building, a two-story yellow brick, which stood in Library Park from 1903 until 1990.  In January 1990, the Carnegie building was deemed structurally unsafe and closed to the public.  After a two-year building campaign, along with the generosity and assistance of a supportive community, the new red brick structure was completed.",
        sec5_heritage_cap1: "Flora Library in 1903",
        sec5_heritage_cap2: "Flora Library in 1933",
        sec6_timeline_title: "Flora's Historical Timeline",
        sec6_timeline_p: "Journey through the significant milestones that have shaped Flora, IL, into the community it is today.",
        sec6_timeline_s1_date: "1854",
        sec6_timeline_s1_head: "Founding of Flora",
        sec6_timeline_s1_desc: "Flora was established as a key stop along the railroad, setting the stage for future growth and development.",
        sec6_timeline_s2_date: "1900",
        sec6_timeline_s2_head: "Industrial Expansion",
        sec6_timeline_s2_desc: "The turn of the century brought industrial growth, with new businesses and factories contributing to the town’s prosperity.",
        sec6_timeline_s3_date: "1950",
        sec6_timeline_s3_head: "Cultural Renaissance",
        sec6_timeline_s3_desc: "Post-war Flora saw a cultural boom, with new schools, theaters, and community centers.  In 1954 the Centenial Birthday was celebrated.",
        sec6_timeline_s4_date: "2000",
        sec6_timeline_s4_head: "Modern Revitalization",
        sec6_timeline_s4_desc: "Flora embraced modernization while preserving its historical charm, leading to a revitalized downtown area and renewed community spirit.",
        sec9_ads_title: "9. Flora Operations & Billboard Display"
    },
    es: { /* Full ES block preserved */
        sec1_title: "5. Panel de Control Maestro",
        sec1_body: "Bienvenido Kevin a tu gestor de secciones apiladas. Todas las secciones se muestran apiladas verticalmente, adaptándose de forma fluida a tus dimensiones de pantalla y reglas de marca. Modifica el diseño desde el menú de configuración para comprobar el rendimiento.",
        sec2_title: "6. Registro del Escuadrón",
        sec2_body: "Nuestro nodo de operaciones contiene información y activos para: Seth (Fluffy, Phoenix_Darkfire), Ray (OneLIVIDMAN), TJ (Darkwing69420), Marc (ElucidatorVah), JCrow207 y UnicornBunnyShiv.",
        sec3_title: "7. Modelos de Vallas Publicitarias",
        sec3_body: "Los modelos de fabricación de carteles deben escalarse con cuidado: 8x16, 5x10, 6x12 (Relación 2:1), 6x14 (~2.33:1) y televisión de 43 pulgadas (16:9).",
        sec4_title: "8. Galería de Imágenes (Lightbox)",
        sec4_body: "Haz clic en cualquier valla publicitaria para abrir la visualización inmersiva en pantalla completa.",
        sec6_title: "10. Enlaces de Comunicación Directa",
        sec6_body: "Pon a prueba la integración de llamadas y mensajería usando tus aplicaciones predeterminadas del sistema.",
        sec7_title: "11. Demostración de Traducción Dinámica",
        sec7_body: "Este panel muestra la actualización de caracteres basada en el idioma activo.",
        translated_sample: "Idioma actual: Español. Traducción ejecutada con éxito.",
        sec8_title: "12. Sincronización Inter-Pestaña",
        sec8_body: "Abre esta aplicación en otra ventana. Los cambios se sincronizarán inmediatamente usando Broadcast Channel.",
        sec9_title: "13. Inspector de Cookies y Estado",
        sec10_title: "14. Registro Operativo",
        sec10_body: "Verificación del sistema: 100% adaptable, contornos de texto contrastados, comprobación automática de hora nocturna y sincronización multiplataforma.",
        sec4_flora_title: "Descubre la Vibrante Comunidad de Flora",
        sec4_flora_body: "Únase a nosotros para apoyar a las empresas locales y sumergirse en los emocionantes eventos que ocurren en Flora, IL. Experimente la calidez de nuestra comunidad y cree recuerdos inolvidables.",
        sec4_flora_sub: "¡Gracias por leer esta publicación, no olvides suscribirte!",
        sec5_heritage_title: "Rico Patrimonio de Flora Illinois",
        sec5_heritage_p1: "Flora, IL fue fundada en 1854 por Samuel White, quien donó terrenos a la Ciudad de Flora para varios edificios y el parque de la ciudad. El Parque de la Ciudad, en ese momento llamado la Plaza Pública, es el actual Parque de la Biblioteca donde se encuentra la Biblioteca Pública de Flora.",
        sec5_heritage_sub: "Biblioteca de Flora",
        sec5_heritage_p2: "La Biblioteca Pública de Flora está ubicada en el Parque de la Biblioteca en 216 North Main Street. La instalación de 9,285 pies cuadrados se completó en 1992 y se inauguró en marzo de 1993. Este espacioso y moderno edificio reemplazó al edificio de la Biblioteca Carnegie de Flora, un ladrillo amarillo de dos pisos, que estuvo en el Parque de la Biblioteca desde 1903 hasta 1990. En enero de 1990, el edificio Carnegie se consideró estructuralmente unsafe y se cerró al público. Después de una campaña de construcción de dos años, junto con la generosidad y el apoyo de una comunidad solidaria, se completó la nueva estructura de ladrillo rojo.",
        sec5_heritage_cap1: "Biblioteca de Flora en 1903",
        sec5_heritage_cap2: "Biblioteca de Flora en 1933",
        sec6_timeline_title: "Línea de Tiempo Histórica de Flora",
        sec6_timeline_p: "Recorrido por los hitos significativos que han dado forma a Flora, IL, en la comunidad que es hoy.",
        sec6_timeline_s1_date: "1854",
        sec6_timeline_s1_head: "Fundación de Flora",
        sec6_timeline_s1_desc: "Flora se estableció como una parada clave a lo largo del ferrocarril, sentando las bases para el crecimiento y desarrollo futuro.",
        sec6_timeline_s2_date: "1900",
        sec6_timeline_s2_head: "Expansión Industrial",
        sec6_timeline_s2_desc: "El cambio de siglo trajo consigo un crecimiento industrial, con nuevas empresas y fábricas que contribuyeron a la prosperidad del municipio.",
        sec6_timeline_s3_date: "1950",
        sec6_timeline_s3_head: "Renacimiento Cultural",
        sec6_timeline_s3_desc: "La Flora de la posguerra experimentó un auge cultural, con nuevas escuelas, teatros y centros comunitarios. En 1954 se celebró el centenario.",
        sec6_timeline_s4_date: "2000",
        sec6_timeline_s4_head: "Revitalización Moderna",
        sec6_timeline_s4_desc: "Flora abrazó la modernización conservando su encanto histórico, lo que dio lugar a un centro de la ciudad revitalizado y un renovado espíritu comunitario.",
        sec9_ads_title: "9. Operaciones de Flora y Exhibición"
    },
    de: { /* Full DE block preserved */
        sec1_title: "5. Master-Portal-Dashboard",
        sec1_body: "Willkommen Kevin in Ihrem responsiven Stack-Manager. Alle Abschnitte sind vertikal übereinander gestapelt und passen sich Ihren Bildschirmverhältnissen an. Passen Sie das Design im Einstellungsmenü an.",
        sec2_title: "6. Kader-Register",
        sec2_body: "Unser Operationszentrum enthält Profile und Koordinationsdaten für: Seth, Ray, TJ, Marc, JCrow207 und UnicornBunnyShiv.",
        sec3_title: "7. Werbetafel-Formate",
        sec3_body: "Schilder-Formate erfordern präzise Skalierung: 8x16, 5x10, 6x12 (Verhältnis 2:1), 6x14 (~2.33:1) und 43-Zoll-TV-Matrix (16:9).",
        sec4_title: "8. Bildergalerie (Lightbox)",
        sec4_body: "Klicken Sie auf ein beliebiges Modellbild unten, um den Lightbox-Viewer zu öffnen.",
        sec6_title: "10. Direktverbindungen & Kommunikation",
        sec6_body: "Teilen Sie Kommunikationskanäle direkt durch Klicken auf unsere Telefon- und E-Mail-Schaltflächen.",
        sec7_title: "11. Dynamische Übersetzungskonsole",
        sec7_body: "Dieses Steuerungsfenster zeigt Live-Übersetzungen und Schriftzeichenanpassungen an.",
        translated_sample: "Aktuelle Sprache: Deutsch. Perfekte Anpassung geladen.",
        sec8_title: "12. Registerkarten-Synchronisation",
        sec8_body: "Öffnen Sie dieses Portal in einem zweiten Fenster. Alle Änderungen synchronisieren sich sofort über den Broadcast-Kanal.",
        sec9_title: "13. Cookie- und Zustandskontrolle",
        sec10_title: "14. Betriebsprotokoll",
        sec10_body: "Systemprüfung: 100% responsiv, kontrastreiche Konturen, automatischer Nachtmodus und Live-Synchronisation.",
        sec4_flora_title: "Entdecken Sie Floras Lebendige Gemeinschaft",
        sec4_flora_body: "Unterstützen Sie gemeinsam mit uns lokale Unternehmen und tauchen Sie ein in die aufregenden Ereignisse in Flora, IL. Erleben Sie die Wärme unserer Gemeinschaft und schaffen Sie unvergessliche Erinnerungen.",
        sec4_flora_sub: "Vielen Dank fürs Lesen, vergessen Sie nicht zu abonnieren!",
        sec5_heritage_title: "Floras Reiches Historisches Erbe",
        sec5_heritage_p1: "Flora, IL wurde 1854 von Samuel White gegründet, der der Stadt Flora Land für mehrere Gebäude und den Stadtpark spendete. Der Stadtpark, damals Public Square genannt, ist der heutige Library Park, in dem sich die Flora Public Library befindet.",
        sec5_heritage_sub: "Flora Bibliothek",
        sec5_heritage_p2: "Die Flora Public Library befindet sich im Library Park in der 216 North Main Street. Die 9.285 Quadratfuß große Einrichtung wurde 1992 fertiggestellt und im März 1993 eingeweiht. Dieses geräumige, moderne Gebäude ersetzte das Flora Carnegie Library-Gebäude, ein zweistöckiges gelbes Backsteingebäude, das von 1903 bis 1990 im Library Park stand. Im Januar 1990 wurde das Carnegie-Gebäude als baulich unsicher eingestuft und für die Öffentlichkeit geschlossen. Nach einer zweijährigen Bauphase wurde mit der Großzügigkeit und Unterstützung einer engagierten Gemeinschaft der neue rote Backsteinbau fertiggestellt.",
        sec5_heritage_cap1: "Flora Bibliothek im Jahre 1903",
        sec5_heritage_cap2: "Flora Bibliothek im Jahre 1933",
        sec6_timeline_title: "Floras Historischer Zeitstrahl",
        sec6_timeline_p: "Reise durch die wichtigsten Meilensteine, die Flora, IL, zu der Gemeinschaft gemacht haben, die es heute ist.",
        sec6_timeline_s1_date: "1854",
        sec6_timeline_s1_head: "Gründung von Flora",
        sec6_timeline_s1_desc: "Flora wurde als wichtiger Knotenpunkt an der Eisenbahnlinie gegründet, was den Grundstein für das zukünftige Wachstum legte.",
        sec6_timeline_s2_date: "1900",
        sec6_timeline_s2_head: "Industrielle Expansion",
        sec6_timeline_s2_desc: "Die Jahrhundertwende brachte industrielles Wachstum, wobei neue Unternehmen und Fabriken zum Wohlstand der Stadt beitrugen.",
        sec6_timeline_s3_date: "1950",
        sec6_timeline_s3_head: "Kulturelle Renaissance",
        sec6_timeline_s3_desc: "Das Nachkriegs-Flora erlebes einen kulturellen Aufschwung mit neuen Schulen, Theatern und Gemeindezentren. 1954 wurde das 100-jährige Jubiläum gefeiert.",
        sec6_timeline_s4_date: "2000",
        sec6_timeline_s4_head: "Moderne Revitalisierung",
        sec6_timeline_s4_desc: "Flora verschrieb sich der Modernisierung und bewahrte gleichzeitig seinen historischen Charme, was zu einer neu belebten Innenstadt führte.",
        sec9_ads_title: "9. Flora Operationen & Plakatwand-Anzeige"
    },
    ja: { /* Full JA block preserved */
        sec1_title: "5. マスター・ポータル・ダッシュボード",
        sec1_body: "ケビン、あなたのレスポンシブなスタック管理画面へようこそ。すべてのセクションは垂直に積み重ねられ、ディスプレイ比率規格および独自仕様に合わせて完全にスケーリングされます。",
        sec2_title: "6. チーム登録簿",
        sec2_body: "当管理ハブには、次のメンバーの活動ステータス情報が格納されています：Seth (Fluffy, Phoenix_Darkfire), Ray (OneLIVIDMAN), TJ (Darkwing69420), Marc (ElucidatorVah), JCrow207, UnicornBunnyShiv。",
        sec3_title: "7. 看板サイズスケーリングモデル",
        sec3_body: "看板デザイン規格アスペクト比：8x16, 5x10, 6x12（2:1仕様）、6x14（約2.33:1仕様）、および43インチテレビアスペクト（16:9仕様）。",
        sec4_title: "8. メインギャラリー（ライトボックス表示）",
        sec4_body: "下の画像をタップすると高精細ライトボックスが起動し、プレビュー表示を確認できます。",
        sec6_title: "10. ダイレクト連絡チャンネル",
        sec6_body: "システム設定で指定されたお好みの通信アプリを使って、通話やメール接続をテストします。",
        sec7_title: "11. ダイナミック多言語翻訳コンソール",
        sec7_body: "この画面は、アクティブ言語を切り替えた際のアウトライン適正レンダリングを示します。",
        translated_sample: "現在の言語：日本語。適正なCJK明朝またはゴシック体のアウトラインで描画されています。",
        sec8_title: "12. 複数タブ間の同期ステータス",
        sec8_body: "このページを別のウィンドウで開きます。片方の設定を変更すると、Broadcast Channelを介して全ウィンドウが瞬時に同期されます。",
        sec9_title: "13. クッキー＆ステート・ストレージ・インスペクター",
        sec10_title: "14. 運用管理ログ",
        sec10_body: "検証チェック：100%レスポンシブ、高コントラスト文字アウトライン、時間判定自動夜間テーマ、およびライブ・タブ同期完了。",
        sec4_flora_title: "フローラの活気あるコミュニティを発見する",
        sec4_flora_body: "地元のビジネスをサポートし、イリノイ州フローラで開催されるエキサイティングなイベントに飛び込みましょう。私たちのコミュニティの温かさを体験し、忘れられない思い出を作ってください。",
        sec4_flora_sub: "この記事を読んでいただきありがとうございます。購読を忘れないでください！",
        sec5_heritage_title: "イリノイ州フローラの豊かな歴史的遺産",
        sec5_heritage_p1: "イリノイ州フローラは、1854年にサミュエル・ホワイトによって設立されました。彼はフローラ市にいくつかの建物と市営公園のための土地を寄付しました。当時「パブリック・スクエア」と呼ばれていた市営公園は、現在のライブラリー・パークであり、フローラ公立図書館が設置されています。",
        sec5_heritage_sub: "フローラ図書館",
        sec5_heritage_p2: "フローラ公立図書館は、ライブラリー・パーク（216 North Main Street）に位置しています。9,285平方フィートの施設は1992年に完成し、1993年3月に開館しました。この広々とした近代的な建物は、1903年から1990年までライブラリー・パークに立っていた2階建ての黄色いレンガ造りのフローラ・カーネギー図書館ビルに代わるものです。1990年1月にカーネギービルは構造的に危険と判断され、閉鎖されました。2年間にわたる建設キャンペーンと、温かいコミュニティの寛大な支援により、新しい赤いレンガ造りの構造が完成しました。",
        sec5_heritage_cap1: "1903年のフローラ図書館",
        sec5_heritage_cap2: "1933年のフローラ図書館",
        sec6_timeline_title: "フローラの歴史タイムライン",
        sec6_timeline_p: "イリノイ州フローラを今日のコミュニティへと形作った、重要なマイルストーンをたどる旅。",
        sec6_timeline_s1_date: "1854",
        sec6_timeline_s1_head: "フローラの誕生",
        sec6_timeline_s1_desc: "フローラは鉄道沿線の要所として設立され、将来の成長と発展の舞台が整いました。",
        sec6_timeline_s2_date: "1900",
        sec6_timeline_s2_head: "産業の拡大",
        sec6_timeline_s2_desc: "世紀 of わりは産業の成長をもたらし、新たな企業や工場が町の繁栄に貢献しました。",
        sec6_timeline_s3_date: "1950",
        sec6_timeline_s3_head: "文化の復興",
        sec6_timeline_s3_desc: "戦後のフローラは、新しい学校、劇場、コミュニティセンターの建設など、文化の隆盛を見せました。1954年には100周年が祝われました。",
        sec6_timeline_s4_date: "2000",
        sec6_timeline_s4_head: "近代的再生",
        sec6_timeline_s4_desc: "フローラは歴史的魅力を保ちながら近代化を受け入れ、活性化した中心街と新たなコミュニティ精神をもたらしました。",
        sec9_ads_title: "9. フローラ事業と看板展示"
    }
};

function toggleMobileNav() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

function switchLanguage(langCode) {
    currentLang = langCode;
    setCookie('user_lang', langCode);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const translationKey = element.getAttribute('data-i18n');
        if (dictionary[langCode] && dictionary[langCode][translationKey]) {
            element.innerHTML = dictionary[langCode][translationKey];
        }
    });

    const langSelect = document.getElementById('lang-select');
    if (langSelect) langSelect.value = langCode;

    if (langCode === 'ja') {
        document.body.style.lineBreak = "anywhere";
        document.body.style.wordBreak = "break-all";
    } else {
        document.body.style.lineBreak = "normal";
        document.body.style.wordBreak = "keep-all";
    }
}

function applyThemeToDOM(themeName) {
    const body = document.body;
    body.classList.remove('dark-mode', 'light-mode');

    if (themeName === 'dark') {
        body.classList.add('dark-mode');
    } else if (themeName === 'bright') {
        body.classList.add('light-mode');
    } else if (themeName === 'system') {
        const sysPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(sysPrefersDark ? 'dark-mode' : 'light-mode');
    } else if (themeName === 'auto-night') {
        const currentHour = new Date().getHours();
        const isNightTime = currentHour >= 18 || currentHour < 6;
        body.classList.add(isNightTime ? 'dark-mode' : 'light-mode');
    }

    const isDarkActive = body.classList.contains('dark-mode');
    document.documentElement.style.setProperty('--border-color', isDarkActive ? '#ffffff' : '#000000');
}

function changeThemeSetting(themeValue) {
    currentTheme = themeValue;
    setCookie('user_theme', themeValue);
    applyThemeToDOM(themeValue);
    syncChannel.postMessage({ type: 'theme', value: themeValue });
}

function applyFontToDOM(fontName) {
    let fontStack = 'Arial, sans-serif';
    if (fontName === 'serif') {
        fontStack = 'Georgia, "Times New Roman", serif';
    } else if (fontName === 'monospace') {
        fontStack = 'Consolas, "Courier New", monospace';
    } else if (fontName === 'dyslexic') {
        fontStack = '"OpenDyslexic", "Comic Sans MS", cursive, sans-serif';
    }
    document.documentElement.style.setProperty('--primary-font', fontStack);
}

function changeFontSetting(fontValue) {
    currentFont = fontValue;
    setCookie('user_font', fontValue);
    applyFontToDOM(fontValue);
    syncChannel.postMessage({ type: 'font', value: fontValue });
}

function applyOutlineColorToDOM(colorCode) {
    if (colorCode === 'none') {
        document.documentElement.style.setProperty('--text-outline', 'none');
        document.querySelectorAll('.section-header, header h1, .et_pb_module_heading').forEach(el => {
            el.style.fontWeight = 'normal';
        });
    } else {
        document.documentElement.style.setProperty('--outline-color', colorCode);
        const outlineCSS = `-1px -1px 0 ${colorCode}, 1px -1px 0 ${colorCode}, -1px 1px 0 ${colorCode}, 1px 1px 0 ${colorCode}`;
        document.documentElement.style.setProperty('--text-outline', outlineCSS);
        document.querySelectorAll('.section-header, header h1, .et_pb_module_heading').forEach(el => {
            el.style.fontWeight = '900';
        });
    }
}

function changeOutlineColor(colorValue) {
    currentOutline = colorValue;
    setCookie('user_outline', colorValue);
    applyOutlineColorToDOM(colorValue);
    syncChannel.postMessage({ type: 'outline', value: colorValue });
}

function setHandlerCookie(key, value) {
    setCookie(`user_${key}`, value);
    syncChannel.postMessage({ type: key, value: value });
}

function triggerMapsAction(address) {
    const chosenApp = getCookie('user_maps_app') || defaultPreferences.maps_app;
    let url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

    if (chosenApp === 'apple') {
        url = `maps://maps.apple.com/?q=${encodeURIComponent(address)}`;
    } else if (chosenApp === 'waze') {
        url = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
    }
    window.open(url, '_blank');
}

function triggerPhoneAction(phoneNumber) {
    const chosenApp = getCookie('user_phone_app') || defaultPreferences.phone_app;
    let url = `tel:${phoneNumber}`;

    if (chosenApp === 'voice') {
        url = `https://voice.google.com/calls?a=nc,%2B1${phoneNumber}`;
    }
    window.location.href = url;
}

function triggerEmailAction(emailAddress) {
    window.location.href = `mailto:${emailAddress}?subject=SKVentureSigns%20Production%20Inquiry`;
}

let currentSlideIndex = 0;
let slideTimer;

function showSlides(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    if (index >= slides.length) { currentSlideIndex = 0; }
    if (index < 0) { currentSlideIndex = slides.length - 1; }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');

    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        moveSlide(1);
    }, 4000);
}

function moveSlide(step) {
    showSlides(currentSlideIndex += step);
}

function setSlide(index) {
    showSlides(currentSlideIndex = index);
}

function launchLightbox(imgUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgUrl;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

async function fetchCSVWithRetry(url, options = {}, retries = 5, delay = 1000) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP fetch error: ${response.status}`);
        return await response.text();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchCSVWithRetry(url, options, retries - 1, delay * 2);
        } else {
            throw error;
        }
    }
}

function parseCSVText(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i+1];
        if (c === '"') {
            if (inQuotes && next === '"') {
                row[row.length - 1] += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === ',' && !inQuotes) {
            row.push('');
        } else if ((c === '\r' || c === '\n') && !inQuotes) {
            if (c === '\r' && next === '\n') {
                i++;
            }
            lines.push(row);
            row = [''];
        } else {
            row[row.length - 1] += c;
        }
    }
    if (row.length > 1 || row[0] !== '') {
        lines.push(row);
    }
    return lines;
}

function renderFloraAds(ads) {
    const sec7Container = document.getElementById('section-7-ads-container');
    const sec9Container = document.getElementById('section-9-ads-container');
    if (!sec7Container || !sec9Container) return;

    sec7Container.innerHTML = '';
    sec9Container.innerHTML = '';

    ads.forEach((ad) => {
        const card7 = document.createElement('div');
        card7.className = 'flora-ad-card';
        card7.innerHTML = `
            <div class="flora-ad-img-col" onclick="launchLightbox('${ad.imgUrl}')">
                <img src="${ad.imgUrl}" alt="${ad.title}">
            </div>
            <div class="flora-ad-text-col">
                <h3><a href="${ad.url}" target="_blank">${ad.title}</a></h3>
            </div>
        `;
        sec7Container.appendChild(card7);
    });

    const shiftAmount = ads.length >= 3 ? 2 : 1;
    const ads9 = [...ads.slice(shiftAmount), ...ads.slice(0, shiftAmount)];

    ads9.forEach((ad) => {
        const card9 = document.createElement('div');
        card9.className = 'flora-ad-card';
        card9.innerHTML = `
            <div class="flora-ad-img-col" onclick="launchLightbox('${ad.imgUrl}')">
                <img src="${ad.imgUrl}" alt="${ad.title}">
            </div>
            <div class="flora-ad-text-col">
                <h3><a href="${ad.url}" target="_blank">${ad.title}</a></h3>
            </div>
        `;
        sec9Container.appendChild(card9);
    });
}

async function loadAdsPipeline() {
    renderFloraAds(fallbackFloraAds);
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT9aXB9z9jcsaA0U-LsuV4nIHwIIw2huGB8zaalh7It4GQP_DWFFdQ4Utaw_ajkdhx5ydn87BcfS82d/pub?output=csv";
    try {
        const csvRaw = await fetchCSVWithRetry(csvUrl);
        const csvData = parseCSVText(csvRaw);
        const filteredAds = [];

        for (let i = 1; i < csvData.length; i++) {
            const row = csvData[i];
            if (row.length >= 4) {
                const title = row[0].trim();
                const targetUrl = row[1].trim();
                const imgUrl = row[2].trim();
                const placement = row[3].trim();

                if (placement.toLowerCase().includes("flora ad")) {
                    filteredAds.push({
                        title: title,
                        url: targetUrl,
                        imgUrl: imgUrl,
                        placement: placement
                    });
                }
            }
        }

        if (filteredAds.length > 0) {
            renderFloraAds(filteredAds.slice(0, 5));
        }
    } catch (err) {
        console.error("Ads fetching pipeline failed. Standard Fallbacks remain active.", err);
    }
}

syncChannel.onmessage = (event) => {
    switch(event.data.type) {
        case 'theme': applyThemeToDOM(event.data.value); break;
        case 'font': applyFontToDOM(event.data.value); break;
        case 'outline': applyOutlineColorToDOM(event.data.value); break;
        case 'lang': switchLanguage(event.data.value); break;
    }
};

window.onload = function() {
    applyThemeToDOM(currentTheme);
    applyFontToDOM(currentFont);
    applyOutlineColorToDOM(currentOutline);
    switchLanguage(currentLang);
    showSlides(currentSlideIndex);
    loadAdsPipeline();

    document.querySelectorAll('#nav-menu a').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('nav-menu').classList.remove('active');
        });
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('data:text/javascript;base64,' + btoa(`
            self.addEventListener('install', (e) => { self.skipWaiting(); });
            self.addEventListener('fetch', (e) => { /* Pass-through routing */ });
        `)).catch(err => console.log('SW registration skipped', err));
    }
};

// --- SECTION 8 INJECTIONS ---

// 1. CLAY COUNTY COMMUNITY BULLETIN ENGINE
(function initBulletin() {
    const MY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwtunjBquRf8yjnYdpMNMglMQB6n0j4pHSNke-9yADxZ3-9HvJqXT2DdVTUjdhRroGcxQ/exec";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[new Date().getMonth()];
    
    const taglineEl = document.getElementById('month-tagline');
    if(taglineEl) taglineEl.innerText = `${currentMonthName} Dispatches & Happenings`;

    window.toggleDetails = function(id, title) {
        const detailEl = document.getElementById('details-' + id);
        const snippetEl = document.getElementById('snippet-' + id);
        const btnEl = document.getElementById('btn-' + id);
        
        if (detailEl.style.display === 'block') {
            detailEl.style.display = 'none';
            snippetEl.style.display = 'block';
            btnEl.innerText = 'Read More';
        } else {
            detailEl.style.display = 'block';
            snippetEl.style.display = 'none';
            btnEl.innerText = 'Show Less';
            if (typeof gtag !== 'undefined') {
                gtag('event', 'read_more_click', { 'event_category': 'Bulletin Widget', 'event_label': title });
            }
        }
    };

    function injectStructuredData(events) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": events.map((ev, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Event",
                    "name": ev.name,
                    "startDate": ev.date,
                    "location": {
                        "@type": "Place",
                        "name": ev.location,
                        "address": { "@type": "PostalAddress", "addressLocality": "Flora", "addressRegion": "IL" }
                    },
                    "description": ev.details
                }
            }))
        };
        const dataBlock = document.getElementById('structured-data-block');
        if(dataBlock) dataBlock.textContent = JSON.stringify(schema);
    }

    async function displayDiviEvents() {
        const list = document.getElementById('divi-event-list');
        if(!list) return;
        const cacheBuster = `t=${Date.now()}&v=${Math.random().toString(36).substring(7)}`;
        const BULLETIN_URL = `${MY_SCRIPT_URL}?feed=true&${cacheBuster}`;

        try {
            const response = await fetch(BULLETIN_URL);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            let events = await response.json();

            if (Array.isArray(events) && events.length > 0) {
                
                // --- STRICT ROLLING 30-DAY WINDOW FILTER ---
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const futureCutoff = new Date(today);
                futureCutoff.setDate(today.getDate() + 30); // Exactly 30 days out

                events = events.filter(item => {
                    const dateStr = item.date || item.displayDate;
                    if (!dateStr) return true; 
                    const evDate = new Date(dateStr);
                    if (isNaN(evDate)) return true; 
                    
                    evDate.setHours(0, 0, 0, 0);
                    return evDate >= today && evDate <= futureCutoff;
                });
                // ------------------------------------

                if(events.length === 0) {
                    list.innerHTML = `<p style='text-align:center; padding: 20px; font-style:italic;'>No events scheduled in the next 30 days.</p>`;
                    return;
                }

                list.innerHTML = '';
                injectStructuredData(events);

                events.forEach((item, index) => {
                    const title = item.name || "Untitled Event";
                    const displayDate = item.date || item.displayDate || "Date TBA";
                    const displayTime = item.time || item.displayTime || "Time TBA";
                    const location = item.location || "Clay County";
                    const details = item.details || "";
                    const isOngoing = item.isOngoing || false;
                    
                    let gCalLink = item.googleLink;
                    if (!gCalLink || gCalLink === "#" || gCalLink.includes("/edit")) {
                        const cleanTitle = encodeURIComponent(title);
                        const cleanLoc = encodeURIComponent(location);
                        const cleanDesc = encodeURIComponent(details);
                        gCalLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${cleanTitle}&details=${cleanDesc}&location=${cleanLoc}&sf=true&output=xml`;
                    }
                    const icsLink = item.icalData ? "data:text/calendar;base64," + item.icalData : "#";
                    const isLong = details.length > 85;
                    const snippetText = isLong ? details.substring(0, 85) + "..." : details;

                    const div = document.createElement('div');
                    div.className = 'divi-event-item';
                    div.innerHTML = `
                        <div class="divi-event-date">${displayDate}</div>
                        <div class="divi-event-title">${title}</div>
                        <div class="event-info-text">
                            <strong>Where:</strong> ${location} <br> 
                            <strong>Time:</strong> ${displayTime} ${isOngoing ? '<span class="right-now-badge">Right Now!</span>' : ''}
                        </div>
                        ${details ? `
                            <div class="event-snippet" id="snippet-${index}">"${snippetText}"</div>
                            <div class="full-details" id="details-${index}">${details}</div>
                            ${isLong ? `<div class="read-more-btn" id="btn-${index}" onclick="toggleDetails(${index}, '${title.replace(/'/g, "\\'")}')">Read More</div>` : ''}
                        ` : ''}
                        <div class="cal-links">
                            <span class="cal-label">Add to Calendar</span>
                            <a href="${gCalLink}" target="_blank" class="cal-text-link">Google</a>
                            <span style="color:#777; margin: 0 5px;">|</span>
                            <a href="${icsLink}" download="${title.replace(/\s+/g, '_')}.ics" class="cal-text-link">Apple / Outlook</a>
                        </div>
                    `;
                    list.appendChild(div);
                });
            } else {
                list.innerHTML = `<p style='text-align:center; padding: 20px; font-style:italic;'>No events scheduled in the next 30 days.</p>`;
            }
        } catch (e) {
            console.error("Bulletin Fetch failure:", e);
            list.innerHTML = `<p style='text-align:center; padding: 20px; color:#cc0000;'>Sync Error. Please check script permissions.</p>`;
        }
    }

    if (document.readyState === 'complete') displayDiviEvents();
    else window.addEventListener('load', displayDiviEvents);
})();

// 2. FUEL MONITOR BILLBOARD FIREBASE SYNC
(function initFuelMonitor() {
    if (typeof firebase === 'undefined') {
        const fbAppScript = document.createElement('script');
        fbAppScript.src = "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js";
        document.head.appendChild(fbAppScript);
        
        const fbDbScript = document.createElement('script');
        fbDbScript.src = "https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js";
        document.head.appendChild(fbDbScript);
        
        fbDbScript.onload = runFirebaseApp;
    } else {
        runFirebaseApp();
    }

    function runFirebaseApp() {
        const firebaseConfig = {
            apiKey: "AIzaSyBYPbGWDNPUmCSnFWDPPWtiXe2F6MPinXg",
            authDomain: "smlc-fuel-monitor.firebaseapp.com",
            databaseURL: "https://smlc-fuel-monitor-default-rtdb.firebaseio.com",
            projectId: "smlc-fuel-monitor",
            storageBucket: "smlc-fuel-monitor.firebasestorage.app",
            messagingSenderId: "22397440085",
            appId: "1:22397440085:web:c88e71688ed58896bc4dc"
        };

        const fuelApp = firebase.initializeApp(firebaseConfig, 'SMLCFuelBillboard_' + Math.random().toString(36).substr(2, 9));
        const db = fuelApp.database();

        const stationConfigs = {
            "48100": { town: "flora", display: "Flora", name: "CASEY'S", logo: "Casey's.png" },     
            "48101": { town: "flora", display: "Flora", name: "HUCK'S", logo: "Hucks.png" },      
            "128128": { town: "flora", display: "Flora", name: "MACH 1", logo: "Mach 1.png" },    
            "120226": { town: "flora", display: "Flora", name: "FAST STOP", logo: "Fast stop.png" },  
            "48026": { town: "louisville", display: "Louisville", name: "CASEY'S", logo: "Casey's.png" }, 
            "87817": { town: "xenia", display: "Xenia", name: "KNAPP'S", logo: "Knapps.png" },      
            "171711": { town: "clay-city", display: "Clay City", name: "CASEY'S", logo: "Casey's.png" }  
        };

        const urlParams = new URLSearchParams(window.location.search);
        const targetTown = urlParams.get('town')?.toLowerCase();
        const screen = document.getElementById('fuel-screen');
        const toast = document.getElementById('notification-toast');
        if(!screen) return;
        
        let currentSlideIndex = 0;
        let lastDataHash = null;
        let isInitialLoad = true;

        function hasDataChanged(newData) {
            const currentHash = JSON.stringify(newData);
            if (lastDataHash && lastDataHash !== currentHash) {
                lastDataHash = currentHash;
                return true;
            }
            lastDataHash = currentHash;
            return false;
        }

        function showNotification() {
            if (isInitialLoad) { isInitialLoad = false; return; }
            if(!toast) return;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4000);
        }

        function render(data) {
            screen.innerHTML = '';
            const ids = Object.keys(stationConfigs).filter(id => !targetTown || stationConfigs[id].town === targetTown);
            
            if (ids.length === 0) {
                screen.innerHTML = '<div style="color: #ffc929; font-weight: bold;">No stations for this area.</div>';
                return;
            }

            ids.forEach(id => {
                const config = stationConfigs[id];
                const info = data[id] || { reg: "---", dsl: "---", date: "PENDING" };
                const safeLogo = encodeURIComponent(config.logo);
                const logoClass = (id === "128128") ? "station-logo logo-bg-white" : "station-logo";
                
                const slide = document.createElement('div');
                slide.className = 'gas-slide';
                slide.innerHTML = `
                    <div class="town-header">${config.display.toUpperCase()}, IL</div>
                    <div class="logo-container">
                        <img src="https://raw.githubusercontent.com/skventuresigns-design/smlc/main/gas-prices/image/${safeLogo}" 
                             class="${logoClass}" loading="lazy"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="logo-fallback" style="display:none;">${config.name}</div>
                    </div>
                    <div class="price-row">
                        <span class="price-label">REGULAR</span>
                        <span class="led-red">${info.reg}</span>
                    </div>
                    <div class="price-row">
                        <span class="price-label">DIESEL</span>
                        <span class="led-grn">${(info.dsl === "0" || !info.dsl) ? "---" : info.dsl}</span>
                    </div>
                    <div class="update-tag">Updated: ${info.date}</div>
                `;
                screen.appendChild(slide);
            });

            const slides = screen.querySelectorAll('.gas-slide');
            function cycle() {
                if(slides.length === 0) return;
                slides.forEach(s => s.classList.remove('active'));
                slides[currentSlideIndex].classList.add('active');
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            }

            if (slides.length > 0) {
                currentSlideIndex = 0;
                cycle();
                if (window.fuelRotator) clearInterval(window.fuelRotator);
                window.fuelRotator = setInterval(cycle, 6000);
            }
        }

        db.ref('fuel_prices').on('value', (snap) => {
            const val = snap.val();
            if (val) {
                if (hasDataChanged(val)) showNotification();
                render(val);
            } else {
                screen.innerHTML = '<div style="color: #ffc929; font-weight: bold;">Service Temporarily Offline</div>';
            }
        }, (error) => {
            screen.innerHTML = '<div style="color: #ffc929; font-weight: bold;">Connection Error</div>';
        });
    }
})();

// 3. SCORESTREAM WIDGET INJECTOR
(function initScoreStream() {
    const ssScript = document.createElement('script');
    ssScript.async = true;
    ssScript.type = "text/javascript";
    ssScript.src = "https://scorestream.com/apiJsCdn/widgets/embed.js";
    document.body.appendChild(ssScript);
})();
