(function(){
const pre=document.querySelector('link[rel=stylesheet]').getAttribute('href').replace('assets/style.css','');
document.addEventListener('click',e=>{const b=e.target.closest('button.copy');if(!b)return;const t=b.dataset.copy;
 const done=()=>{const o=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=o,1500)};
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(done);else{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();done()}});
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function card(q,hl){const att=`— ${q.a}, ${q.w}${q.l?', '+q.l:''}`;const h=s=>hl?hl(esc(s)):esc(s);
 const src=q.u?`<a class="src" href="${esc(q.u)}" target="_blank" rel="noopener">Read it online · ${esc(q.ul)}</a>`:'<span class="src none">No free online copy linked</span>';
 return `<figure class="quote"><blockquote><p>${h(q.t)}</p></blockquote><figcaption>— <a href="${pre}authors/${q.as_}.html">${h(q.a)}</a>, <cite>${h(q.w)}</cite>${q.l?', '+h(q.l):''}</figcaption>
 <div class="meta">${q.tg.map(([n,u,c])=>u?`<a class="${c}" href="${pre}${u}">${esc(n)}</a>`:`<span class="${c}">${esc(n)}</span>`).join('')}</div>
 <div class="actions"><button class="copy" data-copy="${esc('“'+q.t+'”\n\n'+att)}">Copy</button><a class="share" href="${esc(q.x)}" target="_blank" rel="noopener">Share on X</a><a class="perma" href="${pre}quote/${q.id}.html">Permalink</a>${src}</div></figure>`}
let DATA=null;const load=()=>DATA?Promise.resolve(DATA):fetch(pre+'assets/quotes-index.json').then(r=>r.json()).then(d=>DATA=d);
const fold=s=>(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const res=document.getElementById('results');
if(res){const inp=document.getElementById('sq'),cnt=document.getElementById('scount');
 const run=()=>{const raw=inp.value.trim();const terms=fold(raw).split(/\s+/).filter(Boolean);history.replaceState(null,'',raw?'?q='+encodeURIComponent(raw):location.pathname);
  if(!terms.length){res.innerHTML='';cnt.textContent='Type a word or phrase: a doctrine, an author, a Scripture reference…';return}
  load().then(d=>{const hits=d.filter(q=>{const hay=fold([q.t,q.a,q.w,q.l,q.tg.map(x=>x[0]).join(' '),q.kw,q.st].join(' '));return terms.every(t=>hay.includes(t))});
   const rx=new RegExp('('+terms.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')','gi');
   const hl=s=>{/* highlight on accent-folded basis only when exact */return s.replace(rx,'<mark>$1</mark>')};
   cnt.textContent=`${hits.length} quotation${hits.length==1?'':'s'} found for “${raw}”`;res.innerHTML=hits.slice(0,200).map(q=>card(q,hl)).join('')})};
 document.getElementById('sform').addEventListener('submit',e=>{e.preventDefault();run()});let tm;inp.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(run,180)});
 const q0=new URLSearchParams(location.search).get('q');if(q0){inp.value=q0}run()}
const ano=document.getElementById('another');if(ano){ano.addEventListener('click',()=>load().then(d=>{document.getElementById('featured').innerHTML=card(d[Math.floor(Math.random()*d.length)])}));
 load().then(d=>{document.getElementById('featured').innerHTML=card(d[Math.floor(Math.random()*d.length)])}).catch(()=>{})}
// section chips (topic and polemics pages): show one subtopic section, synced with #hash
const secChips=document.querySelectorAll('.chips.secs button.chip');
function showSec(id){const secs=document.querySelectorAll('section.subsec');if(!secs.length)return;
 if(id&&!document.getElementById(id))id='';secs.forEach(s=>s.hidden=!!id&&s.id!==id);
 secChips.forEach(b=>b.classList.toggle('on',b.dataset.sec===id))}
if(secChips.length){secChips.forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.sec;history.replaceState(null,'',id?'#'+id:location.pathname);showSec(id)}));
 const h=decodeURIComponent(location.hash.slice(1));if(h&&[...secChips].some(b=>b.dataset.sec===h))showSec(h);window.addEventListener('hashchange',()=>showSec(decodeURIComponent(location.hash.slice(1))))}
// facet chips: filter the quotes that follow by keyword
document.querySelectorAll('.chips.facets').forEach(bar=>{const list=bar.nextElementSibling;bar.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
 bar.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));const k=b.dataset.kw;
 list.querySelectorAll('figure.quote').forEach(f=>f.hidden=!!k&&!(f.dataset.kw||'').split('|').includes(k))}))});
// expand/collapse topic tree
const ex=document.getElementById('expand');if(ex){ex.addEventListener('click',()=>{const ds=document.querySelectorAll('details.locus');const open=ex.textContent.startsWith('Expand');ds.forEach(d=>d.open=open);ex.textContent=open?'Collapse all':'Expand all'})}
})();

(function(){var b=document.getElementById('themebtn');if(!b)return;var r=document.documentElement;
function cur(){return r.getAttribute('data-theme')==='light'?'light':'dark'}
function paint(){var l=cur()==='light';b.textContent=l?'\u263E':'\u2600';b.title=l?'Switch to dark theme':'Switch to light theme';b.setAttribute('aria-label',(l?'Light':'Dark')+' theme. Switch to '+(l?'dark':'light')+' theme')}
paint();b.addEventListener('click',function(){var n=cur()==='light'?'dark':'light';r.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}paint()})})();
