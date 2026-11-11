// Página do cardápio: busca, navegação por categorias e a folha de cada item.
import { initCore, initReveals, scrollToEl, spy } from './js/common.js'
import { site } from './data/site.js'

initCore()
initReveals()

const units = JSON.parse(document.getElementById('units-data').textContent)
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// ---------- navegação por categoria ----------
const links = [...document.querySelectorAll('[data-cat-link]')]
const nav = document.querySelector('.cat-nav')
const setActive = (id) => {
  links.forEach((a) => {
    const on = a.dataset.catLink === id
    a.classList.toggle('is-active', on)
    if (on) {
      a.setAttribute('aria-current', 'true')
      // Mantém o chip ativo visível na faixa rolável, sem mexer na rolagem da página.
      const r = a.getBoundingClientRect(), n = nav.getBoundingClientRect()
      if (r.left < n.left || r.right > n.right) nav.scrollTo({ left: nav.scrollLeft + r.left - n.left - 24, behavior: 'smooth' })
    } else a.removeAttribute('aria-current')
  })
}
spy([...document.querySelectorAll('[data-cat]')], (sec) => setActive(sec.id))
setActive(links[0]?.dataset.catLink)

// ---------- busca ----------
const input = document.querySelector('[data-search]')
const clear = document.querySelector('[data-search-clear]')
const status = document.querySelector('[data-search-status]')
const empty = document.querySelector('[data-search-empty]')
const items = [...document.querySelectorAll('[data-item]')].map((li) => {
  const nameEl = li.querySelector('.mi-name')
  return { li, nameEl, name: li.dataset.name, key: norm(li.dataset.name), group: li.closest('[data-group]'), cat: li.closest('[data-cat]') }
})

// Destaca o trecho buscado preservando acentos do nome original.
function highlight(name, q) {
  const k = norm(name)
  const i = k.indexOf(q)
  if (i < 0 || !q) return esc(name)
  return esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length))
}

let timer
function runSearch() {
  const raw = input.value
  const q = norm(raw)
  clear.hidden = !raw
  let n = 0
  items.forEach((it) => {
    const hit = !q || q.split(/\s+/).every((w) => it.key.includes(w))
    it.li.hidden = !hit
    it.nameEl.innerHTML = hit && q ? highlight(it.name, q.split(/\s+/)[0]) : esc(it.name)
    if (hit) n++
  })
  document.querySelectorAll('[data-group]').forEach((g) => (g.hidden = !g.querySelector('[data-item]:not([hidden])')))
  document.querySelectorAll('[data-cat]').forEach((c) => (c.hidden = c.hasAttribute('data-info') ? Boolean(q) : !c.querySelector('[data-item]:not([hidden])')))
  document.querySelector('.menu-note').hidden = Boolean(q) && n === 0
  if (!q) status.textContent = ''
  else status.textContent = n ? `${n} ${n === 1 ? 'item encontrado' : 'itens encontrados'} para “${raw.trim()}”.` : ''
  empty.hidden = !q || n > 0
  if (q && !n) {
    empty.querySelector('[data-search-term]').textContent = `“${raw.trim()}”`
    empty.querySelector('[data-empty-actions]').innerHTML = units
      .map((u) =>
        u.order
          ? `<a class="btn btn-ghost" href="${u.order}" target="_blank" rel="noopener">Cardápio online · ${u.name.replace('Unidade ', '')}</a>`
          : `<a class="btn btn-ghost" href="${u.tel}">Ligar ${u.name.replace('Unidade ', '')} ${u.phone}</a>`,
      )
      .join('')
  }
}
input.addEventListener('input', () => {
  clearTimeout(timer)
  timer = setTimeout(runSearch, 120)
})
input.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && input.value) { input.value = ''; runSearch() }
  if (e.key === 'Enter') {
    e.preventDefault()
    const first = items.find((it) => !it.li.hidden)
    if (first && input.value) scrollToEl(first.li, 200)
  }
})
clear.addEventListener('click', () => { input.value = ''; runSearch(); input.focus() })
// ?q=... abre a página já buscando.
const q0 = new URLSearchParams(location.search).get('q')
if (q0) { input.value = q0; runSearch() }

// ---------- folha do item ----------
const sheet = document.querySelector('[data-sheet]')
const sTitle = sheet.querySelector('[data-sheet-title]')
const sCat = sheet.querySelector('[data-sheet-cat]')
const sText = sheet.querySelector('[data-sheet-text]')
const sActs = sheet.querySelector('[data-sheet-actions]')
const sPhoto = sheet.querySelector('[data-sheet-photo]')
const sOrder = sheet.querySelector('[data-sheet-order]')

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-item-btn]')
  if (!btn) return
  const li = btn.closest('[data-item]')
  const name = li.dataset.name
  const cat = li.closest('[data-cat]').querySelector('.cat-title').textContent
  const group = li.closest('[data-group]').querySelector('.mg-title').textContent
  sTitle.textContent = name
  sCat.textContent = `${cat} · ${group}`
  const pic = li.querySelector('picture')
  sPhoto.hidden = !pic
  sPhoto.replaceChildren(...(pic ? [pic.cloneNode(true)] : []))
  sPhoto.querySelector('img')?.setAttribute('sizes', '460px')
  const arrow = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M10 8h6v6"/></svg>'
  const online = li.hasAttribute('data-online')
  sText.textContent = online
    ? 'Veja as opções e os valores do dia no cardápio online da unidade que você preferir.'
    : 'Veja se tem hoje e faça o pedido no cardápio online da unidade que você preferir (G3Food).'
  sActs.innerHTML = units
    .map((u, i) => `<a class="btn ${i ? 'btn-ghost' : 'btn-solid'}" href="${u.order}" target="_blank" rel="noopener"><span>${u.name}<small>Cardápio online · retirada ou entrega</small></span>${arrow}</a>`)
    .join('')
  sOrder.hidden = online
  if (!online) sOrder.href = `./encomendas.html?item=${encodeURIComponent(name)}#pedido`
  sheet.showModal()
})
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close() })
