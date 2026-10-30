'use strict';
/* =====================================================================
   АДМІН-ПАНЕЛЬ RDK CANDLE
   Редагує data/site.json і завантажує фото в репозиторій сайту через GitHub API.
   Усі зміни публікуються одним комітом. Сервер не потрібен: працює на GitHub Pages.
   ===================================================================== */
const DEFAULT_REPO = 'redeko2023/candlesB2C';   // репозиторій за замовчуванням у формі входу
const DATA_PATH = 'data/site.json';
const TPL_PATH = 'data/templates.json';
const UPLOAD_DIR = 'assets/img/uploads';
const IMG_MAX_PX = 1600;        // більша сторона фото після стиснення
const IMG_MIN_PX = 600;         // менше — попередження про якість
const IMG_MAX_MB = 20;

const SHOP_CATS = [['floral', 'Квіткові'], ['gift', 'Подарунки'], ['love', 'Кохання']];
const WORK_CATS = [['gift', 'Подарунок'], ['love', 'Кохання'], ['wedding', 'Весілля'], ['biz', 'Для бізнесу']];
const GLASS = [['clear', 'Прозора'], ['black', 'Чорна'], ['white', 'Біла']];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = (o) => JSON.parse(JSON.stringify(o));

let auth = null;           // { repo, branch, token }
let original = null;       // site.json як у репозиторії (рядок)
let data = null;           // робоча копія
let tpls = { floral: [], all: [] };
const uploads = new Map(); // шлях у репозиторії → { b64, preview }
let tab = 'products';

/* ---------- сховище входу ---------- */
const store = {
  get(){ try { return JSON.parse(sessionStorage.getItem('rdk-admin') || localStorage.getItem('rdk-admin') || 'null'); } catch (e){ return null; } },
  set(v, remember){ try { const s = JSON.stringify(v); sessionStorage.setItem('rdk-admin', s); if (remember) localStorage.setItem('rdk-admin', s); else localStorage.removeItem('rdk-admin'); } catch (e){} },
  clear(){ try { sessionStorage.removeItem('rdk-admin'); localStorage.removeItem('rdk-admin'); } catch (e){} }
};

/* ---------- GitHub API ---------- */
async function gh(path, opts = {}){
  const headers = { Authorization: 'Bearer ' + auth.token, Accept: opts.accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (opts.body) headers['Content-Type'] = 'application/json';
  let r;
  try { r = await fetch('https://api.github.com' + path, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined, cache: 'no-store' }); }
  catch (e){ throw new Error('Немає з’єднання з GitHub. Перевірте інтернет і спробуйте ще раз.'); }
  if (!r.ok){
    let m = ''; try { m = (await r.json()).message || ''; } catch (e){}
    const err = new Error(ghMessage(r.status, m)); err.status = r.status; throw err;
  }
  return opts.raw ? r.text() : r.json();
}
function ghMessage(status, m){
  if (status === 401) return 'Токен недійсний або його термін дії закінчився. Створіть новий токен на GitHub.';
  if (status === 403) return 'У токена немає потрібних дозволів. Потрібен доступ Contents: Read and write до цього репозиторію.';
  if (status === 404) return 'Репозиторій або файл не знайдено. Перевірте назву репозиторію й гілку, а також доступ токена до цього репозиторію.';
  if (status === 409 || status === 422) return 'Сайт щойно змінили з іншого місця. Оновіть сторінку адмінки й повторіть зміни.' + (m ? ` (${m})` : '');
  return `GitHub відповів помилкою ${status}${m ? ': ' + m : ''}.`;
}
const repoPath = () => `/repos/${auth.repo}`;
const b64utf8 = (str) => { const bytes = new TextEncoder().encode(str); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); };

async function readFile(path){ return gh(`${repoPath()}/contents/${path}?ref=${encodeURIComponent(auth.branch)}`, { accept: 'application/vnd.github.raw+json', raw: true }); }

async function publish(message){
  const ref = await gh(`${repoPath()}/git/ref/heads/${encodeURIComponent(auth.branch)}`);
  const head = ref.object.sha;
  const commit = await gh(`${repoPath()}/git/commits/${head}`);
  const tree = [];
  for (const [path, u] of uploads){
    if (!isUsed(path)) continue;   // фото, яке потім замінили ще раз, не завантажуємо
    const blob = await gh(`${repoPath()}/git/blobs`, { method: 'POST', body: { content: u.b64, encoding: 'base64' } });
    tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const json = JSON.stringify(data, null, 2) + '\n';
  const jb = await gh(`${repoPath()}/git/blobs`, { method: 'POST', body: { content: b64utf8(json), encoding: 'base64' } });
  tree.push({ path: DATA_PATH, mode: '100644', type: 'blob', sha: jb.sha });
  const nt = await gh(`${repoPath()}/git/trees`, { method: 'POST', body: { base_tree: commit.tree.sha, tree } });
  const nc = await gh(`${repoPath()}/git/commits`, { method: 'POST', body: { message, tree: nt.sha, parents: [head] } });
  await gh(`${repoPath()}/git/refs/heads/${encodeURIComponent(auth.branch)}`, { method: 'PATCH', body: { sha: nc.sha, force: false } });
  return nc.sha;
}
function isUsed(path){ return JSON.stringify(data).includes(JSON.stringify(path)); }

/* ---------- вхід ---------- */
async function login(a, remember){
  auth = a;
  const repo = await gh(repoPath());
  if (repo.permissions && repo.permissions.push === false) throw new Error('Токен має доступ лише для читання. Потрібен дозвіл Contents: Read and write.');
  const [raw, traw] = await Promise.all([readFile(DATA_PATH), readFile(TPL_PATH).catch(() => '{}')]);
  try { data = JSON.parse(raw); } catch (e){ throw new Error('Файл даних сайту пошкоджений (data/site.json). Відновіть його з історії комітів на GitHub.'); }
  try { const t = JSON.parse(traw); tpls = { floral: t.floral || [], all: t.all || [] }; } catch (e){}
  normalize(data); original = JSON.stringify(data);
  store.set(a, remember);
  $('#loginView').hidden = true; $('#appView').hidden = false; $('#barActions').hidden = false; $('#publishBar').hidden = false;
  $('#who').textContent = `${a.repo} · ${a.branch}`;
  renderAll(); updateDirty();
}
function normalize(d){
  d.products = Array.isArray(d.products) ? d.products : [];
  d.works = Array.isArray(d.works) ? d.works : [];
  d.photos = d.photos || {};
  d.pricing = d.pricing || { tiers: [{ min: 1, price: 0 }] };
  d.pricing.tiers = Array.isArray(d.pricing.tiers) ? d.pricing.tiers : [];
  d.scents = d.scents || { groups: [] };
  d.contacts = d.contacts || {};
  d.texts = d.texts || {}; d.texts.shopHero = d.texts.shopHero || {}; d.texts.b2bHero = d.texts.b2bHero || {};
}
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const repo = $('#l-repo').value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/$/, '');
  const branch = $('#l-branch').value.trim() || 'main', token = $('#l-token').value.trim();
  const err = $('#loginErr'); err.textContent = '';
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)){ err.textContent = 'Вкажіть репозиторій у форматі акаунт/назва.'; $('#l-repo').focus(); return; }
  if (token.length < 20){ err.textContent = 'Вставте GitHub-токен.'; $('#l-token').focus(); return; }
  const btn = $('#btnLogin'); btn.disabled = true; btn.textContent = 'Перевіряємо…';
  try { await login({ repo, branch, token }, $('#l-remember').checked); }
  catch (ex){ auth = null; err.textContent = ex.message; }
  finally { btn.disabled = false; btn.textContent = 'Увійти'; }
});
$('#btnLogout').addEventListener('click', () => {
  if (isDirty() && !confirm('Є неопубліковані зміни. Вийти без збереження?')) return;
  store.clear(); location.reload();
});

/* ---------- стан змін ---------- */
const isDirty = () => data && JSON.stringify(data) !== original;
function updateDirty(){
  const d = isDirty();
  $('#dirtyText').textContent = d ? 'Є неопубліковані зміни' : 'Змін немає. Усе опубліковано.';
  $('#publishBar').classList.toggle('dirty', d);
  $('#btnPublish').disabled = !d; $('#btnDiscard').disabled = !d;
}
function changed(){ updateDirty(); renderAll(); }
window.addEventListener('beforeunload', (e) => { if (isDirty()){ e.preventDefault(); e.returnValue = ''; } });
$('#btnDiscard').addEventListener('click', () => {
  if (!confirm('Скасувати всі неопубліковані зміни?')) return;
  data = JSON.parse(original); uploads.clear(); changed(); toast('Зміни скасовано');
});
$('#btnPublish').addEventListener('click', async () => {
  const problems = validateAll(); if (problems.length){ alert('Перед публікацією виправте:\n\n• ' + problems.join('\n• ')); return; }
  const btn = $('#btnPublish'); btn.disabled = true; btn.textContent = 'Публікуємо…'; document.body.classList.add('busy');
  try {
    await publish('Оновлення сайту з адмін-панелі');
    original = JSON.stringify(data);
    for (const [p, u] of uploads) if (!isUsed(p)) uploads.delete(p);
    updateDirty(); renderAll();
    toast('Опубліковано. Сайт оновиться приблизно за 1–2 хвилини.', 6000);
  } catch (ex){ alert('Не вдалося опублікувати.\n\n' + ex.message); updateDirty(); }
  finally { btn.textContent = 'Опублікувати на сайті'; document.body.classList.remove('busy'); updateDirty(); }
});
function validateAll(){
  const p = [];
  if (!data.products.some((x) => !x.hidden)) p.push('У магазині має бути хоча б один видимий товар.');
  const t = data.pricing.tiers;
  if (!t.length) p.push('Додайте хоча б один тариф ціни.');
  if (t.some((x) => !(x.min >= 1) || !(x.price >= 0))) p.push('У тарифах ціни кількість має бути від 1, а ціна — не від’ємна.');
  if (t.length && t[0].min !== 1) p.push('Перший тариф ціни має починатися з 1 шт.');
  if (!data.scents.groups.some((g) => g.items.length)) p.push('Залиште хоча б один аромат.');
  return p;
}

/* ---------- вкладки ---------- */
$('.tabs').addEventListener('click', (e) => { const b = e.target.closest('[role=tab]'); if (b) setTab(b.id.replace('tab-', '')); });
$('.tabs').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const all = $$('.tabs [role=tab]'), i = all.findIndex((b) => b.getAttribute('aria-selected') === 'true');
  const n = all[(i + (e.key === 'ArrowRight' ? 1 : -1) + all.length) % all.length]; setTab(n.id.replace('tab-', '')); n.focus();
});
function setTab(t){
  tab = t;
  $$('.tabs [role=tab]').forEach((b) => { const on = b.id === 'tab-' + t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
  $$('.pane').forEach((p) => { p.hidden = p.id !== 'pane-' + t; });
}
function renderAll(){ renderProducts(); renderWorks(); renderPhotos(); renderPrices(); renderScents(); renderTexts(); }

/* ---------- зображення ---------- */
const imgSrc = (path) => !path ? '' : uploads.has(path) ? uploads.get(path).preview : path;
/* щойно опубліковане фото з’являється на сайті через 1–2 хв — до того показуємо підпис замість «битої» картинки */
const thumb = (path, label) => path ? `<img src="${esc(imgSrc(path))}" alt="" onerror="this.outerHTML='<span>Фото оновлюється на сайті</span>'">` : esc(label || 'Без фото');
const slug = (s) => {
  const map = { а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'iu', я: 'ia', ы: 'y', э: 'e', ё: 'e', ъ: '' };
  return String(s || '').toLowerCase().split('').map((c) => map[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'item';
};
async function processImage(file, base){
  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) throw new Error('Підходять фото у форматі JPEG, PNG або WebP.');
  if (file.size > IMG_MAX_MB * 1048576) throw new Error(`Файл завеликий. Максимум — ${IMG_MAX_MB} МБ.`);
  let bmp; try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e){ throw new Error('Не вдалося прочитати фото. Спробуйте інший файл.'); }
  const k = Math.min(1, IMG_MAX_PX / Math.max(bmp.width, bmp.height)), w = Math.round(bmp.width * k), h = Math.round(bmp.height * k);
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bmp, 0, 0, w, h);
  let blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.86));
  let ext = 'webp';
  if (!blob || blob.type !== 'image/webp'){ blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.88)); ext = 'jpg'; }
  const preview = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
  const path = `${UPLOAD_DIR}/${slug(base)}-${Date.now().toString(36)}.${ext}`;
  uploads.set(path, { b64: String(preview).split(',')[1], preview });
  return { path, w: bmp.width, h: bmp.height, small: Math.min(bmp.width, bmp.height) < IMG_MIN_PX, kb: Math.round(blob.size / 1024) };
}
/* блок завантаження фото всередині форми редагування */
function uploaderHtml(id, path, label){
  return `<div class="uploader" data-uploader="${id}"><div class="pv">${thumb(path, 'Фото ще немає')}</div>
    <div style="display:grid;gap:8px"><span class="lbl" style="font-weight:600;font-size:14px">${esc(label)}</span>
      <label class="btn btn-ghost btn-sm file-btn">${path ? 'Замінити фото' : 'Завантажити фото'}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="${esc(label)}"></label>
      <input type="hidden" data-path value="${esc(path || '')}">
      <p class="hint">JPEG, PNG або WebP. Найкраще — квадратне фото від 1200 px. Фото стиснемо до ${IMG_MAX_PX} px автоматично.</p>
      <div data-note></div></div></div>`;
}
document.addEventListener('change', async (e) => {
  const inp = e.target.closest('[data-uploader] input[type=file]'); if (!inp || !inp.files[0]) return;
  const box = inp.closest('[data-uploader]'), note = $('[data-note]', box);
  note.innerHTML = '<p class="note">Обробляємо фото…</p>';
  try {
    const base = box.dataset.direct || ($('#e-title') && $('#e-title').value) || box.dataset.uploader;
    const r = await processImage(inp.files[0], base);
    $('[data-path]', box).value = r.path; $('.pv', box).innerHTML = `<img src="${esc(uploads.get(r.path).preview)}" alt="">`;
    note.innerHTML = r.small ? `<p class="note warn">Фото невелике (${r.w}×${r.h} px) — на сайті може виглядати нечітко.</p>` : `<p class="note ok">Фото готове (${r.w}×${r.h} px, ${r.kb} КБ після стиснення).</p>`;
    if (box.dataset.direct) applyDirectPhoto(box.dataset.direct, r.path);
  } catch (ex){ note.innerHTML = `<p class="note bad">${esc(ex.message)}</p>`; }
  inp.value = '';
});

/* ---------- діалог редагування ---------- */
const dlg = $('#editDlg');
let onSave = null;
function openEditor(title, html, save){
  $('#h-edit').textContent = title; $('#editBody').innerHTML = html; $('#editErr').textContent = ''; onSave = save;
  dlg.showModal(); const f = $('#editBody input, #editBody textarea'); if (f) f.focus();
}
$$('#editDlg [data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
$('#editForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = onSave && onSave(); if (msg){ $('#editErr').textContent = msg; return; }
  dlg.close(); changed();
});
const val = (id) => ($('#' + id) ? $('#' + id).value.trim() : '');
const opts = (list, sel) => list.map(([v, l]) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('');
const uniqId = (list, base) => { let id = slug(base), n = 2; while (list.some((x) => x.id === id)) id = `${slug(base)}-${n++}`; return id; };

/* ---------- товари ---------- */
function renderProducts(){
  const L = data.products;
  $('#pane-products').innerHTML = `<div class="pane-head"><div><h2>Товари магазину</h2><p class="muted">Порядок тут — це порядок у каталозі. Приховані товари не показуються на сайті, але їх можна повернути.</p></div>
    <button type="button" class="btn btn-cta" data-act="p-add">+ Додати товар</button></div>
    <ul class="list">${L.map((p, i) => `<li class="row${p.hidden ? ' is-hidden' : ''}">
      <div class="thumb">${p.image ? thumb(p.image) : esc('Квітковий дизайн')}</div>
      <div><b>${esc(p.title)}${p.hidden ? '<span class="badge">приховано</span>' : ''}${p.image && uploads.has(p.image) ? '<span class="badge new">нове фото</span>' : ''}</b>
        <small>${esc((p.cats || []).map((c) => (SHOP_CATS.find((x) => x[0] === c) || [, c])[1]).join(' · ') || 'Без категорії')}${p.image ? '' : ' · ' + esc(tplName(p.tpl))}</small></div>
      <div class="row-actions">
        <button type="button" class="icon-btn" data-act="p-up" data-i="${i}" aria-label="Вище: ${esc(p.title)}"${i ? '' : ' disabled'}>↑</button>
        <button type="button" class="icon-btn" data-act="p-down" data-i="${i}" aria-label="Нижче: ${esc(p.title)}"${i < L.length - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" class="btn btn-ghost btn-sm" data-act="p-edit" data-i="${i}">Редагувати</button>
        <button type="button" class="btn btn-ghost btn-sm" data-act="p-hide" data-i="${i}">${p.hidden ? 'Показати' : 'Сховати'}</button>
        <button type="button" class="btn btn-danger btn-sm" data-act="p-del" data-i="${i}">Видалити</button>
      </div></li>`).join('')}</ul>`;
}
const tplName = (id) => (tpls.all.find((t) => t.id === id) || { name: id || '—' }).name;
function productForm(p){
  const isPhoto = !!p.image || !p.tpl;
  return `<div class="field"><label for="e-title">Назва *</label><input id="e-title" value="${esc(p.title || '')}" maxlength="80"></div>
    <div class="field"><label for="e-desc">Опис</label><textarea id="e-desc" maxlength="300">${esc(p.desc || '')}</textarea><p class="hint">1–2 речення: що зображено на свічці.</p></div>
    <div class="field"><span class="lbl">Категорії</span><div class="checks">${SHOP_CATS.map(([v, l]) => `<label class="check"><input type="checkbox" name="e-cat" value="${v}"${(p.cats || []).includes(v) ? ' checked' : ''}> ${l}</label>`).join('')}</div></div>
    <div class="field"><span class="lbl">Зображення</span><div class="checks">
      <label class="check"><input type="radio" name="e-kind" value="photo"${isPhoto ? ' checked' : ''}> Фото</label>
      ${tpls.floral.length ? `<label class="check"><input type="radio" name="e-kind" value="tpl"${isPhoto ? '' : ' checked'}> Квітковий дизайн на склянці</label>` : ''}</div></div>
    <div data-kind="photo"${isPhoto ? '' : ' hidden'} style="display:grid;gap:14px">
      ${uploaderHtml('product', p.image, 'Фото товару')}
      <div class="grid2"><div class="field"><label for="e-glass">Склянка на фото</label><select id="e-glass">${opts(GLASS, p.glass || 'clear')}</select></div>
      <div class="field"><label for="e-alt">Опис фото для незрячих</label><input id="e-alt" value="${esc(p.alt || '')}" maxlength="200" placeholder="Що видно на фото"></div></div>
    </div>
    <div data-kind="tpl"${isPhoto ? ' hidden' : ''}><div class="field"><label for="e-tpl">Квітковий дизайн</label><select id="e-tpl">${opts(tpls.floral.map((t) => [t.id, t.name]), p.tpl)}</select><p class="hint">Малюнок з конструктора на склянці сайту. Колір склянки задано в дизайні.</p></div></div>`;
}
document.addEventListener('change', (e) => {
  const r = e.target.closest('input[name=e-kind]'); if (!r) return;
  $$('[data-kind]').forEach((x) => { x.hidden = x.dataset.kind !== r.value; });
});
function editProduct(i){
  const isNew = i < 0, p = isNew ? { cats: [], glass: 'clear' } : data.products[i];
  openEditor(isNew ? 'Новий товар' : `Редагувати: ${p.title}`, productForm(p), () => {
    const title = val('e-title'); if (title.length < 2) return 'Вкажіть назву товару.';
    const kind = ($('input[name=e-kind]:checked') || {}).value || 'photo';
    const out = Object.assign({}, p, { title, desc: val('e-desc'), cats: $$('input[name=e-cat]:checked').map((x) => x.value) });
    if (kind === 'photo'){
      const img = $('[data-uploader=product] [data-path]').value; if (!img) return 'Завантажте фото товару.';
      Object.assign(out, { image: img, glass: val('e-glass') || 'clear', alt: val('e-alt') || title }); delete out.tpl;
    } else { out.tpl = val('e-tpl'); delete out.image; delete out.alt; delete out.photo; }
    if (isNew){ out.id = uniqId(data.products, title); data.products.push(out); } else data.products[i] = out;
  });
}

/* ---------- приклади робіт ---------- */
function renderWorks(){
  const L = data.works;
  $('#pane-works').innerHTML = `<div class="pane-head"><div><h2>Приклади робіт (B2B)</h2><p class="muted">Фото готових свічок з персональним чи корпоративним дизайном. Якщо обрати схожий шаблон, під фото з’явиться кнопка «Створити на основі цього дизайну».</p></div>
    <button type="button" class="btn btn-cta" data-act="w-add">+ Додати приклад</button></div>
    <ul class="list">${L.map((w, i) => `<li class="row${w.hidden ? ' is-hidden' : ''}">
      <div class="thumb">${thumb(w.image)}</div>
      <div><b>${esc(w.title)}${w.hidden ? '<span class="badge">приховано</span>' : ''}${uploads.has(w.image) ? '<span class="badge new">нове фото</span>' : ''}</b><small>${esc((WORK_CATS.find((x) => x[0] === w.cat) || [, '—'])[1])}${w.tpl ? ' · шаблон «' + esc(tplName(w.tpl)) + '»' : ''}</small></div>
      <div class="row-actions">
        <button type="button" class="icon-btn" data-act="w-up" data-i="${i}" aria-label="Вище: ${esc(w.title)}"${i ? '' : ' disabled'}>↑</button>
        <button type="button" class="icon-btn" data-act="w-down" data-i="${i}" aria-label="Нижче: ${esc(w.title)}"${i < L.length - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" class="btn btn-ghost btn-sm" data-act="w-edit" data-i="${i}">Редагувати</button>
        <button type="button" class="btn btn-ghost btn-sm" data-act="w-hide" data-i="${i}">${w.hidden ? 'Показати' : 'Сховати'}</button>
        <button type="button" class="btn btn-danger btn-sm" data-act="w-del" data-i="${i}">Видалити</button>
      </div></li>`).join('')}</ul>`;
}
function editWork(i){
  const isNew = i < 0, w = isNew ? { cat: 'gift', glass: 'clear' } : data.works[i];
  const glassOpts = GLASS.concat([['custom', 'Інший колір (під замовлення)']]);
  openEditor(isNew ? 'Новий приклад роботи' : `Редагувати: ${w.title}`, `
    <div class="field"><label for="e-title">Назва *</label><input id="e-title" value="${esc(w.title || '')}" maxlength="80"></div>
    <div class="field"><label for="e-note">Короткий опис</label><input id="e-note" value="${esc(w.note || '')}" maxlength="160" placeholder="Наприклад: Весільний вінок, імена й дата"></div>
    <div class="grid2"><div class="field"><label for="e-cat">Категорія</label><select id="e-cat">${opts(WORK_CATS, w.cat)}</select></div>
      <div class="field"><label for="e-glass">Склянка</label><select id="e-glass">${opts(glassOpts, w.glass || 'clear')}</select></div></div>
    <div class="field"><label for="e-custom">Опис кольору склянки <span class="hint">(для «Інший колір»)</span></label><input id="e-custom" value="${esc(w.customDesc || '')}" maxlength="120"></div>
    ${uploaderHtml('work', w.image, 'Фото прикладу')}
    <div class="field"><label for="e-alt">Опис фото для незрячих</label><input id="e-alt" value="${esc(w.alt || '')}" maxlength="200"></div>
    <div class="field"><label for="e-tpl">Схожий шаблон у конструкторі</label><select id="e-tpl"><option value="">Немає — показати кнопку «Обговорити такий дизайн»</option>${opts(tpls.all.map((t) => [t.id, t.name]), w.tpl)}</select></div>`, () => {
    const title = val('e-title'); if (title.length < 2) return 'Вкажіть назву.';
    const image = $('[data-uploader=work] [data-path]').value; if (!image) return 'Завантажте фото прикладу.';
    const out = Object.assign({}, w, { title, note: val('e-note'), cat: val('e-cat'), glass: val('e-glass'), image, alt: val('e-alt') || title, tpl: val('e-tpl') || undefined });
    if (out.glass === 'custom') out.customDesc = val('e-custom') || 'Колір склянки під замовлення'; else { delete out.customDesc; delete out.customHex; }
    if (!out.tpl) delete out.tpl; delete out.photo;
    if (isNew){ out.id = uniqId(data.works, title); data.works.push(out); } else data.works[i] = out;
  });
}

/* ---------- кнопки списків ---------- */
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, i = Number(b.dataset.i);
  const list = act[0] === 'p' ? data.products : act[0] === 'w' ? data.works : null;
  const move = (d) => { const j = i + d; [list[i], list[j]] = [list[j], list[i]]; changed(); };
  switch (act){
    case 'p-add': return editProduct(-1);
    case 'w-add': return editWork(-1);
    case 'p-edit': return editProduct(i);
    case 'w-edit': return editWork(i);
    case 'p-up': case 'w-up': return move(-1);
    case 'p-down': case 'w-down': return move(1);
    case 'p-hide': case 'w-hide': list[i].hidden = !list[i].hidden; if (!list[i].hidden) delete list[i].hidden; return changed();
    case 'p-del': case 'w-del': if (confirm(`Видалити «${list[i].title}»? Після публікації позиція зникне з сайту.`)){ list.splice(i, 1); changed(); } return;
    case 'tier-add': data.pricing.tiers.push({ min: (data.pricing.tiers.slice(-1)[0] || { min: 0 }).min + 1, price: 0 }); return changed();
    case 'tier-del': data.pricing.tiers.splice(i, 1); return changed();
    case 'g-add': data.scents.groups.push({ id: uniqId(data.scents.groups, 'group'), name: 'Нова група', items: [] }); return changed();
    case 'g-del': { const g = data.scents.groups[i]; if (confirm(`Видалити групу «${g.name}» разом з ароматами?`)){ data.scents.groups.splice(i, 1); changed(); } return; }
    case 'g-up': case 'g-down': { const L = data.scents.groups, j = i + (act === 'g-up' ? -1 : 1); [L[i], L[j]] = [L[j], L[i]]; return changed(); }
    case 's-add': { const g = data.scents.groups[i]; g.items.push({ id: uniqId(allScentItems(), 'aromat'), name: '', desc: '', available: true }); changed(); setTimeout(() => { const ins = $$(`[data-g="${i}"][data-f="name"]`); ins[ins.length - 1]?.focus(); }, 0); return; }
    case 's-del': { const g = data.scents.groups[i]; g.items.splice(Number(b.dataset.j), 1); return changed(); }
  }
});

/* ---------- фото сайту ---------- */
const PHOTO_SLOTS = [
  ['shopHero', 'Головне фото магазину', 'Перший екран головної сторінки'],
  ['b2bHero', 'Головне фото B2B', 'Перший екран розділу «B2B кастомізація»'],
  ['teaser', 'Фото блоку «Свічки з вашим логотипом»', 'Темний блок на головній, що веде в B2B'],
  ['business', 'Фото блоку «Свічки з вашим брендом»', 'Блок про партії в розділі B2B']
];
function renderPhotos(){
  $('#pane-photos').innerHTML = `<div class="pane-head"><div><h2>Фото сайту</h2><p class="muted">Фото товарів і прикладів робіт змінюються у своїх вкладках.</p></div></div>
    <div class="photo-slots">${PHOTO_SLOTS.map(([k, t, h]) => `<div class="slot"><div class="pv">${thumb(data.photos[k], 'Фото не задано')}</div>
      <div><b>${esc(t)}</b>${uploads.has(data.photos[k]) ? '<span class="badge new">нове</span>' : ''}<p class="hint">${esc(h)}</p></div>
      <div data-uploader="slot-${k}" data-direct="${k}"><label class="btn btn-ghost btn-sm file-btn">Замінити фото<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Замінити: ${esc(t)}"></label><input type="hidden" data-path><div class="pv" hidden></div><div data-note></div></div>
    </div>`).join('')}</div>`;
}
function applyDirectPhoto(key, path){ data.photos[key] = path; changed(); toast('Фото замінено. Не забудьте опублікувати.'); }

/* ---------- ціни ---------- */
function renderPrices(){
  const P = data.pricing;
  $('#pane-prices').innerHTML = `<div class="pane-head"><div><h2>Ціни</h2><p class="muted">Ціна за свічку залежить від кількості: у магазині — від загальної кількості в кошику, у B2B — від тиражу. Аромат і ґніт — без доплати.</p></div></div>
    <div class="section"><table class="tiers"><thead><tr><th scope="col">Від, шт</th><th scope="col">Ціна за свічку, грн</th><th></th></tr></thead><tbody>
      ${P.tiers.map((t, i) => `<tr><td><input type="number" min="1" step="1" value="${t.min}" data-tier="${i}" data-f="min" aria-label="Тариф ${i + 1}: від скількох штук"${i === 0 ? ' readonly' : ''}></td>
        <td><input type="number" min="0" step="1" value="${t.price}" data-tier="${i}" data-f="price" aria-label="Тариф ${i + 1}: ціна за свічку"></td>
        <td>${i ? `<button type="button" class="icon-btn" data-act="tier-del" data-i="${i}" aria-label="Видалити тариф ${i + 1}">✕</button>` : ''}</td></tr>`).join('')}
    </tbody></table>
    <div><button type="button" class="btn btn-ghost btn-sm" data-act="tier-add">+ Додати тариф</button></div>
    <div class="grid2"><div class="field"><label for="p-quote">Індивідуальний розрахунок від, шт</label><input type="number" min="2" step="1" id="p-quote" value="${P.quoteFromQty || ''}" placeholder="Порожньо — без обмеження"></div></div>
    <label class="check"><input type="checkbox" id="p-approved"${P.approved ? ' checked' : ''}> Ціни підтверджені — прибрати позначку «орієнтовно»</label>
    <div class="field"><label for="p-note">Примітка до цін</label><textarea id="p-note" maxlength="300">${esc(P.note || '')}</textarea><p class="hint">Показується під цінами, поки ціни не позначені як підтверджені.</p></div></div>`;
}
document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset.tier !== undefined){ const row = data.pricing.tiers[+t.dataset.tier]; row[t.dataset.f] = t.value === '' ? 0 : Math.max(0, Math.round(+t.value)); updateDirty(); return; }
  if (t.id === 'p-quote'){ data.pricing.quoteFromQty = t.value ? Math.max(2, Math.round(+t.value)) : null; updateDirty(); return; }
  if (t.id === 'p-note'){ data.pricing.note = t.value; updateDirty(); return; }
  if (t.dataset.g !== undefined){
    const g = data.scents.groups[+t.dataset.g];
    if (t.dataset.f === 'gname') g.name = t.value;
    else { const it = g.items[+t.dataset.j]; if (t.dataset.f === 'available') it.available = t.checked; else it[t.dataset.f] = t.value; }
    updateDirty(); return;
  }
  if (t.dataset.text){ const [sec, k] = t.dataset.text.split('.'); if (sec === 'contacts') data.contacts[k] = t.value.trim() || null; else data.texts[sec][k] = t.value; updateDirty(); }
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.id === 'p-approved'){ data.pricing.approved = t.checked; updateDirty(); }
  if (t.dataset.tier !== undefined) data.pricing.tiers.sort((a, b) => a.min - b.min), renderPrices();
  if (t.dataset.f === 'available'){ const it = data.scents.groups[+t.dataset.g].items[+t.dataset.j]; it.available = t.checked; updateDirty(); }
  if (t.id === 't-demo'){ data.showDemoNotice = t.checked; updateDirty(); }
  if (t.dataset.text && t.tagName === 'SELECT'){ const [sec, k] = t.dataset.text.split('.'); data.texts[sec][k] = t.value || null; updateDirty(); }
});

/* ---------- аромати ---------- */
const allScentItems = () => data.scents.groups.flatMap((g) => g.items);
function renderScents(){
  const G = data.scents.groups;
  $('#pane-scents').innerHTML = `<div class="pane-head"><div><h2>Аромати</h2><p class="muted">Покупець обирає один аромат або «Без аромату». Зніміть позначку «є», щоб тимчасово прибрати аромат з вибору.</p></div>
    <button type="button" class="btn btn-cta" data-act="g-add">+ Додати групу</button></div>
    ${G.map((g, i) => `<div class="group"><div class="group-head"><input value="${esc(g.name)}" data-g="${i}" data-f="gname" aria-label="Назва групи ${i + 1}">
        <button type="button" class="icon-btn" data-act="g-up" data-i="${i}" aria-label="Групу вище"${i ? '' : ' disabled'}>↑</button>
        <button type="button" class="icon-btn" data-act="g-down" data-i="${i}" aria-label="Групу нижче"${i < G.length - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" class="btn btn-danger btn-sm" data-act="g-del" data-i="${i}">Видалити групу</button></div>
      ${g.items.map((it, j) => `<div class="scent-row">
        <input value="${esc(it.name)}" data-g="${i}" data-j="${j}" data-f="name" aria-label="Назва аромату" placeholder="Назва">
        <input value="${esc(it.desc || '')}" data-g="${i}" data-j="${j}" data-f="desc" aria-label="Опис аромату «${esc(it.name)}»" placeholder="Короткий опис">
        <label class="check"><input type="checkbox" data-g="${i}" data-j="${j}" data-f="available"${it.available !== false ? ' checked' : ''}> є</label>
        <button type="button" class="icon-btn" data-act="s-del" data-i="${i}" data-j="${j}" aria-label="Видалити аромат «${esc(it.name)}»">✕</button></div>`).join('')}
      <div><button type="button" class="btn btn-ghost btn-sm" data-act="s-add" data-i="${i}">+ Аромат</button></div></div>`).join('')}`;
}

/* ---------- контакти й тексти ---------- */
function renderTexts(){
  const C = data.contacts, S = data.texts.shopHero, B = data.texts.b2bHero;
  const f = (sec, k, label, v, area, ph) => `<div class="field"><label for="t-${sec}-${k}">${esc(label)}</label>${area ? `<textarea id="t-${sec}-${k}" data-text="${sec}.${k}" maxlength="400">${esc(v || '')}</textarea>` : `<input id="t-${sec}-${k}" data-text="${sec}.${k}" value="${esc(v || '')}" maxlength="160"${ph ? ` placeholder="${esc(ph)}"` : ''}>`}</div>`;
  $('#pane-texts').innerHTML = `<div class="pane-head"><div><h2>Контакти й тексти</h2><p class="muted">Порожнє поле — на сайті лишається поточний текст.</p></div></div>
    <div class="section"><h3>Контакти</h3><p class="hint">Показуються внизу сайту й у повідомленні після замовлення.</p>
      <div class="grid2">${f('contacts', 'phone', 'Телефон', C.phone, false, '+380 …')}${f('contacts', 'email', 'Email', C.email)}</div>${f('contacts', 'instagram', 'Instagram', C.instagram, false, '@…')}
      <label class="check"><input type="checkbox" id="t-demo"${data.showDemoNotice ? ' checked' : ''}> Показувати в конструкторі плашку «Демоверсія» (поки розміри склянки й зони друку тимчасові)</label></div>
    <div class="section"><h3>Головна (магазин)</h3>
      ${f('shopHero', 'kicker', 'Надзаголовок', S.kicker)}${f('shopHero', 'title', 'Заголовок', S.title)}${f('shopHero', 'lead', 'Опис під заголовком', S.lead, true)}
      <div class="grid2">${f('shopHero', 'photoTitle', 'Підпис до фото: назва', S.photoTitle)}${f('shopHero', 'photoText', 'Підпис до фото: текст', S.photoText)}</div>
      <div class="field"><label for="t-shop-prod">Кнопка під фото відкриває товар</label><select id="t-shop-prod" data-text="shopHero.photoProduct"><option value="">Без кнопки</option>${opts(data.products.map((p) => [p.id, p.title]), S.photoProduct)}</select></div></div>
    <div class="section"><h3>B2B кастомізація</h3>
      ${f('b2bHero', 'kicker', 'Надзаголовок', B.kicker)}${f('b2bHero', 'title', 'Заголовок', B.title)}${f('b2bHero', 'lead', 'Опис під заголовком', B.lead, true)}
      <div class="grid2">${f('b2bHero', 'photoTitle', 'Підпис до фото: назва', B.photoTitle)}${f('b2bHero', 'photoText', 'Підпис до фото: текст', B.photoText)}</div>
      <div class="field"><label for="t-b2b-tpl">Кнопка під фото відкриває шаблон</label><select id="t-b2b-tpl" data-text="b2bHero.photoTemplate"><option value="">Без кнопки</option>${opts(tpls.all.map((t) => [t.id, t.name]), B.photoTemplate)}</select></div></div>`;
}

/* ---------- повідомлення ---------- */
let toastT = 0;
function toast(t, ms = 3200){ const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms); }

/* ---------- старт ---------- */
(async () => {
  const saved = store.get();
  $('#l-repo').value = (saved && saved.repo) || DEFAULT_REPO;
  $('#l-branch').value = (saved && saved.branch) || 'main';
  if (saved && saved.token){
    $('#l-remember').checked = !!localStorage.getItem('rdk-admin');
    try { await login(saved, $('#l-remember').checked); } catch (e){ $('#loginErr').textContent = e.message; }
  }
})();
