"""Gera AVIF + WebP em várias larguras para public/img/ a partir de assets-src/.

Origem das fotos (consultadas em 06/11/2026):
- site atual panificadorabraghetto.com.br (fotos de produto da casa; as de fundo têm uma
  borda serrilhada embaixo, que o recorte remove);
- Instagram @panificadorabraghetto (posts da própria casa: produção na unidade Leão,
  tapioca, brownie com café, bentô cakes);
- Google Maps: fotos de capa dos perfis das duas unidades (a da Leão publicada pelo
  perfil "Panificadora Braghetto - Leão", jan/2025).
Rodar na raiz do projeto: python tools/images.py [nomes...]
"""
import json
import os
import sys
from PIL import Image, ImageOps

SRC = 'assets-src'
OUT = 'public/img'
WIDTHS = (480, 800, 1200, 1600, 1920)
MAXW = 1920
EDGE = (0, 0, None, -28)  # corta a borda serrilhada dos fundos do site antigo

# nome: (esq, topo, dir, base) em px da origem; negativos contam a partir da borda; None mantém.
CROPS = {
    'paes-balcao': EDGE,
    'cafe-xicara': None,
    'cappuccino-chantilly': EDGE,
    'brownies-cereja': EDGE,
    'torta-salgada': EDGE,
    'lanche-presunto': EDGE,
    'bolo-chocolate': None,
    'torta-maracuja': None,
    'doces-glacados': (0, 0, 700, 300),     # tira o recorte diagonal branco do canto
    'buffet-cubas': None,
    'fachada-desenho': None,
    'fachada-anhanguera': (0, 0, None, 860),  # tira o guidão da moto no canto inferior
    'fachada-leao': None,
    'producao-tranca': None,
    'producao-paes-gergelim': None,
    'producao-paes-forno': None,
    'producao-caracois': None,
    'producao-assadeira': None,
    'tapioca-caneca': None,
    'brownie-cafe': None,
    'bento-cake-1': None,
    'bento-cake-2': None,
    # Perfis das duas unidades no Google Maps (coletadas em 10/11/2026).
    'vitrine-paes-leao': None,
    'salao-leao': None,
    'letreiro-noite': (0, 150, None, -260),
    'mil-folhas': None,
    'misto-quente': (0, 500, None, -300),
    'cafe-pao-queijo': None,
    'bombons': None,
    'rocambole': None,
    'sonhos': None,
    'vitrine-doces-anhanguera': None,
    'balcao-anhanguera': (0, 300, None, -250),
}


def box(im, b):
    l, t, r, bt = b
    r = im.width if r is None else (im.width + r if r < 0 else r)
    bt = im.height if bt is None else (im.height + bt if bt < 0 else bt)
    return im.crop((l, t, r, bt))


def main(only=()):
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    path = 'src/data/images.json'
    if only and os.path.exists(path):
        manifest = json.load(open(path, encoding='utf-8'))
    for name, b in CROPS.items():
        if only and name not in only:
            continue
        src = next(os.path.join(SRC, name + e) for e in ('.jpg', '.png') if os.path.exists(os.path.join(SRC, name + e)))
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        if b:
            im = box(im, b)
        if im.width > MAXW:
            im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
        widths = sorted(set([w for w in WIDTHS if w < im.width] + [im.width]))
        widths = [w for w in widths if w >= 400] or [im.width]
        for w in widths:
            h = round(im.height * w / im.width)
            fr = im.resize((w, h), Image.LANCZOS) if w != im.width else im
            fr.save(f'{OUT}/{name}-{w}.webp', 'WEBP', quality=80, method=6)
            fr.save(f'{OUT}/{name}-{w}.avif', 'AVIF', quality=55, speed=5)
        manifest[name] = {'w': im.width, 'h': im.height, 'sizes': widths}
        print(name, im.size, widths)
    json.dump(manifest, open(path, 'w', encoding='utf-8'), indent=1)
    if only:
        return
    em = Image.open(os.path.join(SRC, 'brand', 'emblema.png')).convert('RGBA')
    em = em.crop(em.getbbox())
    em.resize((176, round(176 * em.height / em.width)), Image.LANCZOS).save(f'{OUT}/emblema.png', optimize=True)
    em.resize((176, round(176 * em.height / em.width)), Image.LANCZOS).save(f'{OUT}/emblema.webp', 'WEBP', quality=90)
    sq = Image.new('RGBA', (max(em.size),) * 2, (0, 0, 0, 0))
    sq.paste(em, ((sq.width - em.width) // 2, (sq.height - em.height) // 2), em)
    for s in (32, 180, 192, 512):
        bg = Image.new('RGBA', (s, s), (246, 240, 228, 255)) if s >= 180 else Image.new('RGBA', (s, s), (0, 0, 0, 0))
        ic = sq.resize((round(s * .86), round(s * .86)) if s >= 180 else (s, s), Image.LANCZOS)
        bg.paste(ic, ((s - ic.width) // 2, (s - ic.height) // 2), ic)
        bg.save(f'public/icon-{s}.png', optimize=True)


if __name__ == '__main__':
    main(tuple(sys.argv[1:]))
