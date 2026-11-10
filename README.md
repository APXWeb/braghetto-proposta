# Panificadora Braghetto · proposta de site (APX Web)

Proposta de site institucional e vitrine digital para a Panificadora Braghetto, de Ribeirão Preto.
É um conceito da APX Web, sem vínculo oficial com a casa: sai com `noindex, nofollow` e aviso no rodapé.

## Rodar

```
npm install
npm run dev       # http://localhost:5194
npm run build     # gera dist/
npm run preview   # serve dist/ em http://localhost:4181
npm run images    # regenera public/img a partir de assets-src (Python + Pillow com AVIF)
```

Site estático em Vite, três páginas: `index.html`, `cardapio.html`, `encomendas.html`.
Sem framework e sem biblioteca de animação: o JavaScript inteiro tem cerca de 8 KB.
A publicação no GitHub Pages está pronta em `.github/workflows/pages.yml` (ainda não publicada).

## Onde mexer

| O quê | Arquivo |
|---|---|
| Endereços, telefones, WhatsApp, horários, e-mail, redes, linha do tempo | `src/data/site.js` |
| Cardápio (categorias, grupos, itens, fotos de item) | `src/data/cardapio.js` |
| Textos e composição das páginas | `index.html`, `cardapio.html`, `encomendas.html` |
| Cabeçalho, rodapé, SEO, dados estruturados, qual foto vai em qual lugar | `src/render.js` |
| Visual | `src/styles/main.css` |
| Recortes e lista de fotos | `tools/images.py` + originais em `assets-src/` |

Cada fato aparece em um só lugar: o `vite.config.js` troca os `{{blocos}}` dos HTML pelo que
`src/render.js` gera a partir de `src/data/*`. Cada unidade tem os próprios contatos e horários;
nada é compartilhado entre elas. Para a publicação oficial, troque `PROPOSAL` para `false` em
`src/render.js` e `site.url` em `src/data/site.js`.

## Como os pedidos funcionam (nada é simulado)

- **Marmitex**: botão leva ao cardápio online oficial da casa, `g3food.com.br/PANIFICADORABRAGHETTO`
  (unidade Anhanguera). O G3Food não oferece incorporação oficial, então o site só redireciona.
- **Itens do cardápio**: tocar num item abre o WhatsApp da unidade escolhida com a pergunta pronta.
- **Encomendas**: o formulário valida os campos e abre o WhatsApp da unidade (ou o e-mail) com a
  mensagem montada. Não há servidor nem armazenamento; quem envia é a própria pessoa.
- Sem preços no site: o catálogo da casa não os publica, e os do marmitex mudam (ficam no G3Food).

## Fontes (consultadas em 06/11/2026 e reconferidas em 10/11/2026)

- Site atual `panificadorabraghetto.com.br`: catálogo de produtos, história, endereço, telefone, e-mail.
- Instagram `@panificadorabraghetto`: bio (as duas unidades, coffee-break, almoço self-service de
  segunda a sábado, marmitex) e os 12 posts visíveis sem login.
- Linktree `linktr.ee/panificadora_braghetto`: WhatsApp e cardápio online da unidade Anhanguera.
- G3Food: quatro tipos de marmitex e refrigerantes, horário da unidade Anhanguera.
- Google Maps: perfis das duas unidades (endereços, telefones, horários, fotos).
- Diário FM (10/01/2025): inauguração da unidade Leão XIII.

## A confirmar com a casa antes de publicar

1. **Horário da unidade Leão XIII** (segunda a sábado 6h–22h, domingo 6h–18h): só o Google Maps
   informa. Está em `units[1].hours`.
2. **Horário da unidade Anhanguera** (segunda a sábado 6h–20h30, domingo 6h–18h): G3Food e Google
   coincidem, mas vale a confirmação, inclusive em feriados.
3. **WhatsApp da unidade Leão XIII** `(16) 99622-0860`: vem de legendas do Instagram; não está no Linktree.
4. **Autoria das fotos do Google Maps** (lista abaixo): o Maps sem login não mostra quem enviou
   cada foto. As de estúdio são claramente da casa; as de ambiente podem ser de clientes. Antes da
   publicação oficial, a casa deve autorizar ou substituir por fotos próprias. Duas delas mostram
   pessoas ao fundo (`salao-leao`, `balcao-anhanguera`).
5. **Fotos do almoço**: só existe uma faixa de bufê em baixa definição (`buffet-cubas`). Uma foto
   boa do bufê ou de um marmitex melhora muito essa seção.
6. **Catálogo**: os nomes seguem o site atual, que pode estar desatualizado. Revisar a lista em
   `src/data/cardapio.js`. Itens vindos de outra fonte estão marcados com `src`.
7. **Entrega de encomendas**: o formulário pergunta "retirada ou entrega" e avisa que a unidade
   confirma se atende o endereço. Confirmar se a casa entrega encomendas.
8. **Pedido online da Leão XIII e iFood**: avaliações no Google citam iFood nas duas unidades, mas
   nenhuma fonte oficial traz o link. Não foi incluído.
9. **Facebook** `facebook.com/PanificadoraBraghetto`: link vem do site atual; conferir se segue ativo.

## Fotos

Todas são da própria Braghetto ou dos perfis dela; nenhuma é de banco de imagens ou gerada por IA.
Os originais ficam em `assets-src/` e o material bruto em `fonte/` (fora do git).

- **Site atual**: `paes-balcao`, `cappuccino-chantilly`, `brownies-cereja`, `torta-salgada`,
  `lanche-presunto`, `bolo-chocolate`, `torta-maracuja`, `cafe-xicara`, `buffet-cubas`, `fachada-desenho`.
- **Instagram da casa**: `producao-*` (produção na unidade Leão), `tapioca-caneca`, `brownie-cafe`,
  `bento-cake-1`, `bento-cake-2`.
- **Google Maps, unidade Anhanguera**: `fachada-anhanguera`, `cafe-pao-queijo`, `bombons`,
  `rocambole`, `sonhos`, `vitrine-doces-anhanguera`, `balcao-anhanguera`.
- **Google Maps, unidade Leão XIII**: `fachada-leao`, `salao-leao`, `vitrine-paes-leao`,
  `letreiro-noite`, `mil-folhas`, `misto-quente`.

## Direção de arte

- Assinatura tirada do emblema: a foto de abertura num oval com anel dourado e o xadrez do
  emblema, bem discreto, nos campos escuros (almoço, unidades, rodapé).
- Cores: branco-farinha `#FAF6EE`, papel `#F1E8D8`, chocolate do letreiro `#2C1A10`, caramelo de
  casca `#8C5318` (itálicos sobre o claro), dourado `#D6AC55` (só sobre o escuro).
- Tipos: Vollkorn nos títulos (segunda linha em itálico), Instrument Sans no texto, corpo de 17 px.
- Movimento: fotos que se abrem de baixo para cima e textos que sobem ao entrar na tela; paralaxe
  leve em três fotos; a foto da vitrine de produtos acompanha a categoria em foco. Tudo desliga
  com `prefers-reduced-motion` e o site funciona sem JavaScript.
