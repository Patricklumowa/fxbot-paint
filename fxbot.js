(() => {
  'use strict';

  // ===== Config (API-FREE) =====
  const VERSION = 'v7.2';
  const UI_TICK_MS = 500;                 // UI refresh tick
  const REOPEN_DELAY_MS = 2000;           // normal reopen delay (non-depletion commits)
  const FULL_DEPLETION_REOPEN_MS = 35000; // wait ~+1 cooldown before reopening palette after "tinta acabou"
  const ACK_TIMEOUT_MS = 300;             // debug listener cleanup
  const DEFAULT_COOLDOWN_MIN = 10;        // minutes to cool-down after depletion (configurable)

  // ===== Theme =====
  const THEME = {
    bg:'#070709', panel:'#0f0f14', border:'#1b1b25', text:'#e7e7ee', subtle:'#a2a2ab',
    neon1:'#00F5FF', neon2:'#7C3BFF', good:'#39ff14', warn:'#ffb020', bad:'#ff3860'
  };

  // ===== i18n =====
  const LANGS = {
    pt: {
      title: `FXBot - Pixels ${VERSION}`,
      menu_status: 'STATUS',
      menu_lang: 'Idioma',
      menu_help: 'Ajuda',
      upload:'Upload',
      resize:'Redimensionar',
      selectPos:'Selecionar Posição',
      preview:'Preview (overlay)',
      start:'Iniciar',
      pause:'Pausar',
      resume:'Retomar',
      stop:'Parar',
      builtQueue:'Fila criada: {n} px',
      needImgPos:'Envie a imagem e marque a posição no canvas.',
      waitingClick:'Clique no CANTO SUPERIOR ESQUERDO da arte, dentro do canvas.',
      posOK:'Alinhado em X:{x} Y:{y}.',
      posSelectCanceled: 'Seleção de posição cancelada.',
      loadOK:'Imagem: {w}×{h} • {n} px',
      overlayOn:'Overlay ON.',
      overlayOff:'Overlay OFF.',
      done:'✅ Concluído! Pixels: {n}',
      paused:'⏸️ Pausado.',
      resumed:'▶️ Retomando.',
      stopped:'⏹️ Parado.',
      committing:'⏳ Aplicando…',
      committed:'✅ Aplicado.',
      sessionSaved:'💾 Sessão salva.',
      sessionLoaded:'📦 Sessão restaurada.',
      toastHit:'⚠️ Sem tinta — consolidando…',
      coolingDown:'🧊 Resfriando {min}min… faltam {mmss}',
      noCanvas:'Canvas não encontrado. Abra a página do mapa.',
      openPalette:'Abra a paleta de cores do site.',
      nothingToPaint:'Nada a pintar (filtros atuais).',
      started:'🚀 Pintando…',
      mustPickPos:'Defina a posição antes de iniciar.',
      mustUpload:'Envie a imagem antes de iniciar.',
      cooldownLabel:'Cooldown após esgotar (min)',
      reopenNormal:'Reabrir paleta após commit (ms)',
      reopenDepl:'Reabrir após esgotar (ms)',
      speed:'Velocidade & Precisão',
      pixelSize:'Tamanho do pixel',
      alpha:'Transparência <',
      white:'Branco ≥',
      skipWhite:'Pular branco',
      skipAlpha:'Pular transparente',
      order:'Ordem',
      scan:'Scanline',
      serp:'Serpentina',
      center:'Centro→bordas',
      bycolor:'Por cor',
      processed:'Processados',
      of:'/',
      apiFreeHint:'Sem API: pinta até o toast "Acabou a tinta/Out of paint". Ao disparar, faz commit, espera +1 (~35s) e esfria.',
      langAuto:'Auto (navegador)',
      langPT:'PT-BR',
      langEN:'EN',
      status_idle:'IDLE',
      status_run:'RODANDO',
      status_pause:'PAUSADO',
      helpText:'Dica: marque posição, ative overlay pra conferir e clique Iniciar. Erros aparecem como toasts.',
      topToastDemo:'Pronto. Toques importantes aparecem aqui.',
      resizeHint:'Recomendado redimensionar para caber no mapa, mas é opcional — alterações são ao vivo.',
      // manual start
      manualStartLabel:'Usar início manual',
      manualStartIndex:'Pixel inicial (#)',
      manualStartHelp:'Se ligado, começa a partir do pixel informado.',
      jumpTo:'Início manual: pulando para #{n}'
    },
    en: {
      title: `FXBot - Pixels ${VERSION}`,
      menu_status: 'STATUS',
      menu_lang: 'Language',
      menu_help: 'Help',
      upload:'Upload',
      resize:'Resize',
      selectPos:'Set Position',
      preview:'Preview (overlay)',
      start:'Start',
      pause:'Pause',
      resume:'Resume',
      stop:'Stop',
      builtQueue:'Queue built: {n} px',
      needImgPos:'Upload an image and pick the canvas position.',
      waitingClick:'Click the TOP-LEFT corner of your art inside the canvas.',
      posOK:'Aligned at X:{x} Y:{y}.',
      posSelectCanceled: 'Position selection canceled.',
      loadOK:'Image: {w}×{h} • {n} px',
      overlayOn:'Overlay ON.',
      overlayOff:'Overlay OFF.',
      done:'✅ Done! Pixels: {n}',
      paused:'⏸️ Paused.',
      resumed:'▶️ Resuming.',
      stopped:'⏹️ Stopped.',
      committing:'⏳ Committing…',
      committed:'✅ Committed.',
      sessionSaved:'💾 Session saved.',
      sessionLoaded:'📦 Session restored.',
      toastHit:'⚠️ Out of paint — consolidating…',
      coolingDown:'🧊 Cooling {min}min… left {mmss}',
      noCanvas:'Canvas not found. Open the map page.',
      openPalette:'Open the site color palette.',
      nothingToPaint:'Nothing to paint with current filters.',
      started:'🚀 Painting…',
      mustPickPos:'Pick a position before starting.',
      mustUpload:'Upload the image before starting.',
      cooldownLabel:'Cooldown after depletion (min)',
      reopenNormal:'Reopen palette after commit (ms)',
      reopenDepl:'Reopen after depletion (ms)',
      speed:'Speed & Accuracy',
      pixelSize:'Pixel size',
      alpha:'Transparency <',
      white:'White ≥',
      skipWhite:'Skip white',
      skipAlpha:'Skip transparent',
      order:'Order',
      scan:'Scanline',
      serp:'Serpentine',
      center:'Center→edges',
      bycolor:'By color',
      processed:'Processed',
      of:'/',
      apiFreeHint:'API-free: paints until the "Acabou a tinta/Out of paint" toast. On hit, commit, wait +1 (~35s), cool, and resume.',
      langAuto:'Auto (browser)',
      langPT:'PT-BR',
      langEN:'EN',
      status_idle:'IDLE',
      status_run:'RUNNING',
      status_pause:'PAUSED',
      helpText:'Tip: set position, enable overlay to check alignment, then Start. Errors show as toasts.',
      topToastDemo:'Ready. Important notices show here.',
      resizeHint:'Recommended to resize to fit the map, but optional — changes are live.',
      // manual start
      manualStartLabel:'Use manual start',
      manualStartIndex:'Start pixel (#)',
      manualStartHelp:'If enabled, start from this pixel index.',
      jumpTo:'Manual start: jumping to #{n}'
    }
  };

  const detectBrowserLang = () => {
    try{
      const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(s => String(s||'').toLowerCase());
      return langs.some(l => l.startsWith('pt')) ? 'pt' : 'en';
    }catch{ return 'en'; }
  };

  const sessLangKey = ()=>'fxbot-lang:'+location.host;

  // ===== State =====
  const state = {
    running:false, paused:false, stopFlag:false,
    imgData:null, imgWidth:0, imgHeight:0,
    pos:null,
    pixelSize:1,
    skipWhite:true, skipTransparent:true,
    whiteThr:250, alphaThr:100,
    order:'scanline',
    queue:[], queuePtr:0, painted:0, totalTarget:0,
    palette:[], colorCache:new Map(),
    overlayCanvas:null, overlayNeedsRepaint:true,
    overlayAbsPos: null, // Absolute page position for the overlay {left, top}
    // speed
    turbo:true, cps:80, colorSettleMs:0,
    // session/autosave
    autoSaveEvery:50, sinceSave:0,
    // cooldown (manual only)
    cooldownMin: DEFAULT_COOLDOWN_MIN,
    // toast detector
    toast:{ enabled:true, seen:false, seenAt:0, handling:false, lastSeenAt:0, observer:null, root:null },
    // commit
    committing:false,
    // applied/pending
    applied:{ set:new Set(), pending:[], pendingSet:new Set() },
    // timers
    loopActive:false, lastPaintTs:0,
    uiTicker:null,
    // listeners
    ui:{ keydownHandler:null },
    // language
    lang: (localStorage.getItem(sessLangKey()) || 'auto'),
    _resolvedLang: 'en',
    // manual start override
    manualStart: { enabled:false, index:0 }
  };

  state._resolvedLang = state.lang === 'auto' ? detectBrowserLang() : (state.lang||'en');
  if(!(state._resolvedLang in LANGS)) state._resolvedLang = 'en';

  // tiny template helper
  function tKey(){ return LANGS[state._resolvedLang]; }
  function t(id, params){
    const raw = (tKey()[id] ?? id);
    if(!params) return raw;
    return raw.replace(/\{(\w+)\}/g, (_,k)=> (params[k]!==undefined? String(params[k]): ''));
  }

  // ===== Toast UI =====
  function getToastContainer() {
    let container = document.getElementById('fx-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'fx-toast-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';
        container.style.alignItems = 'center';
        document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = 'info', ms = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = 'bold';
    toast.style.color = '#fff';
    toast.style.background = 'rgba(20, 20, 20, 0.95)'; // solid dark
    toast.style.boxShadow = '0 0 12px rgba(0, 255, 170, 0.8)';
    toast.style.border = '1px solid rgba(0, 255, 170, 0.8)';
    toast.style.textAlign = 'center';
    toast.style.maxWidth = '80%';
    toast.style.wordWrap = 'break-word';
    toast.style.pointerEvents = 'none';

    if (type === 'error') {
      toast.style.boxShadow = '0 0 12px rgba(255, 0, 0, 0.9)';
      toast.style.border = '1px solid rgba(255, 0, 0, 0.9)';
    } else if (type === 'warning' || type === 'warn') {
      toast.style.boxShadow = '0 0 12px rgba(255, 255, 0, 0.9)';
      toast.style.border = '1px solid rgba(255, 255, 0, 0.9)';
    }

    const container = getToastContainer();
    container.appendChild(toast);

    setTimeout(() => {
      try{ toast.remove(); }catch{}
    }, ms);
  }

  // ===== Utils =====
  const U = {
    qs:(s,r=document)=>r.querySelector(s),
    qsa:(s,r=document)=>Array.from(r.querySelectorAll(s)),
    sleep:ms=>new Promise(r=>setTimeout(r,ms)),
    clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
    colorDist(a,b){ const dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2]; return Math.sqrt(dr*dr+dg*dg+db*db); },
    log(...args){ console.log('%c[FXBot '+VERSION+']', 'color:'+THEME.neon1, ...args); },
    mmss(ms){ ms=Math.max(0,ms|0); const s=Math.ceil(ms/1000); const m=(s/60|0); return `${m}:${String(s%60).padStart(2,'0')}`; },
    toDataURL(imgData){ const c=document.createElement('canvas'); c.width=imgData.width; c.height=imgData.height; c.getContext('2d').putImageData(imgData,0,0); return c.toDataURL('image/png'); },
    async fromDataURL(dataURL){
      return new Promise((resolve,reject)=>{ const img=new Image(); img.onload=()=>{ const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0); resolve(ctx.getImageData(0,0,img.width,img.height)); }; img.onerror=reject; img.src=dataURL; });
    },
    now:()=>performance.now(),
  };

  // ===== Canvas target =====
  function getTargetCanvas(){
    return U.qs('.maplibregl-canvas') || U.qs('canvas[aria-label="Map"]') || U.qs('canvas');
  }
  function canvasRect(){ const c=getTargetCanvas(); return c?c.getBoundingClientRect():null; }

  // ===== Palette =====
  function extractPalette(){
    try{
      const els = U.qsa('[id^="color-"]');
      return els.filter(el=>!el.querySelector('svg')).map(el=>{
        const id=parseInt(el.id.replace('color-',''),10);
        const m=(el.style.backgroundColor||'').match(/\d+/g);
        const rgb=m?m.map(Number).slice(0,3):[0,0,0];
        return {id,rgb,element:el};
      }).filter(x=>Number.isFinite(x.id));
    }catch{ return []; }
  }
  function selectColor(id){ const el=document.getElementById(`color-${id}`); if(el){ el.click(); return true; } return false; }

  // ===== Session =====
  const sessKey = ()=>'fxbot-pixels-'+VERSION+':'+location.host;
  function snapshot(){
    return {
      img: state.imgData ? U.toDataURL(state.imgData) : null,
      imgWidth: state.imgWidth, imgHeight: state.imgHeight,
      pos: state.pos,
      overlayAbsPos: state.overlayAbsPos, // OVERLAY CHANGE: Save absolute position
      pixelSize: state.pixelSize,
      skipWhite: state.skipWhite, skipTransparent: state.skipTransparent,
      whiteThr: state.whiteThr, alphaThr: state.alphaThr,
      order: state.order,
      turbo: state.turbo, cps: state.cps, colorSettleMs: state.colorSettleMs,
      queuePtr: state.queuePtr, painted: state.painted, totalTarget: state.totalTarget,
      cooldownMin: state.cooldownMin,
      lang: state.lang,
      manualStart: {...state.manualStart},
      applied:{ set: Array.from(state.applied.set), pending: state.applied.pending.map(p=>({k:p.k,t:p.t, it:{x:p.it.x,y:p.it.y,colorId:p.it.colorId,rgb:p.it.rgb,canvas:p.it.canvas}})) },
      ts: Date.now()
    };
  }
  async function restore(obj){
    if(!obj) return false;
    try{
      if(obj.img){ state.imgData = await U.fromDataURL(obj.img); state.imgWidth=state.imgData.width; state.imgHeight=state.imgData.height; }
      else{ state.imgWidth=obj.imgWidth||0; state.imgHeight=obj.imgHeight||0; }
      state.pos=obj.pos||null;
      state.overlayAbsPos = obj.overlayAbsPos || null; // OVERLAY CHANGE: Restore absolute position
      state.pixelSize=obj.pixelSize||1;
      state.skipWhite= !!obj.skipWhite; state.skipTransparent= !!obj.skipTransparent;
      state.whiteThr= obj.whiteThr ?? 250; state.alphaThr= obj.alphaThr ?? 100;
      state.order= obj.order || 'scanline';
      state.turbo= !!obj.turbo; state.cps= obj.cps ?? 80; state.colorSettleMs= obj.colorSettleMs ?? 0;
      state.queuePtr= obj.queuePtr ?? 0; state.painted= obj.painted ?? 0; state.totalTarget = obj.totalTarget ?? 0;
      state.cooldownMin = obj.cooldownMin ?? DEFAULT_COOLDOWN_MIN;
      state.lang = obj.lang || state.lang;
      state._resolvedLang = state.lang === 'auto' ? detectBrowserLang() : (state.lang||'en');
      if(!(state._resolvedLang in LANGS)) state._resolvedLang = 'en';
      if(obj.manualStart){ state.manualStart = {...state.manualStart, ...obj.manualStart}; }
      if(obj.applied){
        state.applied.set = new Set(obj.applied.set || []);
        state.applied.pending = Array.isArray(obj.applied.pending) ? obj.applied.pending.map(p=>({k:p.k, t:p.t, it:p.it})) : [];
        state.applied.pendingSet = new Set(state.applied.pending.map(p=>p.k));
      }
      markOverlayDirty(); applyStateToUI(); enableAfterImg(); setStatus(t('sessionLoaded')); updateProgress();
      // Auto show overlay after restore for "always live" preview
      if(state.imgData && state.pos){ ensureOverlay(); repaintOverlay(); placeOverlay(); setStatus(t('overlayOn')); }
      return true;
    }catch{ return false; }
  }
  function saveSession(reason=''){ try{ localStorage.setItem(sessKey(), JSON.stringify(snapshot())); if(reason!=='silent') setStatus(t('sessionSaved')); }catch{} }
  function hasSession(){ try{ return !!localStorage.getItem(sessKey()); }catch{return false;} }
  async function loadSession(){ try{ const s=localStorage.getItem(sessKey()); if(!s) return false; return await restore(JSON.parse(s)); }catch{ return false; } }

  // ===== UI =====
  function buildUI(){
    const old=document.getElementById('fxbot-ui'); if(old){
      // remove hotkeys before rebuild
      if(state.ui.keydownHandler){ window.removeEventListener('keydown', state.ui.keydownHandler, true); state.ui.keydownHandler=null; }
      old.remove();
    }
    const root=document.createElement('div'); root.id='fxbot-ui';
    Object.assign(root.style, {position:'fixed', bottom:'20px', right:'20px', zIndex:999999, width:'min(92vw,560px)', maxHeight:'80vh', overflow:'auto',
      background:`linear-gradient(135deg, rgba(124,59,255,.12), rgba(0,245,255,.08))`, boxShadow:'0 20px 50px rgba(0,0,0,.55)', borderRadius:'16px', padding:'1px'});
    const inner=document.createElement('div');
    Object.assign(inner.style, {background:THEME.panel, color:THEME.text, border:`1px solid ${THEME.border}`, borderRadius:'16px', fontFamily:'JetBrains Mono, SFMono-Regular, Menlo, monospace'});

    // header with status + lang
    const statusBadge = `<span id="fx-top-status" style="padding:4px 8px;border:1px solid ${THEME.neon1};border-radius:999px;color:${THEME.neon1};font-size:11px;">${t('status_idle')}</span>`;
    const langSel = `
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:${THEME.subtle}">
        ${t('menu_lang')}
        <select id="fx-lang" style="background:${THEME.bg};border:1px solid ${THEME.border};color:${THEME.text};border-radius:8px;padding:6px;outline:none">
          <option value="auto"${state.lang==='auto'?' selected':''}>${t('langAuto')}</option>
          <option value="pt"${state.lang==='pt'?' selected':''}>${t('langPT')}</option>
          <option value="en"${state.lang==='en'?' selected':''}>${t('langEN')}</option>
        </select>
      </label>`;

    inner.innerHTML = `
      <div id="fx-drag-handle" style="display:flex;align-items:center;gap:10px;justify-content:space-between;padding:10px 14px;border-bottom:1px solid ${THEME.border}; background:rgba(10,10,14,.6); border-top-left-radius:16px;border-top-right-radius:16px;cursor:move">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-weight:700; letter-spacing:.3px; color:${THEME.neon1}; text-shadow:0 0 8px ${THEME.neon1}">${t('title')}</div>
          ${statusBadge}
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:12px;color:${THEME.subtle}">${t('menu_status')}</span>
          ${langSel}
          <button id="fx-save" class="fx-btn ghost">Save</button>
          <button id="fx-restore" class="fx-btn ghost" ${hasSession()?'':'disabled'}>Restore</button>
          <button id="fx-min" class="fx-btn ghost">─</button>
        </div>
      </div>
      <div id="fx-body" style="padding:14px;display:flex;flex-direction:column;gap:12px">
        <div id="fx-status" style="font-size:12px;color:${THEME.subtle};opacity:.9">${t('needImgPos')}</div>

        <div class="grid2">
          <button id="fx-upload" class="fx-btn primary">⭳ ${t('upload')}</button>
          <button id="fx-resize" class="fx-btn" disabled>↔ ${t('resize')}</button>
          <button id="fx-pos" class="fx-btn" disabled>✚ ${t('selectPos')}</button>
          <button id="fx-preview" class="fx-btn" disabled>☯ ${t('preview')}</button>
        </div>

        <fieldset class="box">
          <legend>🧪 Fluxo (without API)</legend>
          <div class="grid3">
            <label>${t('cooldownLabel')}
              <input id="cooldown-min" type="number" min="1" max="60" value="${state.cooldownMin}">
            </label>
            <label>${t('reopenNormal')}
              <input id="reopen-delay" type="number" min="500" max="60000" value="${REOPEN_DELAY_MS}">
            </label>
            <label>${t('reopenDepl')}
              <input id="reopen-depl" type="number" min="1000" max="60000" value="${FULL_DEPLETION_REOPEN_MS}">
            </label>
          </div>

          <div class="grid3" style="margin-top:8px">
            <label>${t('manualStartLabel')}
              <input id="fx-manualstart-en" type="checkbox" ${state.manualStart?.enabled?'checked':''}>
            </label>
            <label>${t('manualStartIndex')}
              <input id="fx-manualstart-idx" type="number" min="0" value="${state.manualStart?.index||0}" ${state.manualStart?.enabled?'':'disabled'}>
            </label>
            <div></div>
          </div>

          <div class="statusline">${t('apiFreeHint')}</div>
          <div class="statusline">${t('manualStartHelp')}</div>
        </fieldset>

        <fieldset class="box">
          <legend>⚙️ ${t('speed')}</legend>
          <div class="grid3">
            <label>Turbo
              <input id="fx-turbo" type="checkbox" ${state.turbo?'checked':''}>
            </label>
            <label>CPS
              <input id="fx-cps" type="number" min="1" max="1000" value="${state.cps}">
            </label>
            <label>Delay cor (ms)
              <input id="fx-colorwait" type="number" min="0" max="200" value="${state.colorSettleMs}">
            </label>
          </div>
          <div class="grid3">
            <label>${t('pixelSize')}
              <input id="fx-psize" type="number" min="1" value="${state.pixelSize}">
            </label>
            <label>${t('alpha')}
              <input id="fx-alpha" type="number" min="0" max="255" value="${state.alphaThr}">
            </label>
            <label>${t('white')}
              <input id="fx-white" type="number" min="0" max="255" value="${state.whiteThr}">
            </label>
          </div>
          <div class="grid3">
            <label>${t('skipWhite')} <input id="fx-skipw" type="checkbox" ${state.skipWhite?'checked':''}></label>
            <label>${t('skipAlpha')} <input id="fx-skipa" type="checkbox" ${state.skipTransparent?'checked':''}></label>
            <label>${t('order')}
              <select id="fx-order">
                <option value="scanline"${state.order==='scanline'?' selected':''}>${t('scan')}</option>
                <option value="serpentine"${state.order==='serpentine'?' selected':''}>${t('serp')}</option>
                <option value="center"${state.order==='center'?' selected':''}>${t('center')}</option>
                <option value="bycolor"${state.order==='bycolor'?' selected':''}>${t('bycolor')}</option>
              </select>
            </label>
          </div>
        </fieldset>

        <div class="grid3">
          <button id="fx-start" class="fx-btn success" disabled>${t('start')}</button>
          <button id="fx-pause" class="fx-btn warn" style="display:none">${t('pause')}</button>
          <button id="fx-resume" class="fx-btn primary" style="display:none">${t('resume')}</button>
          <button id="fx-stop" class="fx-btn danger" style="display:none">${t('stop')}</button>
        </div>

        <div id="fx-progress" class="box soft">
          <div>${t('processed')}: <span id="fx-qdone">0</span>${t('of')}<span id="fx-qtotal">0</span></div>
          <div id="fx-action">—</div>
        </div>

        <div class="statusline">${t('helpText')}</div>
      </div>
      <input id="fx-file" type="file" accept="image/png,image/jpeg" style="display:none">
    `;

    // style helpers
    inner.querySelectorAll('legend').forEach(el=>{ el.style.color=THEME.neon2; el.style.textShadow=`0 0 6px ${THEME.neon2}`; });
    inner.querySelectorAll('input, select').forEach(el=>{
      el.style.width='100%'; el.style.background=THEME.bg; el.style.border=`1px solid ${THEME.border}`;
      el.style.color=THEME.text; el.style.borderRadius='8px'; el.style.padding='6px'; el.style.outline='none';
      el.addEventListener('focus', ()=>{ el.style.boxShadow=`0 0 0 2px ${THEME.neon1}55`; });
      el.addEventListener('blur',  ()=>{ el.style.boxShadow='none'; });
    });
    inner.querySelectorAll('.box').forEach(el=>{ el.style.border=`1px solid ${THEME.border}`; el.style.borderRadius='12px'; el.style.padding='10px'; el.style.background='rgba(10,10,16,.55)'; });
    inner.querySelectorAll('.soft').forEach(el=>{ el.style.background='rgba(10,10,16,.35)'; });
    inner.querySelectorAll('.grid2').forEach(el=>{ el.style.display='grid'; el.style.gridTemplateColumns='1fr 1fr'; el.style.gap='8px'; });
    inner.querySelectorAll('.grid3').forEach(el=>{ el.style.display='grid'; el.style.gridTemplateColumns='1fr 1fr 1fr'; el.style.gap='8px'; });
    inner.querySelectorAll('.fx-btn').forEach(btn=> styleBtn(btn));

    root.appendChild(inner);
    document.body.appendChild(root);

    // Draggable
    makeDraggable(root, inner.querySelector('#fx-drag-handle'));

    // binds
    g('#fx-min').addEventListener('click',()=>{ const b=g('#fx-body'); b.style.display=b.style.display==='none'?'flex':'none'; });
    g('#fx-save').addEventListener('click', ()=>{ saveSession('manual'); showToast(t('sessionSaved')); });
    g('#fx-restore').addEventListener('click', async ()=>{ const ok=await loadSession(); if(ok){ enableAfterImg(); refreshOverlay(); updateButtons(); updateProgress(); showToast(t('sessionLoaded')); }});

    g('#fx-upload').addEventListener('click',()=>g('#fx-file').click());
    g('#fx-file').addEventListener('change', onFile);
    g('#fx-resize').addEventListener('click', resizeImage);
    g('#fx-pos').addEventListener('click', selectPosition);
    g('#fx-preview').addEventListener('click', toggleOverlay);

    g('#fx-start').addEventListener('click', startPainting);
    g('#fx-pause').addEventListener('click', pausePainting);
    g('#fx-resume').addEventListener('click', resumePainting);
    g('#fx-stop').addEventListener('click', stopPainting);

    // inputs
    onInput('#fx-turbo', e=> state.turbo=e.target.checked);
    onInput('#fx-cps',   e=> state.cps=U.clamp(parseInt(e.target.value,10)||80,1,1000));
    onInput('#fx-colorwait', e=> state.colorSettleMs=U.clamp(parseInt(e.target.value,10)||0,0,200));
    onInput('#fx-psize', e=>{ state.pixelSize=Math.max(1,parseInt(e.target.value,10)||1); refreshOverlay(); });
    onInput('#fx-alpha', e=>{ state.alphaThr=U.clamp(parseInt(e.target.value,10)||0,0,255); markOverlayDirty(); refreshOverlay(); });
    onInput('#fx-white', e=>{ state.whiteThr=U.clamp(parseInt(e.target.value,10)||0,0,255); markOverlayDirty(); refreshOverlay(); });
    g('#fx-skipw').addEventListener('change', e=>{ state.skipWhite=e.target.checked; markOverlayDirty(); refreshOverlay(); });
    g('#fx-skipa').addEventListener('change', e=>{ state.skipTransparent=e.target.checked; markOverlayDirty(); refreshOverlay(); });
    g('#fx-order').addEventListener('change', e=> state.order=e.target.value);

    onInput('#cooldown-min', e=>{ state.cooldownMin = U.clamp(parseInt(e.target.value,10)||DEFAULT_COOLDOWN_MIN,1,60); saveSession('cooldown'); });
    onInput('#reopen-delay', e=>{ cfg.reopenDelay = U.clamp(parseInt(e.target.value,10)||REOPEN_DELAY_MS,500,60000); saveSession('cfg'); });
    onInput('#reopen-depl',  e=>{ cfg.reopenDepletion = U.clamp(parseInt(e.target.value,10)||FULL_DEPLETION_REOPEN_MS,1000,60000); saveSession('cfg'); });

    // manual start binds
    const msChk = g('#fx-manualstart-en');
    const msIdx = g('#fx-manualstart-idx');
    msChk.addEventListener('change', ()=>{
      state.manualStart.enabled = !!msChk.checked;
      if(msIdx) msIdx.disabled = !state.manualStart.enabled;
      saveSession('manualStart');
    });
    msIdx.addEventListener('input', ()=>{
      const v = parseInt(msIdx.value,10);
      state.manualStart.index = Number.isFinite(v) ? Math.max(0, v) : 0;
      saveSession('manualStart');
    });

    // language selector
    const langEl = g('#fx-lang');
    langEl.addEventListener('change', ()=>{
      state.lang = langEl.value || 'auto';
      localStorage.setItem(sessLangKey(), state.lang);
      state._resolvedLang = state.lang === 'auto' ? detectBrowserLang() : state.lang;
      if(!(state._resolvedLang in LANGS)) state._resolvedLang = 'en';
      buildUI(); // rebuild with new language
      showToast(t('topToastDemo'));
    });

    // hotkeys (store and remove later)
    if(state.ui.keydownHandler){ window.removeEventListener('keydown', state.ui.keydownHandler, true); }
    state.ui.keydownHandler = (ev)=>{
      if(ev.key.toLowerCase()==='p'){ state.running && !state.paused ? pausePainting() : resumePainting(); }
      else if(ev.key.toLowerCase()==='s'){ stopPainting(); }
      else if(ev.ctrlKey && ev.key.toLowerCase()==='s'){ ev.preventDefault(); saveSession('manual'); showToast(t('sessionSaved')); }
    };
    window.addEventListener('keydown', state.ui.keydownHandler, true);

    applyStateToUI(); updateButtons(); updateProgress();
  }

  const cfg = {
    reopenDelay: REOPEN_DELAY_MS,
    reopenDepletion: FULL_DEPLETION_REOPEN_MS
  };

  function styleBtn(btn){
    const base = 'background:'+THEME.bg+';border:1px solid '+THEME.border+';color:'+THEME.text+';padding:9px 10px;border-radius:10px;cursor:pointer;';
    btn.setAttribute('style', base);
    btn.addEventListener('mouseenter', ()=> btn.style.boxShadow = `0 0 0 2px ${THEME.neon2}55, 0 0 12px ${THEME.neon2}55 inset`);
    btn.addEventListener('mouseleave', ()=> btn.style.boxShadow = 'none');
    if(btn.classList.contains('primary')) btn.style.borderColor = THEME.neon1;
    if(btn.classList.contains('success')) btn.style.borderColor = THEME.good;
    if(btn.classList.contains('warn')) btn.style.borderColor = THEME.warn;
    if(btn.classList.contains('danger')) btn.style.borderColor = THEME.bad;
    if(btn.classList.contains('ghost')) { btn.style.opacity='.85'; btn.style.background='rgba(7,7,9,.6)'; }
  }
  const g = sel => document.querySelector(sel);
  const onInput = (sel, fn) => g(sel).addEventListener('input', fn);

  function setStatus(msg){
    const el=g('#fx-status'); if(el) el.innerHTML=msg;
    U.log(msg);
  }
  function setTopStatus(mode){
    const el=g('#fx-top-status'); if(!el) return;
    if(mode==='run'){ el.textContent = t('status_run'); el.style.color = THEME.good; el.style.borderColor = THEME.good; }
    else if(mode==='pause'){ el.textContent = t('status_pause'); el.style.color = THEME.warn; el.style.borderColor = THEME.warn; }
    else { el.textContent = t('status_idle'); el.style.color = THEME.neon1; el.style.borderColor = THEME.neon1; }
  }
  function updateProgress(){
    const qd=g('#fx-qdone'); const qt=g('#fx-qtotal');
    const done = state.applied.set.size;
    const total = state.totalTarget || (state.queue.length + done);
    if(qd) qd.textContent = String(done);
    if(qt) qt.textContent = String(total);
  }
  function setAction(msg){ const el=g('#fx-action'); if(el) el.textContent=msg; }

  // ===== Upload / Resize =====
  async function onFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file) return;
    setStatus(t('started'));
    const fr=new FileReader();
    fr.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement('canvas'); c.width=img.width; c.height=img.height;
        const ctx=c.getContext('2d'); ctx.drawImage(img,0,0);
        state.imgData=ctx.getImageData(0,0,img.width,img.height);
        state.imgWidth=img.width; state.imgHeight=img.height;
        state.queuePtr=0; state.painted=0;
        state.applied.set.clear(); state.applied.pending.length=0; state.applied.pendingSet.clear();
        markOverlayDirty();
        setStatus(t('loadOK', {w:img.width, h:img.height, n: img.width*img.height}));
        enableAfterImg();
        state.totalTarget = 0; updateProgress(); saveSession('auto');
        if(centerPosOnCanvas()){
          ensureOverlay();
          markOverlayDirty();
          repaintOverlay();
          placeOverlay();
          showToast(t('resizeHint'), 'info', 4000);
          setStatus(t('overlayOn'));
        }
        };
      img.onerror=()=>{ setStatus('Error'); showToast('Error loading image', 'error'); };
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  }
  function resizeImage(){
    if(!state.imgData){ showToast(t('mustUpload'), 'warn'); return; }
    const w=parseInt(prompt('W (px):',state.imgWidth),10);
    const h=parseInt(prompt('H (px):',state.imgHeight),10);
    if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0) return;
    const c=document.createElement('canvas'); c.width=w; c.height=h;
    const ctx=c.getContext('2d'); const tmp=document.createElement('canvas'); tmp.width=state.imgWidth; tmp.height=state.imgHeight;
    tmp.getContext('2d').putImageData(state.imgData,0,0);
    ctx.imageSmoothingEnabled=false; ctx.drawImage(tmp,0,0,w,h);
    state.imgWidth=w; state.imgHeight=h; state.imgData=ctx.getImageData(0,0,w,h);
    state.queuePtr=0; state.painted=0;
    state.applied.set.clear(); state.applied.pending.length=0; state.applied.pendingSet.clear();
    markOverlayDirty(); refreshOverlay();
    setStatus(t('loadOK', {w, h, n: w*h}));
    saveSession('resize');
  }

  // ===== Position =====
  function selectPosition() {
    const rect = canvasRect();
    if (!rect) {
        setStatus(t('noCanvas'));
        return;
    }

    setStatus(t('waitingClick'));

    const uiRoot = document.getElementById('fxbot-ui');
    let cancelKeyHandler = null;

    const onClick = (e) => {
        if (uiRoot && uiRoot.contains(e.target)) {
            arm();
            return;
        }

        const currentRect = canvasRect(); // Get fresh rect on click
        if (!currentRect) return;

        // Use original logic to maintain expected behavior, but ensure it's relative to the canvas
        const relX = e.clientX - currentRect.left;
        const relY = e.clientY - currentRect.top;

        // This sets the top-left corner of the image based on the click
        state.pos = { x: Math.floor(relX), y: Math.floor(relY) };

        // Calculate and store the overlay's absolute page coordinates
        const canvasAbsX = currentRect.left + window.scrollX;
        const canvasAbsY = currentRect.top + window.scrollY;
        state.overlayAbsPos = {
            left: canvasAbsX + state.pos.x,
            top:  canvasAbsY + state.pos.y
        };

        markOverlayDirty();
        ensureOverlay();
        repaintOverlay();
        placeOverlay(); // This will now use the stored absolute position
        saveSession('auto');
        setStatus(t('posOK', { x: state.pos.x, y: state.pos.y }));

        if (cancelKeyHandler) {
            document.removeEventListener('keydown', cancelKeyHandler, true);
            cancelKeyHandler = null;
        }
    };

    function arm() {
        document.addEventListener('click', onClick, { once: true, capture: true });
        cancelKeyHandler = (ev) => {
            if (ev.key === 'Escape') {
                document.removeEventListener('click', onClick, true);
                document.removeEventListener('keydown', cancelKeyHandler, true);
                cancelKeyHandler = null;
                setStatus(t('posSelectCanceled'));
            }
        };
        document.addEventListener('keydown', cancelKeyHandler, true);
    }
    setTimeout(arm, 0);
}


  function centerPosOnCanvas(){
    const rect=canvasRect(); if(!rect || !state.imgData) return false;
    const tile=Math.max(1,state.pixelSize|0);
    const w = state.imgWidth * tile;
    const h = state.imgHeight * tile;
    const x = Math.floor((rect.width  - w)/2);
    const y = Math.floor((rect.height - h)/2);
    state.pos = {x: Math.max(0,x), y: Math.max(0,y)};

    // OVERLAY CHANGE: Calculate and store absolute position when centering
    const canvasAbsX = rect.left + window.scrollX;
    const canvasAbsY = rect.top + window.scrollY;
    state.overlayAbsPos = {
        left: canvasAbsX + state.pos.x,
        top:  canvasAbsY + state.pos.y
    };

    return true;
  }

  // ===== Overlay =====
  function ensureOverlay(){
    if(state.overlayCanvas && document.body.contains(state.overlayCanvas)) return state.overlayCanvas;
    const c=document.createElement('canvas'); c.id='fx-overlay';
    // OVERLAY CHANGE: Use absolute position so it scrolls with the page. No more scroll/resize listeners.
    Object.assign(c.style,{position:'absolute',pointerEvents:'none',opacity:'0.65',zIndex:999998});
    document.body.appendChild(c); state.overlayCanvas=c;
    // Force repaint next refresh to avoid "blank" overlay after toggling
    state.overlayNeedsRepaint = true;
    return c;
  }
  function toggleOverlay() {
    if (state.overlayCanvas) {
        try {
            state.overlayCanvas.remove();
        } catch (e) {
            console.error(e);
        }
        state.overlayCanvas = null;
        setStatus(t('overlayOff'));
        return;
    }

    if (!state.imgData || !state.pos) {
        setStatus(t('needImgPos'));
        showToast(t('mustPickPos'), 'warn');
        return;
    }

    ensureOverlay();
    // Make sure it paints immediately when re-enabled
    markOverlayDirty();
    repaintOverlay();
    placeOverlay();
    setStatus(t('overlayOn'));
}

  function markOverlayDirty(){ state.overlayNeedsRepaint=true; }
  function refreshOverlay(){ if(!state.overlayCanvas) return; repaintOverlay(); placeOverlay(); }
  function repaintOverlay(){
    if(!state.overlayCanvas||!state.imgData) return;
    // OVERLAY CHANGE: Use a fixed tile size of 1 for a true 1:1 pixel preview.
    // The `pixelSize` setting now only affects the bot's drawing logic, not the preview.
    const tile = 1;
    const iw=state.imgWidth, ih=state.imgHeight;
    const cw=iw*tile, ch=ih*tile;
    if(state.overlayCanvas.width!==cw) state.overlayCanvas.width=cw;
    if(state.overlayCanvas.height!==ch) state.overlayCanvas.height=ch;
    if(!state.overlayNeedsRepaint) return;
    state.overlayNeedsRepaint=false;
    const ctx=state.overlayCanvas.getContext('2d');
    const pal=state.palette.length?state.palette:extractPalette(); const usePal=pal.length>0; const cache=new Map();
    ctx.clearRect(0,0,cw,ch);
    for(let y=0;y<ih;y++){
      for(let x=0;x<iw;x++){
        const i=(y*iw+x)*4;
        const r=state.imgData.data[i], g=state.imgData.data[i+1], b=state.imgData.data[i+2], a=state.imgData.data[i+3];
        if(state.skipTransparent && a<state.alphaThr) continue;
        if(state.skipWhite && (r>=state.whiteThr && g>=state.whiteThr && b>=state.whiteThr)) continue;
        let rgb=[r,g,b];
        if(usePal){
          const key=r+','+g+','+b; let best=cache.get(key);
          if(!best){ let md=1e9, sel=pal[0]; for(const p of pal){ const d=U.colorDist(rgb,p.rgb); if(d<md){md=d; sel=p;} } best=sel; cache.set(key,best); }
          rgb=best.rgb;
        }
        ctx.fillStyle=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`; ctx.fillRect(x*tile, y*tile, tile, tile);
      }
    }
  }
  function placeOverlay(){
    // OVERLAY CHANGE: This function is now much simpler. It places the overlay
    // at the absolute page coordinates that were calculated and stored when the
    // user set the position. It no longer moves on scroll or resize.
    if(!state.overlayCanvas || !state.overlayAbsPos) return;
    state.overlayCanvas.style.left = state.overlayAbsPos.left + 'px';
    state.overlayCanvas.style.top  = state.overlayAbsPos.top + 'px';
  }

  // ===== Dedup =====
  const keyXY = (x,y)=>`${x},${y}`;
  function isAppliedXY(x, y) {
    const k = keyXY(x, y);
    return state.applied.set.has(k) || state.applied.pendingSet.has(k);
  }

  // ===== Queue =====
  function buildQueue(){
    state.palette=extractPalette(); state.colorCache.clear();
    if(!state.palette.length){ showToast(t('openPalette'), 'warn'); }
    state.queue=[]; state.painted=state.queuePtr||0;
    const w=state.imgWidth, h=state.imgHeight, data=state.imgData?.data; if(!data) return;
    const wantByColor=state.order==='bycolor'; const buckets=new Map();
    const centerX=(w-1)/2, centerY=(h-1)/2;

    const push=(x,y,colorId,rgb,c)=>{
      const it={x,y,colorId,rgb,canvas:c};
      if(wantByColor){ if(!buckets.has(colorId)) buckets.set(colorId,[]); buckets.get(colorId).push(it); }
      else state.queue.push(it);
    };

    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        const idx=(y*w+x)*4;
        const r=data[idx], g=data[idx+1], b=data[idx+2], a=data[idx+3];
        if(state.skipTransparent && a<state.alphaThr) continue;
        if(state.skipWhite && r>=state.whiteThr && g>=state.whiteThr && b>=state.whiteThr) continue;
        const key=r+','+g+','+b; let best=state.colorCache.get(key);
        if(!best){
          let md=1e9, sel=state.palette[0]||{id:0,rgb:[r,g,b]};
          if(state.palette.length){ for(const p of state.palette){ const d=U.colorDist([r,g,b],p.rgb); if(d<md){md=d; sel=p;} } }
          best=sel; state.colorCache.set(key,best);
        }
        const c = imageToCanvas(x,y);
        if(!c) continue;
        if(isAppliedXY(c.x, c.y)) continue;
        push(x,y, best.id, best.rgb, c);
      }
    }
    if(state.order==='center'){
      state.queue.sort((a,b)=>((a.x-centerX)**2+(a.y-centerY)**2)-((b.x-centerX)**2+(b.y-centerY)**2));
    } else if (wantByColor){
      for(const id of Array.from(buckets.keys())) state.queue.push(...buckets.get(id));
    }
    setStatus(t('builtQueue', {n: state.queue.length})); state.totalTarget = state.applied.set.size + state.queue.length; updateProgress();
  }
  function imageToCanvas(ix,iy){
    const rect=canvasRect(); if(!rect||!state.pos) return null;
    const s=Math.max(1,state.pixelSize|0);
    const x=state.pos.x + ix*s + Math.floor(s/2);
    const y=state.pos.y + iy*s + Math.floor(s/2);
    if(x<0||y<0||x>rect.width||y>rect.height) return null;
    return {x,y};
  }

  // ===== Clicks =====
  function clickCanvasSynthetic(canvas, cx, cy){
    const rect=canvasRect(); if(!rect) return;
    const absX=Math.round(rect.left + cx);
    const absY=Math.round(rect.top  + cy);
    const common={clientX:absX, clientY:absY, bubbles:true, cancelable:true, pointerId:1, isPrimary:true, buttons:1};

    canvas.dispatchEvent(new PointerEvent('pointerdown', {...common, button:0}));
    canvas.dispatchEvent(new PointerEvent('pointerup',   {...common, button:0}));

    canvas.dispatchEvent(new MouseEvent('mousedown', {clientX:absX, clientY:absY, button:0, bubbles:true, cancelable:true}));
    canvas.dispatchEvent(new MouseEvent('mouseup',   {clientX:absX, clientY:absY, button:0, bubbles:true, cancelable:true}));

    const ev = new MouseEvent('click', {clientX:absX, clientY:absY, button:0, bubbles:true, cancelable:true});
    ev.fxbot = true;
    canvas.dispatchEvent(ev);
  }

  function registerAckDebug(canvas){
    let resolved = false;
    const onAck = (ev)=>{
      if(resolved) return;
      if(ev.target !== canvas) return;
      if(ev.isTrusted) return;
      if(!('fxbot' in ev)) return;
      resolved = true;
      canvas.removeEventListener('click', onAck, true);
    };
    canvas.addEventListener('click', onAck, true);
    setTimeout(()=>{
      if(!resolved){
        try{ canvas.removeEventListener('click', onAck, true); }catch{}
      }
    }, ACK_TIMEOUT_MS);
  }

  function reserveAndAdvance(it){
    const k = keyXY(it.canvas.x, it.canvas.y);
    if(state.applied.set.has(k) || state.applied.pendingSet.has(k)) return false;
    const entry = {k, t: U.now(), it};
    state.applied.pending.push(entry);
    state.applied.pendingSet.add(k);
    state.painted++; state.queuePtr++; updateProgress();
    return true;
  }

  async function paintCanvasOnce(it, lastColorRef){
    const canvas = getTargetCanvas();
    if(!canvas) return false;
    if (isAppliedXY(it.canvas.x, it.canvas.y)) return false;

    if(lastColorRef.value !== it.colorId){
      selectColor(it.colorId);
      lastColorRef.value = it.colorId;
      if(state.colorSettleMs>0) await U.sleep(state.colorSettleMs);
    }

    const ok = reserveAndAdvance(it);
    if(!ok) return false;

    registerAckDebug(canvas);
    clickCanvasSynthetic(canvas, it.canvas.x, it.canvas.y);
    return true;
  }

  // ===== Commit helpers =====
  function getCommitButton(){
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => /Pintar/i.test((b.textContent||'').trim()));
  }
  async function clickCommitOnly(){
    const btn = getCommitButton(); if(!btn) return false;
    state.committing = true; setAction(t('committing'));
    btn.click();
    state.committing = false; return true;
  }
  async function reopenPaletteAfter(ms){
    await U.sleep(ms);
    const btn2 = getCommitButton(); if(btn2) btn2.click();
    setAction(t('committed')); return true;
  }
  async function commitAndSync(reopenDelayMs){
    await clickCommitOnly();
    await U.sleep(200);
    for (const p of state.applied.pending) state.applied.set.add(p.k);
    state.applied.pending.length = 0;
    state.applied.pendingSet.clear();
    saveSession('commit');
    updateProgress();
    await reopenPaletteAfter(reopenDelayMs ?? cfg.reopenDelay);
  }

  // ===== Toast detector =====
  function getToastRoot(){
    // Prefer the Sonner toaster root if present
    const el = document.querySelector('[data-sonner-toaster="true"]');
    return el || document.body;
  }
  function startToastObserver(){
    try{
      if(state.toast.observer) return;
      const root = getToastRoot();
      state.toast.root = root;
      const re = /Acabou a tinta|Out of paint/i;
      const obs = new MutationObserver((muts)=>{
        if(state.toast.handling) return;
        const now = U.now();
        if(now - state.toast.lastSeenAt < 2000) return;
        for(const m of muts){
          const nodes = [];
          if(m.addedNodes && m.addedNodes.length) nodes.push(...m.addedNodes);
          if(m.target) nodes.push(m.target);
          for(const n of nodes){
            if(!n) continue;
            let text = '';
            if(n.nodeType===1){ text = n.textContent || ''; }
            else if(n.nodeType===3){ text = n.nodeValue || ''; }
            if(re.test(text)){
              state.toast.seen = true;
              state.toast.seenAt = U.now();
              state.toast.lastSeenAt = state.toast.seenAt;
              setAction(t('toastHit'));
              showToast(t('toastHit'), 'warn', 2500);
              handleInkDepletedToast();
              return;
            }
          }
        }
      });
      obs.observe(root, {subtree:true, childList:true}); // light
      state.toast.observer = obs;
    }catch(e){
      U.log('Toast observer failed:', e);
    }
  }
  function stopToastObserver(){
    try{
      if(state.toast.observer){ state.toast.observer.disconnect(); state.toast.observer=null; }
      state.toast.root = null;
    }catch{}
  }

  async function handleInkDepletedToast(){
    if(state.toast.handling) return;
    state.toast.handling = true;
    try{
      // pause loop
      state.paused = true; updateButtons(); setTopStatus('pause');

      // rollback pendings created after toast
      const cutoff = state.toast.seenAt;
      const keep = []; const rollback = [];
      for(const p of state.applied.pending){
        if(p.t <= cutoff) keep.push(p); else rollback.push(p);
      }
      if(rollback.length){
        const items = rollback.map(p => p.it);
        state.queue.splice(state.queuePtr, 0, ...items);
        state.queuePtr -= rollback.length;
        if(state.queuePtr < 0) state.queuePtr = 0;
        for(const p of rollback){ state.applied.pendingSet.delete(p.k); }
      }
      state.applied.pending = keep;
      updateProgress();

      // commit & reopen with depletion delay (~+1)
      await commitAndSync(cfg.reopenDepletion);

      // cooldown
      const total = Math.max(1, state.cooldownMin|0) * 60 * 1000;
      let remain = total;
      while(remain > 0 && state.running && !state.stopFlag){
        setAction(t('coolingDown', {min:String(state.cooldownMin), mmss: U.mmss(remain)}));
        const step = Math.min(1000, remain);
        await U.sleep(step);
        remain -= step;
      }

      if(!state.running || state.stopFlag) return;
      state.toast.seen = false;
      state.paused = false; updateButtons(); setTopStatus('run');
      showToast(t('resumed') || t('resumed'), 'info', 1800);
    }catch(e){
      U.log('handleInkDepletedToast error:', e);
    }finally{
      state.toast.handling = false;
    }
  }

  // ===== Tickers =====
  function startUITicker(){ stopUITicker(); state.uiTicker = setInterval(()=>{ /* UI pulse if needed */ }, UI_TICK_MS); }
  function stopUITicker(){ if(state.uiTicker){ clearInterval(state.uiTicker); state.uiTicker=null; } }

  // ===== Runner =====
  async function startPainting(){
    if(state.loopActive){ showToast('Already running', 'warn'); return; }
    if(!state.imgData){ setStatus(t('mustUpload')); showToast(t('mustUpload'), 'error'); return; }
    if(!state.pos){ setStatus(t('mustPickPos')); showToast(t('mustPickPos'), 'error'); return; }

    state.palette=extractPalette(); if(!state.palette.length){ setStatus(t('openPalette')); showToast(t('openPalette'), 'error'); return; }
    buildQueue(); if(!state.queue.length){ setStatus(t('nothingToPaint')); showToast(t('nothingToPaint'), 'warn'); return; }

    // Manual start override (only if enabled and valid)
    if(state.manualStart?.enabled){
      const idx = Math.max(0, Math.min(state.queue.length - 1, parseInt(state.manualStart.index,10) || 0));
      state.queuePtr = idx;
      state.painted = idx;
      updateProgress();
      showToast(t('jumpTo', {n: idx}), 'info', 1800);
    }

    state.running=true; state.paused=false; state.stopFlag=false; state.loopActive=true;
    updateButtons(); setTopStatus('run');
    startUITicker();
    startToastObserver();
    showToast(t('started'), 'info', 1600);

    if(state.turbo) mainLoopTurbo(); else mainLoopClassic();
  }

  async function mainLoopClassic(){
    const baseInterval=() => 1000 / U.clamp(state.cps,1,1000);
    const lastColorRef = { value: -1 };
    while(state.running && !state.stopFlag){
      if(state.paused){ await U.sleep(25); continue; }

      if (state.queuePtr >= state.queue.length){
        if(state.applied.pending.length){ await commitAndSync(cfg.reopenDelay); }
        break;
      }

      const it=state.queue[state.queuePtr];
      if(isAppliedXY(it.canvas.x, it.canvas.y)){ state.queuePtr++; updateProgress(); continue; }
      setAction(`Cor ${it.colorId} | ${state.queuePtr+1}/${state.queue.length}`);

      const now = U.now(); const elapsed = now - state.lastPaintTs;
      const need = baseInterval(); if(elapsed < need) await U.sleep(need - elapsed);
      if(!state.running||state.stopFlag) break;

      await paintCanvasOnce(it, lastColorRef);
      state.lastPaintTs = U.now();
      afterStepAutosave();
    }
    finishRun();
  }

  async function mainLoopTurbo(){
    const baseInterval=() => 1000 / U.clamp(state.cps,1,1000);
    const lastColorRef = { value: -1 };
    while(state.running && !state.stopFlag){
      if(state.paused){ await U.sleep(10); continue; }

      if (state.queuePtr >= state.queue.length){
        if(state.applied.pending.length){ await commitAndSync(cfg.reopenDelay); }
        break;
      }

      const it=state.queue[state.queuePtr];
      if(isAppliedXY(it.canvas.x, it.canvas.y)){ state.queuePtr++; updateProgress(); continue; }
      setAction(`⚡ cor ${it.colorId} • ${state.queuePtr+1}/${state.queue.length}`);

      const now = U.now(); const elapsed = now - state.lastPaintTs;
      const need = baseInterval(); if(elapsed < need) await U.sleep(need - elapsed);
      if(!state.running||state.stopFlag) break;

      await paintCanvasOnce(it, lastColorRef);
      state.lastPaintTs = U.now();
      afterStepAutosave();
    }
    finishRun();
  }

  function afterStepAutosave(){
    state.sinceSave++;
    if(state.sinceSave>=state.autoSaveEvery){ saveSession('autosave'); state.sinceSave=0; }
  }

  function updateButtons(){
    if(!state.running){
      g('#fx-start').style.display='inline-block';
      g('#fx-pause').style.display='none';
      g('#fx-resume').style.display='none';
      g('#fx-stop').style.display='none';
      setTopStatus('idle');
    }else if(state.paused){
      g('#fx-start').style.display='none';
      g('#fx-pause').style.display='none';
      g('#fx-resume').style.display='inline-block';
      g('#fx-stop').style.display='inline-block';
      setTopStatus('pause');
    }else{
      g('#fx-start').style.display='none';
      g('#fx-pause').style.display='inline-block';
      g('#fx-resume').style.display='none';
      g('#fx-stop').style.display='inline-block';
      setTopStatus('run');
    }
  }

  function finishRun(){
    state.running=false; state.loopActive=false; state.committing=false;
    stopUITicker();
    stopToastObserver();
    updateButtons();
    saveSession('finish');
    setStatus(state.stopFlag?t('stopped'):t('done', {n: state.painted}));
  }

  function pausePainting(){
    if(!state.running||state.paused) return;
    state.paused=true;
    stopToastObserver();
    updateButtons();
    saveSession('pause'); setStatus(t('paused')); showToast(t('paused'), 'info', 1500);
  }
  function resumePainting(){
    if(!state.running||!state.paused) return;
    state.paused=false;
    startToastObserver();
    updateButtons(); setStatus(t('resumed')); showToast(t('resumed'), 'info', 1500);
  }

  function stopPainting(){
    // full reset: não é retomável
    state.stopFlag=true;
    state.running=false;
    state.loopActive=false;
    state.committing=false;

    stopUITicker();
    stopToastObserver();

    // limpar progressos e filas
    state.queue.length = 0;
    state.queuePtr = 0;
    state.painted = 0;
    state.totalTarget = 0;
    state.palette = [];
    state.colorCache.clear();
    state.applied.set.clear();
    state.applied.pending.length = 0;
    state.applied.pendingSet.clear && state.applied.pendingSet.clear();

    // overlay: remova SEMPRE e solte listeners
    // OVERLAY CHANGE: No more listeners to remove here
    if(state.overlayCanvas){ try{ state.overlayCanvas.remove(); }catch{} state.overlayCanvas=null; }

    // hotkeys
    if(state.ui.keydownHandler){ window.removeEventListener('keydown', state.ui.keydownHandler, true); state.ui.keydownHandler=null; }

    // remover sessão
    try{ localStorage.removeItem(sessKey()); }catch{}
    updateProgress();
    updateButtons();
    setStatus(t('stopped')); showToast(t('stopped'), 'warn', 1600);
  }

  // ===== Helpers UI =====
  function applyStateToUI(){
    const setVal=(sel,val)=>{ const el=g(sel); if(el) el.value=val; };
    const setChk=(sel,val)=>{ const el=g(sel); if(el) el.checked=!!val; };
    setVal('#fx-cps', state.cps);
    setVal('#fx-colorwait', state.colorSettleMs);
    setVal('#fx-psize', state.pixelSize);
    setVal('#fx-alpha', state.alphaThr);
    setVal('#fx-white', state.whiteThr);
    const ord=g('#fx-order'); if (ord) ord.value=state.order;
    setChk('#fx-turbo', state.turbo);
    const cd = g('#cooldown-min'); if(cd) cd.value = String(state.cooldownMin);
    const rd = g('#reopen-delay'); if(rd) rd.value = String(cfg.reopenDelay);
    const rdd= g('#reopen-depl');  if(rdd) rdd.value= String(cfg.reopenDepletion);

    const msChk = g('#fx-manualstart-en'); if(msChk) msChk.checked = !!state.manualStart.enabled;
    const msIdx = g('#fx-manualstart-idx'); if(msIdx){ msIdx.value = String(state.manualStart.index||0); msIdx.disabled = !state.manualStart.enabled; }
  }
  function enableAfterImg(){ g('#fx-resize').disabled=false; g('#fx-pos').disabled=false; g('#fx-preview').disabled=false; g('#fx-start').disabled=false; }

  // ===== Drag =====
  function makeDraggable(panel, handle){
    let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;
    const onStart=(e)=>{
      dragging=true; const p = e.touches? e.touches[0] : e;
      startX=p.clientX; startY=p.clientY;
      const rect=panel.getBoundingClientRect(); startLeft=rect.left; startTop=rect.top;
      document.addEventListener('mousemove', onMove, true);
      document.addEventListener('mouseup', onEnd, true);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onEnd, true);
    };
    const onMove=(e)=>{
      if(!dragging) return; const p = e.touches? e.touches[0] : e;
      const dx=p.clientX-startX, dy=p.clientY-startY;
      panel.style.left = (startLeft+dx)+'px';
      panel.style.top = (startTop+dy)+'px';
      panel.style.right = 'auto'; panel.style.bottom='auto';
      e.preventDefault?.();
    };
    const onEnd=()=>{
      dragging=false;
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('mouseup', onEnd, true);
      document.removeEventListener('touchmove', onMove, true);
      document.removeEventListener('touchend', onEnd, true);
    };
    handle.addEventListener('mousedown', onStart, true);
    handle.addEventListener('touchstart', onStart, {passive:true});
  }

  // ===== Boot =====
  function init(){
    addGlobalStyles();
    buildUI();
    setStatus(t('needImgPos'));
    startUITicker();
    if(hasSession()){ loadSession().then(()=>{ updateButtons(); updateProgress(); }); }
    showToast(t('topToastDemo'), 'info', 2200);
  }
  function addGlobalStyles(){
    const s=document.createElement('style');
    s.textContent=`
      #fxbot-ui .statusline{font-size:12px;color:${THEME.subtle};margin-top:6px}
      #fxbot-ui label{display:flex;flex-direction:column;gap:6px;font-size:12px;color:${THEME.subtle}}
      @media (max-width: 560px){
        #fxbot-ui{width:94vw; bottom:10px; right:10px}
        #fxbot-ui .grid3{grid-template-columns:1fr 1fr}
      }
    `;
    document.head.appendChild(s);
  }
  init();
})();
