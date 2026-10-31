import {REPRESENTATIVES} from './representatives.js';
// Falas curtas, não invasivas, escolhidas apenas entre países ainda aliados.
export const BATTLE_BANTER=Object.freeze({
  "br": {
    "start": [
      "Vai com calma, chefe. O canhão eu conferi.",
      "Mira firme. O barulho é dele mesmo."
    ],
    "danger": [
      "Esse grandão tá vindo pra cá!",
      "Olha a carga daquele laser!"
    ],
    "health": [
      "O canhão tá no limite. Segura aí!",
      "Mais um tranco desses e eu vou junto!"
    ],
    "module": [
      "Boa! Esse pedaço não faz mais falta.",
      "Isso! Desmonta que eu separo a sucata."
    ],
    "special": [
      "Especial pronto. Capricha no endereço!",
      "Tá carregado, chefe. Pode usar!"
    ],
    "arrival": [
      "Pousamos. Confere a mira; eu confiro o prédio.",
      "Chegamos. Tem gente precisando da gente."
    ],
    "clear": [
      "Cidade segura. Próxima parada!",
      "Tudo inteiro. Até a mesa de sinuca!"
    ]
  },
  "us": {
    "start": [
      "Um grande dia para a nossa grande parceria!",
      "Pode começar. Já achei meu melhor ângulo."
    ],
    "danger": [
      "Atenção ao grandão! A entrevista espera!",
      "Esse laser não estava na apresentação!"
    ],
    "module": [
      "Viu? Nossa tecnologia! E sua mira, claro.",
      "Uma explosão histórica! Alguém gravou?"
    ],
    "special": [
      "Especial pronto. Vamos inaugurar isso!",
      "Equipamento pronto. Pode fazer história!"
    ]
  },
  "ru": {
    "start": [
      "Respire. Mire. Comece.",
      "Quero uma série limpa. Sem pressa."
    ],
    "danger": [
      "Olhe o laser. Corrija a posição.",
      "Alvo pesado. Não perca a concentração."
    ],
    "module": [
      "Boa execução. Próximo.",
      "Isso vale o esforço. Continue."
    ],
    "special": [
      "Especial pronto. Escolha o momento.",
      "Equipamento pronto. Sua vez."
    ]
  },
  "jp": {
    "start": [
      "Tô com você. Cinco, seis, sete, oito!",
      "Entrou. Agora confia no ensaio."
    ],
    "danger": [
      "Essa entrada não estava combinada!",
      "Cuidado com o laser! É deles!"
    ],
    "module": [
      "Boa! Essa ficou no tempo certo.",
      "Lindo! Guarda o sorriso pra depois!"
    ],
    "special": [
      "Especial pronto. Puxa o refrão!",
      "Tudo pronto. Pode dar o sinal!"
    ]
  },
  "cn": {
    "start": [
      "Equipe pronta. Vamos fazer render.",
      "Olho na rota. Eu cuido da entrega."
    ],
    "danger": [
      "Carga pesada chegando!",
      "Essa nave vai dar um prejuízo!"
    ],
    "module": [
      "Boa! E guarda o que sobrar.",
      "Saiu do estoque deles. Ótimo."
    ],
    "special": [
      "Especial disponível. Escolha o destino.",
      "Tá pronto! Antes que o alvo vá embora."
    ]
  }
});
// Nunca antecipar personagens: Zé Maria só entra depois da onda 0.5 e do
// conserto do canhão. Os estrangeiros só falam quando já foram apresentados.
export function battleSpeakers(choices=[],traitor=null,{wave=1,voyage=false}={}){
  if(wave<1&&!voyage)return [];
  const recruited=new Set(['br']);
  for(const choice of Array.isArray(choices)?choices:[]){
    const id=typeof choice==='string'?choice:
      (choice?.country??choice?.id??choice?.representative);
    if(['us','ru','jp','cn'].includes(id))recruited.add(id);
  }
  if(traitor)recruited.delete(traitor);
  return ['br','us','ru','jp','cn'].filter(id=>recruited.has(id));
}
export function selectBattleBanter(event,{choices=[],traitor=null,sequence=0,voyage=false,wave=1}={}){
  const candidates=battleSpeakers(choices,traitor,{wave,voyage});
  if(!candidates.length)return null;
  // Na viagem brasileira apenas Zé Maria acompanha o canhão.
  // Quem ainda não entrou na história nunca fala pelo rádio.
  const pool=voyage?['br']:candidates;
  const preferred=(event==='arrival'||event==='clear'||event==='health')?'br':null;
  const speaker=preferred&&pool.includes(preferred)?preferred:
    pool[(event==='start'?0:sequence)%pool.length];
  // Avisos de viagem só existem na campanha final brasileira.
  if((event==='arrival'||event==='clear')&&!voyage)return null;
  const lines=BATTLE_BANTER[speaker]?.[event]??BATTLE_BANTER[speaker]?.danger??[];
  if(!lines.length)return null;
  return {speaker,name:REPRESENTATIVES[speaker].name,
    color:REPRESENTATIVES[speaker].tint,
    text:lines[Math.floor(sequence/pool.length)%lines.length],event};
}
export const BANTER_COOLDOWN_MS=6800;
export const BANTER_DURATION_MS=3600;
export function createBattleBanterState(){
  return {active:null,lastStartedAt:-Infinity,sequence:0};
}
export function enqueueBattleBanter(state,event,context,now){
  if(!state||now-state.lastStartedAt<BANTER_COOLDOWN_MS)return null;
  const line=selectBattleBanter(event,{...context,sequence:state.sequence++});
  if(!line)return null;
  state.active={...line,until:now+BANTER_DURATION_MS};
  state.lastStartedAt=now;
  return state.active;
}
export function currentBattleBanter(state,now){
  if(!state?.active||now>=state.active.until)return null;
  return state.active;
}

