const OZ_G=31.1034768;
const fmt=(n,d=2)=>n.toLocaleString('et-EE',{minimumFractionDigits:d,maximumFractionDigits:d});
const tz=s=>new Date(s).toLocaleString('et-EE',{timeZone:'Europe/Tallinn'});
function goldEur(d){return d.gold.usd_per_oz/d.fx.usd_per_eur}
fetch('data/prices.json').then(r=>r.json()).then(d=>{
 const oz=goldEur(d),g=oz/OZ_G,$=id=>document.getElementById(id);
 $('euroz').textContent=fmt(oz);$('eurg').textContent=fmt(g);
 $('goldmeta').innerHTML=`${fmt(d.gold.usd_per_oz)} USD/oz (<a href="${d.gold.url}">${d.gold.source}</a>, ${tz(d.gold.date)} Eesti aeg) ÷ ${d.fx.usd_per_eur} USD/EUR (<a href="${d.fx.url}">EKP</a>, ${d.fx.date})`;
 const src=[[d.gold.source,d.gold.url,d.gold.date],[d.fx.source,d.fx.url,d.fx.date]];
 $('items').innerHTML=d.items.map(i=>{src.push([`${i.name}: ${i.source}`,i.url,i.date]);return`<article class="card" id="${i.id}"><h3>${i.name}</h3><div class="big">${fmt(i.eur/g,i.eur/g<1?3:2)} g</div><div>${fmt(i.eur/oz,4)} oz · ${fmt(i.eur)} €</div><p class="meta">${i.note}. Allikas: <a href="${i.url}">${i.source}</a>, ${i.date}</p><button data-id="${i.id}">Jaga</button></article>`}).join('');
 document.querySelectorAll('.card button').forEach(b=>b.onclick=()=>{const u=location.origin+location.pathname+'#'+b.dataset.id,t=b.parentNode.querySelector('h3').textContent+' = '+b.parentNode.querySelector('.big').textContent+' kulda';navigator.share?navigator.share({title:t,url:u}):navigator.clipboard.writeText(t+' '+u).then(()=>b.textContent='Link kopeeritud')});
 d.history.forEach(h=>{const ozThen=h.gold_then.usd_per_oz/h.gold_then.usd_per_eur,now=d.items.find(i=>i.id==h.now_item),a=h.then.eur_m2/ozThen,b=now.eur/oz;
  src.push([h.then.source,h.then.url,h.then.date],[h.gold_then.source,h.gold_then.url,h.gold_then.date]);
  $('history').innerHTML+=`<div class="card"><h3>${h.name}</h3><p>2000: ${fmt(h.then.eur_m2)} €/m² ÷ ${fmt(ozThen)} €/oz = <b>${fmt(a)} oz</b><br>Täna: ${fmt(now.eur)} €/m² ÷ ${fmt(oz)} €/oz = <b>${fmt(b)} oz</b></p><p>Kullas mõõdetuna on ruutmeeter ${a>b?'odavam':'kallim'} ${fmt(Math.abs(1-b/a)*100,0)}%.</p><p class="meta"><b>Metoodika:</b> ${h.method}</p></div>`});
 const w=d.items.find(i=>i.id=='palk'),t=d.items.find(i=>i.id=='tallinn-m2');
 $('faktText').textContent=`Keskmise kuupalga (${fmt(w.eur,0)} €) eest saab ${fmt(w.eur/g)} g kulda — Tallinna ruutmeetri jaoks kulub ${fmt(t.eur/w.eur,1)} kuupalka ehk ${fmt(t.eur/g)} g.`;
 $('sources').innerHTML=src.map(s=>`<li><a href="${s[1]}">${s[0]}</a> — ${s[2]}</li>`).join('');
 $('missing').innerHTML=d.missing.map(m=>`<li>${m.name}: ${m.reason}</li>`).join('');
 const calc=()=>{const e=+$('eur').value||0;$('outg').textContent=fmt(e/g,2);$('outoz').textContent=fmt(e/oz,4)};
 $('eur').oninput=calc;calc();$('g').oninput=()=>{$('outeur').textContent=fmt((+$('g').value||0)*g)};
});
