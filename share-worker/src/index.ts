export default {
    async fetch(request: Request, env: any, ctx: any): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname.toLowerCase();

        // 1. App Link Verification
        if (path === '/.well-known/assetlinks.json') {
            return new Response(JSON.stringify([
                {
                    "relation": ["delegate_permission/common.handle_all_urls"],
                    "target": {
                        "namespace": "android_app",
                        "package_name": "com.snaptune.music",
                        "sha256_cert_fingerprints": [
                            "6D:B8:32:6A:55:08:61:F0:F9:6B:9A:DC:B7:06:20:7D:75:AC:44:80:DE:45:4F:B8:AF:95:DA:A5:D6:C7:F9:D9",
                            "22:BB:54:1D:EA:D3:D1:DF:99:15:2D:0A:02:B0:1F:D8:92:C0:91:8E:99:69:1C:00:40:A3:26:15:36:2F:48:40",
                            "7E:52:04:A9:22:BD:94:3B:3D:12:F5:58:0F:C8:E2:52:E7:55:42:F5:2A:20:03:FC:CD:0A:32:CD:E4:61:CF:39"
                        ]
                    }
                },
                {
                    "relation": ["delegate_permission/common.handle_all_urls"],
                    "target": {
                        "namespace": "android_app",
                        "package_name": "com.snaptune.music.debug",
                        "sha256_cert_fingerprints": [
                            "6D:B8:32:6A:55:08:61:F0:F9:6B:9A:DC:B7:06:20:7D:75:AC:44:80:DE:45:4F:B8:AF:95:DA:A5:D6:C7:F9:D9",
                            "22:BB:54:1D:EA:D3:D1:DF:99:15:2D:0A:02:B0:1F:D8:92:C0:91:8E:99:69:1C:00:40:A3:26:15:36:2F:48:40",
                            "7E:52:04:A9:22:BD:94:3B:3D:12:F5:58:0F:C8:E2:52:E7:55:42:F5:2A:20:03:FC:CD:0A:32:CD:E4:61:CF:39"
                        ]
                    }
                }
            ]), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        // 2. Share Link Logic
        let type: 'Song' | 'Playlist' | 'Album' | 'Artist' | null = null;
        let id: string | null = null;

        if (path === '/watch') {
            id = url.searchParams.get('v');
            if (id) type = 'Song';
        } else if (path === '/playlist') {
            id = url.searchParams.get('list');
            if (id) type = id.startsWith('OLAK5uy_') ? 'Album' : 'Playlist';
        } else if (path.startsWith('/channel/')) {
            id = path.split('/')[2];
            if (id) type = 'Artist';
        }

        if (type && id) {
            return await serveLandingPage(request, type, id);
        }

        // 3. Fallback
        return Response.redirect("https://snaptune.indevs.in", 302);
    },
};

async function serveLandingPage(request: Request, type: string, id: string): Promise<Response> {
    const url = new URL(request.url);
    let ytUrl = "";
    let m3Icon = "play_arrow";
    let badgeIcon = "music_note";

    if (type === 'Song') {
        ytUrl = `https://music.youtube.com/watch?v=${id}`;
        m3Icon = "play_circle";
        badgeIcon = "music_note";
    } else if (type === 'Playlist' || type === 'Album') {
        ytUrl = `https://music.youtube.com/playlist?list=${id}`;
        m3Icon = type === "Album" ? "album" : "playlist_play";
        badgeIcon = type === "Album" ? "album" : "queue_music";
    } else if (type === 'Artist') {
        ytUrl = `https://music.youtube.com/channel/${id}`;
        m3Icon = "person";
        badgeIcon = "person";
    }

    let title = "SnapTune Music";
    let description = `Listen to this ${type.toLowerCase()} on SnapTune.`;
    let image = "https://snaptune.indevs.in/logo.svg";

    try {
        const response = await fetch(ytUrl, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } });
        if (response.ok) {
            const html = await response.text();
            const t = html.match(/<meta property="og:title" content="([^"]+)">/);
            if (t) title = t[1];
            const d = html.match(/<meta property="og:description" content="([^"]+)">/);
            if (d) description = d[1];
            const i = html.match(/<meta property="og:image" content="([^"]+)">/);
            if (i) image = i[1];
        }
    } catch (e) {}

    const intentUrl = `intent://play.snaptune.indevs.in${url.pathname}${url.search}#Intent;scheme=https;package=com.snaptune.music;end`;

    const html = `<!DOCTYPE html>
<html id="app-root" lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | SnapTune</title>
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#CAB4FF">
    <link rel="icon" href="https://snaptune.indevs.in/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="https://snaptune.indevs.in/favicon.png">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="music.song">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:site_name" content="SnapTune">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">

    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,400;0,700;0,800;0,900;1,800&family=Outfit:wght@400;500;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

    <style>
        :root {
            --bg: #04030D;
            --s1: #08071A;
            --s2: #0D0B26;
            --s3: #130F38;
            --s4: #1A1445;
            --s5: #231C52;

            --p: #B8A4FF;
            --p-dim: #9B84FF;
            --p-viv: #7C55FF;
            --on-p: #0D0229;
            --pc: #5E3FBE;
            --on-pc: #F0E6FF;

            --q: #F4A8CF;
            --on-q: #38102A;
            --qc: #782055;
            --on-qc: #FFE0EE;

            --t: #5AE6DC;
            --on-t: #003230;
            --tc: #004845;
            --on-tc: #8FFFF5;

            --on-s: #F2EEFF;
            --on-sv: #A89EC8;

            --outline: #635C82;
            --outline-v: #30294E;
            --border: rgba(184, 164, 255, .10);
            --border-h: rgba(184, 164, 255, .32);
            --border-s: rgba(184, 164, 255, .06);

            --g-pq: linear-gradient(135deg, #B8A4FF 0%, #F4A8CF 100%);
            --g-qt: linear-gradient(135deg, #F4A8CF 0%, #5AE6DC 100%);
            --g-tp: linear-gradient(135deg, #5AE6DC 0%, #B8A4FF 100%);
            --g-all: linear-gradient(90deg, #B8A4FF, #F4A8CF, #5AE6DC, #B8A4FF);
            --g-card: linear-gradient(145deg, rgba(184,164,255,.09) 0%, rgba(244,168,207,.04) 60%, transparent 100%);

            --r-xs: 8px;
            --r-sm: 12px;
            --r-md: 18px;
            --r-lg: 24px;
            --r-xl: 32px;
            --r-2xl: 44px;
            --r-f: 9999px;

            --ease-spring: cubic-bezier(.34, 1.56, .64, 1);
            --ease-out: cubic-bezier(0, 0, .2, 1);
        }

        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            scroll-behavior: smooth;
            scrollbar-color: var(--s5) var(--s1);
            scrollbar-width: thin;
        }

        body {
            background-color: #04030D;
            color: var(--on-s);
            font-family: 'Outfit', 'Be Vietnam Pro', system-ui, sans-serif;
            overflow-x: hidden;
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }

        #bg-canvas {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
            display: block;
        }

        .gradient-text {
            background: var(--g-pq);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        @keyframes borderFlow {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(22px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50%      { opacity: 0.9; transform: scale(1.08); }
        }

        /* Navigation */
        .nav-wrapper {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 100;
            display: flex;
            justify-content: center;
            pointer-events: all;
        }

        .nav-pill {
            display: flex;
            align-items: center;
            background: rgba(4, 3, 13, .82);
            backdrop-filter: blur(48px) saturate(240%);
            -webkit-backdrop-filter: blur(48px) saturate(240%);
            border-bottom: 1px solid rgba(184, 164, 255, .1);
            padding: 0 48px;
            width: 100%;
            height: 72px;
            position: relative;
            box-shadow: 0 16px 50px rgba(0, 0, 0, .65), inset 0 -1px 0 rgba(184, 164, 255, .04);
            transition: background .4s ease;
        }

        .nav-pill::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 1.5px;
            background: linear-gradient(90deg, #B8A4FF, #F4A8CF, #5AE6DC, #B8A4FF, #F4A8CF);
            background-size: 300% 100%;
            animation: borderFlow 5s linear infinite;
            opacity: .8;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 14px 6px 4px;
            border-radius: var(--r-md);
            flex-shrink: 0;
            margin-right: 16px;
            transition: background .2s ease;
        }

        .nav-logo:hover { background: rgba(184, 164, 255, .08); }

        .nav-logo-img {
            width: 34px;
            height: 34px;
            border-radius: 9px;
            cursor: pointer;
            transition: transform .3s var(--ease-spring), filter .3s ease;
            flex-shrink: 0;
        }

        .nav-logo:hover .nav-logo-img {
            transform: scale(1.08) rotate(-3deg);
            filter: drop-shadow(0 0 8px rgba(184, 164, 255, .5));
        }

        .nav-logo-text {
            font-family: 'Outfit', sans-serif;
            font-weight: 800;
            font-size: 19px;
            letter-spacing: -.5px;
            background: var(--g-pq);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .nav-links {
            display: none;
            align-items: center;
            gap: 2px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }

        @media(min-width: 768px) {
            .nav-links { display: flex; }
        }

        .nav-link {
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            font-size: 14px;
            color: var(--on-sv);
            padding: 7px 16px;
            border-radius: var(--r-f);
            transition: background .15s ease, color .15s ease;
            display: inline-block;
            letter-spacing: .1px;
        }

        .nav-link:hover {
            background: rgba(184, 164, 255, .12);
            color: var(--p);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
        }

        #nav-download-btn {
            display: none;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #5E3FBE, #7C55FF);
            color: #F0E6FF;
            border-radius: var(--r-f);
            font-weight: 700;
            font-size: 14px;
            font-family: 'Outfit', sans-serif;
            text-decoration: none;
            transition: all .3s var(--ease-spring);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(94, 63, 190, .5), 0 0 0 1px rgba(184, 164, 255, .1) inset;
        }

        @media(min-width: 540px) {
            #nav-download-btn { display: inline-flex; }
        }

        #nav-download-btn:hover {
            transform: scale(1.05) translateY(-1px);
            box-shadow: 0 8px 30px rgba(94, 63, 190, .65);
            filter: brightness(1.1);
        }

        .nav-hamburger {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 10px;
            background: transparent;
            border: none;
            cursor: pointer;
        }

        @media(min-width: 768px) {
            .nav-hamburger { display: none; }
        }

        .hamburger-bar {
            width: 20px;
            height: 2px;
            background: var(--on-sv);
            border-radius: 2px;
            transition: background .15s ease, transform .25s ease, opacity .2s ease;
        }

        .nav-hamburger:hover .hamburger-bar { background: var(--p); }

        .nav-hamburger.is-active .hamburger-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.is-active .hamburger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.is-active .hamburger-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile Menu */
        .mobile-menu {
            position: fixed;
            top: 72px; left: 0; right: 0;
            z-index: 99;
            background: rgba(4, 3, 13, .96);
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border-bottom: 1px solid rgba(184, 164, 255, .1);
            transform: translateY(-8px);
            opacity: 0;
            pointer-events: none;
            transition: transform .28s var(--ease-out), opacity .28s ease;
            max-height: calc(100svh - 72px);
            overflow-y: auto;
        }

        .mobile-menu.is-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
        }

        .mobile-menu-inner {
            display: flex;
            flex-direction: column;
            padding: 16px 20px 24px;
            gap: 4px;
        }

        .mobile-menu-link {
            display: flex;
            align-items: center;
            padding: 14px 16px;
            border-radius: var(--r-md);
            font-size: 16px;
            font-weight: 600;
            color: var(--on-sv);
            text-decoration: none;
            transition: background .15s ease, color .15s ease;
        }

        .mobile-menu-link:hover, .mobile-menu-link:active {
            background: rgba(202, 180, 255, .1);
            color: var(--p);
        }

        .mobile-menu-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
        }

        /* Main Content */
        main {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 120px 20px 60px;
            position: relative;
            z-index: 1;
        }

        .share-container {
            max-width: 580px;
            width: 100%;
            margin: 0 auto;
            animation: fadeSlideUp 0.7s var(--ease-out) both;
        }

        .share-card {
            background: rgba(13, 11, 38, 0.75);
            backdrop-filter: blur(36px) saturate(200%);
            -webkit-backdrop-filter: blur(36px) saturate(200%);
            border: 1px solid rgba(184, 164, 255, 0.18);
            border-radius: var(--r-xl);
            padding: 44px 36px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75), 0 0 50px rgba(94, 63, 190, 0.18), inset 0 1px 0 rgba(184, 164, 255, 0.15);
        }

        .share-card::before {
            content: '';
            position: absolute;
            top: 0; left: 15%; right: 15%;
            height: 1px;
            background: radial-gradient(ellipse, rgba(184, 164, 255, .6) 0%, transparent 70%);
        }

        /* Artwork Wrapper */
        .art-wrapper {
            position: relative;
            display: block;
            margin: 0 auto 28px;
            width: fit-content;
        }

        .art-glow {
            position: absolute;
            inset: -16px;
            background: radial-gradient(circle, rgba(184, 164, 255, 0.4) 0%, rgba(244, 168, 207, 0.2) 45%, transparent 70%);
            border-radius: 36px;
            filter: blur(24px);
            z-index: 1;
            animation: pulseGlow 4s ease-in-out infinite;
        }

        .art-img {
            position: relative;
            z-index: 2;
            width: 230px;
            height: 230px;
            object-fit: cover;
            border-radius: 26px;
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12);
            transition: transform 0.4s var(--ease-spring);
        }

        .art-wrapper:hover .art-img {
            transform: scale(1.03);
        }

        .art-badge-icon {
            position: absolute;
            bottom: -10px;
            right: -10px;
            z-index: 3;
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #5E3FBE, #7C55FF);
            color: #F0E6FF;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.6), 0 0 0 3px #0D0B26;
        }

        .art-badge-icon .material-symbols-outlined {
            font-size: 28px;
        }

        /* Hero Badge Pill */
        .hero-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 6px 16px 6px 8px;
            background: rgba(94, 63, 190, .2);
            border: 1px solid rgba(184, 164, 255, .32);
            border-radius: var(--r-f);
            font-size: 11px;
            font-weight: 700;
            color: var(--p);
            margin: 0 auto 18px;
            letter-spacing: .6px;
            text-transform: uppercase;
            box-shadow: 0 0 20px rgba(94, 63, 190, .2), inset 0 1px 0 rgba(184, 164, 255, .1);
        }

        .hero-badge-dot {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #5E3FBE, #7C55FF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 0 8px rgba(94, 63, 190, .5);
        }

        .hero-badge-dot .material-symbols-outlined {
            font-size: 12px;
            color: #F0E6FF;
        }

        .item-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: clamp(24px, 5vw, 32px);
            line-height: 1.15;
            letter-spacing: -.6px;
            color: var(--on-s);
            margin-bottom: 12px;
            width: 100%;
        }

        .item-desc {
            font-size: 15px;
            line-height: 1.6;
            color: var(--on-sv);
            max-width: 440px;
            margin: 0 auto 32px;
            font-weight: 400;
            width: 100%;
        }

        /* Buttons */
        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px 32px;
            background: linear-gradient(135deg, #B8A4FF 0%, #F4A8CF 50%, #B8A4FF 100%);
            background-size: 200% 100%;
            color: #0D0229;
            border-radius: var(--r-f);
            font-weight: 800;
            font-size: 15px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: all .3s var(--ease-spring);
            box-shadow: 0 4px 24px rgba(184, 164, 255, .4), 0 0 0 1px rgba(184, 164, 255, .15) inset;
            position: relative;
            overflow: hidden;
            font-family: 'Outfit', sans-serif;
            letter-spacing: .5px;
            text-transform: uppercase;
        }

        .btn-primary::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 60%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
            transform: skewX(-15deg);
            transition: left .5s ease;
        }

        .btn-primary:hover {
            background-position: 100% 0;
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 36px rgba(184, 164, 255, .55), 0 0 0 4px rgba(184, 164, 255, .12);
        }

        .btn-primary:hover::before { left: 140%; }
        .btn-primary:active { transform: scale(.98); }

        .btn-ghost {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            padding: 14px 28px;
            background: rgba(19, 15, 56, .55);
            color: var(--on-sv);
            border-radius: var(--r-f);
            font-weight: 700;
            font-size: 14px;
            border: 1px solid var(--border);
            cursor: pointer;
            text-decoration: none;
            transition: all .25s var(--ease-spring);
            backdrop-filter: blur(16px);
            font-family: 'Outfit', sans-serif;
            letter-spacing: .4px;
            text-transform: uppercase;
        }

        .btn-ghost:hover {
            border-color: var(--border-h);
            color: var(--p);
            background: rgba(184, 164, 255, .1);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(94, 63, 190, .15);
        }

        .btn-ghost:active { transform: scale(.98); }

        /* Footer */
        .site-footer {
            background: #04030D;
            border-top: 1px solid rgba(184, 164, 255, .15);
            padding: 56px 0 32px;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .site-footer::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, #B8A4FF, #F4A8CF, #5AE6DC, #B8A4FF, #F4A8CF);
            background-size: 300% 100%;
            animation: borderFlow 6s linear infinite;
            opacity: .75;
        }

        .site-footer::after {
            content: '';
            position: absolute;
            top: -80px; left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 300px;
            background: radial-gradient(ellipse, rgba(94, 63, 190, .18) 0%, rgba(120, 32, 85, .08) 50%, transparent 70%);
            pointer-events: none;
            border-radius: 50%;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 32px;
        }

        .footer-main {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            gap: 32px;
            margin-bottom: 36px;
        }

        @media(min-width: 1024px) {
            .footer-main {
                flex-direction: row;
                align-items: flex-start;
            }
        }

        .footer-brand {
            text-align: center;
        }

        @media(min-width: 1024px) {
            .footer-brand {
                text-align: left;
            }
        }

        .footer-logo-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 10px;
        }

        @media(min-width: 1024px) {
            .footer-logo-row {
                justify-content: flex-start;
            }
        }

        .footer-brand-title {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: 22px;
            background: var(--g-pq);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -.4px;
        }

        .footer-desc {
            color: var(--on-sv);
            font-size: 14px;
            margin-bottom: 6px;
        }

        .footer-author {
            font-size: 12px;
            color: var(--outline);
        }

        .footer-author a {
            color: var(--p);
            font-weight: 600;
        }

        .footer-author a:hover {
            text-decoration: underline;
        }

        .footer-chips-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .footer-chip {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: var(--r-f);
            font-size: 13px;
            font-weight: 600;
            font-family: 'Outfit', sans-serif;
            background: rgba(184, 164, 255, .07);
            color: var(--on-sv);
            border: 1px solid rgba(184, 164, 255, .18);
            transition: all .3s var(--ease-spring);
            text-decoration: none;
            letter-spacing: .1px;
        }

        .footer-chip:hover {
            background: rgba(184, 164, 255, .14);
            color: var(--p);
            border-color: rgba(184, 164, 255, .4);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(94, 63, 190, .2);
        }

        .footer-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            padding-top: 24px;
            border-top: 1px solid rgba(184, 164, 255, .12);
        }

        @media(min-width: 768px) {
            .footer-bottom {
                flex-direction: row;
                justify-content: space-between;
            }
        }

        .footer-copy {
            font-size: 12px;
            color: var(--outline);
        }

        .footer-nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
        }

        .footer-nav-link {
            font-size: 12px;
            color: var(--on-sv);
            font-family: 'Outfit', sans-serif;
            font-weight: 500;
            transition: color .2s ease;
        }

        .footer-nav-link:hover {
            color: var(--p);
        }

        @media(max-width: 600px) {
            .share-card {
                padding: 32px 20px;
                border-radius: 24px;
            }
            .art-img {
                width: 190px;
                height: 190px;
            }
            .nav-pill {
                padding: 0 20px;
            }
            .footer-container {
                padding: 0 20px;
            }
        }
    </style>
</head>
<body>
    <canvas id="bg-canvas"></canvas>

    <!-- Navigation -->
    <div class="nav-wrapper" role="navigation" aria-label="Main navigation">
        <nav class="nav-pill">
            <a href="https://snaptune.indevs.in" class="nav-logo" title="SnapTune Home">
                <img src="https://snaptune.indevs.in/logo.svg" alt="SnapTune logo" class="nav-logo-img" width="34" height="34">
                <span class="nav-logo-text">SnapTune</span>
            </a>
            <div class="nav-links">
                <a href="https://snaptune.indevs.in/#features" class="nav-link">Features</a>
                <a href="https://snaptune.indevs.in/#screenshots" class="nav-link">Screenshots</a>
                <a href="https://snaptune.indevs.in/#downloads" class="nav-link">Downloads</a>
                <a href="https://snaptune.indevs.in/privacy" class="nav-link">Privacy</a>
                <a href="https://snaptune.indevs.in/donate" class="nav-link">Donate</a>
                <a href="https://github.com/farhanansari888/SnapTune" target="_blank" class="nav-link">GitHub</a>
            </div>
            <div class="nav-actions">
                <a id="nav-download-btn" href="https://snaptune.indevs.in/#downloads">
                    <span class="material-symbols-outlined" style="font-size:18px">download</span>
                    <span>Download</span>
                </a>
                <button id="nav-hamburger" class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
                    <div class="hamburger-bar"></div>
                    <div class="hamburger-bar"></div>
                    <div class="hamburger-bar"></div>
                </button>
            </div>
        </nav>
    </div>

    <!-- Mobile Menu Overlay -->
    <div id="mobile-menu" class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-inner">
            <a href="https://snaptune.indevs.in/#features" class="mobile-menu-link">Features</a>
            <a href="https://snaptune.indevs.in/#screenshots" class="mobile-menu-link">Screenshots</a>
            <a href="https://snaptune.indevs.in/#downloads" class="mobile-menu-link">Downloads</a>
            <a href="https://snaptune.indevs.in/privacy" class="mobile-menu-link">Privacy</a>
            <a href="https://snaptune.indevs.in/donate" class="mobile-menu-link">Donate</a>
            <a href="https://github.com/farhanansari888/SnapTune" target="_blank" class="mobile-menu-link">GitHub</a>
            <div class="mobile-menu-actions">
                <a href="https://snaptune.indevs.in/#downloads" class="btn-primary" style="width:100%;">
                    <span class="material-symbols-outlined">download</span>
                    <span>Download App</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Main Content Area -->
    <main>
        <div class="share-container">
            <div class="share-card">
                <!-- Artwork -->
                <div class="art-wrapper">
                    <div class="art-glow"></div>
                    <img src="${image}" alt="${title}" class="art-img" onerror="this.src='https://snaptune.indevs.in/logo.svg'">
                    <div class="art-badge-icon">
                        <span class="material-symbols-outlined">${m3Icon}</span>
                    </div>
                </div>

                <!-- Info -->
                <div class="hero-badge">
                    <div class="hero-badge-dot">
                        <span class="material-symbols-outlined">${badgeIcon}</span>
                    </div>
                    <span>SHARED ${type.toUpperCase()}</span>
                </div>

                <h1 class="item-title">${title}</h1>
                <p class="item-desc">${description}</p>

                <!-- Action Buttons -->
                <div class="btn-group">
                    <a href="${intentUrl}" class="btn-primary">
                        <span class="material-symbols-outlined" style="font-size:22px">play_circle</span>
                        <span>OPEN IN APP</span>
                    </a>
                    <a href="https://snaptune.indevs.in/#downloads" class="btn-ghost">
                        <span class="material-symbols-outlined" style="font-size:19px">download</span>
                        <span>DOWNLOAD APP</span>
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer" role="contentinfo">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <div class="footer-logo-row">
                        <img src="https://snaptune.indevs.in/logo.svg" alt="SnapTune" width="28" height="28">
                        <span class="footer-brand-title">SnapTune</span>
                    </div>
                    <p class="footer-desc">Enhanced Music Streaming for Android</p>
                    <p class="footer-author">
                        Made with <span style="color:#F4A8CF">♥</span> by
                        <a href="https://github.com/farhanansari888" target="_blank">Farhan Ansari</a>.
                        <span>Not affiliated with YouTube or Google.</span>
                    </p>
                </div>
                <div class="footer-chips-row">
                    <a href="https://github.com/farhanansari888/SnapTune/releases" target="_blank" class="footer-chip">
                        <span class="material-symbols-outlined" style="font-size:16px">new_releases</span>
                        <span>Releases</span>
                    </a>
                    <a href="https://github.com/farhanansari888/SnapTune" target="_blank" class="footer-chip">
                        <span class="material-symbols-outlined" style="font-size:16px">code</span>
                        <span>GitHub</span>
                    </a>
                    <a href="https://snaptune.en.uptodown.com/android" target="_blank" class="footer-chip">
                        <span class="material-symbols-outlined" style="font-size:16px">storefront</span>
                        <span>Uptodown</span>
                    </a>
                    <a href="https://github.com/farhanansari888/SnapTune/issues" target="_blank" class="footer-chip">
                        <span class="material-symbols-outlined" style="font-size:16px">support</span>
                        <span>Issues &amp; Support</span>
                    </a>
                </div>
            </div>

            <div class="footer-bottom">
                <p class="footer-copy">&copy; 2026 SnapTune. All Rights Reserved.</p>
                <div class="footer-nav-links">
                    <a href="https://snaptune.indevs.in/#features" class="footer-nav-link">Features</a>
                    <a href="https://snaptune.indevs.in/#screenshots" class="footer-nav-link">Screenshots</a>
                    <a href="https://snaptune.indevs.in/#downloads" class="footer-nav-link">Downloads</a>
                    <a href="https://snaptune.indevs.in/privacy" class="footer-nav-link">Privacy Policy</a>
                    <a href="https://snaptune.indevs.in/donate" class="footer-nav-link" style="color:var(--p);font-weight:600">Donate</a>
                    <a href="https://github.com/farhanansari888/SnapTune" target="_blank" class="footer-nav-link">GitHub</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Mobile Menu Handler -->
    <script>
        (function() {
            const hamburger = document.getElementById('nav-hamburger');
            const mobileMenu = document.getElementById('mobile-menu');
            if (hamburger && mobileMenu) {
                hamburger.addEventListener('click', function() {
                    const isOpen = mobileMenu.classList.toggle('is-open');
                    hamburger.classList.toggle('is-active', isOpen);
                    hamburger.setAttribute('aria-expanded', isOpen);
                    mobileMenu.setAttribute('aria-hidden', !isOpen);
                });
                mobileMenu.querySelectorAll('a').forEach(function(link) {
                    link.addEventListener('click', function() {
                        mobileMenu.classList.remove('is-open');
                        hamburger.classList.remove('is-active');
                        hamburger.setAttribute('aria-expanded', 'false');
                        mobileMenu.setAttribute('aria-hidden', 'true');
                    });
                });
            }
        })();
    </script>

    <!-- Canvas Background Animation -->
    <script>
    (function () {
        'use strict';
        const canvas = document.getElementById('bg-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, dpr, mouse = { x: -9999, y: -9999 };
        let frame = 0;
        const C = {
            p: [104, 69, 200],
            q: [190, 70, 140],
            t: [ 40, 180, 175],
            bg: [ 4, 3, 13]
        };

        class Orb {
            constructor(xr, yr, r, color, speed, phase) {
                this.xr = xr; this.yr = yr; this.r = r;
                this.color = color; this.speed = speed; this.phase = phase;
                this.ox = 0; this.oy = 0;
            }
            tick(t) {
                this.ox = Math.sin(t * this.speed + this.phase) * W * 0.12;
                this.oy = Math.cos(t * this.speed * 0.7 + this.phase) * H * 0.10;
            }
            draw(ctx) {
                const x = W * this.xr + this.ox;
                const y = H * this.yr + this.oy;
                const r = Math.min(W, H) * this.r;
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                const [R, G, B] = this.color;
                g.addColorStop(0, \`rgba(\${R},\${G},\${B},0.55)\`);
                g.addColorStop(0.4, \`rgba(\${R},\${G},\${B},0.20)\`);
                g.addColorStop(1, \`rgba(\${R},\${G},\${B},0)\`);
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            }
        }

        const orbs = [
            new Orb(0.15, 0.15, 0.70, C.p, 0.18, 0.0),
            new Orb(0.85, 0.80, 0.60, C.q, 0.14, 1.2),
            new Orb(0.50, 0.55, 0.55, C.t, 0.10, 2.4),
            new Orb(0.80, 0.10, 0.45, C.p, 0.22, 3.6),
            new Orb(0.10, 0.85, 0.40, C.q, 0.16, 5.0),
        ];

        class Particle {
            constructor() { this.reset(true); }
            reset(init) {
                this.x = Math.random() * W;
                this.y = init ? Math.random() * H : H + 10;
                this.vy = -(0.15 + Math.random() * 0.35);
                this.vx = (Math.random() - 0.5) * 0.2;
                this.size = 0.5 + Math.random() * 1.5;
                this.life = 0;
                this.maxLife = 200 + Math.random() * 300;
                const colors = [C.p, C.q, C.t];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            tick() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    this.vx += (dx / dist) * 0.006;
                    this.vy += (dy / dist) * 0.006;
                }
                if (this.life > this.maxLife || this.y < -10) this.reset(false);
            }
            draw(ctx) {
                const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
                const [R, G, B] = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(\${R},\${G},\${B},\${alpha})\`;
                ctx.fill();
            }
        }

        let particles = [];

        function drawAurora(ctx, t) {
            for (let i = 0; i < 3; i++) {
                const phase = i * 2.1;
                const y0 = H * (0.25 + i * 0.25 + Math.sin(t * 0.12 + phase) * 0.06);
                const cp1x = W * 0.25;
                const cp1y = y0 + Math.sin(t * 0.08 + phase) * H * 0.12;
                const cp2x = W * 0.75;
                const cp2y = y0 - Math.cos(t * 0.10 + phase) * H * 0.10;
                const colors = [[C.p, C.q], [C.q, C.t], [C.t, C.p]];
                const [cA, cB] = colors[i];
                const grad = ctx.createLinearGradient(0, y0 - 80, 0, y0 + 80);
                grad.addColorStop(0, \`rgba(\${cA[0]},\${cA[1]},\${cA[2]},0)\`);
                grad.addColorStop(0.5, \`rgba(\${cA[0]},\${cA[1]},\${cA[2]},0.06)\`);
                grad.addColorStop(1, \`rgba(\${cB[0]},\${cB[1]},\${cB[2]},0)\`);
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(0, y0 + 80);
                ctx.bezierCurveTo(cp1x, cp1y + 80, cp2x, cp2y + 80, W, y0 + 80);
                ctx.lineTo(W, y0 - 80);
                ctx.bezierCurveTo(cp2x, cp2y - 80, cp1x, cp1y - 80, 0, y0 - 80);
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.filter = 'blur(18px)';
                ctx.globalAlpha = 0.9;
                ctx.fill();
                ctx.restore();
            }
        }

        function drawMouseGlow(ctx) {
            if (mouse.x < 0) return;
            const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
            g.addColorStop(0, 'rgba(104,69,200,0.10)');
            g.addColorStop(0.5, 'rgba(190,70,140,0.04)');
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        }

        function resize() {
            dpr = window.devicePixelRatio || 1;
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.scale(dpr, dpr);
            particles = Array.from({ length: 80 }, () => new Particle());
        }

        function render() {
            frame++;
            const t = frame * 0.016;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = \`rgb(\${C.bg[0]},\${C.bg[1]},\${C.bg[2]})\`;
            ctx.fillRect(0, 0, W, H);
            ctx.save();
            ctx.filter = 'blur(60px)';
            orbs.forEach(o => { o.tick(t); o.draw(ctx); });
            ctx.restore();
            drawAurora(ctx, t);
            ctx.save();
            particles.forEach(p => { p.tick(); p.draw(ctx); });
            ctx.restore();
            drawMouseGlow(ctx);
            requestAnimationFrame(render);
        }

        function init() {
            resize();
            window.addEventListener('resize', resize, { passive: true });
            window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
            render();
        }

        init();
    })();
    </script>

    <!-- Auto-redirect for Android -->
    <script>
        if (/Android/i.test(navigator.userAgent) && !sessionStorage.getItem('sn_redirected')) {
            sessionStorage.setItem('sn_redirected', 'true');
            setTimeout(() => { window.location.href = "${intentUrl}"; }, 1500);
        }
    </script>
</body>
</html>`;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
}

