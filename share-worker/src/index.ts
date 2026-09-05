export default {
    async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
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

    if (type === 'Song') {
        ytUrl = `https://music.youtube.com/watch?v=${id}`;
        m3Icon = "play_circle";
    } else if (type === 'Playlist' || type === 'Album') {
        ytUrl = `https://music.youtube.com/playlist?list=${id}`;
        m3Icon = type === "Album" ? "album" : "playlist_play";
    } else if (type === 'Artist') {
        ytUrl = `https://music.youtube.com/channel/${id}`;
        m3Icon = "person";
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

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | SnapTune</title>
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="music.song">
    <meta name="twitter:card" content="summary_large_image">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#CAB4FF',
                        'on-primary': '#150838',
                        background: '#07060F',
                        surface: '#0C0B18',
                        'on-surface': '#EDE8FC',
                        outline: '#706A88',
                        'surface-variant': '#2E284A',
                        'on-surface-variant': '#B0A8CC',
                    }
                }
            }
        }
    </script>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #05040E; color: #EDE8FC; margin: 0; display: flex; flex-direction: column; min-h-screen; }
        .m3-card { background: rgba(12, 11, 24, 0.7); backdrop-filter: blur(20px); border-radius: 28px; border: 1px solid rgba(112, 106, 136, 0.2); }
        .material-symbols-outlined { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        canvas#bg-canvas { position: fixed; inset: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; }
    </style>
</head>
<body>
    <canvas id="bg-canvas"></canvas>

    <!-- Full Website Navigation -->
    <nav class="flex items-center justify-between px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-50 transition-all duration-300">
        <div class="flex items-center gap-3 cursor-pointer" onclick="window.location.href='https://snaptune.indevs.in'">
            <img src="https://snaptune.indevs.in/logo.svg" alt="SnapTune" class="h-8 w-8">
            <span class="text-xl font-bold tracking-tight text-white">SnapTune</span>
        </div>
        <div class="hidden lg:flex gap-8 text-sm font-semibold text-on-surface-variant uppercase tracking-widest">
            <a href="https://snaptune.indevs.in/#features" class="hover:text-primary transition">Features</a>
            <a href="https://snaptune.indevs.in/#screenshots" class="hover:text-primary transition">Screenshots</a>
            <a href="https://snaptune.indevs.in/#downloads" class="hover:text-primary transition">Downloads</a>
            <a href="https://snaptune.indevs.in/privacy" class="hover:text-primary transition">Privacy</a>
            <a href="https://snaptune.indevs.in/donate" class="hover:text-primary transition">Donate</a>
            <a href="https://github.com/farhanansari888/SnapTune" class="hover:text-primary transition">GitHub</a>
        </div>
        <div class="flex items-center gap-4">
            <div class="hidden sm:flex items-center gap-1 text-on-surface-variant font-bold text-xs cursor-pointer hover:text-white transition uppercase tracking-widest">
                <span>EN</span>
                <span class="material-symbols-outlined text-sm">expand_more</span>
            </div>
            <a href="https://snaptune.indevs.in/#downloads" class="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold flex items-center gap-2 text-xs hover:scale-105 active:scale-95 transition shadow-lg shadow-primary/20 uppercase tracking-widest">
                <span class="material-symbols-outlined text-lg">download</span> Download
            </a>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center p-6 py-20">
        <div class="m3-card p-10 md:p-16 max-w-xl w-full text-center shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div class="relative z-10">
                <div class="relative inline-block mx-auto mb-10">
                    <div class="absolute -inset-4 bg-gradient-to-tr from-primary to-blue-500 opacity-20 blur-3xl animate-pulse"></div>
                    <img src="${image}" class="relative w-56 h-52 md:w-64 md:h-64 object-cover rounded-[32px] mx-auto shadow-2xl ring-1 ring-white/10" onerror="this.src='https://snaptune.indevs.in/logo.svg'">
                    <div class="absolute -bottom-4 -right-4 w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-surface">
                        <span class="material-symbols-outlined text-3xl">${m3Icon}</span>
                    </div>
                </div>

                <div class="space-y-4 mb-12">
                    <div class="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-[11px] font-black tracking-[0.2em] text-primary uppercase">
                        SHARED ${type.toUpperCase()}
                    </div>
                    <h1 class="text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tighter">${title}</h1>
                    <p class="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto opacity-80">${description}</p>
                </div>

                <div class="flex flex-col gap-4">
                    <a href="${intentUrl}" class="w-full bg-primary text-on-primary font-black py-5 rounded-[22px] transition-all duration-300 transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 tracking-[0.1em] shadow-xl shadow-primary/20 uppercase text-sm">
                        <span class="material-symbols-outlined text-2xl">play_circle</span> OPEN IN APP
                    </a>
                    <a href="https://snaptune.indevs.in" class="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-[22px] transition duration-300 border border-white/5 flex items-center justify-center gap-2 backdrop-blur-md uppercase text-xs tracking-widest">
                        <span class="material-symbols-outlined text-lg">public</span> VISIT WEBSITE
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Full Website Footer -->
    <footer class="bg-surface/50 border-t border-outline/10 py-16 px-6">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <!-- Brand Column -->
            <div class="lg:col-span-2">
                <div class="flex items-center gap-3 mb-6">
                    <img src="https://snaptune.indevs.in/logo.svg" class="h-8 w-8" alt="Logo">
                    <span class="font-bold text-white text-2xl tracking-tight">SnapTune</span>
                </div>
                <p class="text-on-surface-variant text-sm font-medium leading-relaxed max-w-sm mb-6">
                    Enhanced music streaming client for Android. Ad-free, background play, and offline music wrapped in Material 3.
                </p>
                <p class="text-on-surface-variant/60 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    Made with ♥ by Farhan Ansari
                </p>
                <p class="text-[10px] text-on-surface-variant/40 uppercase tracking-widest leading-relaxed">
                    Not affiliated with YouTube or Google.
                </p>
            </div>

            <!-- Links Column 1 -->
            <div>
                <h4 class="text-white font-black text-xs uppercase tracking-[0.3em] mb-6">Releases</h4>
                <div class="flex flex-col gap-4 text-xs font-bold text-on-surface-variant tracking-widest uppercase">
                    <a href="https://github.com/farhanansari888/SnapTune" class="hover:text-primary transition flex items-center gap-2">GitHub</a>
                    <a href="https://www.uptodown.com/" class="hover:text-primary transition flex items-center gap-2">Uptodown</a>
                    <a href="https://snaptune.indevs.in/#downloads" class="hover:text-primary transition">Stable APK</a>
                </div>
            </div>

            <!-- Links Column 2 -->
            <div>
                <h4 class="text-white font-black text-xs uppercase tracking-[0.3em] mb-6">Support</h4>
                <div class="flex flex-col gap-4 text-xs font-bold text-on-surface-variant tracking-widest uppercase">
                    <a href="https://github.com/farhanansari888/SnapTune/issues" class="hover:text-primary transition">Issues & Support</a>
                    <a href="https://snaptune.indevs.in/privacy" class="hover:text-primary transition">Privacy Policy</a>
                    <a href="https://snaptune.indevs.in/donate" class="hover:text-primary transition">Donate</a>
                </div>
            </div>
        </div>

        <!-- Secondary Footer Bar -->
        <div class="max-w-6xl mx-auto mt-16 pt-8 border-t border-outline/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex flex-wrap justify-center gap-6 text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                <a href="https://snaptune.indevs.in/#features" class="hover:text-white transition">Features</a>
                <a href="https://snaptune.indevs.in/#screenshots" class="hover:text-white transition">Screenshots</a>
                <a href="https://snaptune.indevs.in/#downloads" class="hover:text-white transition">Downloads</a>
                <a href="https://snaptune.indevs.in/changelog" class="hover:text-white transition">Changelog</a>
            </div>
            <p class="text-[10px] font-black text-on-surface-variant/30 tracking-[0.4em] uppercase">
                &copy; 2026 SNAPTUNE &bull; ALL RIGHTS RESERVED
            </p>
        </div>
    </footer>

    <!-- BG ANIMATION SCRIPT -->
    <script>
    (function () { 'use strict'; const canvas = document.getElementById('bg-canvas'); const ctx = canvas.getContext('2d'); let W, H, dpr, mouse = { x: -9999, y: -9999 }; let frame = 0; const C = { p: [104, 69, 200], q: [190, 70, 140], t: [ 40, 180, 175], bg: [ 5, 4, 14] }; class Orb { constructor(xr, yr, r, color, speed, phase) { this.xr = xr; this.yr = yr; this.r = r; this.color = color; this.speed = speed; this.phase = phase; this.ox = 0; this.oy = 0; } tick(t) { this.ox = Math.sin(t * this.speed + this.phase) * W * 0.12; this.oy = Math.cos(t * this.speed * 0.7 + this.phase) * H * 0.10; } draw(ctx) { const x = W * this.xr + this.ox; const y = H * this.yr + this.oy; const r = Math.min(W, H) * this.r; const g = ctx.createRadialGradient(x, y, 0, x, y, r); const [R, G, B] = this.color; g.addColorStop(0, \`rgba(\${R},\${G},\${B},0.55)\`); g.addColorStop(0.4, \`rgba(\${R},\${G},\${B},0.20)\`); g.addColorStop(1, \`rgba(\${R},\${G},\${B},0)\`); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); } } const orbs = [ new Orb(0.15, 0.15, 0.70, C.p, 0.18, 0.0), new Orb(0.85, 0.80, 0.60, C.q, 0.14, 1.2), new Orb(0.50, 0.55, 0.55, C.t, 0.10, 2.4), new Orb(0.80, 0.10, 0.45, C.p, 0.22, 3.6), new Orb(0.10, 0.85, 0.40, C.q, 0.16, 5.0), ]; class Particle { constructor() { this.reset(true); } reset(init) { this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10; this.vy = -(0.15 + Math.random() * 0.35); this.vx = (Math.random() - 0.5) * 0.2; this.size = 0.5 + Math.random() * 1.5; this.life = 0; this.maxLife = 200 + Math.random() * 300; const colors = [C.p, C.q, C.t]; this.color = colors[Math.floor(Math.random() * colors.length)]; } tick() { this.x += this.vx; this.y += this.vy; this.life++; const dx = mouse.x - this.x; const dy = mouse.y - this.y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 160) { this.vx += (dx / dist) * 0.006; this.vy += (dy / dist) * 0.006; } if (this.life > this.maxLife || this.y < -10) this.reset(false); } draw(ctx) { const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7; const [R, G, B] = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = \`rgba(\${R},\${G},\${B},\${alpha})\`; ctx.fill(); } } let particles = []; function drawAurora(ctx, t) { for (let i = 0; i < 3; i++) { const phase = i * 2.1; const y0 = H * (0.25 + i * 0.25 + Math.sin(t * 0.12 + phase) * 0.06); const cp1x = W * 0.25; const cp1y = y0 + Math.sin(t * 0.08 + phase) * H * 0.12; const cp2x = W * 0.75; const cp2y = y0 - Math.cos(t * 0.10 + phase) * H * 0.10; const colors = [[C.p, C.q], [C.q, C.t], [C.t, C.p]]; const [cA, cB] = colors[i]; const grad = ctx.createLinearGradient(0, y0 - 80, 0, y0 + 80); grad.addColorStop(0, \`rgba(\${cA[0]},\${cA[1]},\${cA[2]},0)\`); grad.addColorStop(0.5, \`rgba(\${cA[0]},\${cA[1]},\${cA[2]},0.06)\`); grad.addColorStop(1, \`rgba(\${cB[0]},\${cB[1]},\${cB[2]},0)\`); ctx.save(); ctx.beginPath(); ctx.moveTo(0, y0 + 80); ctx.bezierCurveTo(cp1x, cp1y + 80, cp2x, cp2y + 80, W, y0 + 80); ctx.lineTo(W, y0 - 80); ctx.bezierCurveTo(cp2x, cp2y - 80, cp1x, cp1y - 80, 0, y0 - 80); ctx.closePath(); ctx.fillStyle = grad; ctx.filter = 'blur(18px)'; ctx.globalAlpha = 0.9; ctx.fill(); ctx.restore(); } } function drawMouseGlow(ctx) { if (mouse.x < 0) return; const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200); g.addColorStop(0, 'rgba(104,69,200,0.10)'); g.addColorStop(0.5, 'rgba(190,70,140,0.04)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } function resize() { dpr = window.devicePixelRatio || 1; W = window.innerWidth; H = window.innerHeight; canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.height = H + 'px'; ctx.scale(dpr, dpr); particles = Array.from({ length: 80 }, () => new Particle()); } function render() { frame++; const t = frame * 0.016; ctx.clearRect(0, 0, W, H); ctx.fillStyle = \`rgb(\${C.bg[0]},\${C.bg[1]},\${C.bg[2]})\`; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.filter = 'blur(60px)'; orbs.forEach(o => { o.tick(t); o.draw(ctx); }); ctx.restore(); drawAurora(ctx, t); ctx.save(); particles.forEach(p => { p.tick(); p.draw(ctx); }); ctx.restore(); drawMouseGlow(ctx); requestAnimationFrame(render); } init(); function init() { resize(); window.addEventListener('resize', resize, { passive: true }); window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true }); render(); } })();
    </script>

    <script>
        // Auto-redirect for Android
        if (/Android/i.test(navigator.userAgent) && !sessionStorage.getItem('sn_redirected')) {
            sessionStorage.setItem('sn_redirected', 'true');
            setTimeout(() => { window.location.href = "${intentUrl}"; }, 1500);
        }
    </script>
</body>
</html>
    `;

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}
