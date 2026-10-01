import { Q, cat } from "@/content/helpers";

export const sqlA = [
  cat("joins-avancados", "Junções Avançadas", "Além do INNER JOIN: incluindo linhas sem correspondência, e combinando resultados.", [
    Q({ s: "left-right-join", t: "LEFT JOIN / RIGHT JOIN", d: "Mantêm todas as linhas de um lado, mesmo sem correspondência do outro.", x: "SELECT *\nFROM A LEFT JOIN B ON A.id = B.a_id;",
      n: "LEFT JOIN mantém todas as linhas da tabela da esquerda, preenchendo com NULL onde não há correspondência na direita. RIGHT JOIN faz o inverso. Na prática, quase todo mundo usa só LEFT JOIN (invertendo a ordem das tabelas quando precisar).",
      ex: `-- Todo cliente aparece, mesmo os que nunca fizeram pedido (id vem NULL)
SELECT clientes.nome, pedidos.id
FROM clientes
LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id;`,
      k: "clientes sem pedido|manter todas as linhas|junção com nulos|left join right join" }),
    Q({ s: "full-outer-join", t: "FULL OUTER JOIN", d: "Mantém todas as linhas das duas tabelas, com ou sem correspondência.", x: "SELECT * FROM A FULL OUTER JOIN B ON A.id = B.a_id;",
      n: "Combina o comportamento do LEFT e do RIGHT JOIN: nada se perde de nenhum dos dois lados. Nem todo banco suporta nativamente (MySQL não tem — simula com UNION de LEFT e RIGHT JOIN).",
      ex: `SELECT a.nome, b.nome
FROM tabela_a a
FULL OUTER JOIN tabela_b b ON a.id = b.a_id;`,
      k: "junção completa|todas as linhas dos dois lados|full join" }),
    Q({ s: "self-join", t: "Self Join", d: "Junta uma tabela com ela mesma.", x: "SELECT a.nome, b.nome AS gerente\nFROM funcionarios a JOIN funcionarios b ON a.gerente_id = b.id;",
      n: "Útil para relações hierárquicas (funcionário → gerente, categoria → categoria pai). Sempre use aliases diferentes para cada 'cópia' da tabela.",
      ex: `SELECT f.nome AS funcionario, g.nome AS gerente
FROM funcionarios f
JOIN funcionarios g ON f.gerente_id = g.id;`,
      k: "relação hierárquica|funcionário e gerente|tabela com ela mesma|self join" }),
    Q({ s: "union", t: "UNION / UNION ALL", d: "Combina o resultado de duas consultas em uma lista só.", x: "SELECT col FROM a\nUNION\nSELECT col FROM b;",
      n: "As duas consultas precisam ter o mesmo número de colunas e tipos compatíveis. UNION remove duplicatas automaticamente (mais lento); UNION ALL mantém tudo, inclusive repetidos (mais rápido).",
      ex: `SELECT nome FROM clientes_ativos
UNION ALL
SELECT nome FROM clientes_inativos;`,
      k: "combinar resultados de duas consultas|unir tabelas diferentes|union all" }),
    Q({ s: "exists", t: "EXISTS", d: "Testa se uma subconsulta retorna alguma linha.", x: "SELECT * FROM a\nWHERE EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id);",
      n: "Diferente de IN, EXISTS para assim que encontra a primeira linha correspondente — geralmente mais rápido para checar 'existe pelo menos um'.",
      ex: `-- Clientes que têm pelo menos um pedido
SELECT nome FROM clientes c
WHERE EXISTS (
  SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id
);`,
      k: "verificar se existe|pelo menos um registro|exists subquery" }),
  ]),

  cat("agregacao-detalhada", "Funções de Agregação", "COUNT, SUM, AVG, MAX e MIN — a base de qualquer relatório.", [
    Q({ s: "count", t: "COUNT()", d: "Conta o número de linhas (ou de valores não-nulos).", x: "COUNT(*)\nCOUNT(coluna)\nCOUNT(DISTINCT coluna)",
      n: "COUNT(*) conta todas as linhas, inclusive com NULL. COUNT(coluna) ignora linhas onde essa coluna é NULL. COUNT(DISTINCT coluna) conta só valores únicos.",
      ex: `SELECT COUNT(*) AS total_pedidos FROM pedidos;
SELECT COUNT(DISTINCT cliente_id) AS clientes_unicos FROM pedidos;`,
      k: "contar linhas|contar registros|total de registros|quantidade de itens" }),
    Q({ s: "sum-avg", t: "SUM() / AVG()", d: "Somam ou tiram a média de uma coluna numérica.", x: "SUM(coluna)\nAVG(coluna)",
      ex: `SELECT SUM(valor) AS receita_total, AVG(valor) AS ticket_medio
FROM pedidos;`,
      k: "somar coluna|total de vendas|média|valor médio|soma total" }),
    Q({ s: "max-min", t: "MAX() / MIN()", d: "Retornam o maior ou menor valor de uma coluna.", x: "MAX(coluna)\nMIN(coluna)",
      ex: `SELECT MAX(preco) AS mais_caro, MIN(preco) AS mais_barato
FROM produtos;`,
      k: "maior valor|menor valor|preço máximo|preço mínimo" }),
  ]),

  cat("ddl", "Definição de Tabelas (DDL)", "Criar, alterar e remover a estrutura de tabelas.", [
    Q({ s: "alter-add-column", t: "ALTER TABLE ... ADD COLUMN", d: "Adiciona uma nova coluna a uma tabela existente.", x: "ALTER TABLE tabela ADD COLUMN nome tipo;",
      ex: `ALTER TABLE usuarios ADD COLUMN telefone TEXT;
ALTER TABLE produtos ADD COLUMN ativo BOOLEAN DEFAULT true;`,
      k: "adicionar coluna|nova coluna na tabela|alterar estrutura da tabela" }),
    Q({ s: "alter-drop-column", t: "ALTER TABLE ... DROP COLUMN", d: "Remove uma coluna de uma tabela.", x: "ALTER TABLE tabela DROP COLUMN nome;",
      a: "Remove os dados daquela coluna permanentemente — faça backup antes",
      ex: `ALTER TABLE usuarios DROP COLUMN telefone;`, k: "remover coluna|apagar coluna|deletar coluna da tabela" }),
    Q({ s: "drop-table", t: "DROP TABLE", d: "Apaga uma tabela inteira, com todos os dados.", x: "DROP TABLE tabela;\nDROP TABLE IF EXISTS tabela;",
      n: "IF EXISTS evita erro se a tabela já não existir. Não tem volta — é como um DELETE sem WHERE, mas para a tabela inteira.",
      ex: `DROP TABLE IF EXISTS sessoes_antigas;`,
      a: "Rodar em produção sem certeza absoluta e sem backup", k: "apagar tabela inteira|deletar tabela|remover tabela" }),
    Q({ s: "rename", t: "RENAME TABLE / COLUMN", d: "Renomeia uma tabela ou coluna.", x: "ALTER TABLE t RENAME TO novo_nome;\nALTER TABLE t RENAME COLUMN c TO novo;",
      ex: `ALTER TABLE usuarios RENAME COLUMN nome TO nome_completo;
ALTER TABLE pedidos RENAME TO pedidos_antigos;`,
      k: "renomear tabela|renomear coluna|mudar nome da tabela" }),
  ]),
];
