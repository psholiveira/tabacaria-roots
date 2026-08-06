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
  hidden      BOOLEAN     DEFAULT false,
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

> **Já tem a tabela `products` criada?** Rode só isto no SQL Editor para adicionar a coluna de produto oculto sem perder os dados existentes:
> ```sql
> ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false;
> ```

---

## 3b. Restringir o painel a admins de verdade (importante)

A policy do passo 3 (`auth.role() = 'authenticated'`) libera escrita para **qualquer** usuário logado no projeto Supabase, não só para você. Se um dia existir cadastro de clientes (ou alguém criar conta pelo Supabase), essa pessoa ganharia acesso total ao catálogo. Rode o SQL abaixo no **SQL Editor** para restringir a uma lista explícita de admins — é seguro rodar mesmo que você já tenha o passo 3 aplicado (idempotente):

```sql
-- Tabela com os usuários autorizados a administrar o catálogo
CREATE TABLE IF NOT EXISTS admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read own row" ON admins;
CREATE POLICY "Admins can read own row"
  ON admins FOR SELECT
  USING (auth.uid() = user_id);

-- Substitui a policy antiga (qualquer autenticado) pela restrita (só admins)
DROP POLICY IF EXISTS "Auth manage products" ON products;
CREATE POLICY "Admins manage products"
  ON products FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

DROP POLICY IF EXISTS "Auth upload images" ON storage.objects;
CREATE POLICY "Admins upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.uid() IN (SELECT user_id FROM admins));

DROP POLICY IF EXISTS "Auth delete images" ON storage.objects;
CREATE POLICY "Admins delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.uid() IN (SELECT user_id FROM admins));

-- Autoriza o(s) usuário(s) admin já criados no passo 5 (troque o email)
INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'seu-email-admin@exemplo.com'
ON CONFLICT (user_id) DO NOTHING;
```

> Repita o `INSERT INTO admins` para cada email admin adicional. Sem uma linha em `admins`, o login funciona (é uma conta válida no Supabase Auth) mas toda escrita no catálogo é bloqueada pela RLS.

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

**Não esqueça de rodar o `INSERT INTO admins` do passo 3b com este email**, senão o login funciona mas nenhuma escrita no catálogo é permitida.

---

## 5b. Hardening adicional (recomendado, feito no Dashboard)

Estes passos não têm SQL — são toggles no painel do Supabase:

1. **Desabilitar cadastro público** — vá em **Authentication → Settings → User Signups** e desative "Allow new users to sign up". Sem isso, qualquer pessoa pode criar uma conta autenticada; com a policy do passo 3b ela não teria acesso de escrita, mas é uma camada extra de defesa não deixar contas estranhas existirem no projeto.
2. **Ativar MFA (2FA) na conta admin** — o app já tem suporte a MFA embutido (ver `src/admin/AdminLogin.jsx` e o botão "Segurança" no painel). Depois de logar pela primeira vez, ative o MFA no próprio painel admin e escaneie o QR code com um app autenticador (Google Authenticator, Authy, etc).
3. **(Opcional) CAPTCHA no login** — em **Authentication → Settings → Bot and Abuse Protection**, ative o hCaptcha ou Cloudflare Turnstile e configure a site key. Isso exige adicionar o widget no `AdminLogin.jsx`; avise se quiser que essa parte seja implementada — ela depende de uma conta/site-key externa que só você pode criar.

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
