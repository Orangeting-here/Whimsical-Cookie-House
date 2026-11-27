/* 日历助手工具箱 · 嵌入挂载器 v1
 *
 * 给"单文件导航页"用：一行 script + 一个链接，就能把整个项目以 App 形态打开。
 * 不依赖框架、不改你的导航页结构、不需要 Shadow DOM。
 *
 *   <script src="./toolbox/embed.js"></script>
 *   <a href="./toolbox/index.html"
 *      onclick="return WhimsicalMount.open('./toolbox/index.html','日历助手工具箱')">
 *      日历助手工具箱
 *   </a>
 *
 * 返回 false → 拦住默认跳转，走内嵌；JS 没加载/被拦 → 正常跳到 index.html，不影响可用。
 * 内嵌页里想主动关闭，调 parent.postMessage({type:'wh:embed-close'},'*')。
 */
(function () {
  var HOST_ID = 'wh-embed-host';
  var CSS = [
    '#' + HOST_ID + '{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;',
    'background:rgba(8,10,16,.62);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);',
    'opacity:0;transition:opacity .22s ease;}',
    '#' + HOST_ID + '.on{opacity:1;}',
    '#' + HOST_ID + ' .wh-shell{position:relative;width:min(96vw,1440px);height:min(94vh,900px);padding-top:46px;',
    'background:#0b0d12;border-radius:18px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.14);',
    'transform:translateY(10px) scale(.99);transition:transform .26s cubic-bezier(.22,.9,.24,1);}',
    '#' + HOST_ID + '.on .wh-shell{transform:none;}',
    '#' + HOST_ID + ' iframe{width:100%;height:100%;border:0;display:block;background:#0b0d12;}',
    '#' + HOST_ID + ' .wh-bar{position:absolute;top:0;left:0;right:0;height:46px;z-index:3;display:flex;gap:8px;align-items:center;',
    'padding:0 10px;background:linear-gradient(180deg,rgba(22,26,38,.97),rgba(13,16,24,.94));',
    'border-bottom:1px solid rgba(255,255,255,.08);box-shadow:0 1px 0 rgba(0,0,0,.5);}',
    '#' + HOST_ID + ' .wh-btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 13px;border:0;cursor:pointer;',
    'border-radius:11px;font:500 13px/1 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif;color:#e8eef8;',
    'background:rgba(20,24,34,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'box-shadow:0 2px 10px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.1);transition:.18s;}',
    '#' + HOST_ID + ' .wh-btn:hover{background:rgba(38,45,62,.9);transform:translateY(-1px);}',
    '#' + HOST_ID + ' .wh-title{color:#cfd8e6;font:600 13px/1 -apple-system,"PingFang SC",sans-serif;',
    'padding:0 6px;text-shadow:0 1px 3px rgba(0,0,0,.5);}',
    '#' + HOST_ID + ' .wh-sp{flex:1;}',
    '@media (max-width:760px){#' + HOST_ID + ' .wh-shell{width:100vw;height:100vh;border-radius:0;}}',
    '@media (prefers-reduced-motion:reduce){#' + HOST_ID + ',#' + HOST_ID + ' .wh-shell{transition:none;}}'
  ].join('');

  var host = null, frame = null, titleEl = null, lastFocus = null;

  function injectCss() {
    if (document.getElementById(HOST_ID + '-css')) return;
    var st = document.createElement('style');
    st.id = HOST_ID + '-css';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  function build() {
    host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('role', 'dialog');
    host.setAttribute('aria-modal', 'true');
    host.innerHTML =
      '<div class="wh-shell">' +
        '<div class="wh-bar">' +
          '<button class="wh-btn" data-act="back" type="button" aria-label="返回导航页">← 返回导航页</button>' +
          '<span class="wh-title"></span>' +
          '<span class="wh-sp"></span>' +
          '<button class="wh-btn" data-act="tab" type="button">新窗口打开</button>' +
          '<button class="wh-btn" data-act="close" type="button" aria-label="关闭">✕</button>' +
        '</div>' +
        '<iframe title="日历助手工具箱" allow="clipboard-write; fullscreen" referrerpolicy="same-origin"></iframe>' +
      '</div>';
    document.body.appendChild(host);
    frame = host.querySelector('iframe');
    titleEl = host.querySelector('.wh-title');

    host.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-act]') : null;
      if (!btn) return;
      var act = btn.getAttribute('data-act');
      if (act === 'close') close();
      else if (act === 'back') close();
      else if (act === 'tab') window.open(frame.src, '_blank', 'noopener');
    });

    window.addEventListener('message', function (e) {
      var d = e.data;
      if (!d || typeof d !== 'object' || d.type !== 'wh:embed-close') return;
      /* 只认壳内 iframe 发来的关闭指令：否则同页任何 iframe / 嵌入方
         都能往父页面发一条消息把工具箱关掉。origin 在 file:// 下不可靠，
         以 source 严格比对为准。 */
      if (frame && e.source && e.source !== frame.contentWindow) return;
      close();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && host && host.classList.contains('on')) close();
    });

    window.addEventListener('beforeunload', function () { frame.src = 'about:blank'; });
  }

  function open(src, title) {
    injectCss();
    if (!host) build();
    lastFocus = document.activeElement;
    if (titleEl) titleEl.textContent = title || '';
    if (frame.getAttribute('src') !== src) frame.src = src;
    // 先上屏再过渡，避免 display 切换吞掉动画
    host.style.display = 'flex';
    void host.offsetWidth;
    host.classList.add('on');
    document.documentElement.style.overflow = 'hidden';
    var back = host.querySelector('[data-act="back"]');
    if (back) back.focus();
    return false; // 供 onclick="return ..." 直接拦住跳转
  }

  function close() {
    if (!host) return;
    host.classList.remove('on');
    var done = function () {
      host.style.display = 'none';
      frame.src = 'about:blank'; // 释放页面内存与定时器
      document.documentElement.style.overflow = '';
    };
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) done();
    else setTimeout(done, 230);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (x) {}
  }

  var API = { open: open, close: close, isOpen: function () { return !!(host && host.classList.contains('on')); } };
  window.WhimsicalMount = API;
  if (typeof module === 'object' && module.exports) module.exports = API;
})();
