// Testes unitários da lógica da roleta e das trilhas. Uso: npx tsx scripts/validate/wheel.mts
const { CHALLENGES, LEVELS } = await import("@/content/challenges");
const W = await import("@/lib/wheelPool"); const T = await import("@/lib/trilhas");
let fails = 0; const ok = (name: string, cond: boolean, extra = "") => { if (!cond) fails++; console.log((cond ? "✓" : "✗"), name, cond ? "" : extra); };
const none = {} as Record<string, string>;
const allSolved = Object.fromEntries(CHALLENGES.map((c) => [c.id, "x"]));

// pool e fatias
let r = W.wheelPool(W.DEFAULT_WHEEL, none);
ok("padrão: pool tem todos os desafios", r.pool.length === CHALLENGES.length && !r.manual && !r.relaxed);
let s = W.wheelSlices(r.pool); ok("padrão: 4 fatias, uma por linguagem", s.length === 4 && s.every((x) => x.key.startsWith("l:")), JSON.stringify(s.map((x) => x.key)));
r = W.wheelPool({ ...W.DEFAULT_WHEEL, langs: ["sql"] }, none);
s = W.wheelSlices(r.pool); ok("só SQL: pool só de SQL e uma fatia por trilha", r.pool.every((c) => c.lang === "sql") && s.length === T.tracksOf("sql").length && s.every((x) => x.key.startsWith("t:")), `${r.pool.length} ${s.map((x) => x.key)}`);
r = W.wheelPool({ ...W.DEFAULT_WHEEL, langs: ["js"], levels: ["avançado"] }, none);
s = W.wheelSlices(r.pool); ok("JS avançado: poucas opções viram fatias de desafios", r.pool.length >= 2 && r.pool.length <= W.MAX_SLICES && s.length === r.pool.length && s.every((x) => x.key.startsWith("c:")), `${r.pool.length}`);
const three = ["js-ola", "css-azul", "sql-colunas"];
r = W.wheelPool({ ...W.DEFAULT_WHEEL, custom: three, langs: ["html"] }, allSolved);
ok("seleção manual manda no filtro e inclui resolvidos", r.manual && r.pool.map((c) => c.id).sort().join() === [...three].sort().join());
s = W.wheelSlices(r.pool); ok("seleção manual de 3: 3 fatias, uma por desafio", s.length === 3 && s.every((x) => x.key.startsWith("c:")));
r = W.wheelPool({ ...W.DEFAULT_WHEEL, custom: ["js-ola"] }, none); ok("seleção de 1 desafio: sem fatias (nada a girar)", W.wheelSlices(r.pool).length === 0 && r.pool.length === 1);
r = W.wheelPool({ ...W.DEFAULT_WHEEL, langs: ["html"] }, allSolved); ok("tudo resolvido: devolve os resolvidos e avisa (relaxed)", r.relaxed && r.pool.length > 0 && r.pool.every((c) => c.lang === "html"));
r = W.wheelPool({ ...W.DEFAULT_WHEEL, onlyPending: false, langs: ["css"] }, allSolved); ok("sem 'só pendentes': inclui os resolvidos sem avisar", !r.relaxed && r.pool.length === CHALLENGES.filter((c) => c.lang === "css").length);
const partial = { "js-ola": "x" }; r = W.wheelPool({ ...W.DEFAULT_WHEEL, langs: ["js"] }, partial); ok("só pendentes: tira o já resolvido", !r.pool.some((c) => c.id === "js-ola") && r.pool.length > 0);
r = W.wheelPool({ ...W.DEFAULT_WHEEL, levels: ["chefe"] }, none); ok("só chefes: todos os do nível chefe", r.pool.length > 0 && r.pool.every((c) => c.level === "chefe"));

// resolver o sorteio
let id = W.resolveSpin("c:js-ola", CHALLENGES, none); ok("fatia de desafio devolve esse desafio", id === "js-ola");
id = W.resolveSpin("l:js", CHALLENGES, none, undefined, () => 0); ok("fatia de linguagem devolve desafio da linguagem, do nível mais baixo", !!id && CHALLENGES.find((c) => c.id === id)!.lang === "js" && CHALLENGES.find((c) => c.id === id)!.level === "iniciante");
const jsIni = Object.fromEntries(CHALLENGES.filter((c) => c.lang === "js" && c.level === "iniciante").map((c) => [c.id, "x"]));
id = W.resolveSpin("l:js", CHALLENGES, jsIni, undefined, () => 0); ok("adaptativo: com os iniciantes feitos, sobe para o intermediário", CHALLENGES.find((c) => c.id === id)!.level === "intermediário");
id = W.resolveSpin("l:css", CHALLENGES, none, "css-azul", () => 0); ok("evita repetir o desafio atual", id !== "css-azul");
id = W.resolveSpin("t:sql-agregar", CHALLENGES, none, undefined, () => 0); ok("fatia de trilha devolve desafio da trilha", ["sql-count", "escola-2", "rh-2", "sql-minmax", "sql-having", "escola-3", "escola-4", "loja-10"].includes(id!));
ok("resolve fatia inexistente sem quebrar", W.resolveSpin("l:zzz", CHALLENGES.slice(0, 3), none, undefined, () => 0) !== null);
ok("pool vazio devolve null", W.resolveSpin("l:js", [], none) === null);
ok("sliceLabel legível", W.sliceLabel("l:css") === "CSS" && W.sliceLabel("c:js-ola") === "Olá, nome!" && W.sliceLabel("t:html-comecando") === "Primeiros passos");

// sanitização (localStorage adulterado ou antigo)
let c = W.sanitizeCfg(null); ok("sanitize(null) = padrão", JSON.stringify(c) === JSON.stringify(W.DEFAULT_WHEEL));
c = W.sanitizeCfg({ langs: ["zzz"], levels: [], onlyPending: "sim", custom: ["js-ola", "nao-existe", 5] }); ok("sanitize limpa lixo e mantém ids válidos", c.langs.length === 4 && c.levels.length === LEVELS.length && c.onlyPending === true && c.custom.join() === "js-ola");

// trilhas
ok("nextInLang(html) é o 1º passo", T.nextInLang("html", none) === "html-titulos");
ok("nextAfter segue a ordem da trilha", T.nextAfter("html-titulos", none) === "html-paragrafos");
ok("nextAfter pula o que já foi feito", T.nextAfter("html-titulos", { "html-paragrafos": "x" }) === "html-enfase");
ok("nextAfter no fim da trilha volta ao pendente da própria trilha", T.nextAfter("html-esqueleto", { "html-titulos": "x" }) === "html-paragrafos");
const htmlDone = Object.fromEntries(T.tracksOf("html").flatMap((t) => t.ids).map((x) => [x, "x"])); ok("nextInLang(html) todo feito = null", T.nextInLang("html", htmlDone) === null);
ok("trackProgress conta e acha o próximo", (() => { const t = T.tracksOf("js").find((x) => x.id === "js-basico")!; const p = T.trackProgress(t, { "js-ola": "x" }); return p.done === 1 && p.total === 5 && p.next === "js-soma" && !p.complete; })());
ok("stepOf: js-soma é o passo 2 de 5 em 'Primeiros passos'", (() => { const s = T.stepOf("js-soma"); return !!s && s.step === 2 && s.total === 5 && s.track.title === "Primeiros passos"; })());
console.log(fails ? `\n${fails} FALHA(S)` : "\ntodos os testes passaram"); process.exit(fails ? 1 : 0);
