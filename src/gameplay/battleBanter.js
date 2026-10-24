import {REPRESENTATIVES} from './representatives.js';
// Falas curtas, não invasivas, escolhidas apenas entre países ainda aliados.
export const BATTLE_BANTER=Object.freeze({
  br:{
    start:['Bora, pessoal. Mais uma e a gente fecha a conta!', 'Tudo firme aí? Eu fico no rádio, chefe.'],
    danger:['Opa! Essa nave não veio passear!', 'Cuidado com essa! Tá mirando na gente!'],
    health:['O canhão tá apanhando. Tem como segurar mais um pouco?', 'Segura essa defesa aí, chefe!'],
    module:['Boa! Uma peça a menos naquele trambolho!', 'Isso! Tá desmontando o negócio!'],
    special:['O especial tá pronto. Usa na hora certa!', 'Tem reforço no gatilho, chefe!'],
    arrival:['Chegamos. A cidade ainda precisa da gente!', 'Pousamos. Vou conferir o canhão daqui.'],
    clear:['Cidade protegida. Vou conferir a pressão do canhão!', 'Boa, General! O motor do prédio está pronto pra próxima.'],
  },
  us:{
    start:['Vai ser a maior batalha. Confie em mim!', 'A melhor defesa! Isso é o que a gente constrói.'],
    danger:['Precisamos de um muro maior! O maior de todos!', 'Esse ataque é enorme. Mas eu faço maior!'],
    module:['Excelente explosão. Espetacular. Ninguém explode melhor!', 'Muito bom! Um resultado gigante!'],
    special:['Construam o muro! Um muro enorme!', 'Está na hora de fazer história. Grande história!'],
  },
  ru:{
    start:['Mantenha a posição. O inimigo vai ceder.', 'Camarada, não desperdice o gelo.'],
    danger:['Alvo prioritário. Atire agora.', 'Atenção ao setor de ataque.'],
    module:['Módulo neutralizado. Continue.', 'Uma ameaça a menos. Próximo alvo.'],
    special:['Sputnik disponível. Escolha bem o momento.', 'Equipamento pronto. Sem hesitação.'],
  },
  jp:{
    start:['Brasil, esse é o nosso grande palco!', 'Concentração! Cinco, seis, sete, oito!'],
    danger:['Essa entrada não estava na coreografia!', 'Cuidado! É um solo perigoso!'],
    module:['Foi um hit perfeito! Encore!', 'Mais um módulo fora do palco!'],
    special:['A luz está pronta. Hora do refrão!', 'Encore! Mostra como se faz!'],
  },
  cn:{
    start:['Pedido recebido! Vamos entregar vitória!', 'Esta operação tem entrega expressa!'],
    danger:['Alerta de entrega: objeto voador muito grande!', 'Precisamos revisar essa rota de chegada!'],
    module:['Removido do estoque inimigo. Excelente!', 'Mais um item despachado!'],
    special:['Oferta especial disponível! Sem taxa extra!', 'Aproveite antes que acabe o estoque!'],
  },
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
