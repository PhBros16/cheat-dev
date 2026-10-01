import { Q, cat } from "@/content/helpers";

export const sqlB = [
  cat("indices-performance", "Índices & Performance", "Como fazer consultas grandes rodarem rápido.", [
    Q({ s: "create-index", t: "CREATE INDEX", d: "Cria um índice para acelerar buscas numa coluna.", x: "CREATE INDEX idx_nome ON tabela (coluna);",
      n: "Um índice funciona como o índice de um livro: em vez de ler tabela inteira, o banco vai direto ao ponto. Colunas usadas com frequência em WHERE, JOIN e ORDER BY são boas candidatas. O custo é: escrita (INSERT/UPDATE) fica um pouco mais lenta, e o índice ocupa espaço em disco.",
      ex: `CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios (email);`,
      u: "Colunas muito consultadas em WHERE/JOIN em tabelas grandes",
      a: "Criar índice em toda coluna 'por garantia' — cada índice tem custo de escrita e espaço",
      k: "acelerar consulta lenta|otimizar busca|index no banco|melhorar performance sql" }),
    Q({ s: "explain", t: "EXPLAIN / EXPLAIN ANALYZE", d: "Mostra como o banco vai executar uma consulta, sem rodar de verdade (ou rodando, com ANALYZE).", x: "EXPLAIN SELECT * FROM tabela WHERE coluna = valor;",
      n: "Revela se a consulta está usando um índice ou varrendo a tabela inteira (sequential/table scan) — é a ferramenta número um para investigar consultas lentas.",
      ex: `EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 42;`,
      k: "consulta lenta|analisar performance|plano de execução|explain analyze|por que está lento" }),
  ]),

  cat("window-functions", "Funções de Janela (Window Functions)", "Cálculos que enxergam outras linhas sem colapsar o resultado, diferente do GROUP BY.", [
    Q({ s: "over-partition", t: "OVER() / PARTITION BY", d: "Aplica uma função de agregação 'olhando' um grupo, sem juntar as linhas em uma só.", x: "SUM(valor) OVER (PARTITION BY categoria)",
      n: "Diferente de GROUP BY (que reduz várias linhas a uma por grupo), uma window function mantém todas as linhas originais e adiciona uma coluna calculada com base no 'grupo' (partição) daquela linha.",
      ex: `SELECT
  nome,
  categoria,
  preco,
  AVG(preco) OVER (PARTITION BY categoria) AS media_categoria
FROM produtos;`,
      k: "média por categoria sem agrupar|comparar com a média do grupo|window function|over partition by" }),
    Q({ s: "row-number-rank", t: "ROW_NUMBER() / RANK()", d: "Numeram as linhas dentro de uma ordenação.", x: "ROW_NUMBER() OVER (ORDER BY coluna)\nRANK() OVER (ORDER BY coluna)",
      n: "ROW_NUMBER() sempre dá números únicos e sequenciais (1,2,3...). RANK() dá o mesmo número para empates e pula números depois (1,1,3...). DENSE_RANK() também empata, mas não pula (1,1,2...).",
      ex: `SELECT
  nome,
  pontos,
  RANK() OVER (ORDER BY pontos DESC) AS posicao
FROM jogadores;`,
      k: "ranking|classificação|posição no ranking|numerar linhas|row number" }),
    Q({ s: "lag-lead", t: "LAG() / LEAD()", d: "Acessam o valor de uma linha anterior ou seguinte, sem precisar de self join.", x: "LAG(coluna) OVER (ORDER BY data)\nLEAD(coluna) OVER (ORDER BY data)",
      ex: `SELECT
  mes,
  receita,
  LAG(receita) OVER (ORDER BY mes) AS receita_mes_anterior
FROM vendas_mensais;`,
      k: "comparar com linha anterior|valor do mês anterior|diferença entre linhas|lag lead" }),
  ]),

  cat("views-cte", "Views & CTEs", "Formas de organizar e reutilizar consultas complexas.", [
    Q({ s: "create-view", t: "CREATE VIEW", d: "Salva uma consulta como se fosse uma tabela virtual, reutilizável.", x: "CREATE VIEW nome AS SELECT ...;",
      n: "Uma view não guarda dados — toda vez que é consultada, roda a query original por trás. Ótima para simplificar consultas repetidas ou esconder complexidade/joins de quem só precisa consumir os dados.",
      ex: `CREATE VIEW pedidos_resumo AS
SELECT p.id, c.nome AS cliente, p.total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;

SELECT * FROM pedidos_resumo WHERE total > 100;`,
      k: "tabela virtual|salvar consulta|view sql|reutilizar query" }),
    Q({ s: "with-cte", t: "WITH (CTE)", d: "Dá um nome temporário a uma subconsulta, para deixar o SQL mais legível.", x: "WITH nome AS (\n  SELECT ...\n)\nSELECT * FROM nome;",
      n: "CTE (Common Table Expression) existe só durante aquela consulta — diferente de VIEW, não fica salva no banco. Ótima para quebrar uma query complexa em passos nomeados e legíveis, ou fazer consultas recursivas (WITH RECURSIVE).",
      ex: `WITH vendas_por_mes AS (
  SELECT DATE_TRUNC('month', criado_em) AS mes, SUM(valor) AS total
  FROM pedidos
  GROUP BY mes
)
SELECT * FROM vendas_por_mes WHERE total > 10000;`,
      k: "subconsulta nomeada|quebrar query complexa|common table expression|with recursive" }),
    Q({ s: "between-isnull", t: "BETWEEN / IS NULL", d: "Filtram por uma faixa de valores, ou pela ausência de valor.", x: "WHERE coluna BETWEEN a AND b;\nWHERE coluna IS NULL;",
      n: "BETWEEN inclui os dois limites. Para checar NULL nunca use '= NULL' (sempre falso) — o certo é IS NULL ou IS NOT NULL.",
      ex: `SELECT * FROM produtos WHERE preco BETWEEN 10 AND 50;
SELECT * FROM usuarios WHERE telefone IS NULL;`,
      a: "Usar = NULL ou != NULL — sempre retorna vazio, o certo é IS NULL/IS NOT NULL",
      k: "filtrar por faixa de valores|entre dois valores|campo vazio|valor nulo|is not null" }),
  ]),
];
