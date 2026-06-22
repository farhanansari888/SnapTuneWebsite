document.addEventListener('DOMContentLoaded', ()=>{
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  (function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const storageKey = 'at-theme';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    const applyTheme = (theme) => {
      document.body.classList.toggle('light', theme === 'light');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'light' ? '#f5f5f7' : '#a78bfa');
      }
    };

    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme('light');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = document.body.classList.contains('light');
        const newTheme = isCurrentlyLight ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem(storageKey, newTheme);
      });
    }

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(storageKey)) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  })();

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  document.querySelectorAll('img').forEach(img=>{
    if('loading' in HTMLImageElement.prototype) img.loading = 'lazy';
  });

  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if(navToggle && nav){
    const setOpen = open => {
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        nav.classList.add('mobile-panel');
        nav.classList.remove('mobile-hidden');
      } else {
        nav.classList.remove('mobile-panel');
        nav.classList.remove('mobile-hidden');
      }
    }

    navToggle.addEventListener('click', e=>{
      const open = document.body.classList.contains('nav-open') === false;
      setOpen(open);
    });

    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false);
    });

    document.addEventListener('click', e=>{
      if(!document.body.classList.contains('nav-open')) return;
      if(!nav.contains(e.target) && !navToggle.contains(e.target)) setOpen(false);
    });
  }

  (function(){
    const carousel = document.querySelector('.phone-mockup .carousel');
    if(!carousel) return;
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.phone-mockup .carousel-control.prev');
    const nextBtn = document.querySelector('.phone-mockup .carousel-control.next');
    const indicators = Array.from(document.querySelectorAll('.phone-mockup .indicator'));
    let idx = slides.findIndex(s=>s.classList.contains('active'));
    if(idx < 0) idx = 0;
    let timer = null;
    const delay = 4000;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(connection && connection.saveData);
    const effectiveType = connection && connection.effectiveType ? String(connection.effectiveType) : '';
    const deviceMemory = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null;
    const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null;
    const lite = saveData || (deviceMemory !== null && deviceMemory <= 4) || (cores !== null && cores <= 4) || /(^|-)2g|slow-2g/.test(effectiveType);
    if(lite) document.body.classList.add('carousel-lite');

    const loadSlideImage = (slide)=>{
      const img = slide ? slide.querySelector('img') : null;
      if(!img) return;
      const dataSrc = img.getAttribute('data-src');
      if(!dataSrc) return;
      img.src = dataSrc;
      img.removeAttribute('data-src');
    }

    const clearPositions = ()=>{
      slides.forEach(s=> s.classList.remove('slide--center','slide--left','slide--right','slide--behind','active'));
    }

    const applyPositions = (centerIdx)=>{
      clearPositions();
      const leftIdx = (centerIdx - 1 + slides.length) % slides.length;
      const rightIdx = (centerIdx + 1) % slides.length;
      slides[centerIdx].classList.add('slide--center','active');
      slides[rightIdx].classList.add('slide--right');
      slides[leftIdx].classList.add('slide--left');
      slides.forEach((s,i)=>{ if(i!==centerIdx && i!==leftIdx && i!==rightIdx) s.classList.add('slide--behind') });

      indicators.forEach(i=>i.classList.toggle('active', Number(i.dataset.slide) === centerIdx));
      idx = centerIdx;
      loadSlideImage(slides[centerIdx]);
      loadSlideImage(slides[leftIdx]);
      loadSlideImage(slides[rightIdx]);
    }

    let rafId = 0;
    let pendingIdx = idx;
    const schedule = (targetIdx)=>{
      pendingIdx = (targetIdx + slides.length) % slides.length;
      if(rafId) return;
      rafId = requestAnimationFrame(()=>{
        rafId = 0;
        applyPositions(pendingIdx);
      });
    }

    const goTo = (n)=>{
      schedule(n);
    }

    const next = ()=> goTo(idx+1);
    const prev = ()=> goTo(idx-1);

    const start = ()=>{
      if(prefersReducedMotion || saveData) return;
      if(document.hidden) return;
      stop();
      timer = setInterval(next, delay);
    }
    const stop = ()=>{ if(timer) { clearInterval(timer); timer = null } }

    if(nextBtn) nextBtn.addEventListener('click', e=>{ e.preventDefault(); next(); start(); });
    if(prevBtn) prevBtn.addEventListener('click', e=>{ e.preventDefault(); prev(); start(); });
    indicators.forEach((btn,i)=> btn.addEventListener('click', ()=>{ goTo(i); start(); }));

    const container = document.querySelector('.phone-mockup');
    if(container){
      container.addEventListener('mouseenter', stop);
      container.addEventListener('mouseleave', start);
      container.addEventListener('focusin', stop);
      container.addEventListener('focusout', start);
    }

    if(container){
      container.addEventListener('keydown', e=>{
        if(e.key === 'ArrowRight') next();
        if(e.key === 'ArrowLeft') prev();
      });
    }

    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden) stop();
      else start();
    });

    goTo(idx);
    start();
  })();

  (async function fetchGitHubStats() {
    const owner = 'farhanansari888';
    const repo = 'SnapTune';
    const versionEl = document.getElementById('latest-version');
    const downloadVersionEl = document.getElementById('download-version');
    const downloadSizeEl = document.getElementById('download-size');
    const repoLeadEl = document.getElementById('repo-lead');
    const repoTopicsEl = document.getElementById('repo-topics');
    const repoBadgeTextEl = document.getElementById('repo-badge-text');
    const footerTaglineEl = document.getElementById('footer-tagline');
    const releaseTagEl = document.getElementById('release-tag');
    const releaseDateEl = document.getElementById('release-date');
    const releaseNotesEl = document.getElementById('release-notes');
    const releaseLinkEl = document.getElementById('release-link');
    const starsEl = document.getElementById('stars');
    const forksEl = document.getElementById('forks');
    const issuesEl = document.getElementById('issues');
    const repoLicenseEl = document.getElementById('repo-license');
    const repoUpdatedEl = document.getElementById('repo-updated');
    const repoBranchEl = document.getElementById('repo-branch');

    const formatNumber = (n) => {
      if (n == null || Number.isNaN(Number(n))) return '—';
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
      return String(n);
    };

    const formatSize = (bytes) => {
      if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(1) + ' MB';
      }
      return (bytes / 1024).toFixed(0) + ' KB';
    };

    const formatDate = (iso) => {
      if (!iso) return '—';
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '—';
      return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
    };

    const setText = (el, value) => {
      if (!el) return;
      el.textContent = value == null || value === '' ? '—' : String(value);
    };

    const setPillStatus = (el, status) => {
      if (!el) return;
      el.classList.remove('pill--success', 'pill--warning', 'pill--neutral');
      const norm = (status || '').toLowerCase();
      if (norm === 'success') el.classList.add('pill--success');
      else if (norm === 'failed' || norm === 'failure') el.classList.add('pill--warning');
      else el.classList.add('pill--neutral');
      el.textContent = status || '—';
    };

    const decodeBase64Utf8 = (b64) => {
      try {
        const bytes = Uint8Array.from(atob((b64 || '').replace(/\s/g, '')), c => c.charCodeAt(0));
        return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      } catch {
        return '';
      }
    };

    const stripInlineMd = (text) => {
      return (text || '')
        .replace(/<img\b[^>]*>/gi, '')
        .replace(/<\/?[^>]+>/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const escapeHtml = (s) => {
      return (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const renderMarkdownLite = (md) => {
      const lines = String(md || '').split(/\r?\n/);
      const out = [];
      let inCode = false;
      let codeLang = '';
      let codeLines = [];
      let inList = false;

      const closeList = () => {
        if (!inList) return;
        out.push('</ul>');
        inList = false;
      };

      const closeCode = () => {
        if (!inCode) return;
        const langAttr = codeLang ? ` data-lang="${escapeHtml(codeLang)}"` : '';
        out.push(`<pre class="md-pre"${langAttr}><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        inCode = false;
        codeLang = '';
        codeLines = [];
      };

      const safeLink = (url) => {
        try {
          const u = new URL(url, 'https://example.com');
          if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
          return url;
        } catch {
          return null;
        }
      };

      const renderInline = (text) => {
        let s = escapeHtml(text);
        s = s.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
          const safe = safeLink(url);
          if (!safe) return label;
          return `<a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${label}</a>`;
        });
        return s;
      };

      for (const rawLine of lines) {
        const line = rawLine.replace(/\t/g, '  ');
        const trimmed = line.trim();

        if (trimmed.startsWith('```')) {
          if (inCode) {
            closeCode();
          } else {
            closeList();
            inCode = true;
            codeLang = trimmed.slice(3).trim();
          }
          continue;
        }

        if (inCode) {
          codeLines.push(line);
          continue;
        }

        if (!trimmed) {
          closeList();
          continue;
        }

        const h = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (h) {
          closeList();
          const level = h[1].length;
          const tag = level === 1 ? 'h3' : level === 2 ? 'h4' : level === 3 ? 'h5' : 'h6';
          out.push(`<${tag} class="md-h">${renderInline(h[2])}</${tag}>`);
          continue;
        }

        const li = trimmed.match(/^[-*]\s+(.+)$/);
        if (li) {
          if (!inList) {
            out.push('<ul class="md-ul">');
            inList = true;
          }
          out.push(`<li>${renderInline(li[1])}</li>`);
          continue;
        }

        closeList();
        out.push(`<p class="md-p">${renderInline(trimmed)}</p>`);
      }

      closeList();
      closeCode();

      return out.join('');
    };

    const extractReadmeSummary = (readmeText) => {
      const lines = (readmeText || '').split(/\r?\n/);
      const blocks = [];
      let cur = [];
      for (const line of lines) {
        const t = line.trim();
        if (!t) {
          if (cur.length) blocks.push(cur.join(' ').trim());
          cur = [];
          continue;
        }
        if (/^!\[.*\]\(.*\)/.test(t)) continue;
        if (/^<img\b/i.test(t) || /<img\b/i.test(t)) continue;
        if (/^#+\s+/.test(t)) {
          if (cur.length) blocks.push(cur.join(' ').trim());
          cur = [];
          continue;
        }
        cur.push(t);
      }
      if (cur.length) blocks.push(cur.join(' ').trim());
      const paragraph = blocks.find(b => stripInlineMd(b).length >= 40) || blocks[0] || '';
      return stripInlineMd(paragraph);
    };

    const extractFeatures = (readmeText) => {
      const lines = (readmeText || '').split(/\r?\n/);
      const idx = lines.findIndex(l => /^#{1,6}\s*features\b/i.test(l.trim()));
      if (idx < 0) return [];
      const out = [];
      for (let i = idx + 1; i < lines.length; i++) {
        const raw = lines[i];
        const t = raw.trim();
        if (/^#{1,6}\s+/.test(t)) break;
        const m = t.match(/^[-*]\s+(.+)/);
        if (!m) continue;
        const cleaned = stripInlineMd(m[1]);
        if (!cleaned) continue;
        const split = cleaned.split(/\s+[—-]\s+|\s*:\s*/);
        const title = (split[0] || '').trim();
        const desc = (split.slice(1).join(' — ') || '').trim();
        out.push({ title, desc });
        if (out.length >= 6) break;
      }
      return out;
    };

    const renderTopics = (topics) => {
      if (!repoTopicsEl) return;
      repoTopicsEl.textContent = '';
      const list = Array.isArray(topics) ? topics.slice(0, 8) : [];
      if (!list.length) return;
      for (const topic of list) {
        const chip = document.createElement('span');
        chip.className = 'topic-pill';
        chip.textContent = topic;
        repoTopicsEl.appendChild(chip);
      }
    };

    const renderFeatures = (features) => {
      if (!Array.isArray(features) || !features.length) return;
      features.forEach((f, i) => {
        const titleEl = document.querySelector(`[data-feature-title="${i}"]`);
        const descEl = document.querySelector(`[data-feature-desc="${i}"]`);
        if (titleEl && f.title) titleEl.textContent = f.title;
        if (descEl && f.desc) descEl.textContent = f.desc;
      });
    };

    const cacheKey = `gh:${owner}/${repo}:v3`;
    const readCache = () => {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed?.ts || !parsed?.data) return null;
        const age = Date.now() - parsed.ts;
        if (age > 10 * 60 * 1000) return null;
        return parsed.data;
      } catch {
        return null;
      }
    };
    const writeCache = (data) => {
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
      } catch {}
    };

    try {

      const requestHeaders = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      };
     const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  if (!res.ok) return null;
  return await res.json();
};

      const cached = readCache();
      if (cached) {
        if (cached.repoData?.stargazers_count != null) setText(starsEl, formatNumber(cached.repoData.stargazers_count));
        if (cached.repoData?.forks_count != null) setText(forksEl, formatNumber(cached.repoData.forks_count));
        if (cached.repoData?.open_issues_count != null) setText(issuesEl, formatNumber(cached.repoData.open_issues_count));
        setText(repoLicenseEl, cached.repoData?.license?.spdx_id || '—');
        setText(repoUpdatedEl, formatDate(cached.repoData?.pushed_at || cached.repoData?.updated_at));
        setText(repoBranchEl, cached.repoData?.default_branch || '—');
        if (cached.repoData?.description) setText(footerTaglineEl, cached.repoData.description);
        if (cached.releaseData?.tag_name || cached.releaseData?.name) {
          const version = cached.releaseData.tag_name || cached.releaseData.name;
          const displayVersion = version.startsWith('v') ? version.slice(1) : version;
          setText(versionEl, displayVersion);
          setText(downloadVersionEl, version.startsWith('v') ? version : 'v' + version);
          setText(releaseTagEl, version);
          setText(releaseDateEl, formatDate(cached.releaseData.published_at));
          if (releaseLinkEl && cached.releaseData.html_url) releaseLinkEl.href = cached.releaseData.html_url;
          if (releaseNotesEl) {
            releaseNotesEl.classList.add('md');
            releaseNotesEl.innerHTML = renderMarkdownLite((cached.releaseData.body || '').trim()) || '—';
          }
          const apkAsset = cached.releaseData.assets?.find(a => a.name && a.name.toLowerCase().endsWith('.apk'));
          if (apkAsset?.size != null) setText(downloadSizeEl, '~' + formatSize(apkAsset.size));
        }
        if (cached.readmeSummary) setText(repoLeadEl, cached.readmeSummary);
        renderTopics(cached.repoData?.topics || []);
        renderFeatures(cached.features || []);
        if (repoBadgeTextEl) {
          const lic = cached.repoData?.license?.spdx_id;
          const branch = cached.repoData?.default_branch;
          setText(repoBadgeTextEl, ['Material 3 Expressive Design', lic && lic !== 'NOASSERTION' ? lic : null].filter(Boolean).join(' • '));
        }
      }

      const [repoData, releaseData, readmeData] = await Promise.all([
        fetchJson(`https://api.github.com/repos/${owner}/${repo}`),
        fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/latest`),
        fetchJson(`https://api.github.com/repos/${owner}/${repo}/readme`)
      ]);

      const readmeText = readmeData?.content ? decodeBase64Utf8(readmeData.content) : '';
      const readmeSummary = extractReadmeSummary(readmeText);
      const features = extractFeatures(readmeText);

      if (repoData) {
        setText(starsEl, repoData.stargazers_count != null ? formatNumber(repoData.stargazers_count) : '—');
        setText(forksEl, repoData.forks_count != null ? formatNumber(repoData.forks_count) : '—');
        setText(issuesEl, repoData.open_issues_count != null ? formatNumber(repoData.open_issues_count) : '—');
        setText(repoLicenseEl, repoData.license?.spdx_id || '—');
        setText(repoUpdatedEl, formatDate(repoData.pushed_at || repoData.updated_at));
        setText(repoBranchEl, repoData.default_branch || '—');
        if (repoData.description) setText(footerTaglineEl, repoData.description);
        renderTopics(repoData.topics || []);
        if (repoBadgeTextEl) {
          const lic = repoData.license?.spdx_id;
          const branch = repoData.default_branch;
          setText(repoBadgeTextEl, [
  'Material 3 Expressive Design',
  lic && lic !== 'NOASSERTION' ? lic : null
].filter(Boolean).join(' • '));
        }
      }

      if (readmeSummary) setText(repoLeadEl, readmeSummary);
      renderFeatures(features);

      if (releaseData) {
        const version = releaseData.tag_name || releaseData.name;
        if (version) {
          const displayVersion = version.startsWith('v') ? version.slice(1) : version;
          setText(versionEl, displayVersion);
          setText(downloadVersionEl, version.startsWith('v') ? version : 'v' + version);
          setText(releaseTagEl, version);
        }
        setText(releaseDateEl, formatDate(releaseData.published_at));
        if (releaseLinkEl && releaseData.html_url) releaseLinkEl.href = releaseData.html_url;
        if (releaseNotesEl) {
          releaseNotesEl.classList.add('md');
          releaseNotesEl.innerHTML = renderMarkdownLite((releaseData.body || '').trim()) || '—';
        }
        const apkAsset = releaseData.assets?.find(a => a.name && a.name.toLowerCase().endsWith('.apk'));
        if (apkAsset && downloadSizeEl) setText(downloadSizeEl, '~' + formatSize(apkAsset.size));
      }

      writeCache({ repoData, releaseData, readmeSummary, features });
    } catch (err) {
      console.warn('Failed to fetch GitHub stats:', err);
      if (starsEl) starsEl.textContent = '—';
      if (versionEl) versionEl.textContent = '—';
    }
  })();
});