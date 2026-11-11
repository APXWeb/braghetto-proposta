// Catálogo da Braghetto: LEVANTAMENTO PRELIMINAR, a revisar com a casa.
//
// Os nomes vêm das páginas de produtos do site atual (panificadorabraghetto.com.br/produtos/*),
// que pode estar desatualizado. Por isso cada item tem um estado interno:
//   confirmado -> visto em 2026 num canal oficial em uso (Instagram da casa ou pedido online G3Food).
//                 São os itens com `src: IG` ou `src: G3`.
//   pendente   -> veio só do site atual; a venda hoje ainda não foi confirmada. É o padrão.
//
// SHOW_PENDING controla o que vai para o site:
//   true  -> versão de apresentação: os pendentes aparecem como "catálogo em revisão", sempre com
//            "consulte a unidade" e nunca como disponíveis.
//   false -> versão para publicar: só os confirmados aparecem. Use assim até a casa revisar a lista.
// Para confirmar um item, acrescente `ok: true` a ele (ex.: { name: 'Pão francês', ok: true }).
//
// Sem preços, ingredientes ou tamanhos: nada disso foi publicado pela casa no catálogo.
// Item: 'Nome' ou { name, photo?, note?, src?, ok? }. `photo` só quando a foto é daquele produto.

export const SHOW_PENDING = true

const IG = 'Instagram da casa, 2026'
const G3 = 'cardápio online G3Food, nov/2026'

export const categories = [
  {
    id: 'paes',
    title: 'Pães',
    lead: 'Do pão francês da manhã aos pães de forma, integrais, recheados e de fermentação doce.',
    cover: 'paes-balcao',
    alt: 'Pães franceses, roscas e pães caseiros da Braghetto sobre a bancada',
    groups: [
      {
        title: 'Pães',
        items: [
          'Pão francês', 'Pão ciabatta', 'Pão caseirinho', 'Pão de leite', 'Pão de açúcar', 'Pão de laranja',
          'Pão da vovó', 'Pão alemão', 'Pão amanteigado', 'Pão bola', 'Pão com gergelim', 'Pão de alho',
          'Pão de banha', 'Pão de batata', 'Pão de cebola', 'Pão de cenoura', 'Pão de chocolate', 'Pão australiano',
          'Pão de ervas finas', 'Pão de ervas com cream cheese', 'Pão de centeio', 'Pão de milho', 'Pão integral',
          'Pão neutro', 'Pão de forma', 'Pão quinoa com linhaça', 'Pão multigrãos', 'Pão de hambúrguer',
          'Pão de hot-dog', 'Pão mini filão', 'Pão mini bisnaga', 'Pão de hambúrguer com gergelim', 'Pão de tempero',
          'Pão de torresmo', 'Pão gratinado', 'Pão italiano', 'Pão sírio', 'Pão sovado',
        ],
      },
      { title: 'Baguetes', items: ['Baguete', 'Baguete recheada'] },
      { title: 'Torradas', items: ['Torrada pão de queijo', 'Torrada gratinada', 'Torrada palito', 'Torrada de pão', 'Torrada temperada'] },
      { title: 'Broas', items: ['Broa caxambu', 'Broa aerosa', 'Broa temperada'] },
    ],
  },
  {
    id: 'cafes',
    title: 'Cafés',
    lead: 'O cafezinho do balcão, o pingado, o leite, o chocolate e os cappuccinos.',
    cover: 'cafe-xicara',
    alt: 'Xícara de café com leite com a marca Braghetto, grãos de café e pães de queijo',
    groups: [
      {
        title: 'Cafés',
        items: [
          'Café longo', 'Café curto', 'Café carioca', 'Café duplo', 'Pingado', 'Leite', 'Chocolate',
          'Café com chocolate', 'Cappuccino Utam', 'Cappuccino italiano',
          { name: 'Cappuccino gelado', src: IG },
        ],
      },
    ],
  },
  {
    id: 'salgados',
    title: 'Salgados e tortas',
    lead: 'Feitos na cozinha da casa: mini salgados para festas, salgados do dia a dia e tortas.',
    cover: 'torta-salgada',
    alt: 'Fatia de torta salgada de presunto e queijo gratinada',
    groups: [
      {
        title: 'Mini salgados assados',
        items: [
          'Croissant de calabresa', 'Croissant de frango', 'Croissant de presunto e queijo', 'Doguinho',
          'Empada de frango', 'Empada de palmito', 'Enrolado de presunto e queijo', 'Enrolado de escarola',
          'Esfirra de carne', 'Esfirra de frango', 'Esfirra de queijo', 'Enrolado de calabresa',
        ],
      },
      {
        title: 'Mini salgados fritos',
        items: [
          'Bolinha de frango', 'Bolinha de queijo', 'Coxinha', 'Enrolado de presunto e queijo', 'Enrolado de salsicha',
          'Quibe', 'Pastel de carne', 'Pastel de queijo', 'Risoles de carne', 'Risoles de milho',
        ],
      },
      {
        title: 'Salgados assados',
        items: [
          'Cachorro louco', 'Croissant de frango', 'Croissant de presunto e queijo', 'Doguinho', 'Empada de frango',
          'Enrolado de calabresa', 'Enrolado de frios', 'Enrolado de presunto e queijo', 'Hambúrguer',
          'Hambúrguer bem bolado', 'Lasanha (12 pedaços)', 'Mini pizza de calabresa', 'Mini pizza de frango',
          'Mini pizza de presunto e queijo', 'Panqueca de carne (pedaços)', 'Escarola', 'Esfirra brasileira',
          'Esfirra de carne e queijo', 'Esfirra de carne', 'Esfirra de frango', 'Esfirra de milho', 'Esfirra de queijo',
          'Esfirra de estrogonofe', 'Titanic', 'Torta de frango (pedaço)',
        ],
      },
    ],
  },
  {
    id: 'lanches',
    title: 'Lanches e pães de metro',
    lead: 'Pão na chapa, mistos, lanches naturais e os pães de metro que fazem sucesso nas festas.',
    cover: 'lanche-presunto',
    alt: 'Sanduíche de presunto e queijo com alface e tomate em pão francês',
    groups: [
      {
        title: 'Lanches',
        items: [
          'Pão com margarina', 'Pão com margarina na chapa', 'Pão caseiro com margarina', 'Pão de queijo',
          'Pão de queijo recheado', 'Pão com queijo', 'Pão com queijo na chapa',
          { name: 'Pão com requeijão na chapa', src: IG },
          'Misto frio', 'Misto quente', 'Pão com mortadela', 'Bauru', 'Americano', 'Cheese burguer', 'Cheese egg',
          'Cheese salada', 'Cheese frango', 'Cheese tudo', 'Lanche natural de presunto e queijo',
          'Lanche natural de peito de peru', 'Lanche natural de salame',
          { name: 'Tapioca', photo: 'tapioca-caneca', note: 'Recheios variados', src: IG },
        ],
      },
      {
        title: 'Pães de metro',
        items: [
          'Pão de metro tradicional', 'Pão de metro com gergelim', 'Pão de metro gratinado',
          'Pão de metro de presunto e queijo', 'Pão de metro de lombo', 'Pão de metro de frango',
          'Pão de metro de peito de peru', 'Pão de metro de salame', 'Pão de metro vegetariano', 'Pão de metro de atum',
        ],
      },
    ],
  },
  {
    id: 'doces',
    title: 'Doces e confeitaria',
    lead: 'Bolos confeitados para encomenda, bolos caseiros, tortas, pudins, mousses e roscas.',
    cover: 'brownies-cereja',
    alt: 'Brownies com cobertura de chocolate e cereja',
    groups: [
      {
        title: 'Bolos confeitados',
        items: [
          'Prestígio branco', 'Prestígio', 'Floresta negra', 'Floresta branca', 'Mousse de chocolate preto',
          'Mousse de chocolate branco', 'Trufado', 'Sensação', 'Sonho de valsa', 'Ouro branco', 'Chocolate',
          'Chocolate com creme', 'Brigadeiro', 'Leite Ninho', 'Doce de leite com ameixas', 'Nozes', 'Abacaxi',
          'Pêssego', 'Morango', 'Creme bavariano', 'Creme bavariano de frutas vermelhas', 'Creme bavariano de morango',
          { name: 'Bentô cake', photo: 'bento-cake-1', note: 'Bolinho personalizado', src: IG },
        ],
      },
      {
        title: 'Bolos diversos',
        items: [
          'Cenoura', 'Cenoura com chocolate', 'Limão', 'Coco', 'Laranja', 'Fubá', 'Frapê', 'Formigueiro', 'Chocolate',
          'Aipim', 'Bolo de maracujá', 'Bolo de milho', 'Bolo de pé de moleque', 'Bolo de prestígio de coco',
          'Bolo de caçarola',
        ],
      },
      {
        title: 'Doces diversos',
        items: [
          'Pudim de leite condensado', 'Pudim de padaria', 'Rocamboles', 'Torta de morango',
          { name: 'Torta de maracujá', photo: 'torta-maracuja' }, 'Torta de limão', 'Torta holandesa',
          'Bombom de coco', 'Mousses diversos', 'Lua de mel de Leite Ninho', 'Lua de mel de maracujá',
          'Lua de mel de limão', 'Lua de mel tradicional', 'Lua de mel com canela', 'Amor perfeito',
          { name: 'Brownie', photo: 'brownies-cereja', src: 'página de produtos do site atual' },
          { name: 'Cupcake', src: 'página de produtos do site atual' },
        ],
      },
      {
        title: 'Roscas',
        items: [
          'Rosca de coco', 'Rosca de creme', 'Rosca de goiabada', 'Rosca de chocolate', 'Rosca de chocolate com creme',
          'Rosca de frutas', 'Rosca de calabresa',
        ],
      },
    ],
  },
  {
    id: 'marmitex',
    title: 'Almoço e marmitas',
    lead: 'Almoço completo de segunda a sábado e marmitas para retirar ou receber em casa. Consulte as opções disponíveis no cardápio online.',
    // Sem foto por enquanto: a casa ainda não tem uma boa foto do almoço. Quando houver, basta
    // acrescentar `cover` e `alt` como nas outras categorias.
    online: true,
    groups: [
      {
        title: 'Marmitas · pedido online',
        note: 'As opções de carnes, guarnições e saladas mudam: escolha no pedido online, que mostra o cardápio e os valores do dia.',
        items: [
          { name: 'Marmitex executivo', note: '2 carnes, 2 guarnições e 1 salada', src: G3 },
          { name: 'Marmitex tradicional', note: '2 carnes, 2 guarnições e 1 salada', src: G3 },
          { name: 'Marmitex menor', note: '1 carne, 1 guarnição e 1 salada', src: G3 },
          { name: 'Marmita para três', src: G3 },
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    lead: 'Refrigerantes e outras bebidas para acompanhar. Veja o que está disponível no cardápio online.',
    online: true,
    groups: [
      {
        title: 'Refrigerantes',
        note: 'Disponíveis no cardápio online (G3Food).',
        items: [
          { name: 'Guaraná Antarctica lata 350 ml', src: G3 },
          { name: 'Schweppes Citrus lata 350 ml', src: G3 },
          { name: 'Schweppes Citrus Light lata 350 ml', src: G3 },
          { name: 'Sprite lata 350 ml', src: G3 },
        ],
      },
    ],
  },
  {
    id: 'encomendas',
    title: 'Encomendas e coffee breaks',
    lead: 'Bolos, salgados para festa, pães de metro e coffee break para reuniões, empresas e eventos. Peça um orçamento pelo formulário, com retirada na unidade ou entrega.',
    info: true,
    groups: [],
  },
]

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
export const asItem = (i) => (typeof i === 'string' ? { name: i } : i)
export const isConfirmed = (i) => {
  const it = asItem(i)
  return it.ok === true || it.src === IG || it.src === G3
}
export const isListed = (i) => SHOW_PENDING || isConfirmed(i)
export const pendingCount = categories.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.filter((i) => !isConfirmed(i)).length, 0), 0)
export const searchKey = (i) => norm(asItem(i).name)
export const itemCount = categories.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0), 0)
