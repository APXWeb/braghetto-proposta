// Página inicial.
import { initCore, initReveals, reduced, spy } from './js/common.js'

initCore()
initReveals()
initShowcase()
initTimeline()

// Vitrine de categorias: a foto fixa acompanha a categoria em foco (mouse, teclado ou rolagem).
function initShowcase() {
  const items = [...document.querySelectorAll('[data-pc]')]
  const frames = [...document.querySelectorAll('[data-pc-frame]')]
  if (!items.length) return
  let current = -1
  const show = (i) => {
    if (i === current) return
    current = i
    frames.forEach((f, k) => f.classList.toggle('is-on', k === i))
    items.forEach((it, k) => it.classList.toggle('is-on', k === i))
  }
  show(0)
  items.forEach((it, i) => {
    it.addEventListener('mouseenter', () => show(i))
    it.addEventListener('focusin', () => show(i))
  })
  // Na rolagem, a categoria que cruza o meio da tela assume a foto.
  spy(items, (el) => show(items.indexOf(el)))
}

// Linha do tempo: o fio dourado se preenche conforme a pessoa desce pela história.
function initTimeline() {
  const tl = document.querySelector('[data-tl]')
  const fill = document.querySelector('[data-tl-fill]')
  if (!tl || !fill) return
  if (reduced) { fill.style.transform = 'scaleY(1)'; return }
  let ticking = false
  const run = () => {
    ticking = false
    const r = tl.getBoundingClientRect()
    const p = (window.innerHeight * 0.7 - r.top) / r.height
    fill.style.transform = `scaleY(${Math.max(0, Math.min(1, p))})`
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run) } }, { passive: true })
  run()
}
