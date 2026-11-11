// Comportamento comum às três páginas: cabeçalho, menu, âncoras, revelações,
// "aberto agora" e o mapa que só carrega quando a pessoa pede.
// Sem biblioteca de animação: IntersectionObserver + transições CSS (ver "Movimento" no main.css).
import '@fontsource-variable/vollkorn/wght.css'
import '@fontsource-variable/vollkorn/wght-italic.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '../styles/main.css'

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initCore() {
  initHeader()
  initMenu()
  initStatus()
  initMaps()
  initAnchors()
}

const headerOffset = () => (document.querySelector('[data-header]')?.offsetHeight || 72) + 8

export function scrollToEl(el, offset = headerOffset()) {
  const y = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' })
}

// Marca como ativo o elemento que cruza a faixa do meio da tela.
export function spy(elements, onActive) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && onActive(e.target)),
    { rootMargin: '-45% 0px -54% 0px' },
  )
  elements.forEach((el) => io.observe(el))
  return io
}

// Âncoras da mesma página respeitam a altura do cabeçalho (e das ferramentas do cardápio).
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]')
    if (!a) return
    const url = new URL(a.href, location.href)
    if (url.pathname !== location.pathname || !url.hash) return
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (!el) return
    e.preventDefault()
    closeMenu()
    history.replaceState(null, '', url.hash)
    scrollToEl(el, el.dataset.cat !== undefined ? 150 : headerOffset())
  })
  // Chegando de outra página com âncora: corrige a posição depois do layout.
  if (location.hash) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el) window.addEventListener('load', () => setTimeout(() => scrollToEl(el), 80), { once: true })
  }
}

function initHeader() {
  const header = document.querySelector('[data-header]')
  const bar = document.querySelector('.mobile-bar')
  if (!header) return
  let last = window.scrollY
  const onScroll = () => {
    const y = window.scrollY
    const down = y > last + 4 && y > 320
    const up = y < last - 4
    header.classList.toggle('is-solid', y > 24)
    if (down) header.classList.add('is-hidden')
    else if (up || y <= 320) header.classList.remove('is-hidden')
    document.body.classList.toggle('hdr-visible', !header.classList.contains('is-hidden'))
    // A barra do celular some enquanto a pessoa preenche o formulário ou chega ao rodapé.
    if (bar) {
      const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 140
      bar.classList.toggle('is-away', nearEnd || Boolean(document.activeElement?.matches('input, textarea, select')))
    }
    last = y
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('focusin', onScroll)
  document.addEventListener('focusout', onScroll)
  onScroll()

  // Destaca no menu a seção em vista (só na home).
  const links = new Map()
  header.querySelectorAll('.main-nav a[href*="#"]').forEach((a) => {
    const sec = document.getElementById(a.getAttribute('href').split('#')[1])
    if (sec) links.set(sec, a)
  })
  if (links.size) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => links.get(e.target).classList.toggle('is-active', e.isIntersecting)),
      { rootMargin: '-45% 0px -54% 0px' },
    )
    links.forEach((_, sec) => io.observe(sec))
  }
}

let menuEl, openBtn, lastFocus
function initMenu() {
  menuEl = document.querySelector('[data-menu]')
  openBtn = document.querySelector('[data-menu-open]')
  if (!menuEl || !openBtn) return
  openBtn.addEventListener('click', openMenu)
  menuEl.addEventListener('click', (e) => {
    if (e.target === menuEl || e.target.closest('[data-menu-close]') || e.target.closest('a')) closeMenu()
  })
  document.addEventListener('keydown', (e) => {
    if (menuEl.hidden) return
    if (e.key === 'Escape') closeMenu()
    if (e.key === 'Tab') {
      const f = [...menuEl.querySelectorAll('a, button')]
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus() }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus() }
    }
  })
}
function openMenu() {
  lastFocus = document.activeElement
  menuEl.hidden = false
  openBtn.setAttribute('aria-expanded', 'true')
  document.documentElement.classList.add('menu-open')
  menuEl.querySelector('[data-menu-close]').focus()
}
function closeMenu() {
  if (!menuEl || menuEl.hidden) return
  menuEl.hidden = true
  openBtn.setAttribute('aria-expanded', 'false')
  document.documentElement.classList.remove('menu-open')
  lastFocus?.focus?.({ preventScroll: true })
}

// ---------- aberto agora (fuso de São Paulo) ----------

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export function nowInSaoPaulo(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  return { day: DAYS.indexOf(get('weekday')), hour: Number(get('hour')) % 24, minute: Number(get('minute')) }
}
const fmt = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`
export function statusFor(unit, { day, hour, minute }) {
  const today = unit.hours[day]
  const t = hour + minute / 60
  if (t >= today.open && t < today.close) return { open: true, text: `Aberto agora, até ${fmt(today.close)}` }
  if (t < today.open) return { open: false, text: `Fechado, abre às ${fmt(today.open)}` }
  return { open: false, text: `Fechado, abre amanhã às ${fmt(unit.hours[(day + 1) % 7].open)}` }
}
function initStatus() {
  // Horários confirmados, gerados no build (ver hoursData em src/render.js).
  const units = JSON.parse(document.getElementById('hours-data')?.textContent || '[]')
  const update = () => {
    const now = nowInSaoPaulo()
    units.forEach((u) => {
      const s = statusFor(u, now)
      document.querySelectorAll(`[data-status="${u.id}"]`).forEach((n) => {
        n.dataset.open = String(s.open)
        n.querySelector('[data-status-text]').textContent = s.text
      })
      document.querySelectorAll(`[data-hours="${u.id}"] tr[data-day]`).forEach((r) => {
        if (Number(r.dataset.day) === now.day) r.dataset.today = 'true'
        else r.removeAttribute('data-today')
      })
    })
  }
  update()
  setInterval(update, 60_000)
}

function initMaps() {
  document.querySelectorAll('[data-map]').forEach((slot) => {
    slot.querySelector('.map-load')?.addEventListener('click', () => {
      const { lat, lng, label } = slot.dataset
      const f = document.createElement('iframe')
      f.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=pt-BR&output=embed`
      f.title = `Mapa da ${label}`
      f.loading = 'lazy'
      f.referrerPolicy = 'no-referrer-when-downgrade'
      slot.replaceChildren(f)
    })
  })
}

// ---------- movimento ----------

// Textos marcados com data-reveal sobem e aparecem; fotos com data-clip se abrem de baixo
// para cima. O estado inicial só existe sob .js-motion, então sem JS (ou com movimento
// reduzido) tudo já nasce visível.
export function initReveals(root = document) {
  if (reduced) return
  document.documentElement.classList.add('js-motion')
  const els = [...root.querySelectorAll('[data-reveal], [data-clip], [data-hero], [data-hero-photo]')]
  // Escalona irmãos que entram juntos.
  const seen = new Map()
  els.forEach((el) => {
    const k = el.parentElement
    const n = seen.get(k) || 0
    seen.set(k, n + 1)
    el.style.setProperty('--d', `${Math.min(n, 5) * 80}ms`)
  })
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('is-in')
      io.unobserve(e.target)
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  )
  // Um quadro de espera garante que o estado inicial foi pintado antes da transição.
  requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => io.observe(el))))

  // Paralaxe discreta: o elemento desliza poucos por cento enquanto atravessa a tela.
  const par = [...root.querySelectorAll('[data-parallax]')].map((el) => ({ el, amt: Number(el.dataset.parallax) || 6, host: el.parentElement }))
  if (!par.length) return
  let ticking = false
  const run = () => {
    ticking = false
    const vh = window.innerHeight
    par.forEach(({ el, amt, host }) => {
      const r = host.getBoundingClientRect()
      if (r.bottom < -100 || r.top > vh + 100) return
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
      el.style.transform = `translate3d(0, ${(-p * amt) / 2}%, 0)`
    })
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run) } }, { passive: true })
  run()
}

// Se algo falhar no JS, nada pode ficar invisível.
window.addEventListener('error', () => document.documentElement.classList.remove('js-motion'))
