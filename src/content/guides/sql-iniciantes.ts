import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "sql-da-tabela-ao-relatorio",
  title: "SQL para iniciantes: da tabela ao relatório",
  summary: "Crie tabelas, insira dados, relacione, filtre e monte um relatório agrupado — o ciclo completo do SQL.",
  level: "iniciante",
  minutes: 14,
  tags: ["sql", "banco de dados"],
  steps: [
    {
      heading: "1. Criando as tabelas",
      text: [
        "Um mini sistema de pedidos: clientes e pedidos, relacionados por uma chave estrangeira. Repare no PRIMARY KEY (identificador único) e no FOREIGN KEY (garante que todo pedido aponte para um cliente real).",
      ],
      code: {
        lang: "sql",
        content: `CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  produto TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  criado_em DATE NOT NULL
);`,
      },
    },
    {
      heading: "2. Inserindo dados",
      text: ["Alguns clientes e pedidos de exemplo para trabalharmos em cima."],
      code: {
        lang: "sql",
        content: `INSERT INTO clientes (nome, cidade) VALUES
  ('Ana Souza', 'Natal'),
  ('Bruno Lima', 'Recife'),
  ('Carla Dias', 'Natal');

INSERT INTO pedidos (cliente_id, produto, valor, criado_em) VALUES
  (1, 'Teclado mecânico', 350.00, '2026-01-10'),
  (1, 'Mouse',            120.00, '2026-02-03'),
  (2, 'Monitor',          890.00, '2026-01-22'),
  (3, 'Cadeira gamer',    1200.00, '2026-02-15');`,
      },
    },
    {
      heading: "3. Consultas básicas: filtrar e ordenar",
      text: ["Todo pedido acima de R$300, do mais caro para o mais barato."],
      code: {
        lang: "sql",
        content: `SELECT produto, valor
FROM pedidos
WHERE valor > 300
ORDER BY valor DESC;`,
      },
    },
    {
      heading: "4. Juntando as duas tabelas",
      text: [
        "Sozinha, a tabela pedidos só tem 'cliente_id' — um número sem significado para quem lê o relatório. Com INNER JOIN, trazemos o nome do cliente junto.",
      ],
      code: {
        lang: "sql",
        content: `SELECT clientes.nome, pedidos.produto, pedidos.valor
FROM pedidos
INNER JOIN clientes ON clientes.id = pedidos.cliente_id
ORDER BY pedidos.valor DESC;`,
      },
    },
    {
      heading: "5. O relatório: total gasto por cliente",
      text: [
        "GROUP BY agrupa as linhas por cliente; SUM soma o valor de cada grupo. Isso transforma 4 linhas de pedidos em 3 linhas de relatório — uma por cliente.",
      ],
      code: {
        lang: "sql",
        content: `SELECT
  clientes.nome,
  COUNT(pedidos.id) AS total_pedidos,
  SUM(pedidos.valor) AS total_gasto
FROM clientes
LEFT JOIN pedidos ON pedidos.cliente_id = clientes.id
GROUP BY clientes.nome
ORDER BY total_gasto DESC;`,
      },
      note: "Usamos LEFT JOIN (em vez de INNER) para garantir que clientes sem nenhum pedido ainda apareçam no relatório, com total 0 — INNER JOIN os esconderia.",
    },
    {
      heading: "6. Filtrando o próprio agrupado com HAVING",
      text: [
        "WHERE não funciona em valores agregados (como SUM) — para isso existe HAVING, que filtra depois do agrupamento. Aqui: só clientes que gastaram mais de R$400 no total.",
      ],
      code: {
        lang: "sql",
        content: `SELECT clientes.nome, SUM(pedidos.valor) AS total_gasto
FROM clientes
JOIN pedidos ON pedidos.cliente_id = clientes.id
GROUP BY clientes.nome
HAVING SUM(pedidos.valor) > 400;`,
      },
    },
  ],
};

export default guide;
