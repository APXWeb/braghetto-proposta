// TODOS os fatos exibidos no site saem deste arquivo. Corrija aqui e rode o build.
// Fontes consultadas em 06/11/2026 e reconferidas em 10/11/2026 (detalhes e pendências em README.md):
//   site atual panificadorabraghetto.com.br · Instagram @panificadorabraghetto (bio e posts)
//   Linktree linktr.ee/panificadora_braghetto · cardápio online g3food.com.br/PANIFICADORABRAGHETTO
//   perfis no Google Maps das duas unidades · matéria Diário FM (10/01/2025) sobre a unidade Leão.

export const site = {
  name: 'Panificadora Braghetto',
  short: 'Braghetto',
  since: 1992,
  founded: '8 de agosto de 1992',
  city: 'Ribeirão Preto',
  state: 'SP',
  // Endereço de publicação da proposta (GitHub Pages). Usado nos metadados e no sitemap.
  url: 'https://apxweb.github.io/braghetto-proposta/',
  instagram: { handle: '@panificadorabraghetto', url: 'https://www.instagram.com/panificadorabraghetto/' },
  facebook: 'https://www.facebook.com/PanificadoraBraghetto',
  email: 'encomendas@panificadorabraghetto.com.br',
  // Cardápio online oficial (G3Food): marmitex e bebidas, retirada ou entrega, da unidade Anhanguera.
  orderOnline: 'https://g3food.com.br/PANIFICADORABRAGHETTO',
  legal: { razao: 'Panificadora Braghetto Ltda', cnpj: '68.127.885/0001-28' },
}

// Cada unidade com os seus próprios contatos. Nunca misture telefones ou horários entre elas.
// hours: índice 0 = domingo. open/close em horas decimais (20.5 = 20h30). null = não confirmado.
export const units = [
  {
    id: 'anhanguera',
    name: 'Unidade Anhanguera',
    tag: 'Onde tudo começou',
    street: 'Rua Domingos Padovan, 839',
    district: 'Jardim Anhanguera',
    cep: '14092-040',
    geo: { lat: -21.1780052, lng: -47.774844 },
    phone: '(16) 3627-6365',
    whatsapp: '(16) 99770-7265',
    maps: 'https://maps.google.com/?cid=15990699822627416054',
    // Horário publicado pela casa no cardápio online (G3Food) e igual ao do Google Maps em 10/11/2026.
    hours: [
      { open: 6, close: 18 },
      { open: 6, close: 20.5 },
      { open: 6, close: 20.5 },
      { open: 6, close: 20.5 },
      { open: 6, close: 20.5 },
      { open: 6, close: 20.5 },
      { open: 6, close: 20.5 },
    ],
    hoursSummary: [
      ['Segunda a sábado', '6h às 20h30'],
      ['Domingo', '6h às 18h'],
    ],
    services: ['Padaria e confeitaria', 'Café e lanches', 'Almoço self-service (seg. a sáb.)', 'Marmitex com pedido online', 'Encomendas e coffee-break'],
    photo: 'fachada-anhanguera',
  },
  {
    id: 'leao',
    name: 'Unidade Leão XIII',
    tag: 'Inaugurada em janeiro de 2025',
    street: 'Avenida Leão XIII, 1708',
    district: 'Ribeirânia',
    cep: '14096-190',
    geo: { lat: -21.196833, lng: -47.7782917 },
    phone: '(16) 3624-4455',
    whatsapp: '(16) 99622-0860',
    maps: 'https://maps.google.com/?cid=2524024342688290727',
    // Horário conforme o perfil da unidade no Google Maps em 10/11/2026 (segunda a sábado 6h–22h,
    // domingo 6h–18h). A CONFIRMAR com a casa: não há outra fonte oficial para esta unidade.
    hours: [
      { open: 6, close: 18 },
      { open: 6, close: 22 },
      { open: 6, close: 22 },
      { open: 6, close: 22 },
      { open: 6, close: 22 },
      { open: 6, close: 22 },
      { open: 6, close: 22 },
    ],
    hoursSummary: [
      ['Segunda a sábado', '6h às 22h'],
      ['Domingo', '6h às 18h'],
    ],
    services: ['Padaria e confeitaria', 'Café e lanches', 'Encomendas e coffee-break'],
    photo: 'fachada-leao',
  },
]

export const digits = (s) => s.replace(/\D/g, '')
export const waLink = (unit, text = '') =>
  `https://wa.me/55${digits(unit.whatsapp)}${text ? `?text=${encodeURIComponent(text)}` : ''}`
export const telLink = (n) => `tel:+55${digits(n)}`

// Linha do tempo: só marcos documentados (página "A panificadora" do site atual,
// matéria do Diário FM e posts do Instagram de agosto de 2026).
export const timeline = [
  { year: '1992', title: 'A primeira fornada', text: 'Os irmãos Acácio e Kleber abrem a Panificadora Braghetto em 8 de agosto, na Rua Domingos Padovan.' },
  { year: '1999', title: 'A casa cresce', text: 'Primeira mudança significativa: a equipe aumenta e ganha uma área de mercearia.' },
  { year: '2008', title: 'Negócio de família', text: 'Acácio segue à frente da padaria, agora com a esposa e os dois filhos ajudando a administrar. No fim do ano chegam a informatização e uma pequena copa para o café da manhã.' },
  { year: '2009', title: 'Cozinha própria', text: 'É construída a cozinha que produz os salgados da casa, com cerca de nove funcionários.' },
  { year: '2011', title: 'Sempre aprendendo', text: 'A panificadora entra no programa conjunto do PROPAN, da ACIRP e do Sebrae.' },
  { year: '2025', title: 'A segunda casa', text: 'Em janeiro abre a unidade da Avenida Leão XIII, na zona Leste da cidade.' },
  { year: '2026', title: '34 anos', text: 'Em agosto a Braghetto completa 34 anos, agradecendo a colaboradores e clientes que fazem parte dessa história.' },
]

// Créditos das fotos (rodapé e README).
export const photoCredits =
  'Fotos: site e Instagram da Panificadora Braghetto (@panificadorabraghetto) e perfis das duas unidades no Google Maps.'
