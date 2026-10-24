import {LAB_COUNTRIES,LAB_BALANCE_FIELDS,LAB_BALANCE_DEFAULTS,normalizeLabBalance} from '../gameplay/labBalanceProfile.js';
const STORAGE_KEY='operacao-soberania-lab-matematico-v1';
// Campos ainda registrados no perfil, sem efeito jogável correspondente.
const PENDING_FIELDS=new Set([
  'us.P3.push','us.P3.pushTime','us.S2.pushMax',
  'ru.P4.bossMultiplier','ru.S4.targets','ru.S4.radius','ru.S4.damageFactor',
  'jp.S4.targetCap',
]);
const STYLE_ID='soberania-lab-math-style';
let memoryProfile=null;
export function readLabBalance(){
  if(memoryProfile)return {...memoryProfile};
  try { memoryProfile=normalizeLabBalance(JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')); }
  catch { memoryProfile=normalizeLabBalance(); }
  return {...memoryProfile};
}
export function saveLabBalance(values){
  memoryProfile=normalizeLabBalance(values);
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify(memoryProfile));}catch { /* Armazenamento privado ou indisponível. */ }
  return {...memoryProfile};
}
function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');style.id=STYLE_ID;
  style.textContent=`
.sob-math-open{position:fixed;right:12px;top:10px;z-index:20000;background:#164958;color:#eafff5;border:2px solid #a0ecd0;border-radius:6px;padding:9px 14px;font:bold 12px monospace;cursor:pointer;box-shadow:0 3px 12px #030b18ad}
.sob-math-panel{position:fixed;right:8px;top:8px;bottom:8px;width:min(492px,calc(100vw - 16px));z-index:20001;background:#102336;color:#f1f8ff;border:2px solid #9cc6da;border-radius:9px;box-shadow:0 5px 30px #020611e6;display:none;flex-direction:column;font:13px 'IBM Plex Sans',system-ui,sans-serif}
.sob-math-panel.sob-open{display:flex}
.sob-math-head{padding:12px;background:#183b4c;border-bottom:1px solid #608098;display:flex;justify-content:space-between;align-items:center;gap:7px}
.sob-math-head strong{font:700 17px 'IBM Plex Sans',system-ui,sans-serif}
.sob-math-toolbar{padding:9px;display:flex;flex-wrap:wrap;gap:5px;border-bottom:1px solid #426072}
.sob-math-btn{background:#244b61;color:#effaff;border:1px solid #749db0;border-radius:4px;padding:7px 9px;font:600 12px 'IBM Plex Sans',system-ui,sans-serif;cursor:pointer}
.sob-math-btn[aria-pressed="true"]{background:#257051;border-color:#c2ffdc}
.sob-math-btn:focus-visible,.sob-math-input:focus-visible{outline:2px solid #ffe8a9;outline-offset:2px}
.sob-math-scroll{overflow:auto;flex:1;min-height:0;padding:12px}
.sob-math-stage{border:1px solid #48687a;border-radius:7px;padding:10px;margin:0 0 10px}
.sob-math-stage small{color:#b2c8d6}
.sob-math-field{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #29495e;padding-top:7px;margin-top:7px}
.sob-math-field label{flex:1;line-height:1.3}
.sob-math-field output{color:#b5d0d8;font:11px monospace;min-width:28px;text-align:right}
.sob-math-input{box-sizing:border-box;background:#071622;color:#fff;border:1px solid #77a4b5;border-radius:5px;width:95px;padding:7px;text-align:right;font:600 14px monospace}
.sob-math-footer{padding:9px;border-top:1px solid #426072;display:flex;flex-wrap:wrap;gap:5px}
.sob-math-hint{color:#bed9e1;font-size:11px;line-height:1.4;margin:0 0 10px}
.sob-math-status{color:#a3ffce;font-size:12px}
`;
  document.head.appendChild(style);
}
function button(label,cb,className='sob-math-btn'){
  const b=document.createElement('button');b.type='button';b.className=className;
  b.textContent=label;b.addEventListener('click',cb);return b;
}
function downloadProfile(profile){
  const blob=new Blob([JSON.stringify({format:'operacao-soberania-lab-v1',values:profile},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='operacao-soberania-balanceamento.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function mountLabBalanceEditor({allocation={},especial=null,
  onChange=()=>{},onReturn=null}={}){
  installStyle();
  let profile=readLabBalance(),country='br',track='P',alive=true;
  const launcher=button('⚙ BALANCEAMENTO',()=>setOpen(true),'sob-math-open');
  const panel=document.createElement('section');
  panel.className='sob-math-panel';panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Balanceamento matemático do laboratório');
  const head=document.createElement('div');head.className='sob-math-head';
  const title=document.createElement('strong');title.textContent='Laboratório · Matemática';
  const close=button('FECHAR ✕',()=>setOpen(false));head.append(title,close);
  const nav=document.createElement('div');nav.className='sob-math-toolbar';
  const tracks=document.createElement('div');tracks.className='sob-math-toolbar';
  const scroll=document.createElement('div');scroll.className='sob-math-scroll';
  const footer=document.createElement('div');footer.className='sob-math-footer';
  const status=document.createElement('div');status.className='sob-math-status';
  footer.append(
    button('EXPORTAR JSON',()=>downloadProfile(profile)),
    button('IMPORTAR JSON',()=>importInput.click()),
    button('RESTAURAR PADRÃO',()=>{
      if(!confirm('Restaurar todos os valores matemáticos padrão?'))return;
      profile=saveLabBalance(LAB_BALANCE_DEFAULTS);onChange({...profile});render();status.textContent='Valores padrão restaurados.';
    }),
  );
  if(onReturn)footer.append(button('← VOLTAR AO LAB',()=>{setOpen(false);onReturn();}));
  const importInput=document.createElement('input');
  importInput.type='file';importInput.accept='.json,application/json';importInput.hidden=true;
  importInput.addEventListener('change',async()=>{
    const file=importInput.files?.[0];if(!file)return;
    try {
      const parsed=JSON.parse(await file.text()),incoming=parsed.values??parsed;
      if(!incoming || typeof incoming!=='object' || !Object.keys(incoming).some(k=>Object.hasOwn(LAB_BALANCE_DEFAULTS,k)))throw Error('Nenhum parâmetro reconhecido.');
      profile=saveLabBalance(incoming);onChange({...profile});render();
      status.textContent='Perfil importado e aplicado.';
    } catch(err){status.textContent='Arquivo inválido: '+err.message;}
    importInput.value='';
  });
  footer.append(status,importInput);
  panel.append(head,nav,tracks,scroll,footer);
  document.body.append(launcher,panel);
  function setOpen(open){
    panel.classList.toggle('sob-open',open);
    launcher.hidden=open;
    if(open)render();
  }
  function render(){
    if(!alive)return;
    nav.replaceChildren();
    for(const c of LAB_COUNTRIES){
      const b=button(c.name,()=>{country=c.id;render();});
      b.setAttribute('aria-pressed',String(country===c.id));nav.append(b);
    }
    tracks.replaceChildren();
    for(const t of ['P','S']){
      const b=button(t==='P'?'PRINCIPAL P1–P4':'ESPECIAL S1–S4',()=>{track=t;render();});
      b.setAttribute('aria-pressed',String(track===t));tracks.append(b);
    }
    scroll.replaceChildren();
    const hint=document.createElement('p');hint.className='sob-math-hint';
    hint.textContent='Perfil experimental: altere números, exporte/importe JSON e veja mudanças nos próximos disparos. Campos marcados EM PREPARAÇÃO ainda não mudam o jogo. Efeitos do especial de outro país ainda não se combinam completamente.';
    scroll.append(hint);
    for(let stage=1;stage<=4;stage++){
      const fields=LAB_BALANCE_FIELDS.filter(f=>f.country===country&&f.track===track&&f.stage===stage);
      if(!fields.length)continue;
      const box=document.createElement('div');box.className='sob-math-stage';
      const h=document.createElement('strong');h.textContent=track+stage+' — '+fields[0].description;
      const note=document.createElement('small');note.style.marginLeft='10px';
      note.textContent=stage<=(allocation[country]?.[track]??0)?'ATIVO':'NÃO INSTALADO';
      box.append(h,note);
      for(const f of fields){
        const row=document.createElement('div');row.className='sob-math-field';
        const label=document.createElement('label');label.textContent=f.label;label.htmlFor='sob-math-'+f.key;
        const input=document.createElement('input');input.className='sob-math-input';
        input.id='sob-math-'+f.key;input.type='number';input.step=String(f.step);
        input.min=String(f.min);input.max=String(f.max);input.value=String(profile[f.key]);
        const unit=document.createElement('output');unit.textContent=f.unit;
        const linked=!PENDING_FIELDS.has(f.key) && (track!=='S'||!especial||country===especial);
        if(!linked){
          const marker=document.createElement('small');marker.textContent='EM PREPARAÇÃO';
          marker.style.color='#ffda91';marker.style.marginRight='5px';
          label.append(' ',marker);
        }
        input.addEventListener('change',()=>{
          const raw=Number(input.value);
          if(!Number.isFinite(raw)||input.value===''){input.value=String(profile[f.key]);return;}
          profile=saveLabBalance({...profile,[f.key]:raw});
          input.value=String(profile[f.key]);
          onChange({...profile});status.textContent='Aplicado: '+f.label+' = '+profile[f.key]+' '+f.unit;
        });
        row.append(label,input,unit);box.append(row);
      }
      scroll.append(box);
    }
  }
  render();
  return {open:()=>setOpen(true),getProfile:()=>({...profile}),
    updateAllocation:next=>{allocation=next;if(panel.classList.contains('sob-open'))render();},
    updateIdentity:next=>{especial=next;if(panel.classList.contains('sob-open'))render();},
    destroy:()=>{alive=false;launcher.remove();panel.remove();}};
}
