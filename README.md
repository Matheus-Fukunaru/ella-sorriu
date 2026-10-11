# Ela Sorriu

## Para abrir no computador

1. Extraia o ZIP completo.
2. Abra a pasta extraída.
3. Dê dois cliques em **INICIAR-ELLA-SORRIU.bat**.

Na primeira abertura, o iniciador prepara tudo automaticamente. Pode levar
alguns minutos. Em seguida, o navegador abre na tela **Configuração inicial**,
onde a proprietária informa somente nome, e-mail e a própria senha.

Nas próximas vezes, basta dar dois cliques no mesmo arquivo. O navegador abre
diretamente no login administrativo. Mantenha a janela “Ela Sorriu” aberta
enquanto estiver usando o site.

Não é necessário abrir PowerShell, terminal ou VS Code. Não é necessário
digitar comandos nem editar arquivos de configuração.

### Se aparecer a mensagem sobre Node.js

O iniciador abrirá a página oficial. Instale o Node.js, feche a página e dê dois
cliques em **INICIAR-ELLA-SORRIU.bat** novamente. O instalador nunca é baixado
ou executado silenciosamente pelo projeto.

## Depois que o site estiver publicado

O arquivo de início não será mais necessário. A proprietária e a equipe usarão
somente o navegador:

`https://DOMINIO-DO-SITE/admin/login`

Usuários, convites, funções e acesso temporário do suporte são administrados
dentro do próprio painel.

## Informações para o responsável técnico pela publicação

Esta seção não faz parte do uso cotidiano da proprietária.

- Requer Node.js 22.5 ou mais recente.
- Em produção, configure `NODE_ENV`, `DATABASE_URL`, `SESSION_SECRET`,
  `INSTALL_TOKEN` e `APP_URL` nas variáveis privadas da hospedagem.
- `SESSION_SECRET` e `INSTALL_TOKEN` precisam ter pelo menos 32 caracteres e
  nunca devem ir para o frontend ou para o repositório.
- Configure HTTPS, um volume persistente para o SQLite e SMTP para envio
  automático de convites e recuperação de senha.
- O `.env.example` usa um caminho de Volume do Railway e não contém segredos reais.
- O banco local, o arquivo `.env` e `node_modules` não fazem parte do ZIP.

### Persistência e Vercel

Administradores, sessões e pedidos sobrevivem a reinícios e novos deploys
somente se `DATABASE_URL` apontar para um disco ou volume persistente.

Não publique esta arquitetura diretamente na Vercel usando SQLite local. O
sistema de arquivos das funções é temporário e pode apagar contas e pedidos.
Para usar Vercel, migre primeiro para PostgreSQL ou outro banco persistente.

## Segurança

O painel usa bcrypt, cookies HttpOnly/SameSite, Secure em produção, sessões
revogáveis, JWT com algoritmo e validade explícitos, CSRF, rate limiting,
Helmet/CSP e consultas parametrizadas. Convites e recuperações armazenam apenas
o hash dos tokens. O último Proprietário não pode ser removido ou rebaixado.

## Sites de presente

O site público possui a opção **Criar meu site** em
`/site-presente.html`. A pessoa pode escolher:

- nome de quem recebe e de quem presenteia;
- ocasião;
- URL curta com verificação de disponibilidade;
- dois ou três textos;
- até sete fotos próprias, com mudança de ordem, descrição, nota e opção de tocar a música ao abrir;
- galeria tradicional ou fotos intercaladas com as cartinhas;
- até dois carrosséis opcionais de dez fotos cada;
- música obrigatória enviada pela pessoa, com audição no criador e título opcional (reprodução no site somente após interação);
- quatro estilos visuais e quatro opções de tipografia;
- tema claro/escuro, movimento suave/reduzido e leitura confortável;
- quatro cupons de teste;
- PIX, crédito ou débito em modo de teste;
- quatro acabamentos de QR Code com prévias visuais, contorno de coração e centro escaneável.

O resultado é publicado como `/presente/<slug>` e também pode ser aberto pela
prévia do criador. Clique na prévia lateral para abrir o simulador de celular;
use **Atualizar** após mudar os campos. Fotos (até 1 MB cada) e música (até 8 MB)
ficam na pasta `gift-media` ao lado do banco configurado em `DATABASE_URL`.
Para preservar os sites de presente publicados durante novos deploys, mantenha **banco
e mídia** no mesmo armazenamento persistente. Nenhum deles deve entrar no ZIP.

### Pagamento

O checkout entregue está explicitamente em **modo de teste**. Ele registra a
forma escolhida e cria a página, mas não cobra e não guarda número de cartão.
Para habilitar cobrança real, ainda é necessário escolher um provedor,
configurar as credenciais privadas de produção/sandbox e definir preço, moeda,
webhooks e política de reembolso. Esses dados nunca devem ser colocados no
frontend ou no ZIP.
