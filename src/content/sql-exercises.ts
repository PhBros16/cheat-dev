import type { DbId } from "@/lib/sqlDbs";

export type SqlExercise = {
  id: string;
  db: DbId;
  level: "iniciante" | "intermediário" | "avançado";
  title: string;
  text: string;
  hint: string;
  solution: string;
};

/** Exercícios com correção automática: a consulta do aluno é comparada com o resultado da solução. */
export const SQL_EXERCISES: SqlExercise[] = [
  { id: "loja-1", db: "loja", level: "iniciante", title: "Clientes de Natal", text: "Liste o nome e a cidade de todos os clientes que moram em Natal.", hint: "SELECT colunas FROM tabela WHERE coluna = 'texto'. Textos vão entre aspas simples.", solution: "SELECT nome, cidade FROM clientes WHERE cidade = 'Natal';" },
  { id: "loja-2", db: "loja", level: "iniciante", title: "Os 5 mais baratos", text: "Mostre nome e preço dos 5 produtos mais baratos, do mais barato para o mais caro.", hint: "ORDER BY preco (ASC é o padrão) e depois LIMIT 5.", solution: "SELECT nome, preco FROM produtos ORDER BY preco ASC LIMIT 5;" },
  { id: "loja-3", db: "loja", level: "iniciante", title: "Pedidos por status", text: "Quantos pedidos existem em cada status? Mostre o status e a quantidade.", hint: "GROUP BY status e COUNT(*).", solution: "SELECT status, COUNT(*) FROM pedidos GROUP BY status;" },
  { id: "loja-4", db: "loja", level: "iniciante", title: "Estoque zerado", text: "Quais produtos estão com o estoque zerado? Mostre só o nome.", hint: "WHERE estoque = 0.", solution: "SELECT nome FROM produtos WHERE estoque = 0;" },
  { id: "loja-5", db: "loja", level: "intermediário", title: "Pedidos pagos com o nome do cliente", text: "Para cada pedido pago, mostre o nome do cliente e o total do pedido.", hint: "Junte pedidos com clientes (JOIN ... ON clientes.id = pedidos.cliente_id) e filtre status = 'pago'.", solution: "SELECT c.nome, p.total FROM pedidos p JOIN clientes c ON c.id = p.cliente_id WHERE p.status = 'pago';" },
  { id: "loja-6", db: "loja", level: "intermediário", title: "Quanto cada cliente gastou", text: "Mostre o nome de cada cliente e a soma dos totais dos seus pedidos pagos. Só quem comprou, do que mais gastou para o que menos gastou.", hint: "JOIN + WHERE status = 'pago' + GROUP BY cliente + SUM(total) + ORDER BY ... DESC.", solution: "SELECT c.nome, SUM(p.total) AS gasto FROM pedidos p JOIN clientes c ON c.id = p.cliente_id WHERE p.status = 'pago' GROUP BY c.id, c.nome ORDER BY gasto DESC;" },
  { id: "loja-7", db: "loja", level: "intermediário", title: "Clientes que nunca compraram", text: "Liste o nome dos clientes que nunca fizeram nenhum pedido.", hint: "LEFT JOIN de clientes com pedidos e filtre as linhas em que o pedido veio NULL (IS NULL).", solution: "SELECT c.nome FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id WHERE p.id IS NULL;" },
  { id: "loja-8", db: "loja", level: "intermediário", title: "Produtos nunca vendidos", text: "Quais produtos nunca apareceram em nenhum pedido? Mostre o nome.", hint: "LEFT JOIN de produtos com itens_pedido e procure onde itens_pedido.pedido_id IS NULL. Ou use NOT EXISTS.", solution: "SELECT p.nome FROM produtos p LEFT JOIN itens_pedido i ON i.produto_id = p.id WHERE i.pedido_id IS NULL;" },
  { id: "loja-9", db: "loja", level: "avançado", title: "O mais caro de cada categoria", text: "Para cada categoria de produto, mostre a categoria e o nome do produto mais caro.", hint: "Janela: ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC) numa subconsulta, e depois filtre posição = 1.", solution: "SELECT categoria, nome FROM (SELECT categoria, nome, ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY preco DESC) AS pos FROM produtos) WHERE pos = 1;" },
  { id: "loja-10", db: "loja", level: "avançado", title: "Receita por mês", text: "Mostre a receita mensal (soma dos totais) apenas dos pedidos pagos. Formato do mês: AAAA-MM. Em ordem cronológica.", hint: "strftime('%Y-%m', data) como mês, SUM(total), GROUP BY mês, ORDER BY mês.", solution: "SELECT strftime('%Y-%m', data) AS mes, SUM(total) AS receita FROM pedidos WHERE status = 'pago' GROUP BY mes ORDER BY mes;" },
  { id: "escola-1", db: "escola", level: "iniciante", title: "Alunos da turma 3A", text: "Liste o nome dos alunos da turma 3A.", hint: "WHERE turma = '3A'.", solution: "SELECT nome FROM alunos WHERE turma = '3A';" },
  { id: "escola-2", db: "escola", level: "intermediário", title: "Média por curso", text: "Mostre o nome de cada curso e a média das notas, arredondada para 2 casas.", hint: "JOIN matriculas com cursos, GROUP BY curso, ROUND(AVG(nota), 2). O AVG ignora notas NULL sozinho.", solution: "SELECT c.nome, ROUND(AVG(m.nota), 2) FROM matriculas m JOIN cursos c ON c.id = m.curso_id GROUP BY c.id, c.nome;" },
  { id: "escola-3", db: "escola", level: "intermediário", title: "Média geral abaixo de 7", text: "Quais alunos têm média geral abaixo de 7? Mostre o nome e a média (2 casas decimais).", hint: "GROUP BY aluno e filtre com HAVING AVG(nota) < 7 (WHERE não pode usar funções de agregação).", solution: "SELECT a.nome, ROUND(AVG(m.nota), 2) FROM alunos a JOIN matriculas m ON m.aluno_id = a.id GROUP BY a.id, a.nome HAVING AVG(m.nota) < 7;" },
  { id: "escola-4", db: "escola", level: "avançado", title: "Notas pendentes por aluno", text: "Para cada aluno que tem matrícula sem nota lançada (NULL), mostre o nome e quantas notas faltam.", hint: "WHERE nota IS NULL, JOIN com alunos, GROUP BY aluno e COUNT(*).", solution: "SELECT a.nome, COUNT(*) FROM matriculas m JOIN alunos a ON a.id = m.aluno_id WHERE m.nota IS NULL GROUP BY a.id, a.nome;" },
  { id: "rh-1", db: "rh", level: "iniciante", title: "Salários altos", text: "Liste nome e salário de quem ganha mais de 8000, do maior para o menor salário.", hint: "WHERE salario > 8000 e ORDER BY salario DESC.", solution: "SELECT nome, salario FROM funcionarios WHERE salario > 8000 ORDER BY salario DESC;" },
  { id: "rh-2", db: "rh", level: "intermediário", title: "Salário médio por departamento", text: "Mostre o nome de cada departamento e o salário médio (arredondado, sem casas decimais). Departamentos sem funcionários também devem aparecer (média vazia).", hint: "Comece pela tabela departamentos e use LEFT JOIN com funcionarios, assim departamentos vazios não somem.", solution: "SELECT d.nome, ROUND(AVG(f.salario)) FROM departamentos d LEFT JOIN funcionarios f ON f.depto_id = d.id GROUP BY d.id, d.nome;" },
  { id: "rh-3", db: "rh", level: "avançado", title: "Acima da média do próprio departamento", text: "Quem ganha mais do que a média salarial do seu próprio departamento? Mostre só o nome.", hint: "Subconsulta correlacionada: WHERE salario > (SELECT AVG(salario) FROM funcionarios WHERE depto_id = f.depto_id). Ou AVG() OVER (PARTITION BY ...).", solution: "SELECT f.nome FROM funcionarios f WHERE f.salario > (SELECT AVG(salario) FROM funcionarios WHERE depto_id = f.depto_id);" },
  { id: "rh-4", db: "rh", level: "avançado", title: "Gerentes e subordinados", text: "Mostre cada gerente e quantos subordinados diretos ele tem. Do maior número para o menor.", hint: "Self join: funcionarios f JOIN funcionarios g ON g.id = f.gerente_id, depois GROUP BY g.id e COUNT(*).", solution: "SELECT g.nome, COUNT(*) AS subordinados FROM funcionarios f JOIN funcionarios g ON g.id = f.gerente_id GROUP BY g.id, g.nome ORDER BY subordinados DESC;" },
];

/** Aulas guiadas: pontos de partida para explorar no SQL Lab (usam as consultas dos comandos). */
export const SQL_LESSONS: { slug: string; title: string; level: SqlExercise["level"] }[] = [
  { slug: "select-where", title: "Filtrar linhas (WHERE)", level: "iniciante" },
  { slug: "order-by", title: "Ordenar (ORDER BY)", level: "iniciante" },
  { slug: "like", title: "Buscar por texto (LIKE)", level: "iniciante" },
  { slug: "between-isnull", title: "BETWEEN e IS NULL", level: "iniciante" },
  { slug: "group-by-having", title: "Agrupar (GROUP BY + HAVING)", level: "intermediário" },
  { slug: "inner-join", title: "Juntar tabelas (INNER JOIN)", level: "intermediário" },
  { slug: "left-right-join", title: "LEFT JOIN: manter quem não tem par", level: "intermediário" },
  { slug: "case-when", title: "Condições (CASE WHEN)", level: "intermediário" },
  { slug: "subquery", title: "Subconsulta", level: "intermediário" },
  { slug: "exists", title: "EXISTS", level: "intermediário" },
  { slug: "with-cte", title: "CTE (WITH)", level: "avançado" },
  { slug: "over-partition", title: "Janela: média por grupo (OVER)", level: "avançado" },
  { slug: "row-number-rank", title: "Ranking (ROW_NUMBER, RANK)", level: "avançado" },
  { slug: "lag-lead", title: "LAG: comparar com a linha anterior", level: "avançado" },
  { slug: "self-join", title: "Self join (hierarquia)", level: "avançado" },
  { slug: "begin-commit-rollback", title: "Transações (ROLLBACK)", level: "avançado" },
  { slug: "create-index", title: "Índices e plano de execução", level: "avançado" },
  { slug: "update", title: "Alterar dados (UPDATE)", level: "intermediário" },
];
