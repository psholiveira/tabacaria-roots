# 🦁 Roots Tabacaria

Catálogo online da Tabacaria Roots (Recife) — mobile-first, com fluxo de pedido direto pelo WhatsApp e painel admin pra cadastrar produtos.

## Stack

- **Vite** + **React 18**
- CSS puro com variáveis (temas dark/light)
- SVG vetorial pra logo + ícones
- `localStorage` pra persistência dos produtos (substituir por Supabase/Firebase em prod)

## Rodando local

```bash
cd vite
npm install
npm run dev
```

Vai abrir em `http://localhost:5173`.

## Build pra produção

```bash
npm run build      # gera /dist
npm run preview    # serve o /dist localmente pra testar
```

Os arquivos em `dist/` podem ser hospedados em qualquer static host:
**Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**, etc.

## Estrutura

```
vite/
├── public/
│   └── assets/        # logos SVG + imagens de produto
├── src/
│   ├── components/    # ProductCard, ProductImage, Icons
│   ├── hooks/         # useCart
│   ├── store/         # products (localStorage + pub/sub)
│   ├── mobile/        # telas mobile
│   ├── desktop/       # telas desktop
│   ├── admin/         # painel admin
│   ├── App.jsx        # roteamento + responsive switch
│   ├── data.js        # produtos + categorias + filtros
│   ├── main.jsx       # entry
│   └── styles.css     # tokens + tema reggae
└── vite.config.js
```

## Rotas

- `/` — storefront (mobile ou desktop conforme largura da tela)
- `/#admin` — painel admin pra cadastrar produtos

## Próximos passos sugeridos

- [ ] Persistência real (Supabase/Firebase) — substituir `src/store/products.js`
- [ ] Auth no /admin (Clerk, Supabase Auth ou senha simples)
- [ ] Upload de fotos pra storage real (S3 / Cloudinary / Supabase Storage)
- [ ] Domínio custom + analytics (Plausible / GA)
- [ ] Versão PWA pra instalação no celular

---

Made with 🦁 in Recife.
