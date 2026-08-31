document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════ MULTI-LANGUAGE TRANSLATION DICTIONARY ═══════════════════════
    const translations = {
        es: {
            nav_features: "Características",
            nav_screenshots: "Capturas",
            nav_downloads: "Descargas",
            nav_privacy: "Privacidad",
            nav_donate: "Donar",
            nav_download_btn: "Descargar",
            hero_subtitle: "Streaming sin anuncios, reproducción en segundo plano y música offline en Material 3.",
            hero_download_apk: "Descargar APK",
            features_title: "Características",
            features_subtitle: "Descubre todas las potentes funciones que hacen de SnapTune el cliente definitivo de música.",
            about_chip: "EXPERIENCIA PREMIUM",
            about_title: "Diseñado para los Amantes de la Música",
            about_desc: "SnapTune está creado para brindar una experiencia auditiva excepcional y sin anuncios en Android. Disfruta de reproducción en segundo plano, descarga sin conexión, letras sincronizadas y personalización profunda.",
            about_star: "Ver en GitHub",
            about_version_title: "Última Versión Estable",
            shots_title: "Velo en Acción",
            shots_subtitle: "Una interfaz hermosa e intuitiva diseñada para amantes de la música.",
            shots_active: "Vista activa",
            shots_hint: "Desliza o usa los controles para cambiar la vista.",
            support_title: "¿Necesitas Ayuda?",
            support_desc: "Envía una solicitud o reporta un problema directamente a Farhan Ansari en GitHub.",
            support_btn: "Obtener Ayuda",
            downloads_title: "Obtener SnapTune",
            downloads_subtitle: "Elige la opción de descarga adecuada para tu dispositivo Android.",
            android_card_sub: "Compilación lista para producción, probada y optimizada para el uso diario.",
            android_stable_chip: "Compilación Recomendada",
            view_changelog: "Ver Registro de Cambios",
            previous_versions: "Versiones Anteriores",
            android_download_text: "Descargar APK Estable",
            footer_rights: "No afiliado con YouTube o Google.",
            footer_license: "© 2026 SnapTune. Todos los derechos reservados.",
            android_req: "Requiere Android 8.0+",
            lang_dialog_title: "Seleccionar Idioma"
        },
        en: {
            nav_features: "Features",
            nav_screenshots: "Screenshots",
            nav_downloads: "Downloads",
            nav_privacy: "Privacy",
            nav_donate: "Donate",
            nav_download_btn: "Download",
            hero_subtitle: "Ad-free streaming, background play, and offline music wrapped in Material 3.",
            hero_download_apk: "Download APK",
            features_title: "Features",
            features_subtitle: "Discover all the powerful capabilities that make SnapTune the ultimate music streaming client.",
            about_chip: "PREMIUM EXPERIENCE",
            about_title: "Crafted for True Music Enthusiasts",
            about_desc: "SnapTune is engineered to deliver an exceptional, ad-free music streaming experience on Android. Enjoy background listening, offline downloads, synced lyrics, and full interface personalization.",
            about_star: "View on GitHub",
            about_version_title: "Latest Stable Version",
            shots_title: "See It In Action",
            shots_subtitle: "Beautiful, intuitive interface designed for music lovers.",
            shots_active: "Active View",
            shots_hint: "Swipe or click controls to switch views.",
            support_title: "Need Help?",
            support_desc: "Submit a request or report an issue directly to Farhan Ansari on GitHub.",
            support_btn: "Get Help",
            downloads_title: "Get SnapTune",
            downloads_subtitle: "Choose the download version that is right for you.",
            android_card_sub: "Production-ready build, thoroughly tested and optimized for daily use.",
            android_stable_chip: "Recommended Build",
            view_changelog: "View Changelog",
            previous_versions: "Previous Versions",
            android_download_text: "Download Stable APK",
            footer_rights: "Not affiliated with YouTube or Google.",
            footer_license: "© 2026 SnapTune. All Rights Reserved.",
            android_req: "Requires Android 8.0+",
            lang_dialog_title: "Select Language"
        },
        pt: {
            nav_features: "Recursos",
            nav_screenshots: "Capturas",
            nav_downloads: "Downloads",
            nav_privacy: "Privacidade",
            nav_donate: "Doar",
            nav_download_btn: "Baixar",
            hero_subtitle: "Streaming sem anúncios, reprodução em segundo plano e música offline em Material 3.",
            hero_download_apk: "Baixar APK",
            features_title: "Recursos",
            features_subtitle: "Descubra todos os recursos poderosos que tornam o SnapTune o cliente definitivo para streaming de música.",
            about_chip: "EXPERIÊNCIA PREMIUM",
            about_title: "Criado para Apaixonados por Música",
            about_desc: "O SnapTune foi projetado para oferecer uma experiência musical excepcional e sem anúncios no Android. Aproveite reprodução em segundo plano, downloads offline, letras sincronizadas e personalização total.",
            about_star: "Ver no GitHub",
            about_version_title: "Última Versão Estável",
            shots_title: "Veja em Ação",
            shots_subtitle: "Interface bonita e intuitiva projetada para os amantes da música.",
            shots_active: "Visão ativa",
            shots_hint: "Deslize ou use os controles para alternar as exibições.",
            support_title: "Precisa de Ajuda?",
            support_desc: "Envie uma solicitação ou informe um problema diretamente a Farhan Ansari no GitHub.",
            support_btn: "Pedir Ajuda",
            downloads_title: "Baixar SnapTune",
            downloads_subtitle: "Escolha a versão de download ideal para o seu dispositivo Android.",
            android_card_sub: "Compilação pronta para produção, exaustivamente testada e otimizada.",
            android_stable_chip: "Versão Recomendada",
            view_changelog: "Ver Alterações",
            previous_versions: "Versões Anteriores",
            android_download_text: "Baixar APK Estável",
            footer_rights: "Não afiliado ao YouTube ou Google.",
            footer_license: "© 2026 SnapTune. Todos os direitos reservados.",
            android_req: "Requer Android 8.0+",
            lang_dialog_title: "Selecionar Idioma"
        },
        hi: {
            nav_features: "विशेषताएं",
            nav_screenshots: "स्क्रीनशॉट",
            nav_downloads: "डाउनलोड",
            nav_privacy: "गोपनीयता",
            nav_donate: "डोनेट",
            nav_download_btn: "डाउनलोड",
            hero_subtitle: "विज्ञापन-मुक्त स्ट्रीमिंग, बैकग्राउंड प्लेबैक और ऑफलाइन म्यूजिक, मटेरियल 3 डिज़ाइन के साथ।",
            hero_download_apk: "APK डाउनलोड करें",
            features_title: "विशेषताएं",
            features_subtitle: "उन सभी शक्तिशाली क्षमताओं की खोज करें जो SnapTune को सर्वश्रेष्ठ म्यूजिक स्ट्रीमिंग क्लाइंट बनाती हैं।",
            about_chip: "प्रीमियम अनुभव",
            about_title: "संगीत प्रेमियों के लिए विशेष रूप से निर्मित",
            about_desc: "SnapTune को एंड्रॉइड पर असाधारण और विज्ञापन-मुक्त संगीत अनुभव देने के लिए डिज़ाइन किया गया है। बैकग्राउंड प्लेबैक, ऑफलाइन डाउनलोड, लाइव लिरिक्स और पूर्ण कस्टमाइजेशन का आनंद लें।",
            about_star: "GitHub पर देखें",
            about_version_title: "नवीनतम स्थिर संस्करण",
            shots_title: "इसे एक्शन में देखें",
            shots_subtitle: "संगीत प्रेमियों के लिए डिज़ाइन किया गया सुंदर और सहज ज्ञान युक्त इंटरफ़ेस।",
            shots_active: "सक्रिय दृश्य",
            shots_hint: "दृश्य बदलने के लिए स्वाइप या नियंत्रण का उपयोग करें।",
            support_title: "क्या आपको मदद चाहिए?",
            support_desc: "GitHub पर सीधे फरहान अंसारी को अनुरोध भेजें या समस्या की रिपोर्ट करें।",
            support_btn: "मदद प्राप्त करें",
            downloads_title: "SnapTune प्राप्त करें",
            downloads_subtitle: "अपने एंड्रॉइड डिवाइस के लिए उपयुक्त डाउनलोड विकल्प चुनें।",
            android_card_sub: "दैनिक उपयोग के लिए अनुकूलित और पूरी तरह से परीक्षण किया गया स्थिर बिल्ड।",
            android_stable_chip: "अनुशंसित बिल्ड",
            view_changelog: "बदलाव देखें",
            previous_versions: "पिछले संस्करण",
            android_download_text: "स्थिर APK डाउनलोड करें",
            footer_rights: "यूट्यूब या गूगल से संबद्ध नहीं है।",
            footer_license: "© 2026 SnapTune. सर्वाधिकार सुरक्षित।",
            android_req: "एंड्रॉइड 8.0+ आवश्यक",
            lang_dialog_title: "भाषा चुनें"
        }
    };

    let currentLang = localStorage.getItem('snaptune_lang') || 'en';

    function setLanguage(lang) {
        if (!translations[lang]) lang = 'en';
        currentLang = lang;
        localStorage.setItem('snaptune_lang', lang);

        const langText = document.getElementById('languageText');
        if (langText) langText.textContent = lang.toUpperCase();

        const dict = translations[lang];

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Close language dialog if open
        const langDialog = document.getElementById('language-dialog');
        if (langDialog && langDialog.open) langDialog.close();
    }

    // Attach listener to language selection buttons in modal
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            showToast(`🌐 Language changed to ${lang.toUpperCase()}`);
        });
    });

    // ═══════════════════════ DOM ELEMENTS & RELEASES ═══════════════════════
    const downloadToast = document.getElementById('downloadToast');
    const toastMsg = document.getElementById('downloadToastMessage');
    const ossVersionBadge = document.getElementById('oss-version-badge');
    const heroVersionTag = document.getElementById('hero-version-tag');
    const androidVersionBadge = document.getElementById('android-version-badge');

    let allReleases = [
        {
            tag_name: "v2.0.0",
            name: "SnapTune v2.0.0 - Major Redesign Update",
            published_at: "2026-05-24T06:26:07Z",
            body: `### 🎵 SnapTune v2.0.0 - Major Redesign Update
The biggest SnapTune update yet — redesigned UI, improved performance, smarter features, and a smoother music experience.

---

### 🎨 Complete Material 3 Redesign
- Fully redesigned **Material 3 UI**
- Fresh modern styling & improved visual polish
- **50+ Themes** for deep personalization
- New Stats Page & New Releases Section
- Rebuilt from scratch: Home, Search, Library, Settings, Player, and Lyrics UI

### 🚀 Extra Features & Performance
- Open Supported Music Links (Songs, Albums, Artists, Playlists)
- Faster search experience & better caching system
- Home screen shortcuts & lightweight performance
- Skip silence during playback & sleep timer

### 📖 Library & Lyrics
- Full Library Management & local playlists support
- YouTube Music account sync (Songs, Albums, Playlists)
- Live Synced Lyrics with word-by-word highlighting
- Integrated Lyrics translation support

### 🎛️ Audio Controls & Equalizer
- Built-in Equalizer
- Audio Normalization
- Tempo & Pitch Control
- Background playback & offline downloads`,
            assets: [
                {
                    name: "SnapTune-v2.0.0.apk",
                    size: 27398090,
                    browser_download_url: "https://github.com/farhanansari888/SnapTune/releases/download/v2.0.0/SnapTune-v2.0.0.apk"
                },
                {
                    name: "SnapTune.apk",
                    size: 27398090,
                    browser_download_url: "https://github.com/farhanansari888/SnapTune/releases/download/v2.0.0/SnapTune.apk"
                }
            ]
        }
    ];

    let latestRelease = allReleases[0];

    // 1. Toast Notification Helper
    function showToast(msg) {
        if (!downloadToast || !toastMsg) return;
        toastMsg.textContent = msg;
        downloadToast.classList.add('show');
        setTimeout(() => downloadToast.classList.remove('show'), 3500);
    }

    // 2. Mobile Menu Toggle
    const hamburger  = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
        if (!mobileMenu || !hamburger) return;
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            hamburger.classList.toggle('is-open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        });
        mobileMenu.querySelectorAll('.mobile-menu-link, .btn-primary').forEach(el => {
            el.addEventListener('click', closeMobileMenu);
        });
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('is-open') &&
                !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // 4. GitHub Releases API Fetching

    async function fetchReleases() {
        const repoUrl = "https://api.github.com/repos/farhanansari888/SnapTune/releases";
        
        try {
            const res = await fetch(repoUrl, {
                headers: {
                    'Accept': 'application/vnd.github+json'
                }
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    allReleases = data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
                    latestRelease = allReleases[0];
                    updateVersionBadges();
                    return;
                }
            }
        } catch (e) {
            console.warn("Failed to fetch SnapTune GitHub releases:", e);
        }
        updateVersionBadges();
    }

    function formatVersionTag(tag) {
        if (!tag) return 'v2.0.0';
        return tag.startsWith('v') || tag.startsWith('V') ? tag : `v${tag}`;
    }

    function updateVersionBadges() {
        if (!latestRelease) return;
        const tag = formatVersionTag(latestRelease.tag_name || latestRelease.name);

        if (ossVersionBadge) ossVersionBadge.textContent = tag;
        if (heroVersionTag) heroVersionTag.textContent = tag;
        if (androidVersionBadge) androidVersionBadge.textContent = tag;

        // Find latest APK asset
        const apkAsset = latestRelease.assets?.find(a => a.name && /\.apk$/i.test(a.name));
        const androidDownloadBtn = document.getElementById('android-download-btn');
        const androidDownloadText = document.getElementById('android-download-text');
        
        if (androidDownloadBtn && apkAsset) {
            androidDownloadBtn.href = apkAsset.browser_download_url;
        }
        if (androidDownloadText && apkAsset) {
            const sizeMb = (apkAsset.size / (1024 * 1024)).toFixed(0);
            androidDownloadText.textContent = `Download Stable APK (~${sizeMb} MB)`;
        }
    }

    // 4. Screenshots Section Accordion & Carousel
    const screenshotsHeader = document.getElementById('screenshots-header');
    const screenshotsContent = document.getElementById('screenshots-content');
    const screenshotsIcon = document.getElementById('screenshots-icon');

    if (screenshotsHeader && screenshotsContent) {
        screenshotsHeader.addEventListener('click', () => {
            const isCollapsed = screenshotsContent.style.maxHeight === '0px';
            if (isCollapsed) {
                screenshotsContent.style.maxHeight = '2000px';
                if (screenshotsIcon) screenshotsIcon.classList.add('rotated');
            } else {
                screenshotsContent.style.maxHeight = '0px';
                if (screenshotsIcon) screenshotsIcon.classList.remove('rotated');
            }
        });
    }

    // Screenshots Carousel Logic
    const track = document.getElementById('screenshots-track');
    const slides = document.querySelectorAll('.screenshots-slide');
    const prevBtn = document.getElementById('screenshots-prev');
    const nextBtn = document.getElementById('screenshots-next');
    const titleEl = document.getElementById('screenshots-title');
    const descEl = document.getElementById('screenshots-description');
    const indexEl = document.getElementById('screenshots-current-index');
    const indicatorsEl = document.getElementById('screenshots-indicators');
    const previewCards = document.querySelectorAll('.screenshots-preview-card');

    let currentSlide = 0;
    const totalSlides = slides.length;

    function buildIndicators() {
        if (!indicatorsEl) return;
        indicatorsEl.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `screenshots-indicator ${i === currentSlide ? 'is-active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsEl.appendChild(dot);
        }
    }

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;

        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        const activeSlide = slides[currentSlide];
        if (activeSlide) {
            if (titleEl) titleEl.textContent = activeSlide.dataset.title || 'Music Player';
            if (descEl) descEl.textContent = activeSlide.dataset.description || '';
        }

        if (indexEl) {
            indexEl.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        if (indicatorsEl) {
            const dots = indicatorsEl.querySelectorAll('.screenshots-indicator');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('is-active', idx === currentSlide);
            });
        }

        previewCards.forEach((card, idx) => {
            card.classList.toggle('is-active', idx === currentSlide);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    previewCards.forEach((card, idx) => {
        card.addEventListener('click', () => goToSlide(idx));
    });

    buildIndicators();

    // Mobile touch swipe gesture support for App Gallery
    const viewportEl = document.querySelector('.screenshots-viewport');
    if (viewportEl) {
        let touchStartX = 0;
        let touchEndX = 0;

        viewportEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        viewportEl.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) goToSlide(currentSlide + 1);
                else goToSlide(currentSlide - 1);
            }
        }, { passive: true });
    }

    // 5. Changelog Modal Triggers
    const changelogTrigger = document.getElementById('changelog-trigger');
    const changelogDialog = document.getElementById('changelog-dialog');
    const changelogContent = document.getElementById('changelog-content');

    function openChangelogModal(targetRel) {
        if (!changelogDialog || !changelogContent) return;
        changelogDialog.showModal();
        const rel = targetRel || latestRelease;
        if (!rel) return;

        let bodyMarkdown = `### ${rel.name || formatVersionTag(rel.tag_name)} Changelog\n\n${rel.body || 'No release details available.'}`;
        if (window.marked) {
            changelogContent.innerHTML = `<div class="prose prose-invert max-w-none text-on-surface-variant">${window.marked.parse(bodyMarkdown)}</div>`;
        } else {
            changelogContent.innerHTML = `<pre class="text-sm text-on-surface-variant whitespace-pre-wrap">${bodyMarkdown}</pre>`;
        }
    }

    if (changelogTrigger) {
        changelogTrigger.addEventListener('click', () => openChangelogModal(latestRelease));
    }

    // 6. Previous Versions Modal Popup Logic (Android)
    const versionsTrigger = document.getElementById('versions-trigger');
    const versionsDialog = document.getElementById('versions-dialog');
    const versionsList = document.getElementById('versions-list');

    function renderVersionsModal() {
        if (!versionsDialog || !versionsList) return;

        const dialogTitle = versionsDialog.querySelector('.dialog-header h3');
        if (dialogTitle) {
            dialogTitle.innerHTML = `<span class="flex items-center gap-2"><span class="material-symbols-outlined text-primary">history</span> Previous Releases (.apk)</span>`;
        }

        const filteredReleases = allReleases.filter(rel => rel.assets && rel.assets.some(a => /\.apk$/i.test(a.name)));

        if (!filteredReleases || filteredReleases.length === 0) {
            versionsList.innerHTML = `<p class="text-on-surface-variant text-center py-6">No previous releases found.</p>`;
            versionsDialog.showModal();
            return;
        }

        let html = '';
        filteredReleases.forEach(rel => {
            const tag = formatVersionTag(rel.tag_name);
            const pubDate = rel.published_at ? new Date(rel.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent';
            const rawNotes = rel.body ? rel.body.split('\n').filter(l => l.trim())[0] || 'Official Release' : 'Official Release';
            const cleanNotes = rawNotes.replace(/[#*`]/g, '').substring(0, 110);

            const downloadableAssets = (rel.assets || []).filter(a => a.name && /\.apk$/i.test(a.name));

            let assetButtons = '';
            downloadableAssets.forEach(asset => {
                const size = (asset.size / (1024 * 1024)).toFixed(1);
                assetButtons += `
                    <a href="${asset.browser_download_url}" target="_blank" rel="noopener noreferrer" class="bg-primary-container text-on-primary-container hover:brightness-110 px-4 py-2 rounded-full text-xs font-semibold no-underline inline-flex items-center gap-1.5 active:scale-95 transition-all">
                        <span class="material-symbols-outlined" style="font-size:16px">android</span>
                        ${asset.name} (${size} MB)
                    </a>
                `;
            });

            html += `
                <div class="bg-surface-container-high p-5 rounded-2xl mb-4 border border-white/5 shadow-md flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-xs">${tag}</span>
                            <span class="text-xs text-on-surface-variant">${pubDate}</span>
                        </div>
                        <span class="text-xs text-on-surface-variant font-medium">${downloadableAssets.length} file(s)</span>
                    </div>
                    <p class="text-xs text-on-surface-variant leading-relaxed">✨ ${cleanNotes}</p>
                    <div class="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        ${assetButtons}
                    </div>
                </div>
            `;
        });

        versionsList.innerHTML = html;
        versionsDialog.showModal();
    }

    if (versionsTrigger) {
        versionsTrigger.addEventListener('click', () => renderVersionsModal());
    }

    // Apply stored language on initial load
    setLanguage(currentLang);

    fetchReleases();
});
