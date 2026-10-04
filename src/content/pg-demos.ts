/** Versões PostgreSQL das consultas do SQL Lab. Quando um comando não aparece aqui, a mesma consulta roda nos dois motores. */
export const PG_OVERRIDES: Record<string, string> = {
  "upsert": `CREATE TABLE contador_vendas (produto_id INTEGER PRIMARY KEY, total INTEGER);
INSERT INTO contador_vendas VALUES (1, 10);

-- Se o produto já existe, SOMA; se não existe, INSERE
-- (no Postgres, a coluna da tabela precisa do prefixo para não confundir com "excluded")
INSERT INTO contador_vendas (produto_id, total) VALUES (1, 5), (2, 7)
ON CONFLICT (produto_id) DO UPDATE SET total = contador_vendas.total + excluded.total;

SELECT * FROM contador_vendas ORDER BY produto_id;`,
  "delete-vs-truncate": `CREATE TABLE logs (id SERIAL PRIMARY KEY, msg TEXT);
INSERT INTO logs (msg) VALUES ('a'), ('b'), ('c');

DELETE FROM logs WHERE msg = 'b';      -- remove só o que combina
SELECT COUNT(*) AS restantes FROM logs;

TRUNCATE TABLE logs RESTART IDENTITY;  -- esvazia de uma vez e zera o contador do id
SELECT COUNT(*) AS depois FROM logs;

DROP TABLE logs;                       -- apaga a tabela inteira
SELECT to_regclass('logs') AS tabela_existe;  -- NULL = não existe mais`,
  "delete": `-- Antes
SELECT status, COUNT(*) AS qtd FROM pedidos GROUP BY status ORDER BY status;

-- O Postgres SEMPRE respeita chaves estrangeiras: primeiro apague os itens dos pedidos cancelados...
DELETE FROM itens_pedido WHERE pedido_id IN (SELECT id FROM pedidos WHERE status = 'cancelado');
-- ...e só depois os próprios pedidos
DELETE FROM pedidos WHERE status = 'cancelado';

-- Depois: sumiram os cancelados
SELECT status, COUNT(*) AS qtd FROM pedidos GROUP BY status ORDER BY status;`,
  "funcoes-numericas": `SELECT nome, preco,
  ROUND(preco / 3, 2)               AS terco,
  CAST(preco AS INTEGER) / 7        AS divisao_inteira,
  CAST(preco AS INTEGER) % 7        AS resto,
  ABS(preco - 200)                  AS distancia_de_200,
  GREATEST(preco, 100)              AS no_minimo_100   -- Postgres: GREATEST/LEAST (no SQLite, MAX/MIN com 2 valores)
FROM produtos
ORDER BY id
LIMIT 6;`,
  "group-concat": `SELECT categoria,
  COUNT(*) AS qtd,
  STRING_AGG(nome, ', ' ORDER BY nome) AS produtos   -- Postgres: STRING_AGG, com ORDER BY dentro
FROM produtos
GROUP BY categoria
ORDER BY categoria;`,
  "pivot-case": `SELECT to_char(data, 'MM') AS mes,
  SUM(CASE WHEN status = 'pago'      THEN total ELSE 0 END) AS pago,
  SUM(CASE WHEN status = 'pendente'  THEN total ELSE 0 END) AS pendente,
  SUM(CASE WHEN status = 'cancelado' THEN total ELSE 0 END) AS cancelado
FROM pedidos
GROUP BY mes
ORDER BY mes;`,
  "relacionamento-nn": `CREATE TABLE artigos (id SERIAL PRIMARY KEY, titulo TEXT);
CREATE TABLE tags (id SERIAL PRIMARY KEY, nome TEXT UNIQUE);

-- Tabela ASSOCIATIVA: cada linha liga um artigo a uma tag
CREATE TABLE artigos_tags (
  artigo_id INTEGER REFERENCES artigos(id),
  tag_id    INTEGER REFERENCES tags(id),
  PRIMARY KEY (artigo_id, tag_id)   -- impede ligar o mesmo par duas vezes
);

INSERT INTO artigos (titulo) VALUES ('Guia de JOIN'), ('Flexbox do zero');
INSERT INTO tags (nome) VALUES ('sql'), ('css'), ('iniciante');
INSERT INTO artigos_tags VALUES (1, 1), (1, 3), (2, 2), (2, 3);

SELECT a.titulo, STRING_AGG(t.nome, ', ' ORDER BY t.nome) AS tags
FROM artigos a
JOIN artigos_tags x ON x.artigo_id = a.id
JOIN tags t ON t.id = x.tag_id
GROUP BY a.id, a.titulo;`,
  "indice-composto": `CREATE INDEX idx_status_data ON pedidos (status, data);
SET enable_seqscan = off;   -- só para a demonstração: força o Postgres a preferir índice (a tabela é minúscula)

-- ✅ Usa o índice: começa pela PRIMEIRA coluna (status)
EXPLAIN SELECT * FROM pedidos WHERE status = 'pago' AND data >= '2024-06-01';

-- ⚠️ Pula a primeira coluna: o índice é pouco útil para esta busca
EXPLAIN SELECT * FROM pedidos WHERE data >= '2024-06-01';`,
  "funcao-na-coluna": `CREATE INDEX idx_clientes_criado ON clientes (criado_em);
SET enable_seqscan = off;   -- só para a demonstração

-- ✅ Compara a COLUNA diretamente: pode usar o índice
EXPLAIN SELECT * FROM clientes WHERE criado_em >= '2024-03-01' AND criado_em < '2024-04-01';

-- ❌ Aplica uma FUNÇÃO na coluna: o índice não ajuda (Seq Scan)
EXPLAIN SELECT * FROM clientes WHERE to_char(criado_em, 'YYYY-MM') = '2024-03';`,
  "select-asterisco": `CREATE INDEX idx_prod_cat_preco ON produtos (categoria, preco);
SET enable_seqscan = off;

-- Pede SÓ colunas do índice: pode virar "Index Only Scan" (nem toca na tabela)
EXPLAIN SELECT categoria, preco FROM produtos WHERE categoria = 'Livros';

-- SELECT * precisa voltar à tabela para buscar as outras colunas
EXPLAIN SELECT * FROM produtos WHERE categoria = 'Livros';`,
  "autoincrement": `CREATE TABLE exemplo_auto (id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, nome TEXT);

-- RETURNING devolve o id gerado, na mesma viagem ao banco
INSERT INTO exemplo_auto (nome) VALUES ('primeiro'), ('segundo') RETURNING id, nome;

SELECT * FROM exemplo_auto;`,
  "datas-por-banco": `-- Datas no PostgreSQL: operadores com DATE/INTERVAL, to_char() e EXTRACT()
SELECT (DATE '2024-01-31' + INTERVAL '1 month')::date AS mais_um_mes,   -- 29/02: o Postgres ajusta ao último dia do mês
       DATE '2024-03-15' - 7                           AS semana_passada,
       to_char(DATE '2024-03-15', 'DD/MM/YYYY')        AS formatada,
       DATE '2024-12-25' - DATE '2024-03-15'           AS dias_entre;`,
  "json-no-sql": `CREATE TABLE eventos (id SERIAL PRIMARY KEY, dados JSONB);   -- JSONB: binário, indexável
INSERT INTO eventos (dados) VALUES
  ('{"tipo":"clique","pagina":"/home","tags":["a","b","c"]}'),
  ('{"tipo":"compra","valor":199.9,"itens":[{"sku":"X1","qtd":2}]}');

SELECT id,
  dados ->> 'tipo'                     AS tipo,          -- ->> devolve TEXTO
  (dados ->> 'valor')::numeric         AS valor,
  dados -> 'itens' -> 0 ->> 'sku'      AS primeiro_sku,  -- -> devolve JSON (dá para encadear)
  jsonb_array_length(dados -> 'tags')  AS qtd_tags
FROM eventos;`,
  "gerar-sequencia": `-- Postgres tem a série pronta: generate_series
SELECT x, x * x AS quadrado FROM generate_series(1, 10) AS x;

-- Calendário: os 7 dias a partir de uma data
SELECT d::date AS dia, to_char(d, 'TMDay') AS dia_da_semana
FROM generate_series(DATE '2024-03-01', DATE '2024-03-07', INTERVAL '1 day') AS d;`,
  "primary-key": `CREATE TABLE exemplo (id SERIAL PRIMARY KEY, nome TEXT);
INSERT INTO exemplo (nome) VALUES ('A'), ('B');   -- o id é gerado sozinho (SERIAL)

-- Experimente tirar o "--" da linha abaixo: o banco recusa um id repetido
-- INSERT INTO exemplo (id, nome) VALUES (1, 'repetido');

SELECT * FROM exemplo;`,
  "foreign-key": `-- No Postgres a chave estrangeira é SEMPRE verificada (não existe PRAGMA)
CREATE TABLE autor (id SERIAL PRIMARY KEY, nome TEXT);
CREATE TABLE livro (id SERIAL PRIMARY KEY, titulo TEXT, autor_id INTEGER REFERENCES autor(id));
INSERT INTO autor (nome) VALUES ('Machado de Assis');
INSERT INTO livro (titulo, autor_id) VALUES ('Dom Casmurro', 1);

-- Tire o "--" para ver o erro (autor 99 não existe):
-- INSERT INTO livro (titulo, autor_id) VALUES ('Livro órfão', 99);

SELECT l.titulo, a.nome FROM livro l JOIN autor a ON a.id = l.autor_id;`,
  "unique-not-null": `CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL
);
INSERT INTO usuarios (email, nome) VALUES ('ana@email.com', 'Ana');

-- Descomente uma linha por vez para ver cada erro:
-- INSERT INTO usuarios (email, nome) VALUES ('ana@email.com', 'Outra Ana');  -- UNIQUE
-- INSERT INTO usuarios (email, nome) VALUES ('x@email.com', NULL);          -- NOT NULL

SELECT * FROM usuarios;`,
  "check-constraint": `CREATE TABLE ofertas (
  id SERIAL PRIMARY KEY,
  preco NUMERIC CHECK (preco > 0),
  desconto INTEGER CHECK (desconto BETWEEN 0 AND 100)
);
INSERT INTO ofertas (preco, desconto) VALUES (99.9, 15);

-- Tire o "--" para ver a regra barrar dados inválidos:
-- INSERT INTO ofertas (preco, desconto) VALUES (-5, 150);

SELECT * FROM ofertas;`,
  "funcoes-data": `-- Datas no PostgreSQL: to_char(), EXTRACT() e subtração de datas
SELECT id, data,
  to_char(data, 'YYYY-MM')             AS mes,
  EXTRACT(DOW FROM data)               AS dia_da_semana,   -- 0 = domingo
  DATE '2025-01-01' - data             AS dias_ate_2025
FROM pedidos
ORDER BY data
LIMIT 8;`,
  "drop-table": `CREATE TABLE rascunho (x INTEGER);
SELECT table_name AS tabelas_antes FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1;

DROP TABLE rascunho;   -- some para sempre!

SELECT table_name AS tabelas_depois FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1;`,
  "create-index": `SET enable_seqscan = off;   -- só para a demonstração (a tabela é minúscula)

-- Sem índice em cliente_id
EXPLAIN SELECT * FROM pedidos WHERE cliente_id = 3;

CREATE INDEX idx_pedidos_cliente ON pedidos (cliente_id);

-- Com índice: "Index Scan" / "Bitmap Index Scan"
EXPLAIN SELECT * FROM pedidos WHERE cliente_id = 3;`,
  "explain": `-- No Postgres: EXPLAIN mostra o plano; EXPLAIN ANALYZE também EXECUTA e mede o tempo real.
EXPLAIN ANALYZE
SELECT c.nome, SUM(p.total)
FROM pedidos p JOIN clientes c ON c.id = p.cliente_id
WHERE p.status = 'pago'
GROUP BY c.id;`,
};
