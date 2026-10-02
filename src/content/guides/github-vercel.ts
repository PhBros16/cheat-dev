import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "publicar-site-github-vercel",
  title: "Do zero ao site no ar: GitHub + Vercel",
  summary: "Guarde seu código no GitHub, publique de graça na Vercel e entenda o ciclo de atualizar o site com um git push.",
  level: "iniciante",
  minutes: 20,
  tags: ["git", "github", "vercel", "deploy", "publicar"],
  steps: [
    {
      heading: "1. O que você vai montar",
      text: [
        "O fluxo completo tem três peças. O Git guarda o histórico do seu código no seu computador. O GitHub guarda uma cópia online (seu portfólio de código). A Vercel olha para esse repositório e publica o site sozinha toda vez que você enviar uma mudança.",
        "Depois de configurado, atualizar o site é só: editar, salvar, git add, git commit, git push. Não existe mais 'subir arquivo por FTP'.",
      ],
      note: "Tudo isso é gratuito para projetos pessoais. Você precisa de uma conta no GitHub e uma na Vercel (dá para entrar na Vercel direto com o GitHub).",
    },
    {
      heading: "2. Instale o Git e confira",
      text: [
        "Baixe o Git em git-scm.com (Windows e Mac) ou instale pelo gerenciador de pacotes (Linux). No Windows, aceite as opções padrão. Depois abra o terminal (no VS Code: menu Terminal → Novo Terminal) e confira.",
      ],
      code: { lang: "bash", content: `git --version\n# git version 2.4x.x` },
    },
    {
      heading: "3. Diga ao Git quem é você (passo que quase todo mundo erra)",
      text: [
        "Cada commit leva seu nome e e-mail. O GitHub só conta o commit no seu gráfico de contribuições (os quadradinhos verdes) se o e-mail do commit estiver ligado à sua conta. Um e-mail diferente do cadastrado, e os commits ficam 'sem dono'.",
        "Para não expor seu e-mail pessoal, o GitHub dá um endereço privado. Em GitHub → Settings → Emails, marque 'Keep my email addresses private' e copie o endereço que termina em @users.noreply.github.com. Use esse na configuração.",
      ],
      code: {
        lang: "bash",
        caption: "Faça uma vez por computador",
        content: `git config --global user.name "Seu Nome"\ngit config --global user.email "123456+seuusuario@users.noreply.github.com"\ngit config --global init.defaultBranch main\n\n# conferir\ngit config --global --list`,
      },
      note: "Se commits antigos saíram com o e-mail errado, eles não aparecem no gráfico. Dá para consertar reescrevendo o histórico (git filter-branch ou git rebase), mas é bem mais fácil configurar certo desde o começo.",
    },
    {
      heading: "4. Crie o repositório no GitHub",
      text: [
        "No GitHub, clique em + → New repository. Dê um nome sem espaços (ex.: meu-site), deixe Public (necessário para o plano gratuito de várias hospedagens e para aparecer no seu perfil) e não marque 'Add a README' se o projeto já existe no seu computador, para evitar conflito no primeiro envio.",
        "Ao criar, o GitHub mostra uma página com o endereço do repositório, algo como https://github.com/seuusuario/meu-site.git. Guarde esse endereço.",
      ],
    },
    {
      heading: "5. Envie seu projeto pela primeira vez",
      text: [
        "Na pasta do projeto (cd caminho/da/pasta no terminal), rode os comandos abaixo. git init cria o repositório local, git add . seleciona tudo, git commit guarda uma versão com uma mensagem, git remote liga ao GitHub e git push envia.",
      ],
      code: {
        lang: "bash",
        content: `cd meu-site\ngit init\ngit add .\ngit commit -m "primeira versão do site"\ngit branch -M main\ngit remote add origin https://github.com/seuusuario/meu-site.git\ngit push -u origin main`,
      },
      note: "No primeiro push, o terminal pede autenticação. O GitHub não aceita mais senha: use um Personal Access Token (próximo passo) ou o login pelo navegador que o Git Credential Manager abre sozinho no Windows/Mac.",
    },
    {
      heading: "6. Autenticação: token ou chave SSH",
      text: [
        "Opção A, token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Escolha só o repositório que precisa, permissão Contents: Read and write, e validade curta. Cole o token quando o terminal pedir a senha.",
        "Opção B, SSH (melhor a longo prazo, você configura uma vez e esquece): gere uma chave, copie a parte pública para GitHub → Settings → SSH keys e troque o endereço do remote para o formato git@github.com.",
        "Regra de ouro para qualquer token: ele é uma senha. Nunca escreva em arquivo do projeto, não faça commit dele e revogue quando terminar de usar.",
      ],
      code: {
        lang: "bash",
        caption: "Opção B: SSH",
        content: `ssh-keygen -t ed25519 -C "seuemail@exemplo.com"\n# aperte Enter nas perguntas; depois copie a chave pública:\ncat ~/.ssh/id_ed25519.pub\n\n# usar SSH no repositório\ngit remote set-url origin git@github.com:seuusuario/meu-site.git\nssh -T git@github.com   # deve responder com seu usuário`,
      },
    },
    {
      heading: "7. Crie um .gitignore antes de ir longe",
      text: [
        "Há arquivos que nunca devem ir para o GitHub: dependências pesadas (node_modules), builds e, principalmente, segredos (.env com chaves de API). O .gitignore diz ao Git o que ignorar.",
        "Se você já deu commit em um arquivo sensível, apagar depois não basta: ele continua no histórico. Considere a chave vazada, gere outra e só então limpe o histórico.",
      ],
      code: {
        lang: "bash",
        caption: ".gitignore para projetos Node/Next.js",
        content: `node_modules/\n.next/\ndist/\nbuild/\n.env\n.env.*\n!.env.example\n.DS_Store\n.vscode/*\n!.vscode/*.code-snippets`,
      },
    },
    {
      heading: "8. Publique na Vercel",
      text: [
        "Em vercel.com, entre com o GitHub e clique em Add New → Project. Escolha o repositório, confira o framework (a Vercel detecta Next.js, Vite, Astro etc. sozinha; para um site de HTML puro, deixe 'Other') e clique em Deploy.",
        "Em cerca de um minuto você recebe um endereço como meu-site.vercel.app. A partir daí, cada git push na branch main gera um novo deploy automático; pushes em outras branches geram um endereço de pré-visualização.",
      ],
      note: "Variáveis de ambiente (chaves, URLs de banco) ficam em Project → Settings → Environment Variables. Nunca no código.",
    },
    {
      heading: "9. O ciclo do dia a dia",
      text: [
        "Quando mexer no site: edite, teste local, e rode os três comandos. A mensagem do commit deve dizer o que mudou e por quê, pois é o seu histórico (e o de quem for ler seu perfil).",
      ],
      code: {
        lang: "bash",
        content: `git status                       # o que mudou?\ngit add .\ngit commit -m "adiciona seção de preços"\ngit push                         # a Vercel publica sozinha`,
      },
    },
    {
      heading: "10. Trabalhando sem medo de quebrar: branches",
      text: [
        "Quer testar algo grande sem arriscar o site que está no ar? Crie uma branch. A Vercel gera um endereço de teste para ela; quando estiver bom, junte na main.",
      ],
      code: {
        lang: "bash",
        content: `git switch -c nova-pagina        # cria e entra na branch\n# ...edite, git add, git commit...\ngit push -u origin nova-pagina   # a Vercel cria um preview\n\n# aprovado? volte e junte\ngit switch main\ngit merge nova-pagina\ngit push`,
      },
    },
    {
      heading: "11. Domínio próprio (opcional)",
      text: [
        "Em Project → Settings → Domains, adicione seu domínio e siga as instruções de DNS que a Vercel mostra (um registro A ou CNAME no painel de onde você comprou o domínio). O HTTPS é emitido automaticamente.",
      ],
    },
    {
      heading: "12. Erros comuns e como resolver",
      text: [
        "'rejected — non-fast-forward': o GitHub tem commits que você não tem (ex.: criou o README no site). Rode git pull --rebase e depois git push.",
        "'Permission denied' ou 'Authentication failed': token expirado/sem permissão de Contents (Read and write) ou chave SSH não cadastrada.",
        "Build falha na Vercel mas funciona no seu computador: costuma ser variável de ambiente faltando, diferença de maiúsculas/minúsculas em nome de arquivo (Linux diferencia) ou erro de lint/tipos que só aparece no build. Rode npm run build local antes do push.",
        "Os commits não aparecem no gráfico: confira o passo 3 (e-mail do commit), se o repo é seu (não fork) e se o push foi na branch principal.",
      ],
      code: {
        lang: "bash",
        content: `git log --format='%h %an <%ae> %s' -5   # confere autor e e-mail dos últimos commits\ngit pull --rebase                         # traz o que faltava antes de enviar\nnpm run build                             # simula o build da Vercel`,
      },
    },
  ],
};

export default guide;
