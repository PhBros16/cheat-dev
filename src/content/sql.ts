import { Language } from "@/lib/types";

const sql: Language = {
  slug: "sql",
  title: "SQL",
  short: "Structured Query Language",
  tagline: "Como conversar com um banco de dados relacional.",
  color: "#1F9C7A",
  codeLang: "sql",
  categories: [
    {
      slug: "consultas",
      title: "Consultas Básicas",
      description:
        "O ponto de partida de qualquer banco: buscar, filtrar e ordenar linhas de uma tabela.",
      entries: [
        {
          slug: "select-where",
          title: "SELECT ... WHERE",
          summary: "Busca colunas específicas, filtrando linhas por uma condição.",
          syntax: `SELECT coluna1, coluna2\nFROM tabela\nWHERE condicao;`,
          description: [
            "SELECT define quais colunas você quer ver (ou * para todas). WHERE filtra quais linhas entram no resultado, comparando colunas com valores usando =, !=, >, <, AND, OR, IN, BETWEEN, entre outros.",
          ],
          examples: [
            {
              code: `SELECT nome, email
FROM usuarios
WHERE ativo = true AND idade >= 18;`,
            },
            {
              code: `SELECT * FROM pedidos
WHERE status IN ('pendente', 'processando');`,
            },
          ],
          useWhen: ["Buscar dados que atendem a uma ou mais condições"],
          avoidWhen: ["Filtrar por um valor calculado a partir de agregação (SUM, COUNT...) — para isso use HAVING"],
          related: ["sql/consultas/order-by", "sql/avancado/group-by-having"],
        },
        {
          slug: "order-by",
          title: "ORDER BY",
          summary: "Ordena o resultado por uma ou mais colunas.",
          syntax: `SELECT * FROM tabela\nORDER BY coluna ASC|DESC;`,
          description: [
            "ASC (padrão) ordena do menor para o maior / A-Z; DESC faz o inverso. Pode ordenar por várias colunas — a segunda serve de critério de desempate da primeira.",
          ],
          examples: [
            {
              code: `SELECT nome, preco
FROM produtos
ORDER BY preco DESC, nome ASC;`,
              caption: "Mais caros primeiro; em caso de empate, ordem alfabética",
            },
          ],
          useWhen: ["Apresentar resultados em uma ordem específica (mais recente, mais barato, alfabético)"],
          avoidWhen: [],
        },
        {
          slug: "limit",
          title: "LIMIT",
          summary: "Restringe o número de linhas retornadas.",
          syntax: `SELECT * FROM tabela\nORDER BY coluna\nLIMIT quantidade OFFSET pular;`,
          description: [
            "Retorna só as primeiras N linhas do resultado. Combinado com OFFSET, permite paginação: LIMIT 10 OFFSET 20 pega as linhas 21-30.",
          ],
          examples: [
            {
              code: `-- página 3, 10 itens por página
SELECT * FROM produtos
ORDER BY id
LIMIT 10 OFFSET 20;`,
            },
          ],
          useWhen: ["Paginação", "Pegar só o 'top N' de algo (ex: 5 mais vendidos)"],
          avoidWhen: ["Sem ORDER BY, o LIMIT não garante quais linhas você vai receber"],
        },
        {
          slug: "distinct",
          title: "DISTINCT",
          summary: "Remove linhas duplicadas do resultado.",
          syntax: `SELECT DISTINCT coluna FROM tabela;`,
          description: [
            "Retorna apenas valores únicos da(s) coluna(s) selecionada(s). Se selecionar mais de uma coluna, a combinação das duas é que precisa ser única.",
          ],
          examples: [
            {
              code: `SELECT DISTINCT cidade
FROM clientes;`,
              caption: "Lista todas as cidades sem repetição",
            },
          ],
          useWhen: ["Listar valores únicos (categorias, cidades, status existentes)"],
          avoidWhen: ["Tabelas grandes sem necessidade real — DISTINCT tem custo de processamento"],
        },
        {
          slug: "like",
          title: "LIKE",
          summary: "Filtra texto por um padrão, com curingas.",
          syntax: `WHERE coluna LIKE 'padrao%'`,
          description: [
            "% substitui qualquer sequência de caracteres; _ substitui exatamente um caractere. 'abc%' acha o que começa com 'abc'; '%abc' o que termina; '%abc%' o que contém.",
          ],
          examples: [
            {
              code: `SELECT * FROM usuarios
WHERE email LIKE '%@gmail.com';`,
            },
            {
              code: `SELECT * FROM produtos
WHERE nome LIKE 'Caneca%';`,
            },
          ],
          useWhen: ["Busca de texto simples (nome, e-mail, começa/termina com)"],
          avoidWhen: ["Busca de texto complexa em muitos dados — considere índices de full-text search"],
        },
      ],
    },
    {
      slug: "avancado",
      title: "Junções & Agregação",
      description:
        "Como combinar dados de várias tabelas e transformar muitas linhas em um resumo.",
      entries: [
        {
          slug: "inner-join",
          title: "INNER JOIN",
          summary: "Combina linhas de duas tabelas onde há correspondência.",
          syntax: `SELECT *\nFROM tabelaA\nINNER JOIN tabelaB ON tabelaA.id = tabelaB.tabelaA_id;`,
          description: [
            "Junta linhas de duas tabelas com base numa condição (geralmente chave estrangeira = chave primária). Só aparecem no resultado as linhas que TÊM correspondência nas duas tabelas.",
            "Para incluir também as linhas sem correspondência, use LEFT JOIN (mantém tudo da tabela da esquerda) ou RIGHT JOIN.",
          ],
          examples: [
            {
              code: `SELECT pedidos.id, clientes.nome
FROM pedidos
INNER JOIN clientes ON pedidos.cliente_id = clientes.id;`,
            },
          ],
          useWhen: ["Buscar dados relacionados de tabelas diferentes (pedidos + nome do cliente)"],
          avoidWhen: ["Precisa manter linhas mesmo sem correspondência — use LEFT JOIN"],
        },
        {
          slug: "group-by-having",
          title: "GROUP BY ... HAVING",
          summary: "Agrupa linhas e filtra grupos por um resultado agregado.",
          syntax: `SELECT coluna, COUNT(*)\nFROM tabela\nGROUP BY coluna\nHAVING COUNT(*) > valor;`,
          description: [
            "GROUP BY agrupa linhas que têm o mesmo valor numa coluna, permitindo usar funções de agregação (COUNT, SUM, AVG, MAX, MIN) por grupo. HAVING filtra os GRUPOS depois de agregados — WHERE não pode fazer isso, porque roda antes da agregação.",
          ],
          examples: [
            {
              code: `SELECT cliente_id, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY cliente_id
HAVING COUNT(*) > 5;`,
              caption: "Clientes com mais de 5 pedidos",
            },
          ],
          useWhen: ["Relatórios e resumos: total por categoria, média por grupo, contagens"],
          avoidWhen: ["Filtrar linhas individuais antes de agrupar — isso é papel do WHERE"],
          related: ["sql/consultas/select-where"],
        },
        {
          slug: "insert",
          title: "INSERT INTO",
          summary: "Adiciona uma nova linha a uma tabela.",
          syntax: `INSERT INTO tabela (coluna1, coluna2)\nVALUES (valor1, valor2);`,
          description: [
            "Cria uma nova linha, especificando quais colunas você está preenchendo e seus valores, na mesma ordem. Colunas não citadas recebem o valor padrão (ou NULL).",
          ],
          examples: [
            {
              code: `INSERT INTO usuarios (nome, email, ativo)
VALUES ('Marina Costa', 'marina@email.com', true);`,
            },
          ],
          useWhen: ["Cadastrar um novo registro"],
          avoidWhen: [],
        },
        {
          slug: "update",
          title: "UPDATE",
          summary: "Altera valores de linhas existentes.",
          syntax: `UPDATE tabela\nSET coluna = novoValor\nWHERE condicao;`,
          description: [
            "Atualiza as colunas indicadas em SET, mas SÓ nas linhas que atendem ao WHERE. Esquecer o WHERE atualiza a tabela inteira — sempre confira antes de rodar.",
          ],
          examples: [
            {
              code: `UPDATE produtos
SET preco = preco * 1.1
WHERE categoria = 'eletronicos';`,
              caption: "Aumenta 10% no preço só da categoria eletrônicos",
            },
          ],
          useWhen: ["Corrigir ou atualizar dados existentes"],
          avoidWhen: ["Rodar sem WHERE em produção sem ter certeza absoluta — o efeito é em toda a tabela"],
        },
        {
          slug: "delete",
          title: "DELETE",
          summary: "Remove linhas de uma tabela.",
          syntax: `DELETE FROM tabela\nWHERE condicao;`,
          description: [
            "Remove permanentemente as linhas que atendem ao WHERE. Assim como UPDATE, esquecer o WHERE apaga a tabela inteira.",
          ],
          examples: [
            {
              code: `DELETE FROM sessoes
WHERE expirada_em < NOW();`,
              caption: "Remove sessões expiradas",
            },
          ],
          useWhen: ["Remover registros que não são mais necessários"],
          avoidWhen: ["Quando dá para só marcar como inativo (soft delete) — mais seguro que apagar de vez"],
        },
      ],
    },
    {
      slug: "transacoes",
      title: "Transações & Integridade",
      description:
        "Como garantir que operações aconteçam por completo (ou não aconteçam) e que os dados fiquem consistentes.",
      entries: [
        {
          slug: "begin-commit-rollback",
          title: "BEGIN / COMMIT / ROLLBACK",
          summary: "Agrupa várias operações para acontecerem todas juntas, ou nenhuma.",
          syntax: `BEGIN;\nUPDATE ...;\nINSERT ...;\nCOMMIT; -- ou ROLLBACK;`,
          description: [
            "Uma transação garante atomicidade: se algo der errado no meio (queda de conexão, erro de constraint), ROLLBACK desfaz tudo que já rodou. COMMIT confirma as mudanças de forma definitiva. Essencial em operações que envolvem múltiplas tabelas relacionadas (ex: transferência bancária).",
          ],
          examples: [
            {
              code: `BEGIN;

UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

COMMIT;`,
              caption: "Transferência: as duas atualizações acontecem juntas, ou nenhuma acontece",
            },
          ],
          useWhen: ["Operações que precisam ser tudo-ou-nada em múltiplas tabelas/linhas"],
          avoidWhen: ["Uma única instrução simples — bancos já tratam cada comando isolado como transação implícita"],
        },
        {
          slug: "primary-key",
          title: "PRIMARY KEY",
          summary: "Identifica de forma única cada linha de uma tabela.",
          syntax: `CREATE TABLE usuarios (\n  id SERIAL PRIMARY KEY,\n  nome TEXT\n);`,
          description: [
            "Toda tabela deveria ter uma chave primária: um valor (ou combinação de valores) que nunca se repete e nunca é nulo, usado para identificar e referenciar aquela linha especificamente — inclusive em relacionamentos (FOREIGN KEY).",
          ],
          examples: [
            {
              code: `CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  preco NUMERIC(10,2)
);`,
            },
          ],
          useWhen: ["Sempre — toda tabela deveria ter uma"],
          avoidWhen: ["Escolher uma coluna que pode mudar de valor (como email) — prefira um ID interno"],
          related: ["sql/transacoes/foreign-key"],
        },
        {
          slug: "foreign-key",
          title: "FOREIGN KEY",
          summary: "Garante que um valor só existe se apontar para uma linha real de outra tabela.",
          syntax: `CREATE TABLE pedidos (\n  id SERIAL PRIMARY KEY,\n  cliente_id INT REFERENCES clientes(id)\n);`,
          description: [
            "Impede 'dados órfãos': não deixa inserir um pedido com cliente_id que não existe na tabela clientes, nem apagar um cliente que ainda tem pedidos vinculados (a menos que configure ON DELETE CASCADE ou similar).",
          ],
          examples: [
            {
              code: `CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE
);`,
              caption: "ON DELETE CASCADE: apagar o cliente apaga os pedidos dele também",
            },
          ],
          useWhen: ["Sempre que uma tabela referencia outra (pedido → cliente, comentário → post)"],
          avoidWhen: ["ON DELETE CASCADE sem pensar — pode apagar dados em cadeia sem querer"],
          related: ["sql/transacoes/primary-key", "sql/avancado/inner-join"],
        },
        {
          slug: "unique-not-null",
          title: "UNIQUE / NOT NULL",
          summary: "Impede valores duplicados ou vazios numa coluna.",
          syntax: `email TEXT UNIQUE NOT NULL`,
          description: [
            "NOT NULL obriga que a coluna sempre tenha um valor. UNIQUE garante que nenhum outro registro tenha o mesmo valor naquela coluna (ex: dois usuários não podem ter o mesmo e-mail). Podem ser combinados na mesma coluna.",
          ],
          examples: [
            {
              code: `CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE
);`,
            },
          ],
          useWhen: ["Campos que não fazem sentido duplicados (e-mail, CPF, username) ou nunca vazios"],
          avoidWhen: ["Colunas que legitimamente podem repetir ou ficar em branco às vezes"],
        },
        {
          slug: "check-constraint",
          title: "CHECK",
          summary: "Valida uma condição antes de aceitar o valor numa coluna.",
          syntax: `preco NUMERIC CHECK (preco >= 0)`,
          description: [
            "Rejeita a inserção/atualização se a condição for falsa. Garante regras de negócio diretamente no banco, como uma segunda linha de defesa além da validação na aplicação.",
          ],
          examples: [
            {
              code: `CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  preco NUMERIC CHECK (preco >= 0),
  estoque INT CHECK (estoque >= 0)
);`,
            },
          ],
          useWhen: ["Regras simples de validação de valor (preço não-negativo, status dentro de uma lista)"],
          avoidWhen: ["Regras complexas que dependem de outras tabelas — isso é papel de trigger ou da aplicação"],
        },
      ],
    },
    {
      slug: "funcoes",
      title: "Funções & Subconsultas",
      description:
        "Recursos para calcular, transformar e combinar valores dentro da própria consulta.",
      entries: [
        {
          slug: "case-when",
          title: "CASE WHEN",
          summary: "Um if/else dentro do SQL.",
          syntax: `CASE\n  WHEN condicao THEN valor\n  ELSE outroValor\nEND`,
          description: [
            "Avalia condições em ordem e retorna o valor do primeiro WHEN verdadeiro; ELSE é o padrão se nenhum bater (opcional — sem ele, retorna NULL). Pode ser usado no SELECT, WHERE ou ORDER BY.",
          ],
          examples: [
            {
              code: `SELECT
  nome,
  CASE
    WHEN idade < 18 THEN 'menor'
    WHEN idade < 65 THEN 'adulto'
    ELSE 'idoso'
  END AS faixa_etaria
FROM pessoas;`,
            },
          ],
          useWhen: ["Categorizar valores, criar colunas calculadas condicionais em relatórios"],
          avoidWhen: ["Muitos WHEN encadeados podem ficar difíceis de ler — considere resolver na aplicação"],
        },
        {
          slug: "coalesce",
          title: "COALESCE",
          summary: "Retorna o primeiro valor não-nulo de uma lista.",
          syntax: `COALESCE(valor1, valor2, valorPadrao)`,
          description: [
            "Percorre os argumentos em ordem e retorna o primeiro que não for NULL. Muito usado para substituir NULL por um valor padrão de exibição, ou para 'preencher' com uma alternativa quando o principal falta.",
          ],
          examples: [
            {
              code: `SELECT nome, COALESCE(apelido, nome, 'Sem nome') AS exibicao
FROM usuarios;`,
              caption: "Usa o apelido se existir, senão o nome, senão um texto padrão",
            },
          ],
          useWhen: ["Exibir um valor alternativo quando a coluna principal pode ser NULL"],
          avoidWhen: ["Mascarar um NULL que deveria ser investigado/corrigido na origem"],
        },
        {
          slug: "cast",
          title: "CAST",
          summary: "Converte um valor de um tipo para outro.",
          syntax: `CAST(valor AS tipo)\n-- ou: valor::tipo (atalho do Postgres)`,
          description: [
            "Converte explicitamente entre tipos — texto para número, número para texto, string para data, etc. Necessário quando o banco não converte automaticamente ou quando você quer garantir o tipo do resultado.",
          ],
          examples: [
            {
              code: `SELECT CAST('42' AS INTEGER) + 8;
-- 50

SELECT preco::TEXT || ' reais' FROM produtos;
-- atalho do Postgres com ::`,
            },
          ],
          useWhen: ["Comparar/combinar colunas de tipos diferentes, formatar saída"],
          avoidWhen: ["Conversões que podem falhar silenciosamente ou perder precisão (ex: texto não numérico para INTEGER)"],
        },
        {
          slug: "subquery",
          title: "Subconsulta (WHERE ... IN)",
          summary: "Uma consulta SELECT usada dentro de outra.",
          syntax: `SELECT * FROM tabela\nWHERE coluna IN (SELECT coluna FROM outraTabela WHERE condicao);`,
          description: [
            "Permite filtrar uma consulta com base no resultado de outra, sem precisar de duas idas ao banco. A subconsulta roda primeiro (ou por linha, dependendo do caso) e o resultado alimenta a consulta externa.",
          ],
          examples: [
            {
              code: `SELECT nome FROM produtos
WHERE id IN (
  SELECT produto_id FROM pedidos WHERE quantidade > 10
);`,
              caption: "Produtos que já tiveram algum pedido com mais de 10 unidades",
            },
          ],
          useWhen: ["Filtrar com base em um critério calculado a partir de outra tabela"],
          avoidWhen: ["Quando um JOIN resolve de forma mais direta e geralmente mais performática"],
          related: ["sql/avancado/inner-join"],
        },
        {
          slug: "funcoes-data",
          title: "Funções de data (NOW, DATE_TRUNC)",
          summary: "Manipulam e formatam valores de data/hora.",
          syntax: `NOW();\nDATE_TRUNC('month', data);\nEXTRACT(YEAR FROM data);`,
          description: [
            "NOW() retorna o timestamp atual. DATE_TRUNC arredonda uma data para uma unidade (dia, mês, ano), ótimo para agrupar registros por mês. EXTRACT pega uma parte específica (ano, mês, dia da semana) de uma data.",
          ],
          examples: [
            {
              code: `SELECT DATE_TRUNC('month', criado_em) AS mes, COUNT(*)
FROM pedidos
GROUP BY mes
ORDER BY mes;`,
              caption: "Total de pedidos agrupados por mês",
            },
          ],
          useWhen: ["Relatórios agrupados por período (dia, mês, ano)"],
          avoidWhen: ["Nomes de função variam entre bancos (MySQL usa DATE_FORMAT, por exemplo) — confira a documentação do seu SGBD"],
        },
      ],
    },
  ],
};

export default sql;
