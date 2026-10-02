"use client";

import { useState } from "react";
import { htmlDoc } from "@/components/Playground";
import OpenInLab from "@/components/OpenInLab";

/** O iframe é isolado (sem allow-same-origin): sem isto, localStorage/sessionStorage lançam SecurityError. */
const STORAGE_SHIM = `<script>(function(){function m(){var d={};return{getItem:function(k){return k in d?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}try{void localStorage.length}catch(e){try{Object.defineProperty(window,"localStorage",{value:m(),configurable:true});Object.defineProperty(window,"sessionStorage",{value:m(),configurable:true})}catch(_){}}})();</script>`;

function withShim(d: string) {
  return /<head[^>]*>/i.test(d) ? d.replace(/<head[^>]*>/i, (m) => m + STORAGE_SHIM) : STORAGE_SHIM + d;
}

/** Preview de um documento HTML completo (snippets e templates). */
export default function Live({ doc, height = 320, editable = false }: { doc: string; height?: number; editable?: boolean }) {
  const [code, setCode] = useState(doc);
  return (
    <div className="grid gap-3">
      <div className="flex justify-end"><OpenInLab payload={{ doc: code }} label="Editar no Lab (HTML + CSS + JS)" /></div>
      {editable && (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Código"
          className="h-64 w-full resize-y rounded-lg border border-border bg-surface-muted p-3 font-mono text-[13px] text-foreground outline-none"
        />
      )}
      <iframe
        title="Preview"
        sandbox="allow-scripts"
        srcDoc={withShim(/<html|<!doctype/i.test(code) ? code : htmlDoc(code))}
        style={{ height }}
        className="w-full rounded-lg border border-border bg-white"
      />
    </div>
  );
}
