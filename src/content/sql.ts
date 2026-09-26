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
  ],
};

export default sql;
