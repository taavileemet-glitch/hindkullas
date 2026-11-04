(function(){
const OZ=31.1034768,$=id=>document.getElementById(id);
const f=(n,d=2)=>n.toLocaleString('et-EE',{minimumFractionDigits:d,maximumFractionDigits:d});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
Promise.all([fetch('data/history.json').then(r=>r.json()),fetch('data/prices.json').then(r=>r.json())]).then(([h,p])=>{
 const ozNow=p.gold.usd_per_oz/p.fx.usd_per_eur,nowYear=+p.updated.slice(0,4);
 const sel=$('histSel');sel.innerHTML=h.series.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
 const hash=location.hash.match(/^#ajalugu-(.+)/);if(hash&&h.series.some(s=>s.id==hash[1]))sel.value=hash[1];
 function rows(s){
  const r=h.years.map(y=>({y:String(y),eur:s.values[String(y)],goz:h.gold.years[String(y)].eur_per_oz,note:(s.notes||{})[String(y)]||''}));
  const it=p.items.find(i=>i.id==s.now_item);
  r.push({y:nowYear+' (täna)',eur:it?it.eur:null,goz:ozNow,note:it?`${it.note}; ${it.source}`:'',now:true});
  return r.map(x=>({...x,oz:x.eur!=null?x.eur/x.goz:null,g:x.eur!=null?x.eur/(x.goz/OZ):null}));
 }
 function chart(r){
  const pts=r.filter(x=>x.oz!=null),W=600,H=260,L=60,R=20,T=20,B=40,svg=$('histChart');
  if(pts.length<2){svg.innerHTML='<text x="300" y="130" text-anchor="middle" font-size="14">Graafiku jaoks on liiga vähe andmeid</text>';return}
  const max=Math.max(...pts.map(x=>x.oz))*1.1,X=i=>L+i*(W-L-R)/(r.length-1),Y=v=>T+(H-T-B)*(1-v/max);
  let g='';for(let k=0;k<=4;k++){const v=max*k/4;g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eee"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#666">${f(v,v<1?3:2)}</text>`}
  r.forEach((x,i)=>g+=`<text x="${X(i)}" y="${H-B+18}" text-anchor="middle" font-size="11" fill="#666">${x.y.slice(0,4)}${x.now?'*':''}</text>`);
  const path=pts.map((x,j)=>`${j?'L':'M'}${X(r.indexOf(x))},${Y(x.oz)}`).join(' ');
  g+=`<path d="${path}" fill="none" stroke="#c9a227" stroke-width="3"/>`;
  pts.forEach(x=>g+=`<circle cx="${X(r.indexOf(x))}" cy="${Y(x.oz)}" r="4" fill="#c9a227"><title>${x.y}: ${f(x.oz,4)} oz</title></circle>`);
  g+=`<text x="${L}" y="12" font-size="11" fill="#666">untsi kulda</text>`;svg.innerHTML=g;
 }
 function show(){
  const s=h.series.find(x=>x.id==sel.value),r=rows(s);
  $('histTable').tBodies[0].innerHTML=r.map(x=>`<tr><td>${x.y}${x.note?`<br><small class="meta">${esc(x.note)}</small>`:''}</td><td>${x.eur!=null?f(x.eur):'—'}</td><td>${x.g!=null?f(x.g,x.g<1?3:2):'—'}</td><td>${x.oz!=null?f(x.oz,4):'—'}</td><td>${f(x.goz)}</td></tr>`).join('');
  chart(r);
  const a=r.find(x=>x.oz!=null&&!x.now),b=r[r.length-1];
  $('histText').textContent=a&&b.oz!=null&&a!==b?`${s.text} maksis ${a.y}. aastal ${f(a.oz,a.oz<1?4:2)} untsi kulda (${f(a.eur)} €), täna ${f(b.oz,b.oz<1?4:2)} untsi (${f(b.eur)} €). Eurodes ${b.eur>a.eur?'kallines':'odavnes'} ${f(Math.abs(b.eur/a.eur-1)*100,0)}%, kullas ${b.oz>a.oz?'kallines':'odavnes'} ${f(Math.abs(b.oz/a.oz-1)*100,0)}%.`:`${s.text}: ajaloolisi andmeid ei leitud, seega võrdlust ei saa teha.`;
  $('histMeta').innerHTML=`<b>Metoodika:</b> ${esc(s.method)} ${esc(h.note)} Kuld: ${esc(h.gold.method)} Täna: kulla hetkehind ${f(ozNow)} €/oz. * = jooksev aasta.`;
  const src=[...s.sources,...h.gold.sources];
  $('histSrc').innerHTML=src.map(x=>`<li><a href="${esc(x.url)}">${esc(x.name)}</a> — vaadatud ${esc(x.date)}</li>`).join('')+'<li>Andmed: <a href="data/history.json">data/history.json</a></li>';
 }
 sel.onchange=()=>{show();history.replaceState(null,'','#ajalugu-'+sel.value)};show();
}).catch(e=>{$('histText').textContent='Ajaloo andmete laadimine ebaõnnestus.';console.error(e)});
})();
