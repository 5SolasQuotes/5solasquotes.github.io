(function(){
const cssHref=document.querySelector('link[rel=stylesheet]').getAttribute('href');const pre=cssHref.split('assets/style.css')[0];const _vm=cssHref.match(/[?&]v=([^&]+)/);const assetQ=_vm?('?v='+_vm[1]):'';
document.addEventListener('click',e=>{const b=e.target.closest('button.copy');if(!b)return;const t=b.dataset.copy;
 const done=()=>{const o=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=o,1500)};
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(done);else{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();done()}});
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function card(q,hl){const att=`— ${q.a}, ${q.w}${q.l?', '+q.l:''}`;const h=s=>hl?hl(esc(s)):esc(s);
 const src=q.u?`<a class="src" href="${esc(q.u)}" target="_blank" rel="noopener">Read it online · ${esc(q.ul)}</a>`:'<span class="src none">No free online copy linked</span>';
 return `<figure class="quote"><blockquote><p>${h(q.t)}</p></blockquote><figcaption><span class="by"><span class="lbl">Author:</span> <a href="${pre}authors/${q.as_}.html">${h(q.a)}</a></span><span class="wk"><span class="lbl">Work:</span> <cite>${h(q.w)}</cite>${q.l?', '+h(q.l):''}</span></figcaption>
 <div class="meta">${q.tg.map(t=>`<span class="t">${t[3].map(([n,u])=>`<a href="${pre}${u}">${esc(n)}</a>`).join(' › ')}</span>`).join('')}</div>
 <div class="actions"><button class="copy" data-copy="${esc('“'+q.t+'”\n\n'+att)}">Copy</button><a class="share" href="${esc(q.x)}" target="_blank" rel="noopener">Share on X</a><a class="perma" href="${pre}quote/${q.id}.html">Permalink</a>${src}</div></figure>`}
// tags: each quote stores slugs; names, links and parent levels come from assets/tree.json
function prep(tree,d){const M={},pol=new Set(),cnt={};
 tree.parts.forEach(p=>p.topics.forEach(t=>{if(p.slug==='polemics')pol.add(t.slug);else t.subtopics.forEach(s=>cnt[s.name]=(cnt[s.name]||0)+1)}));
 tree.parts.forEach(p=>p.topics.forEach(t=>{M[t.slug]=[t.name,'topics/'+t.slug+'.html',[p.name,t.name],[[t.name,'topics/'+t.slug+'.html']]];
  t.subtopics.forEach(s=>{const k=t.slug+'/'+s.slug,n=(pol.has(t.slug)||cnt[s.name]>1)?t.name+': '+s.name:s.name;M[k]=[n,'topics/'+k+'.html',[p.name,t.name,s.name],[[n,'topics/'+k+'.html']]];
   (s.fine||[]).forEach(f=>M[k+'/'+f.slug]=[M[k][0]+' › '+f.name,'topics/'+k+'/'+f.slug+'.html',[p.name,t.name,s.name,f.name],[M[k][3][0],[f.name,'topics/'+k+'/'+f.slug+'.html']]])})}));
 const PN={};tree.parts.forEach(p=>p.topics.forEach(t=>PN[t.slug]=p.slug));
 d.forEach(q=>{const ts=(q.tags||[]).filter(k=>M[k]);q.tg=ts.map(k=>[M[k][0],M[k][1],'tag',M[k][3]]);q.anc=[...new Set(ts.flatMap(k=>M[k][2]))].join(' ');q.nodes=new Set();ts.forEach(k=>{const b=k.split('/');q.nodes.add('part:'+PN[b[0]]);for(let i=1;i<=b.length;i++)q.nodes.add(b.slice(0,i).join('/'))})});return d}
let DATA=null,TREEJ=null,AUJ={};const load=()=>DATA?Promise.resolve(DATA):Promise.all([fetch(pre+'assets/tree.json'+assetQ).then(r=>r.json()),fetch(pre+'assets/quotes-index.json'+assetQ).then(r=>r.json()),fetch(pre+'assets/authors.json'+assetQ).then(r=>r.json()).catch(()=>({}))]).then(([t,d,a])=>{TREEJ=t;AUJ=a;return DATA=prep(t,d)});
const fold=s=>(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’‘`]/g,"'").toLowerCase();
const wordsOf=s=>fold(s).match(/[\p{L}\p{N}]+/gu)||[];
// light stemming so that justify / justified / justification meet; used only for "similar forms"
function stem(w){if(w.length<4)return w;
 const R=[[/(ification|ifications|ifying|ified|ifies|ify|ication)$/,'if'],[/(ational|ations?|ators?|ating|ated|ates|ate)$/,''],[/(ness|ments?|ities|ity|ally|ful|less|able|ible|ous|ives?)$/,''],[/ies$/,'y'],[/(ions?|ings?|ers?|ed|es|ly)$/,''],[/([^s])s$/,'$1']];
 for(let g=0;g<6;g++){let ch=false;for(const[r,t]of R){const n=w.replace(r,t);if(n!==w&&n.length>=(t==='$1'?3:4)){w=n;ch=true;break}}if(!ch)break}return w}
const variants=t=>{const v=new Set([t,t+'s',t+'es',t+'d',t+'ed',t+'ing',t+'er',t+'ers',t+'ly',t+'ness',t+'est']);
 if(/e$/.test(t)){v.add(t.slice(0,-1)+'ing');v.add(t+'r');v.add(t+'rs')}
 if(/y$/.test(t)){const b=t.slice(0,-1);v.add(b+'ies');v.add(b+'ied');v.add(b+'ily')}
 if(/s$/.test(t)&&t.length>3)v.add(t.slice(0,-1));return v};
const makeMatcher=(t,form)=>{if(form==='part')return w=>w.includes(t);if(form==='whole')return w=>w===t;
 const V=variants(t),S=stem(t),pre=t.length>=5;return(w,s)=>V.has(w)||s===S||(pre&&w.startsWith(t))};
// Scripture references: "Rom. 3:28", "Psalm 51", "1 Cor. 15:20-22"
const BKS={};(()=>{const add=(n,al)=>al.split(' ').forEach(a=>BKS[a]=n);
 [['Genesis','gen ge gn genesis'],['Exodus','ex exod exodus'],['Leviticus','lev leviticus'],['Numbers','num numb numbers'],['Deuteronomy','deut dt deuteronomy'],['Joshua','josh joshua'],['Judges','judg judges'],['Ruth','ruth'],['Ezra','ezra'],['Nehemiah','neh nehemiah'],['Esther','esth est esther'],['Job','job'],['Psalms','ps psa pss psalm psalms'],['Proverbs','prov pr proverbs'],['Ecclesiastes','eccl eccles ecc ecclesiastes'],['Song of Solomon','song canticles songofsolomon songofsongs'],['Isaiah','isa isaiah'],['Jeremiah','jer jeremiah'],['Lamentations','lam lamentations'],['Ezekiel','ezek eze ezekiel'],['Daniel','dan daniel'],['Hosea','hos hosea'],['Joel','joel'],['Amos','amos'],['Obadiah','obad obadiah'],['Jonah','jonah'],['Micah','mic micah'],['Nahum','nah nahum'],['Habakkuk','hab habakkuk'],['Zephaniah','zeph zephaniah'],['Haggai','hag haggai'],['Zechariah','zech zechariah'],['Malachi','mal malachi'],['Matthew','matt mt matthew'],['Mark','mk mark'],['Luke','lk luke'],['John','jn john'],['Acts','acts'],['Romans','rom romans'],['Galatians','gal galatians'],['Ephesians','eph ephesians'],['Philippians','phil php philippians'],['Colossians','col colossians'],['Titus','titus'],['Philemon','philem philemon'],['Hebrews','heb hebrews'],['James','jas jam james'],['Jude','jude'],['Revelation','rev revelation revelations']].forEach(([n,a])=>add(n,a));
 [['Samuel','sam samuel',2],['Kings','kgs kings ki',2],['Chronicles','chr chron chronicles',2],['Corinthians','cor corinthians',2],['Thessalonians','thess thes thessalonians',2],['Timothy','tim timothy',2],['Peter','pet pe peter',2],['John','jn jo john',3]].forEach(([n,a,m])=>{for(let i=1;i<=m;i++)a.split(' ').forEach(x=>BKS[i+' '+x]=i+' '+n)})})();
const ROM={i:'1',ii:'2',iii:'3'};
const bookOf=(num,name)=>{const k=name.toLowerCase().replace(/[.\s]/g,'');const n=num?(ROM[num.toLowerCase()]||num):'';return BKS[n?n+' '+k:k]||BKS[k]||null};
const REFRX=/(^|[^A-Za-z0-9])(?:([1-3]|I{1,3})\s?)?(Song\s+of\s+(?:Solomon|Songs)|[A-Z][A-Za-z]+)\.?\s?(\d{1,3})(?:\s?:\s?(\d{1,3})(?:\s?[-–—]\s?(\d{1,3}))?)?/g;
function refsOf(s){const out=[];let m;REFRX.lastIndex=0;while((m=REFRX.exec(s))){const b=bookOf(m[2],m[3]);if(b)out.push({b,c:+m[4],v:m[5]?+m[5]:null,v2:m[6]?+m[6]:null})}return out}
function parseRef(raw){const m=/^\s*(?:([1-3]|i{1,3})\s?)?(song\s+of\s+(?:solomon|songs)|[a-z]+)\.?\s*(\d{1,3})(?:\s*[:.]\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?\s*$/i.exec(raw);if(!m)return null;
 const b=bookOf(m[1],m[2]);if(!b)return null;return{b,c:+m[3],v:m[4]?+m[4]:null,v2:m[5]?+m[5]:null}}
const refLabel=r=>(r.b==='Psalms'?'Psalm':r.b)+' '+r.c+(r.v?':'+r.v+(r.v2?'–'+r.v2:''):'');
const refHit=(q,r)=>q._r.some(x=>x.b===r.b&&x.c===r.c&&(r.v==null||(x.v!=null&&x.v<=(r.v2||r.v)&&(x.v2||x.v)>=r.v)));
function parseQuery(raw){const ph=[],neg=[],tm=[];
 const rest=raw.replace(/"([^"]*)"/g,(m,p)=>{const w=wordsOf(p);if(w.length)ph.push(w);return' '});
 rest.split(/\s+/).forEach(tok=>{if(!tok)return;const n=tok[0]==='-'&&tok.length>1;wordsOf(tok).forEach(w=>(n?neg:tm).push(w))});return{ph,neg,tm}}
const ffield=s=>{const w=wordsOf(s);return{w,s:w.map(stem)}};
function ready(d,au){if(d._ready)return;d._ready=1;d.forEach(q=>{
 const an=au[q.as_]&&au[q.as_][2];q._f={t:ffield(q.t),a:ffield(q.a+(an&&an!==q.a?' '+an:'')),w:ffield(q.w+' '+(q.l||'')),k:ffield(q.tg.map(x=>x[0]).join(' ')+' '+q.anc+' '+q.kw+' '+q.st)};
 q.nw=q.t.split(/\s+/).length;q._len=q.nw<=40?'short':q.nw<=100?'medium':'long';const a=au[q.as_]||[9999,''];q._ar=a[0];q._p=a[1];q._r=refsOf(q.t+' '+(q.l||''))})}
const ERAS=[['early','Early church (to 600)'],['medieval','Medieval (600–1500)'],['1500s','1500s: Reformation'],['1600s','1600s: Puritan and post-Reformation'],['1700s','1700s'],['1800s','1800s'],['1900s','1900s to today'],['none','Not placed']];
const LENS=[['short','Short (up to 40 words)'],['medium','Medium (41 to 100 words)'],['long','Long (over 100 words)']];
const SRCS=[['yes','With a free online copy'],['no','No online copy yet']];
const DEF={q:'',inn:'all',mode:'all',form:'forms',sort:'rel',author:'',work:'',topic:'',era:'',len:'',src:''};
const KEYS={q:'q',inn:'in',mode:'mode',form:'form',sort:'sort',author:'author',work:'work',topic:'topic',era:'era',len:'len',src:'src'};
const res=document.getElementById('results');
if(res){const $=id=>document.getElementById(id),inp=$('sq'),cnt=$('scount');
 const sel={inn:'o-in',mode:'o-mode',form:'o-form',sort:'o-sort',author:'o-author',work:'o-work',topic:'o-topic',era:'o-era',len:'o-len',src:'o-src'};
 let S=Object.assign({},DEF),shown=25;
 const sp=new URLSearchParams(location.search);Object.keys(KEYS).forEach(k=>{const v=sp.get(KEYS[k]);if(v!==null)S[k]=v});
 inp.value=S.q;Object.keys(sel).forEach(k=>{const e=$(sel[k]);if(e&&[...e.options].some(o=>o.value===S[k]))e.value=S[k]});
 const mt=new Map(),M=(t,f)=>{const k=f+'|'+t;let m=mt.get(k);if(!m){m=makeMatcher(t,f);mt.set(k,m)}return m};
 const FW={t:3,a:6,w:3,k:4};
 const hasFilter=s=>!!(s.author||s.work||s.topic||s.era||s.len||s.src);
 function pass(q,s,x){return(x==='author'||!s.author||q.as_===s.author)&&(x==='work'||!s.work||q.as_+'|'+q.w===s.work)&&(x==='topic'||!s.topic||q.nodes.has(s.topic))&&(x==='era'||!s.era||(q._p||'none')===s.era)&&(x==='len'||!s.len||q._len===s.len)&&(x==='src'||!s.src||(s.src==='yes')===!!q.u)}
 // matches of the words only (no filters): [{q,sc}] and the info needed to describe and highlight them
 function matchWords(d,s){const raw=s.q.trim(),info={ref:null,P:null,words:[]};if(!raw)return{hits:d.map(q=>({q,sc:0})),info};
  const rf=(s.inn==='ref'||(s.inn==='all'&&/\d/.test(raw)))?parseRef(raw):null;
  if(s.inn==='ref'&&!rf){info.badref=true;return{hits:[],info}}
  if(rf){info.ref=rf;return{hits:d.filter(q=>refHit(q,rf)).map(q=>({q,sc:0})),info}}
  const P=parseQuery(raw);if(s.mode==='phrase'&&P.tm.length){P.ph.push(P.tm.splice(0))}
  info.P=P;P.tm.forEach(t=>info.words.push(t));P.ph.forEach(p=>p.forEach(t=>info.words.push(t)));
  const none=!P.tm.length&&!P.ph.length&&!P.neg.length;
  if(none)return{hits:d.map(q=>({q,sc:0})),info};
  const sc=s.inn==='all'||s.inn==='ref'?['t','a','w','k']:[s.inn],hits=[];
  for(const q of d){const fl=sc.map(k=>q._f[k]);let bad=false;
   for(const w of P.neg){const m=M(w,s.form);if(fl.some(f=>f.w.some((x,i)=>m(x,f.s[i])))){bad=true;break}}if(bad)continue;
   let score=0,all=true,any=false;
   for(const t of P.tm){const m=M(t,s.form);let h=0;fl.forEach((f,j)=>{let n=0;for(let i=0;i<f.w.length&&n<3;i++)if(m(f.w[i],f.s[i]))n++;if(n)h+=FW[sc[j]]*(1+.3*(n-1))});if(h){any=true;score+=h}else all=false}
   for(const p of P.ph){const ms=p.map(t=>M(t,s.form));let h=0;fl.forEach((f,j)=>{const n=f.w.length-p.length;for(let i=0;i<=n;i++){let k=0;while(k<p.length&&ms[k](f.w[i+k],f.s[i+k]))k++;if(k===p.length){h+=FW[sc[j]]*3;break}}});if(h){any=true;score+=h}else all=false}
   const positive=P.tm.length+P.ph.length>0;
   if(!positive||(s.mode==='any'?any:all))hits.push({q,sc:score})}
  return{hits,info}}
 const authorRank=(a,b)=>a.q._ar-b.q._ar||(a.q.w<b.q.w?-1:a.q.w>b.q.w?1:0);
 const wkey=w=>fold(w).replace(/^(a|an|the) /,'');
 const SORTS={rel:(a,b)=>b.sc-a.sc||authorRank(a,b),author:authorRank,work:(a,b)=>wkey(a.q.w)<wkey(b.q.w)?-1:wkey(a.q.w)>wkey(b.q.w)?1:authorRank(a,b),
  old:(a,b)=>ERAS.findIndex(e=>e[0]===(a.q._p||'none'))-ERAS.findIndex(e=>e[0]===(b.q._p||'none'))||authorRank(a,b),
  new:(a,b)=>ERAS.findIndex(e=>e[0]===(b.q._p||'none'))-ERAS.findIndex(e=>e[0]===(a.q._p||'none'))||authorRank(a,b),
  short:(a,b)=>a.q.nw-b.q.nw,long:(a,b)=>b.q.nw-a.q.nw};
 function setOpts(id,items,val){const e=$(id);if(!e)return;if(val&&!items.some(i=>i[0]===val))items.push([val,val+' (0)']);e.innerHTML=items.map(i=>`<option value="${esc(i[0])}"${i[0]===val?' selected':''}>${esc(i[1])}</option>`).join('')}
 function facets(d,hits,s){const C={author:{},work:{},topic:{},era:{},len:{},src:{}},T={};['author','work','topic','era','len','src'].forEach(x=>T[x]=0);
  for(const{q}of hits){const inc=(f,k)=>{C[f][k]=(C[f][k]||0)+1};
   if(pass(q,s,'author')){inc('author',q.as_);T.author++}
   if(pass(q,s,'work')){inc('work',q.as_+'|'+q.w);T.work++}
   if(pass(q,s,'topic')){q.nodes.forEach(n=>inc('topic',n));T.topic++}
   if(pass(q,s,'era')){inc('era',q._p||'none');T.era++}
   if(pass(q,s,'len')){inc('len',q._len);T.len++}
   if(pass(q,s,'src')){inc('src',q.u?'yes':'no');T.src++}}
  const names={};d.forEach(q=>{names[q.as_]=(AUJ[q.as_]&&AUJ[q.as_][2])||q.a});const works={};d.forEach(q=>works[q.as_+'|'+q.w]=[q.w,q.a]);
  const keep=(c,k,cur)=>c[k]>0||k===cur;
  setOpts('o-author',[['',`All authors (${T.author})`]].concat(Object.keys(C.author).concat(s.author&&!C.author[s.author]?[s.author]:[]).sort((a,b)=>(AUJ[a]?AUJ[a][0]:9999)-(AUJ[b]?AUJ[b][0]:9999)).map(k=>[k,`${names[k]||k} (${C.author[k]||0})`])),s.author);
  setOpts('o-work',[['',`All works (${T.work})`]].concat(Object.keys(C.work).concat(s.work&&!C.work[s.work]?[s.work]:[]).sort((a,b)=>wkey(works[a]?works[a][0]:a)<wkey(works[b]?works[b][0]:b)?-1:1).map(k=>[k,`${works[k]?works[k][0]+' · '+works[k][1]:k} (${C.work[k]||0})`])),s.work);
  const topics=[['',`All topics (${T.topic})`]];
  if(TREEJ)TREEJ.parts.forEach(p=>{const pk='part:'+p.slug;if(keep(C.topic,pk,s.topic))topics.push([pk,`${p.name.toUpperCase()} (${C.topic[pk]||0})`]);
   p.topics.forEach(t=>{if(keep(C.topic,t.slug,s.topic))topics.push([t.slug,`– ${t.name} (${C.topic[t.slug]||0})`]);
    t.subtopics.forEach(u=>{const uk=t.slug+'/'+u.slug;if(keep(C.topic,uk,s.topic))topics.push([uk,`–– ${u.name} (${C.topic[uk]||0})`]);
     (u.fine||[]).forEach(f=>{const fk=uk+'/'+f.slug;if(keep(C.topic,fk,s.topic))topics.push([fk,`––– ${f.name} (${C.topic[fk]||0})`])})})})});
  setOpts('o-topic',topics,s.topic);
  setOpts('o-era',[['',`Any period (${T.era})`]].concat(ERAS.filter(e=>keep(C.era,e[0],s.era)).map(e=>[e[0],`${e[1]} (${C.era[e[0]]||0})`])),s.era);
  setOpts('o-len',[['',`Any length (${T.len})`]].concat(LENS.filter(e=>keep(C.len,e[0],s.len)).map(e=>[e[0],`${e[1]} (${C.len[e[0]]||0})`])),s.len);
  setOpts('o-src',[['',`Any (${T.src})`]].concat(SRCS.map(e=>[e[0],`${e[1]} (${C.src[e[0]]||0})`])),s.src)}
 function highlighter(info,form){const P=info.P;if(!P||!(P.tm.length+P.ph.length))return null;
  const tm=[...new Set(P.tm)].map(t=>M(t,form)),ph=P.ph.map(p=>p.map(t=>M(t,form)));
  return s=>{const parts=s.split(/(&(?:amp|lt|gt|quot);|[\p{L}\p{N}]+)/gu),W=[];
   parts.forEach((x,i)=>{if(/^[\p{L}\p{N}]+$/u.test(x)){const w=fold(x);W.push([i,w,stem(w)])}});
   const mark=new Set();W.forEach(([i,w,st])=>{if(tm.some(m=>m(w,st)))mark.add(i)});
   ph.forEach(ms=>{for(let a=0;a+ms.length<=W.length;a++){let k=0;while(k<ms.length&&ms[k](W[a+k][1],W[a+k][2]))k++;if(k===ms.length)for(let k2=0;k2<ms.length;k2++)mark.add(W[a+k2][0])}});
   return parts.map((x,i)=>mark.has(i)?`<mark>${x}</mark>`:x).join('')}}
 const label=(id,v)=>{if(v.startsWith('part:')&&TREEJ){const p=TREEJ.parts.find(x=>'part:'+x.slug===v);if(p)return p.name}const e=$(id);const o=e&&[...e.options].find(x=>x.value===v);return o?o.textContent.replace(/ \(\d+\)$/,'').replace(/^[–]+ /,''):v};
 function url(s){const p=new URLSearchParams();Object.keys(KEYS).forEach(k=>{if(s[k]!==DEF[k])p.set(KEYS[k],s[k])});const t=p.toString();history.replaceState(null,'',t?'?'+t:location.pathname)}
 const set=(k,v)=>{S[k]=v;shown=25;run()};
 function run(){url(S);const oc=$('ocount');if(oc){const k=Object.keys(sel).filter(k=>S[k]!==DEF[k]).length;oc.textContent=k?` · ${k} set`:''}load().then(d=>{ready(d,AUJ);
   const raw=S.q.trim(),tips=[];
   let{hits,info}=matchWords(d,S);
   facets(d,hits,S);
   let list=hits.filter(h=>pass(h.q,S));
   const rnd=S.sort==='rand';if(rnd){for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}}
   else list.sort(SORTS[S.sort==='rel'&&!info.words.length?'author':S.sort]||SORTS.rel);
   const active=[['author','Author'],['work','Work'],['topic','Topic'],['era','Period'],['len','Length'],['src','Online copy']].filter(x=>S[x[0]]).map(x=>`${x[1]}: ${label(sel[x[0]],S[x[0]])}`);
   const n=list.length;
   if(!raw&&!hasFilter(S)){res.innerHTML='';cnt.textContent='Type a word or phrase: a doctrine, an author, a Scripture reference… or choose options below to browse.';return}
   let head=`${n} quotation${n==1?'':'s'}`;
   if(info.ref)head+=` citing ${refLabel(info.ref)}`;else if(raw)head+=` found for “${raw}”`;
   if(active.length)head+=` · ${active.join(' · ')}`;
   cnt.textContent=head;
   if(info.badref){res.innerHTML='<p class="noq">To look up a Scripture reference, type it like Rom. 3:28 or Psalm 51.</p>';return}
   const notes=[];
   if(info.ref&&S.inn==='all')notes.push(`These are quotations that cite ${esc(refLabel(info.ref))}. <button type="button" class="textbtn" data-set="inn=t">Search “${esc(raw)}” as plain words instead</button>`);
   if(!n){const alt=(label2,patch)=>{const s2=Object.assign({},S,patch);const c=matchWords(d,s2).hits.filter(h=>pass(h.q,s2)).length;if(c)tips.push(`<button type="button" class="textbtn" data-set="${Object.keys(patch).map(k=>k+'='+patch[k]).join('&')}">${label2} (${c})</button>`)};
    if(info.ref&&info.ref.v){const c0={b:info.ref.b,c:info.ref.c},c=d.filter(q=>refHit(q,c0)&&pass(q,S)).length;if(c)tips.push(`<button type="button" class="textbtn" data-set="q=${esc(refLabel(c0))}">All of ${esc(refLabel(c0))} (${c})</button>`)}
    if(S.mode==='all'&&info.P&&info.P.tm.length+info.P.ph.length>1)alt('Any of the words',{mode:'any'});
    if(S.form!=='part'&&raw)alt('Part of a word',{form:'part'});
    if(S.inn!=='all'&&raw)alt('Look in everything',{inn:'all'});
    if(hasFilter(S))alt('Clear the filters',{author:'',work:'',topic:'',era:'',len:'',src:''});
    res.innerHTML=`<p class="noq">No quotations match.${tips.length?' Try: '+tips.join(' · ')+'.':''}</p>`;return}
   const hl=highlighter(info,S.form),more=n>shown;
   res.innerHTML=(notes.length?`<p class="sub">${notes.join(' ')}</p>`:'')+list.slice(0,shown).map(h=>card(h.q,hl)).join('')+
    (more?`<p class="more">Showing ${shown} of ${n}. <button type="button" class="textbtn" data-more="25">Show 25 more</button>${n-shown>25?` · <button type="button" class="textbtn" data-more="all">Show all ${n}</button>`:''}</p>`:'')})}
 res.addEventListener('click',e=>{const b=e.target.closest('button[data-set],button[data-more]');if(!b)return;
  if(b.dataset.more){shown=b.dataset.more==='all'?1e9:shown+25;run();return}
  b.dataset.set.split('&').forEach(kv=>{const[i,v]=kv.split('=');S[i]=v});inp.value=S.q;shown=25;Object.keys(sel).forEach(k=>{const e2=$(sel[k]);if(e2&&[...e2.options].some(o=>o.value===S[k]))e2.value=S[k]});run()});
 Object.keys(sel).forEach(k=>{const e=$(sel[k]);if(e)e.addEventListener('change',()=>set(k,e.value))});
 $('sform').addEventListener('submit',e=>{e.preventDefault();set('q',inp.value)});
 let tm;inp.addEventListener('input',()=>{clearTimeout(tm);tm=setTimeout(()=>set('q',inp.value),180)});
 const clr=$('oclear');if(clr)clr.addEventListener('click',()=>{const q=S.q;S=Object.assign({},DEF,{q});Object.keys(sel).forEach(k=>{const e=$(sel[k]);if(e&&e.options.length&&[...e.options].some(o=>o.value===DEF[k]))e.value=DEF[k]});shown=25;run()});
 const od=$('opts');if(od){const wide=matchMedia('(min-width:700px)').matches,set0=Object.keys(sel).some(k=>S[k]!==DEF[k]);let v=null;try{v=localStorage.getItem('searchopts')}catch(e){}
  od.open=set0||(wide?v!=='closed':false);if(wide)od.addEventListener('toggle',()=>{try{localStorage.setItem('searchopts',od.open?'open':'closed')}catch(e){}})}
 run()}
const ano=document.getElementById('another');if(ano){ano.addEventListener('click',()=>load().then(d=>{document.getElementById('featured').innerHTML=card(d[Math.floor(Math.random()*d.length)])}));
 load().then(d=>{document.getElementById('featured').innerHTML=card(d[Math.floor(Math.random()*d.length)])}).catch(()=>{})}
// expand/collapse topic tree
const ex=document.getElementById('expand');if(ex){ex.addEventListener('click',()=>{const ds=document.querySelectorAll('details.locus');const open=ex.textContent.startsWith('Expand');ds.forEach(d=>d.open=open);ex.textContent=open?'Collapse all':'Expand all'})}
})();

(function(){var b=document.getElementById('themebtn');if(!b)return;var r=document.documentElement;
function cur(){return r.getAttribute('data-theme')==='light'?'light':'dark'}
function paint(){var l=cur()==='light';b.textContent=l?'\u263E':'\u2600';b.title=l?'Switch to dark theme':'Switch to light theme';b.setAttribute('aria-label',(l?'Light':'Dark')+' theme. Switch to '+(l?'dark':'light')+' theme')}
paint();b.addEventListener('click',function(){var n=cur()==='light'?'dark':'light';r.setAttribute('data-theme',n);try{localStorage.setItem('theme',n)}catch(e){}paint()})})();
