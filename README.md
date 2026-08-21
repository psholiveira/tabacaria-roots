<div align="center">

# 🦁 Roots Tabacaria

**Catálogo online mobile-first com checkout via WhatsApp e painel administrativo.**

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel&logoColor=white)](https://tabacaria-roots.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#-licença)

[**Ver demo ao vivo →**](https://tabacaria-roots.vercel.app)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack](#-stack)
- [Começando](#-começando)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Rotas](#-rotas)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Aviso legal](#-aviso-legal)

---

## 📖 Sobre o projeto

**Roots Tabacaria** é o catálogo digital da Tabacaria Roots (Recife/PE). O projeto nasceu para resolver um problema concreto do varejo de bairro: substituir listas de produtos enviadas manualmente por WhatsApp por uma vitrine sempre atualizada, rápida de navegar no celular e que leva o cliente ao pedido em poucos toques.

A aplicação é uma SPA construída com Vite + React, com layouts distintos para mobile e desktop, tema visual próprio e um painel administrativo para gestão do catálogo sem necessidade de deploy a cada alteração de produto.

**Princípios de design:**

- **Mobile-first** — a maior parte do tráfego vem do celular, e a interface foi desenhada a partir dessa restrição.
- **Zero fricção no pedido** — sem cadastro, sem gateway de pagamento: o carrinho gera uma mensagem pronta e abre o WhatsApp.
- **Leve** — CSS puro com variáveis, ícones e logo em SVG vetorial, sem bibliotecas de UI pesadas.

---

## ✨ Funcionalidades

| | Funcionalidade | Descrição |
|:--|:--|:--|
| 🛍️ | **Catálogo de produtos** | Listagem por categorias com filtros e imagens otimizadas. |
| 📱 | **Layout adaptativo** | Telas dedicadas para mobile e desktop, selecionadas por largura de viewport. |
| 🛒 | **Carrinho** | Hook `useCart` com controle de itens e quantidades. |
| 💬 | **Pedido via WhatsApp** | Geração automática da mensagem de pedido e redirecionamento para a conversa. |
| 🔐 | **Painel admin** | Cadastro e edição de produtos direto pela aplicação. |
| 🌗 | **Temas dark/light** | Design tokens em variáveis CSS. |
| ⚡ | **Build estático** | Saída em `dist/`, hospedável em qualquer static host. |

---

## 🛠 Stack

| Camada | Tecnologia |
|:--|:--|
| Build tool | [Vite 6](https://vitejs.dev/) |
| UI | [React 18](https://react.dev/) |
| Estilo | CSS puro com custom properties (design tokens) |
| Backend / dados | [Supabase](https://supabase.com/) (`@supabase/supabase-js`) |
| Assets | SVG vetorial (logo e ícones) |
| Hospedagem | [Vercel](https://vercel.com/) |

---

## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/) **18+**
- npm 9+ (ou pnpm/yarn)
- Um projeto no [Supabase](https://supabase.com/) — veja [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/psholiveira/tabacaria-roots.git
cd tabacaria-roots

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

---

## 🔑 Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto a partir do `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

| Variável | Obrigatória | Descrição |
|:--|:--:|:--|
| `VITE_SUPABASE_URL` | ✅ | URL do projeto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Chave pública (`anon`) do Supabase. |

> ⚠️ **Importante:** variáveis prefixadas com `VITE_` são embutidas no bundle e ficam visíveis no navegador. Use **apenas** a chave `anon` e proteja os dados com [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security). Nunca exponha a `service_role`.

As instruções completas de criação das tabelas e políticas estão em [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md).

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|:--|:--|
| `npm run dev` | Servidor de desenvolvimento com HMR em `localhost:5173`. |
| `npm run build` | Build de produção otimizado em `dist/`. |
| `npm run preview` | Serve o `dist/` localmente para validação pré-deploy. |

---

## 📂 Estrutura do projeto

```
tabacaria-roots/
├── public/
│   └── assets/           # Logos SVG e imagens de produto
├── src/
│   ├── components/       # ProductCard, ProductImage, Icons
│   ├── hooks/            # useCart
│   ├── store/            # Camada de dados (Supabase + pub/sub)
│   ├── mobile/           # Telas mobile
│   ├── desktop/          # Telas desktop
│   ├── admin/            # Painel administrativo
│   ├── App.jsx           # Roteamento e responsive switch
│   ├── data.js           # Produtos, categorias e filtros
│   ├── main.jsx          # Entry point
│   └── styles.css        # Design tokens e tema
├── .env.example          # Modelo de variáveis de ambiente
├── index.html
├── vite.config.js
└── SUPABASE_SETUP.md     # Guia de configuração do banco
```

---

## 🗺 Rotas

| Rota | Descrição |
|:--|:--|
| `/` | Storefront — renderiza a versão mobile ou desktop conforme a largura da tela. |
| `/#admin` | Painel administrativo para cadastro e gestão de produtos. |

---

## ☁️ Deploy

O projeto gera um build 100% estático, compatível com **Vercel**, **Netlify**, **Cloudflare Pages** e **GitHub Pages**.

**Vercel (configuração atual):**

1. Importe o repositório no painel da Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build` · Output directory: `dist`.
4. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em *Settings → Environment Variables*.

Cada push na branch `main` dispara um novo deploy automaticamente.

---

## 🧭 Roadmap

- [x] Catálogo responsivo (mobile + desktop)
- [x] Fluxo de pedido via WhatsApp
- [x] Painel administrativo
- [x] Migração da persistência para Supabase
- [ ] Autenticação no `/#admin` (Supabase Auth)
- [ ] Upload de imagens para Supabase Storage
- [ ] PWA instalável no celular
- [ ] Domínio próprio + analytics (Plausible)
- [ ] Testes automatizados (Vitest + Testing Library)

---

## 🤝 Contribuindo

Contribuições são bem-vindas. O fluxo sugerido:

1. Faça um fork do projeto
2. Crie sua branch (`git checkout -b feat/minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feat/minha-feature`)
5. Abra um Pull Request

Os commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](./LICENSE) para mais informações.

---

## ⚖️ Aviso legal

Este catálogo destina-se **exclusivamente a maiores de 18 anos**. A venda de produtos derivados do tabaco a menores é proibida por lei no Brasil (Lei nº 8.069/1990 e Lei nº 9.294/1996), que também estabelece restrições à publicidade desses produtos. O projeto é uma ferramenta de consulta de estoque e contato direto com o estabelecimento.

---

<div align="center">

Feito com 🦁 em Recife por [**@psholiveira**](https://github.com/psholiveira)

</div>
