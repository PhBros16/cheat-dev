import { buildDoc } from "@/components/lab/doc";
import type { Code } from "@/content/challenges";

/** Executa os testes do desafio dentro da página do aluno e devolve o resultado ao Hub. */
const HARNESS = `<script>(function(){
window.__runTests=async function(tests){var out=[];for(var i=0;i<tests.length;i++){var t=tests[i];try{var v=(0,eval)(t.check);if(v&&typeof v.then==='function'){v=await Promise.race([v,new Promise(function(_,rej){setTimeout(function(){rej(new Error('tempo esgotado (3s)'))},3000)})])}out.push({name:t.name,ok:!!v})}catch(e){out.push({name:t.name,ok:false,err:String((e&&e.message)||e)})}}return out};
addEventListener('message',function(e){var d=e.data;if(d&&d.__hubRun){window.__runTests(d.tests).then(function(r){parent.postMessage({__hubTests:1,id:d.id,results:r},'*')})}});
addEventListener('load',function(){parent.postMessage({__hubReady:1},'*')});
})();</script>`;

/** Documento do desafio: o código do aluno (HTML + CSS + JS) mais o executor de testes, em um script separado. */
export function buildChallengeDoc(code: Code): string {
  const doc = buildDoc(code);
  const i = doc.toLowerCase().lastIndexOf("</body>");
  return i < 0 ? doc + HARNESS : doc.slice(0, i) + HARNESS + doc.slice(i);
}
