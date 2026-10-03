/** Bancos de exemplo do SQL Lab. Tudo roda em SQLite (sql.js) no navegador, sem servidor. */

export type DbId = "loja" | "escola" | "rh";
export type DbInfo = { id: DbId; name: string; desc: string; script: string };

/* gerador determinístico (os mesmos dados em toda execução) */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const q = (v: string | number | null) => (v === null ? "NULL" : typeof v === "number" ? String(v) : `'${v.replace(/'/g, "''")}'`);
const ins = (t: string, cols: string, rows: (string | number | null)[][]) =>
  `INSERT INTO ${t} (${cols}) VALUES\n${rows.map((r) => "  (" + r.map(q).join(", ") + ")").join(",\n")};\n`;

/* ---------------- LOJA ---------------- */
function loja() {
  const clientes: (string | null)[][] = [
    ["Ana Souza", "ana@gmail.com", "Natal", "RN", "2024-01-10"],
    ["Bruno Lima", "bruno@email.com", "Recife", "PE", "2024-01-22"],
    ["Carla Mota", "carla@gmail.com", "Fortaleza", "CE", "2024-02-03"],
    ["Diego Rocha", "diego@email.com", "São Paulo", "SP", "2024-02-14"],
    ["Elisa Nunes", null, "Natal", "RN", "2024-03-01"],
    ["Felipe Dias", "felipe@gmail.com", "Salvador", "BA", "2024-03-19"],
    ["Gabriela Costa", "gabi@email.com", "Mossoró", "RN", "2024-04-05"],
    ["Heitor Alves", "heitor@email.com", "Recife", "PE", "2024-05-11"],
    ["Isabela Ramos", null, "São Paulo", "SP", "2024-06-02"],
    ["João Pedro", "joao@gmail.com", "Natal", "RN", "2024-07-15"],
    ["Karla Mendes", "karla@email.com", "Belo Horizonte", "MG", "2024-08-09"],
    ["Lucas Pinto", "lucas@email.com", "Fortaleza", "CE", "2024-09-21"],
  ];
  const produtos: (string | number)[][] = [
    ["Notebook Pro 15", "Informática", 3200, 8], ["Mouse sem fio", "Periféricos", 80, 120], ["Teclado mecânico", "Periféricos", 150, 45],
    ["Monitor 27 polegadas", "Informática", 900, 15], ["Headset gamer", "Periféricos", 220, 0], ["Webcam Full HD", "Periféricos", 180, 30],
    ["Cadeira ergonômica", "Móveis", 750, 12], ["Mesa de escritório", "Móveis", 600, 6], ["Livro: SQL na prática", "Livros", 70, 60],
    ["Livro: JavaScript moderno", "Livros", 85, 55], ["Caneca de programador", "Acessórios", 30, 200], ["Mochila para notebook", "Acessórios", 200, 25],
    ["Hub USB-C", "Acessórios", 95, 70], ["SSD 1 TB", "Informática", 340, 40],
  ];
  return { clientes, produtos };
}

function lojaScript() {
  // regera de forma consistente: pedidos e itens com o mesmo id
  const base = loja();
  const r = rng(11);
  const pedidos: (string | number)[][] = [];
  const itens: (string | number)[][] = [];
  const status = ["pago", "pago", "pago", "enviado", "pendente", "cancelado"];
  const dados: { cli: number; data: string; st: string; its: (number)[][] }[] = [];
  for (let i = 0; i < 32; i++) {
    const cli = 1 + Math.floor(r() * 10);
    const mes = 1 + Math.floor(r() * 12);
    const dia = 1 + Math.floor(r() * 27);
    const data = `2024-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const n = 1 + Math.floor(r() * 3);
    const used = new Set<number>();
    const its: number[][] = [];
    for (let k = 0; k < n; k++) {
      let p = 1 + Math.floor(r() * 14);
      while (used.has(p) || p === 11) p = 1 + Math.floor(r() * 14);
      used.add(p);
      its.push([p, 1 + Math.floor(r() * 3), base.produtos[p - 1][2] as number]);
    }
    dados.push({ cli, data, st: status[Math.floor(r() * status.length)], its });
  }
  dados.sort((a, b) => a.data.localeCompare(b.data));
  dados.forEach((d, i) => {
    const id = i + 1;
    const total = d.its.reduce((s, x) => s + x[1] * x[2], 0);
    pedidos.push([d.cli, d.data, d.st, total]);
    d.its.forEach((x) => itens.push([id, x[0], x[1], x[2]]));
  });
  return `CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT,
  cidade TEXT,
  estado TEXT,
  criado_em TEXT
);
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  preco REAL NOT NULL,
  estoque INTEGER DEFAULT 0
);
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id),
  data TEXT,
  status TEXT,
  total REAL
);
CREATE TABLE itens_pedido (
  pedido_id INTEGER REFERENCES pedidos(id),
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER,
  preco_unit REAL
);
${ins("clientes", "nome, email, cidade, estado, criado_em", base.clientes)}${ins("produtos", "nome, categoria, preco, estoque", base.produtos)}${ins("pedidos", "cliente_id, data, status, total", pedidos)}${ins("itens_pedido", "pedido_id, produto_id, quantidade, preco_unit", itens)}`;
}

/* ---------------- ESCOLA ---------------- */
const escolaScript = () => {
  const alunos = [["Alice", "3A", "2008-03-12"], ["Bernardo", "3A", "2008-07-30"], ["Camila", "3B", "2009-01-05"], ["Davi", "3B", "2008-11-21"], ["Eduarda", "3A", "2009-05-17"],
    ["Fábio", "3C", "2008-09-09"], ["Giovana", "3C", "2009-02-28"], ["Henrique", "3B", "2008-12-14"], ["Ingrid", "3A", "2009-04-03"], ["Júlio", "3C", "2008-06-25"]];
  const cursos = [["Matemática", 80, "Prof. Marcos"], ["Português", 80, "Profa. Lúcia"], ["Física", 60, "Prof. Marcos"], ["História", 40, "Profa. Rita"], ["Programação", 100, "Prof. André"]];
  const mat: (number | null)[][] = [
    [1, 1, 9.5, 2], [1, 2, 8, 0], [1, 5, 10, 1], [2, 1, 6.5, 6], [2, 3, 5, 8], [2, 5, 7.5, 3], [3, 2, 9, 1], [3, 4, 8.5, 0], [3, 5, 9.5, 0],
    [4, 1, 4.5, 10], [4, 2, 7, 4], [4, 3, 6, 5], [5, 1, 8, 2], [5, 4, 9, 1], [5, 5, 8.5, 2], [6, 2, 6, 7], [6, 3, 7.5, 3], [6, 5, null, 0],
    [7, 1, 10, 0], [7, 2, 9.5, 0], [7, 4, 9, 1], [8, 3, 5.5, 6], [8, 5, 6.5, 4], [9, 1, 7, 3], [9, 4, null, 2], [9, 5, 9, 1], [10, 2, 8, 2], [10, 3, 6.5, 4],
  ];
  return `CREATE TABLE alunos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, turma TEXT, nascimento TEXT);
CREATE TABLE cursos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, carga_horaria INTEGER, professor TEXT);
CREATE TABLE matriculas (aluno_id INTEGER REFERENCES alunos(id), curso_id INTEGER REFERENCES cursos(id), nota REAL, faltas INTEGER);
${ins("alunos", "nome, turma, nascimento", alunos)}${ins("cursos", "nome, carga_horaria, professor", cursos)}${ins("matriculas", "aluno_id, curso_id, nota, faltas", mat)}`;
};

/* ---------------- RH ---------------- */
const rhScript = () => {
  const deptos = [["Tecnologia", "Natal"], ["Vendas", "Recife"], ["Recursos Humanos", "Natal"], ["Financeiro", "São Paulo"], ["Jurídico", "São Paulo"]];
  const f: (string | number | null)[][] = [
    ["Helena Prado", "Diretora Geral", 28000, 1, null, "2015-03-01"],
    ["Marcos Vieira", "Gerente de TI", 15000, 1, 1, "2017-06-12"],
    ["Paula Teixeira", "Desenvolvedora Sênior", 11000, 1, 2, "2018-02-19"],
    ["Rafael Gomes", "Desenvolvedor Pleno", 8000, 1, 2, "2020-08-03"],
    ["Sofia Barros", "Desenvolvedora Júnior", 4500, 1, 2, "2023-01-16"],
    ["Tiago Moreira", "Analista de Dados", 7200, 1, 2, "2021-05-24"],
    ["Úrsula Campos", "Gerente de Vendas", 14000, 2, 1, "2016-09-05"],
    ["Valter Neves", "Vendedor", 4200, 2, 7, "2019-04-08"],
    ["Wanda Lopes", "Vendedora", 4800, 2, 7, "2020-11-30"],
    ["Xavier Duarte", "Vendedor", 4200, 2, 7, "2022-07-18"],
    ["Yara Fonseca", "Analista de RH", 5600, 3, 1, "2019-10-21"],
    ["Zeca Amaral", "Contador", 6800, 4, 1, "2018-12-03"],
    ["Alice Brandão", "Analista Financeira", 6200, 4, 12, "2021-03-29"],
    ["Bento Cardoso", "Desenvolvedor Pleno", 8000, 1, 2, "2022-02-14"],
  ];
  return `CREATE TABLE departamentos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cidade TEXT);
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT,
  salario REAL,
  depto_id INTEGER REFERENCES departamentos(id),
  gerente_id INTEGER REFERENCES funcionarios(id),
  admissao TEXT
);
${ins("departamentos", "nome, cidade", deptos)}${ins("funcionarios", "nome, cargo, salario, depto_id, gerente_id, admissao", f)}`;
};

export const DBS: Record<DbId, DbInfo> = {
  loja: { id: "loja", name: "Loja virtual", desc: "clientes, produtos, pedidos e itens_pedido: o clássico de e-commerce.", script: lojaScript() },
  escola: { id: "escola", name: "Escola", desc: "alunos, cursos e matriculas (com notas e faltas, algumas notas vazias).", script: escolaScript() },
  rh: { id: "rh", name: "Recursos Humanos", desc: "departamentos e funcionarios (com gerente: hierarquia e salários).", script: rhScript() },
};

export const DB_IDS = Object.keys(DBS) as DbId[];
