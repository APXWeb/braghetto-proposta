// Página de encomendas: validação do formulário e envio pelo WhatsApp da unidade ou por e-mail.
// Não há servidor: o site só monta a mensagem; quem envia é a própria pessoa, no WhatsApp ou no e-mail.
import { initCore, initReveals, scrollToEl } from './js/common.js'
import { site } from './data/site.js'

initCore()
initReveals()

const units = JSON.parse(document.getElementById('units-data').textContent)
const form = document.querySelector('[data-order-form]')
const result = form.querySelector('[data-result]')
const endereco = form.querySelector('[data-endereco]')
const $ = (n) => form.elements[n]

// Data mínima: amanhã (encomenda no mesmo dia é combinada direto com a unidade).
const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
$('data').min = iso(tomorrow)

// Item vindo do cardápio (?item=...).
const item = new URLSearchParams(location.search).get('item')
if (item) $('itens').value = `${item}: `

// Endereço só aparece (e só é exigido) quando a pessoa pede entrega.
form.querySelectorAll('input[name="entrega"]').forEach((r) =>
  r.addEventListener('change', () => {
    const on = form.querySelector('input[name="entrega"]:checked').value === 'entrega'
    endereco.hidden = !on
    $('endereco').required = on
    if (!on) setError('endereco', '')
  }),
)

// Máscara leve de telefone: (16) 99999-9999.
$('telefone').addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11)
  let v = d
  if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length > 6) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length === 11 ? 7 : 6)}-${d.slice(d.length === 11 ? 7 : 6)}`
  e.target.value = v
})

function setError(name, msg) {
  const p = form.querySelector(`[data-error-for="${name}"]`)
  const field = name === 'unidade' ? form.querySelector('[data-field="unidade"]') : $(name)
  if (p) { p.textContent = msg; p.hidden = !msg }
  if (name === 'unidade') field.classList.toggle('is-invalid', Boolean(msg))
  else if (field) {
    field.setAttribute('aria-invalid', msg ? 'true' : 'false')
    if (p) { p.id = `err-${name}`; msg ? field.setAttribute('aria-describedby', p.id) : field.removeAttribute('aria-describedby') }
  }
}

function validate() {
  const errors = []
  const add = (n, m) => { setError(n, m); if (m) errors.push(n) }
  add('unidade', form.querySelector('input[name="unidade"]:checked') ? '' : 'Escolha a unidade que vai preparar a encomenda.')
  add('nome', $('nome').value.trim().length >= 2 ? '' : 'Digite o seu nome.')
  const tel = $('telefone').value.replace(/\D/g, '')
  add('telefone', tel.length === 10 || tel.length === 11 ? '' : 'Digite o telefone com DDD, por exemplo (16) 99999-9999.')
  const em = $('email').value.trim()
  add('email', !em || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) ? '' : 'Este e-mail parece incompleto. Confira ou deixe em branco.')
  add('tipo', $('tipo').value ? '' : 'Escolha o tipo de encomenda.')
  const d = $('data').value
  add('data', !d ? 'Escolha a data da encomenda.' : d < $('data').min ? 'Escolha uma data a partir de amanhã. Para hoje, fale direto com a unidade.' : '')
  const p = $('pessoas').value
  add('pessoas', !p || (Number(p) >= 1 && Number(p) <= 2000) ? '' : 'Informe um número de pessoas entre 1 e 2000.')
  if ($('endereco').required) add('endereco', $('endereco').value.trim().length >= 6 ? '' : 'Informe o endereço de entrega.')
  return errors
}

// Revalida o campo assim que a pessoa corrige.
form.addEventListener('input', (e) => {
  const n = e.target.name
  if (!n || !form.querySelector(`[data-error-for="${n}"]:not([hidden])`)) return
  validate()
  ;['unidade', 'nome', 'telefone', 'email', 'tipo', 'data', 'pessoas', 'endereco'].forEach((k) => {
    if (k !== n && !form.querySelector(`[data-error-for="${k}"]:not([hidden])`)) setError(k, '')
  })
})
// Unidade sem WhatsApp confirmado: o botão de WhatsApp sai e o pedido segue por e-mail.
const waBtn = form.querySelector('[data-send="whatsapp"]')
const waHint = form.querySelector('[data-wa-hint]')
function syncChannel() {
  const id = form.querySelector('input[name="unidade"]:checked')?.value
  const u = units.find((x) => x.id === id)
  const noWa = Boolean(u && !u.wa)
  waBtn.hidden = noWa
  waHint.hidden = !noWa
  if (noWa) waHint.innerHTML = `Para a ${u.name}, envie por e-mail ou ligue <a href="${u.tel}">${u.phone}</a>.`
}
form.addEventListener('change', (e) => {
  if (e.target.name !== 'unidade') return
  setError('unidade', '')
  syncChannel()
})
syncChannel()

function message() {
  const u = units.find((x) => x.id === form.querySelector('input[name="unidade"]:checked').value)
  const [y, m, d] = $('data').value.split('-')
  const interesses = [...form.querySelectorAll('input[name="interesse"]:checked')].map((i) => i.value)
  const entrega = form.querySelector('input[name="entrega"]:checked').value
  const sug = form.querySelector('input[name="sugestao"]:checked').value
  const L = [
    `Olá! Gostaria de fazer uma encomenda na ${u.name}.`,
    '',
    `*Nome:* ${$('nome').value.trim()}`,
    `*Telefone:* ${$('telefone').value.trim()}`,
    !!$('email').value.trim() && `*E-mail:* ${$('email').value.trim()}`,
    `*Tipo:* ${$('tipo').value}`,
    `*Data:* ${d}/${m}/${y}${$('horario').value ? ` às ${$('horario').value}` : ''}`,
    !!$('pessoas').value && `*Pessoas:* cerca de ${$('pessoas').value}`,
    interesses.length && `*Interesse:* ${interesses.join(', ')}`,
    `*Itens:* ${sug === 'sugerir' ? 'quero sugestões da equipe' : 'eu escolho'}`,
    !!$('itens').value.trim() && `*Itens e quantidades:* ${$('itens').value.trim()}`,
    `*Retirada ou entrega:* ${entrega === 'entrega' ? `entrega em ${$('endereco').value.trim()}` : 'vou retirar na unidade'}`,
    !!$('obs').value.trim() && `*Observações:* ${$('obs').value.trim()}`,
    '',
    'Aguardo a confirmação dos valores e da disponibilidade. Obrigado!',
  ].filter((l) => typeof l === 'string')
  return { u, text: L.join('\n') }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  let via = e.submitter?.dataset.send || 'whatsapp'
  const errors = validate()
  if (errors.length) {
    result.hidden = false
    result.className = 'f-result is-error'
    result.innerHTML = `<p><strong>Faltam ${errors.length === 1 ? 'uma informação' : `${errors.length} informações`}.</strong> Os campos marcados em vermelho precisam de ajuste.</p>`
    const first = errors[0] === 'unidade' ? form.querySelector('input[name="unidade"]') : $(errors[0])
    scrollToEl(first.closest('.f-block') || first, 110)
    setTimeout(() => first.focus({ preventScroll: true }), 500)
    return
  }
  const { u, text } = message()
  if (!u.wa) via = 'email'
  const href = via === 'email'
    ? `mailto:${site.email}?subject=${encodeURIComponent(`Encomenda · ${u.name} · ${$('nome').value.trim()}`)}&body=${encodeURIComponent(text.replace(/\*/g, ''))}`
    : `${u.wa}?text=${encodeURIComponent(text)}`
  if (via === 'email') location.href = href
  else window.open(href, '_blank', 'noopener')
  result.hidden = false
  result.className = 'f-result'
  result.innerHTML =
    via === 'email'
      ? `<p><strong>Abrimos o seu aplicativo de e-mail</strong> com a encomenda pronta para ${site.email}. Confira e envie.</p><p>A encomenda só fica confirmada quando a equipe responder. Se o e-mail não abriu, <a href="${href}">toque aqui</a> ou ligue para a ${u.name}: <a href="${u.tel}">${u.phone}</a>.</p>`
      : `<p><strong>Abrimos o WhatsApp da ${u.name}</strong> (${u.whatsapp}) com a sua mensagem pronta. É só conferir e enviar.</p><p>A encomenda só fica confirmada quando a unidade responder. Se o WhatsApp não abriu, <a href="${href}" target="_blank" rel="noopener">toque aqui</a>.</p>`
  result.focus()
})

