// HTML gerado no build a partir de src/data/*. O vite.config.js troca cada {{chave}} das
// páginas por estes blocos, então o site publicado é HTML estático e cada fato vive num só lugar.
import images from './data/images.json' with { type: 'json' }
import { site, units, timeline, photoCredits, waLink, telLink } from './data/site.js'
import { categories, asItem, itemCount } from './data/cardapio.js'

// Enquanto for proposta, o site não deve ser indexado. Na publicação oficial, troque para false.
export const PROPOSAL = true

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const ext = 'target="_blank" rel="noopener"'

export function picture(name, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
  const m = images[name]
  if (!m) throw new Error(`Imagem desconhecida: ${name}`)
  const set = (e) => m.sizes.map((w) => `/img/${name}-${w}.${e} ${w}w`).join(', ')
  const fb = m.sizes.find((w) => w >= 1000) ?? m.sizes.at(-1)
  return (
    `<picture${cls ? ` class="${cls}"` : ''}>` +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` +
    `<img src="/img/${name}-${fb}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ` +
    (eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"') +
    `></picture>`
  )
}

export const icon = {
  arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  out: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M10 8h6v6"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>',
  phone: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z"/></svg>',
  wa: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4A8 8 0 1 1 8.3 19z"/><path d="M9 8.8c0 3 2.6 6 5.8 6.2l1-1.3-1.8-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-1.8z"/></svg>',
  mail: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg>',
  insta: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" class="dot"/></svg>',
  fb: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z"/></svg>',
  route: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.6"/></svg>',
  bag: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  search: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>',
  close: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  menu: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  wheat: '<svg class="i wheat" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22V7"/><path d="M12 7c-1.6-1-1.6-3 0-4.5 1.6 1.5 1.6 3.5 0 4.5zM12 12c-2.3.3-3.8-1.1-4-3.3 2.2-.2 3.7 1.1 4 3.3zM12 12c2.3.3 3.8-1.1 4-3.3-2.2-.2-3.7 1.1-4 3.3zM12 16.5c-2.3.3-3.8-1.1-4-3.3 2.2-.2 3.7 1.1 4 3.3zM12 16.5c2.3.3 3.8-1.1 4-3.3-2.2-.2-3.7 1.1-4 3.3z"/></svg>',
}

const [anh] = units
const fullAddress = (u) => `${u.street} · ${u.district}, ${site.city} - ${site.state} · ${u.cep}`
const routeLink = (u) => `https://www.google.com/maps/dir/?api=1&destination=${u.geo.lat},${u.geo.lng}`

// ---------- partes comuns ----------

function header(page) {
  const home = page === 'index.html' ? '' : './'
  const nav = [
    ['Produtos', `${home}#produtos`],
    ['Almoço', `${home}#almoco`],
    ['Encomendas', './encomendas.html'],
    ['História', `${home}#historia`],
    ['Unidades', `${home}#unidades`],
  ]
  const cur = (href) => (page === 'encomendas.html' && href.includes('encomendas') ? ' aria-current="page"' : '')
  const links = nav.map(([t, h]) => `<li><a href="${h}"${cur(h)}>${t}</a></li>`).join('')
  return `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header" data-header>
  <div class="wrap header-row">
    <a class="brand" href="./" aria-label="Panificadora Braghetto, página inicial">
      <img src="/img/emblema.webp" width="44" height="44" alt="">
      <span class="brand-text"><span class="brand-name">Braghetto</span><span class="brand-sub">Panificadora desde ${site.since}</span></span>
    </a>
    <nav class="main-nav" aria-label="Principal"><ul>${links}</ul></nav>
    <div class="header-cta">
      <a class="btn btn-ghost btn-sm" href="./cardapio.html"${page === 'cardapio.html' ? ' aria-current="page"' : ''}>Cardápio</a>
      <a class="btn btn-solid btn-sm" href="./encomendas.html#pedido">Fazer encomenda</a>
    </div>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-open>${icon.menu}<span>Menu</span></button>
  </div>
</header>
<div class="menu" id="menu" hidden data-menu>
  <div class="menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="menu-top">
      <span class="brand-name">Braghetto</span>
      <button class="icon-btn" type="button" data-menu-close aria-label="Fechar menu">${icon.close}</button>
    </div>
    <ul class="menu-links">
      <li><a href="./cardapio.html">Cardápio completo</a></li>
      ${nav.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}
    </ul>
    <div class="menu-units">
      ${units
        .map(
          (u) => `<div><p class="eyebrow">${u.name}</p>
        <a href="${waLink(u)}" ${ext}>${icon.wa} WhatsApp ${u.whatsapp}</a>
        <a href="${telLink(u.phone)}">${icon.phone} ${u.phone}</a></div>`,
        )
        .join('')}
    </div>
  </div>
</div>`
}

function mobileBar() {
  return `
<nav class="mobile-bar" aria-label="Atalhos">
  <a href="./cardapio.html">${icon.search}<span>Cardápio</span></a>
  <a href="./encomendas.html#pedido">${icon.bag}<span>Encomendar</span></a>
  <a href="./#unidades">${icon.pin}<span>Unidades</span></a>
</nav>`
}

function footer() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="/img/emblema.webp" width="64" height="64" alt="" loading="lazy">
        <p class="footer-claim">Da nossa família<br><em>para a sua.</em></p>
      </div>
      <div class="footer-cols">
        ${units
          .map(
            (u) => `<div>
          <p class="eyebrow">${u.name}</p>
          <p>${u.street}<br>${u.district} · ${site.city}</p>
          <p><a href="${telLink(u.phone)}">${u.phone}</a><br><a href="${waLink(u)}" ${ext}>WhatsApp ${u.whatsapp}</a></p>
        </div>`,
          )
          .join('')}
        <div>
          <p class="eyebrow">Navegue</p>
          <ul class="footer-links">
            <li><a href="./cardapio.html">Cardápio</a></li>
            <li><a href="./encomendas.html">Encomendas e coffee-break</a></li>
            <li><a href="${site.orderOnline}" ${ext}>Pedir marmitex online</a></li>
            <li><a href="./#historia">Nossa história</a></li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">Fale com a gente</p>
          <ul class="footer-links">
            <li><a href="mailto:${site.email}">${site.email}</a></li>
            <li><a href="${site.instagram.url}" ${ext}>Instagram</a></li>
            <li><a href="${site.facebook}" ${ext}>Facebook</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${site.legal.razao} · CNPJ ${site.legal.cnpj} · ${site.city} - ${site.state}</p>
      <p>${photoCredits}</p>
      <p>Proposta de site desenvolvida pela <a href="https://apxweb.github.io/apex-web/" ${ext}>APX Web</a>. Conceito, sem vínculo oficial com a Panificadora Braghetto.</p>
    </div>
  </div>
</footer>`
}

// ---------- SEO ----------

const pages = {
  'index.html': {
    title: 'Panificadora Braghetto · Padaria em Ribeirão Preto desde 1992',
    desc: 'Pães, bolos, salgados, cafés, almoço self-service, marmitex, encomendas e coffee-break. Duas unidades em Ribeirão Preto: Rua Domingos Padovan e Avenida Leão XIII.',
    path: '',
  },
  'cardapio.html': {
    title: 'Cardápio · Panificadora Braghetto · Ribeirão Preto',
    desc: `Pães, cafés, salgados, lanches, pães de metro, bolos e doces da Panificadora Braghetto: ${itemCount} itens do catálogo, com busca por nome e pedido pelo WhatsApp de cada unidade.`,
    path: 'cardapio.html',
  },
  'encomendas.html': {
    title: 'Encomendas, festas e coffee-break · Panificadora Braghetto',
    desc: 'Salgados para festa, bolos confeitados, bentô cake, pães de metro e coffee-break para empresas e eventos em Ribeirão Preto. Monte o pedido e envie para a unidade.',
    path: 'encomendas.html',
  },
}

const LD_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`
// Agrupa os dias com o mesmo horário, direto de units[].hours.
function hoursLd(hours) {
  const groups = new Map()
  hours.forEach((h, d) => {
    const key = `${h.open}-${h.close}`
    if (!groups.has(key)) groups.set(key, { '@type': 'OpeningHoursSpecification', dayOfWeek: [], opens: hhmm(h.open), closes: hhmm(h.close) })
    groups.get(key).dayOfWeek.push(LD_DAYS[d])
  })
  return [...groups.values()]
}

function schema() {
  const unitLd = (u) => ({
    '@type': 'Bakery',
    '@id': `${site.url}#${u.id}`,
    name: `${site.name} · ${u.name}`,
    image: `${site.url}img/${u.photo}-800.webp`,
    telephone: `+55 ${u.phone}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: u.street,
      addressLocality: site.city,
      addressRegion: site.state,
      postalCode: u.cep,
      addressCountry: 'BR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: u.geo.lat, longitude: u.geo.lng },
    hasMap: u.maps,
    parentOrganization: { '@id': `${site.url}#org` },
    ...(u.hours ? { openingHoursSpecification: hoursLd(u.hours) } : {}),
  })
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}#org`,
        name: site.name,
        legalName: site.legal.razao,
        foundingDate: '1992-08-08',
        url: site.url,
        logo: `${site.url}icon-512.png`,
        email: site.email,
        sameAs: [site.instagram.url, site.facebook],
      },
      ...units.map(unitLd),
    ],
  }
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
}

function head(page) {
  const p = pages[page]
  const url = site.url + p.path
  return `
  <title>${p.title}</title>
  <meta name="description" content="${esc(p.desc)}">
  ${PROPOSAL ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${site.url}og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#FAF6EE">
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
  <link rel="apple-touch-icon" href="/icon-180.png">
  <link rel="manifest" href="/manifest.webmanifest">
  ${page === 'index.html' ? schema() : ''}`
}

export function sitemap() {
  const urls = Object.values(pages)
    .map((p) => `  <url><loc>${site.url}${p.path}</loc><changefreq>monthly</changefreq></url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function robots() {
  return `# Na publicação oficial, este arquivo deve ficar na raiz do domínio da Braghetto.\nUser-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`
}

// ---------- blocos da página inicial ----------

function statusChip(u, cls = '') {
  return `<p class="status ${cls}" data-status="${u.id}"><span class="dot" aria-hidden="true"></span><span data-status-text>${u.name}</span></p>`
}

function heroUnits() {
  return `
  <ul class="hero-units">
    ${units
      .map(
        (u) => `<li>
      <a class="hu-name" href="./#unidades">${u.name.replace('Unidade ', '')}</a>
      <span class="hu-addr">${u.street}</span>
      ${u.hours ? statusChip(u, 'status-sm') : `<a class="hu-link" href="${telLink(u.phone)}">${u.phone}</a>`}
    </li>`,
      )
      .join('')}
  </ul>`
}

// Vitrine de categorias: na tela grande, a foto fica fixa à esquerda e troca com a categoria
// em foco; no celular, cada categoria traz a sua foto.
const homeCats = [
  { id: 'paes', photo: 'producao-paes-gergelim', alt: 'Pães com gergelim recém-saídos do forno na unidade Leão XIII', sample: ['Pão francês', 'Ciabatta', 'Pão de torresmo', 'Pão australiano', 'Broa caxambu'] },
  { id: 'cafes', photo: 'cappuccino-chantilly', alt: 'Cappuccino com chantilly e canela em taça de vidro', sample: ['Café carioca', 'Pingado', 'Chocolate', 'Cappuccino italiano', 'Cappuccino gelado'] },
  { id: 'salgados', photo: 'torta-salgada', alt: 'Fatia de torta salgada de presunto e queijo', sample: ['Coxinha', 'Esfirra de carne', 'Empada de palmito', 'Titanic', 'Mini pizza'] },
  { id: 'lanches', photo: 'lanche-presunto', alt: 'Sanduíche de presunto e queijo com salada', sample: ['Misto quente', 'Bauru', 'Cheese salada', 'Lanche natural', 'Pão de metro'] },
  { id: 'doces', photo: 'brownies-cereja', alt: 'Brownies com cobertura de chocolate e cereja', sample: ['Floresta negra', 'Bolo de cenoura', 'Pudim de padaria', 'Torta holandesa', 'Rosca de coco'] },
]

function productShowcase() {
  const count = (c) => c.groups.reduce((n, g) => n + g.items.length, 0)
  const rows = homeCats
    .map((h, i) => {
      const c = categories.find((x) => x.id === h.id)
      return `
      <li class="pc-item" data-pc="${i}">
        <a class="pc-link" href="./cardapio.html#${c.id}">
          <span class="pc-body">
            <span class="pc-title">${c.title}</span>
            <span class="pc-lead">${c.lead}</span>
            <span class="pc-sample">${h.sample.join(', ')}</span>
          </span>
          <span class="pc-count">${count(c)} itens ${icon.arrow}</span>
        </a>
        <div class="pc-photo-m" aria-hidden="true">${picture(h.photo, { alt: '', sizes: '100vw' })}</div>
      </li>`
    })
    .join('')
  const frames = homeCats
    .map((h, i) => `<figure class="pc-frame${i === 0 ? ' is-on' : ''}" data-pc-frame="${i}">${picture(h.photo, { alt: h.alt, sizes: '(min-width: 1000px) 42vw, 100vw' })}</figure>`)
    .join('')
  return `
  <div class="pc">
    <div class="pc-stage" aria-hidden="false"><div class="pc-frames">${frames}</div></div>
    <ol class="pc-list">${rows}</ol>
  </div>`
}

function marmitexList() {
  const g = categories.find((c) => c.id === 'marmitex').groups[0]
  return g.items
    .map(asItem)
    .map((i) => `<li><span class="mx-name">${i.name.replace(/^Marmitex (.)/, (_, c) => c.toUpperCase())}</span>${i.note ? `<span class="mx-note">${i.note}</span>` : ''}</li>`)
    .join('')
}

function timelineList() {
  return timeline
    .map(
      (t) => `
    <li class="tl-item" data-reveal>
      <span class="tl-year">${t.year}</span>
      <div><h3 class="tl-title">${t.title}</h3><p>${t.text}</p></div>
    </li>`,
    )
    .join('')
}

function hoursTable(u) {
  if (!u.hours) {
    return `<p class="hours-pending">Horário de funcionamento: confirme com a unidade pelo telefone <a href="${telLink(u.phone)}">${u.phone}</a> ou pelo WhatsApp.</p>`
  }
  const names = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const fmt = (h) => `${Math.floor(h)}h${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`
  const order = [1, 2, 3, 4, 5, 6, 0]
  return `<table class="hours" data-hours="${u.id}"><caption class="sr-only">Horário de funcionamento da ${u.name}</caption><tbody>${order
    .map((d) => `<tr data-day="${d}"><th scope="row">${names[d]}</th><td>${fmt(u.hours[d].open)} às ${fmt(u.hours[d].close)}</td></tr>`)
    .join('')}</tbody></table>`
}

function unitCard(u) {
  return `
  <article class="unit" id="${u.id}" data-reveal>
    <header class="unit-head">
      <p class="unit-tag">${u.tag}</p>
      <h3 class="unit-name">${u.name}</h3>
      <p class="unit-addr">${u.street}<br>${u.district}, ${site.city} - ${site.state}, ${u.cep}</p>
      ${u.hours ? statusChip(u) : ''}
    </header>
    ${hoursTable(u)}
    <ul class="unit-contacts">
      <li><a href="${waLink(u)}" ${ext}>${icon.wa}<span>WhatsApp <strong>${u.whatsapp}</strong></span></a></li>
      <li><a href="${telLink(u.phone)}">${icon.phone}<span>Telefone <strong>${u.phone}</strong></span></a></li>
    </ul>
    <div class="unit-actions">
      <a class="btn btn-gold" href="${routeLink(u)}" ${ext}>${icon.route} Traçar rota</a>
      <a class="btn btn-ghost-light" href="${u.maps}" ${ext}>Ver no Google Maps ${icon.out}</a>
    </div>
    <div class="map-slot" data-map data-lat="${u.geo.lat}" data-lng="${u.geo.lng}" data-label="${esc(u.name)}">
      <button class="map-load" type="button">${icon.pin}<span><strong>Mostrar o mapa aqui</strong><small>Carrega o Google Maps só quando você pedir</small></span></button>
    </div>
  </article>`
}

// ---------- cardápio ----------

function cardapioNav() {
  return categories
    .map((c) => `<li><a href="#${c.id}" data-cat-link="${c.id}">${c.title}</a></li>`)
    .join('')
}

function cardapioSections() {
  return categories
    .map((c) => {
      const n = c.groups.reduce((a, g) => a + g.items.length, 0)
      const groups = c.groups
        .map(
          (g) => `
        <div class="menu-group" data-group>
          <h3 class="mg-title">${g.title}</h3>
          ${g.note ? `<p class="mg-note">${g.note}</p>` : ''}
          <ul class="mg-items">${g.items
            .map(asItem)
            .map((it) => {
              const thumb = it.photo ? picture(it.photo, { alt: '', sizes: '56px', cls: 'mi-thumb' }) : ''
              return `<li data-item data-name="${esc(it.name)}"${it.photo ? ` data-photo="${it.photo}"` : ''}${c.online ? ' data-online' : ''}>
                <button type="button" class="mi${it.photo ? ' has-photo' : ''}" data-item-btn>
                  ${thumb}<span class="mi-text"><span class="mi-name">${esc(it.name)}</span>${it.note ? `<span class="mi-note">${esc(it.note)}</span>` : ''}</span>
                  <span class="mi-act" aria-hidden="true">${c.online ? 'Pedir' : 'Consultar'}</span>
                </button></li>`
            })
            .join('')}</ul>
        </div>`,
        )
        .join('')
      return `
    <section class="cat" id="${c.id}" data-cat aria-labelledby="t-${c.id}">
      <header class="cat-head">
        <div class="cat-photo">${picture(c.cover, { alt: c.alt, sizes: '(min-width: 1000px) 38vw, 100vw' })}</div>
        <div class="cat-intro">
          <p class="eyebrow">${n} itens</p>
          <h2 id="t-${c.id}" class="cat-title">${c.title}</h2>
          <p class="cat-lead">${c.lead}</p>
          ${
            c.online
              ? `<a class="btn btn-solid" href="${site.orderOnline}" ${ext}>${icon.bag} Pedir marmitex online</a><p class="fine">Unidade Anhanguera · retirada ou entrega · cardápio e valores do dia no pedido online.</p>`
              : ''
          }
        </div>
      </header>
      <div class="cat-groups">${groups}</div>
    </section>`
    })
    .join('')
}

function unitOptions() {
  return units
    .map(
      (u, i) => `<label class="choice"><input type="radio" name="unidade" value="${u.id}" ${i === 0 ? '' : ''} required><span><strong>${u.name}</strong><small>${u.street} · ${u.district}</small></span></label>`,
    )
    .join('')
}

function unitsData() {
  const data = units.map((u) => ({ id: u.id, name: u.name, whatsapp: u.whatsapp, wa: waLink(u), phone: u.phone }))
  return `<script type="application/json" id="units-data">${JSON.stringify(data)}</script>`
}

function encContacts() {
  return units
    .map(
      (u) => `<div class="enc-unit">
      <p class="eyebrow">${u.name}</p>
      <a href="${waLink(u, 'Olá! Gostaria de fazer uma encomenda.')}" ${ext}>${icon.wa} <span>${u.whatsapp}</span></a>
      <a href="${telLink(u.phone)}">${icon.phone} <span>${u.phone}</span></a>
    </div>`,
    )
    .join('')
}

function quickLinks() {
  return (
    `<a class="quick-card quick-dark" href="${site.orderOnline}" ${ext}>${icon.bag}<span><strong>Marmitex do dia</strong><small>Pedido online · retirada ou entrega</small></span>${icon.out}</a>` +
    units.map((u) => `<a class="quick-card" href="${waLink(u, 'Olá! Gostaria de saber o que tem disponível hoje.')}" ${ext}>${icon.wa}<span><strong>Perguntar à ${u.name.replace('Unidade ', 'unidade ')}</strong><small>WhatsApp ${u.whatsapp}</small></span>${icon.arrow}</a>`).join('')
  )
}

export function blocks(page = 'index.html') {
  return {
    head: head(page),
    header: header(page),
    footer: footer(),
    mobileBar: mobileBar(),
    unitsData: unitsData(),
    heroUnits: heroUnits(),
    productShowcase: productShowcase(),
    marmitexList: marmitexList(),
    timeline: timelineList(),
    units: units.map((u) => unitCard(u)).join(''),
    itemCount: String(itemCount),
    quickLinks: quickLinks(),
    cardapioNav: cardapioNav(),
    cardapioSections: cardapioSections(),
    unitOptions: unitOptions(),
    encContacts: encContacts(),
    'i-arrow': icon.arrow,
    'i-insta': icon.insta,
    'i-search': icon.search,
    'i-close': icon.close,
    'i-wa': icon.wa,
    'i-phone': icon.phone,
    'i-mail': icon.mail,
    orderOnline: site.orderOnline,
    email: site.email,
    instagram: site.instagram.url,
    anhPhone: anh.phone,
    anhTel: telLink(anh.phone),
    'img-hero': picture('paes-balcao', { alt: 'Pães franceses, bisnagas e pães caseiros da Braghetto sobre a bancada enfarinhada', eager: true, sizes: '(min-width: 1000px) 40vw, 86vw' }),
    'img-hero-coin': picture('cafe-pao-queijo', { alt: 'Xícara de café com pães de queijo', eager: true, sizes: '(min-width: 1000px) 15vw, 34vw' }),
    'img-intro-a': picture('vitrine-paes-leao', { alt: 'Vitrine de pães, roscas e croissants na unidade Leão XIII', sizes: '(min-width: 1000px) 30vw, 70vw' }),
    'img-intro-b': picture('producao-caracois', { alt: 'Pães doces em espiral com gotas de chocolate, saídos do forno', sizes: '(min-width: 1000px) 22vw, 52vw' }),
    'img-salao': picture('salao-leao', { alt: 'Salão da unidade Leão XIII: mesas de madeira, vitrines de pães e doces e o balcão ao fundo', sizes: '100vw' }),
    'img-manha': picture('tapioca-caneca', { alt: 'Tapioca recheada servida no prato, com a caneca esmaltada da Braghetto ao fundo', sizes: '(min-width: 1000px) 40vw, 100vw' }),
    'img-lanche': picture('misto-quente', { alt: 'Misto quente no pão francês, cortado ao meio', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-doce': picture('mil-folhas', { alt: 'Mil-folhas com doce de leite e morango, com o letreiro da Braghetto ao fundo', sizes: '(min-width: 1000px) 24vw, 100vw' }),
    'img-almoco': picture('buffet-cubas', { alt: 'Cubas do bufê de almoço self-service', sizes: '100vw' }),
    'img-enc-a': picture('bolo-chocolate', { alt: 'Bolo de chocolate confeitado com cerejas', sizes: '(min-width: 1000px) 55vw, 100vw' }),
    'img-enc-b': picture('rocambole', { alt: 'Rocambole com cobertura crocante, chantili e cerejas', sizes: '(min-width: 1000px) 34vw, 60vw' }),
    'img-enc-c': picture('bento-cake-1', { alt: 'Bentô cake decorado com um dinossauro verde e um nome escrito', sizes: '(min-width: 1000px) 20vw, 40vw' }),
    'img-historia': picture('fachada-desenho', { alt: 'Desenho a lápis da fachada da Panificadora Braghetto na esquina da Rua Domingos Padovan', sizes: '(min-width: 1000px) 36vw, 100vw' }),
    'img-casa-a': picture('fachada-leao', { alt: 'Fachada da unidade Leão XIII, com parede de pedra e o emblema da Braghetto', sizes: '(min-width: 1000px) 62vw, 100vw' }),
    'img-casa-b': picture('letreiro-noite', { alt: 'Letreiro iluminado da Panificadora Braghetto à noite, na unidade Leão XIII', sizes: '(min-width: 1000px) 30vw, 50vw' }),
    'img-casa-c': picture('vitrine-doces-anhanguera', { alt: 'Vitrine de tortas, pudins e doces na unidade Anhanguera', sizes: '(min-width: 1000px) 30vw, 50vw' }),
    'img-casa-d': picture('fachada-anhanguera', { alt: 'Fachada de tijolos da unidade Anhanguera, com o letreiro Panificadora Braghetto desde 1992', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-casa-e': picture('balcao-anhanguera', { alt: 'Balcão de atendimento e mesas da unidade Anhanguera', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-ig-a': picture('bento-cake-2', { alt: 'Bentô cake branco com confeitos coloridos e mensagem escrita em chocolate', sizes: '(min-width: 1000px) 22vw, 50vw' }),
    'img-ig-b': picture('producao-tranca', { alt: 'Pães trançados e pães com gotas de chocolate na assadeira', sizes: '(min-width: 1000px) 22vw, 50vw' }),
    'img-ig-c': picture('brownie-cafe', { alt: 'Brownie, café e sobremesa servidos na mesa, vistos de cima', sizes: '(min-width: 1000px) 22vw, 50vw' }),
    'img-ig-d': picture('producao-paes-forno', { alt: 'Pães franceses dourados lado a lado na esteira do forno', sizes: '(min-width: 1000px) 22vw, 50vw' }),
    'img-enc-hero': picture('sonhos', { alt: 'Sonhos recheados de creme, polvilhados com açúcar', eager: true, sizes: '(min-width: 1000px) 30vw, 60vw' }),
    'img-enc-salgado': picture('torta-salgada', { alt: 'Fatia de torta salgada gratinada', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-enc-pao': picture('producao-assadeira', { alt: 'Assadeira com dezenas de pãezinhos em espiral dourados', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-enc-doce': picture('bombons', { alt: 'Bombons de chocolate recheados', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'img-enc-cafe': picture('cafe-pao-queijo', { alt: 'Café com pães de queijo', sizes: '(min-width: 1000px) 30vw, 100vw' }),
    'i-out': icon.out,
  }
}
