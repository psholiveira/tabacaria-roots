# Setup Supabase — Roots Tabacaria

Siga este guia para conectar o projeto ao Supabase (banco de dados + auth + imagens).

---

## 1. Criar conta e projeto

1. Acesse **https://supabase.com** e crie uma conta gratuita
2. Clique em **"New project"**
3. Escolha um nome (ex: `roots-tabacaria`) e uma senha forte para o banco
4. Selecione a região **South America (São Paulo)**
5. Aguarde ~2 minutos enquanto o projeto é criado

---

## 2. Pegar as credenciais

1. No painel do projeto, vá em **Settings → API**
2. Copie:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public key** → `eyJ...`

3. Abra o arquivo `.env.local` na raiz do projeto e cole:

```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## 3. Criar a tabela de produtos

1. No painel do Supabase, vá em **SQL Editor → New query**
2. Cole e execute o SQL abaixo:

```sql
-- Tabela de produtos
CREATE TABLE products (
  id          TEXT PRIMARY KEY,
  name        TEXT        NOT NULL,
  cat         TEXT        NOT NULL DEFAULT 'narguile',
  brand       TEXT        DEFAULT '',
  price       NUMERIC     NOT NULL DEFAULT 0,
  old_price   NUMERIC,
  description TEXT        DEFAULT '',
  variations  TEXT[]      DEFAULT '{}',
  tags        TEXT[]      DEFAULT '{}',
  photo       TEXT,
  rating      NUMERIC     DEFAULT 5.0,
  ratings     INTEGER     DEFAULT 0,
  bestseller  BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ler os produtos (vitrine pública)
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (true);

-- Só usuários autenticados (admin) podem criar/editar/deletar
CREATE POLICY "Auth manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## 4. Criar o bucket de imagens

1. Ainda no **SQL Editor**, execute:

```sql
-- Bucket público para fotos dos produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Qualquer um pode ver as imagens
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Só admin pode fazer upload
CREATE POLICY "Auth upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Só admin pode deletar imagens
CREATE POLICY "Auth delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');
```

---

## 5. Criar o usuário admin

1. Vá em **Authentication → Users → Add user**
2. Preencha:
   - **Email**: seu email de acesso ao admin
   - **Password**: uma senha forte
3. Clique em **Create user**

> Esse é o único usuário que terá acesso ao painel `/#admin`.

---

## 6. Testar

1. Pare o servidor de desenvolvimento se estiver rodando
2. Reinicie: `npm run dev`
3. Acesse `http://localhost:5173/#admin`
4. Faça login com o email e senha criados no passo 5
5. Na primeira vez, o sistema vai popular automaticamente o banco com os 20 produtos de exemplo

---

## Estrutura criada

```
Supabase Project
├── Database
│   └── products          ← tabela de produtos com RLS
├── Storage
│   └── products/         ← bucket público para fotos
└── Authentication
    └── users             ← seus usuários admin
```

---

## Problemas comuns

| Problema | Causa | Solução |
|---|---|---|
| "relation products does not exist" | Tabela não criada | Execute o SQL do passo 3 |
| Upload falha | Bucket não criado | Execute o SQL do passo 4 |
| Login não funciona | Usuário não criado | Crie via Authentication > Users |
| Produtos não carregam | .env.local errado | Verifique URL e anon key |
