import { ADVANCED_WAVE_METADATA, getAdvancedWaveEvents } from './advancedWaves.js';
import { hostileBosses } from './wave11Rules.js';

// Ondas 0–3: três escolhas de aliado. Ondas 4–9 seguem automaticamente,
// conservando as 3 escolhas, até que os upgrades intermediários sejam criados.
// Laboratórios continuam independentes da campanha.
// Intervalos curtos e ataques simultâneos aumentam a pressão sem acelerar
// artificialmente a movimentação de um único OVNI.
const wave0Times = Array.from({ length: 20 }, (_, index) => 250 + index * 1280);
const wave0Packs = [
  { at: 7600, type: 1, pattern: 'spread', count: 3 },
  { at: 15300, type: 1, pattern: 'spread', count: 4 },
  { at: 23200, type: 1, pattern: 'spread', count: 5 },
];

export const WAVE_COUNTDOWN_SECONDS = 3;
export const WAVE_DURATION_MS = 30000;
export const FINAL_WAVE_DURATION_MS = 60000;
export const WAVE_FIRST_SPAWN_WINDOW_MS = 20000;
// Resguardo de meio segundo para o último lote entrar antes dos 20s.
export const WAVE_LAST_SPAWN_MS = WAVE_FIRST_SPAWN_WINDOW_MS - 500;

// Temporário: preserva os encontros e padrões existentes, distribuindo seus
// horários proporcionalmente no novo período. O balanceamento da densidade
// e os retornos de Tipos 3/4 serão tratados separadamente.
export function fitWaveEventsToWindow(events, lastAt = WAVE_LAST_SPAWN_MS) {
  if (!events.length) return [];
  const end = Math.max(...events.map(event => event.at));
  if (end <= 0) return events.map(event => ({ ...event, at: 0 }));
  return events.map(event => ({
    ...event,
    at: Math.min(lastAt, Math.round(event.at / end * lastAt)),
  })).sort((a, b) => a.at - b.at);
}

// Antes da onda há 3, 2, 1. O relógio de inimigos só começa no fim.
export function countdownNumberAt(elapsedMs) {
  if (elapsedMs < 0 || elapsedMs >= WAVE_COUNTDOWN_SECONDS * 1000) return null;
  return WAVE_COUNTDOWN_SECONDS - Math.floor(elapsedMs / 1000);
}


export const MODES = {
  wave0: { title: 'ONDA 0', minDuration: WAVE_DURATION_MS },
  wave1: { title: 'ONDA 1', minDuration: WAVE_DURATION_MS },
  wave2: { title: 'ONDA 2', minDuration: WAVE_DURATION_MS },
  wave3: { title: 'ONDA 3 — CÉU FECHADO', minDuration: WAVE_DURATION_MS },
  wave4: { title: 'ONDA 4 — ATAQUE EM PINÇA', minDuration: WAVE_DURATION_MS },
  ...ADVANCED_WAVE_METADATA,
  wave10: { title: 'ONDA 10 — FORTALEZA-MÃE', minDuration: FINAL_WAVE_DURATION_MS },
  wave11: { title: 'ONDA 11 — CONFRONTO PELA SOBERANIA', minDuration: FINAL_WAVE_DURATION_MS },
  lab: { title: 'TESTE DE INIMIGOS', minDuration: 36000 },
  upgradeLab: { title: 'LAB DE UPGRADES', minDuration: Infinity },
};

// Encontros finais em 60 segundos: vitória só acontece ao destruir
// todos os chefes principais, nunca pelo cronômetro ou pela escolta.
export function getFinalWaveEvents(mode, state = {}) {
  if(mode==='wave10')return [
    {at:1250,type:5,level:9,finalBoss:true,warning:'FORTALEZA-MÃE DETECTADA!'},
    {at:7500,type:2,level:9,group:true,count:3},
    {at:14000,type:1,level:9,pattern:'spread',count:5},
    {at:20500,type:3,level:9,warning:'A FORTALEZA ENVIA BOMBARDEIROS!'},
    {at:27000,type:2,level:9,pattern:'orbit',count:5},
    {at:33000,type:4,level:9,pattern:'pincer'},
    {at:39000,type:1,level:9,pattern:'line',count:6,
      warning:'ÚLTIMOS REFORÇOS ALIENÍGENAS!'},
  ];
  if(mode==='wave11'){
    const coalition=hostileBosses(state?.choices??[]);
    const invaders=coalition.length===0;
    const bosses=invaders?[{country:'alien',level:10}]:coalition;
    const count=bosses.length;
    return [
      ...bosses.map(({country,level},i)=>({
        at:1450+i*900,type:5,level:10,
        bossCountry:country,bossLevel:level,coalitionSize:count,finalBoss:true,
        warning:i===0 ? invaders
          ? 'A ÚLTIMA FROTA ALIENÍGENA ATACA!'
          : 'ALERTA: ANTIGOS ALIADOS DECLARAM OCUPAÇÃO!' : undefined,
      })),
      {at:8500,type:2,level:9,group:true,count:3},
      {at:16500,type:1,level:9,pattern:'spread',count:4},
      {at:23000,type:3,level:9,warning:'ESCOLTAS DE OCUPAÇÃO SE APROXIMAM!'},
      {at:30500,type:4,level:9,pattern:'pincer'},
      {at:37500,type:2,level:9,pattern:'orbit',count:5},
      {at:44000,type:1,level:9,pattern:'line',count:6,
        warning:'ÚLTIMA CHANCE DE DEFENDER A SOBERANIA!'},
    ].sort((a,b)=>a.at-b.at);
  }
  return [];
}

function getOriginalWaveEvents(mode, state = {}) {
  // Laboratório livre: inimigos aparecem por timer próprio e nunca acaba a onda.
  if (mode === 'upgradeLab') return [];
  if (mode === 'wave0') {
    const events = wave0Times.map((at, index) => ({ at, type: 1, index }));
    return [...events, ...wave0Packs].sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave1') {
    // A Onda 1 mantém mais de uma ameaça na tela praticamente o tempo todo:
    // novos básicos a cada ~1s, rajadas espalhadas e as formações Tipo 2.
    const events = Array.from({ length: 32 }, (_, index) => ({
      at: 250 + index * 960,
      type: 1,
      level: index >= 20 && index % 4 === 0 ? 2 : 1,
      index,
    }));
    events.push(
      { at: 6000, type: 1, pattern: 'spread', count: 3 },
      { at: 8700, type: 2, group: true },
      { at: 15500, type: 1, pattern: 'spread', count: 4 },
      { at: 18300, type: 2, group: true, level: 2 },
      { at: 25600, type: 2, level: 2, pattern: 'orbit', count: 10 },
      { at: 27400, type: 1, level: 2, pattern: 'spread', count: 5 },
      // Ataque final preservado: uma fileira cheia de inimigos rápidos.
      { at: 34700, type: 1, level: 2, pattern: 'line', count: 10 },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave2') {
    // Onda 2 introdutória: apenas Tipo 1 (básico) e Tipo 2 (formação).
    const events = Array.from({ length: 32 }, (_, index) => ({
      at: 320 + index * 1070,
      type: 1,
      level: index > 20 && index % 4 === 0 ? 2 : 1,
      index,
    }));
    events.push(
      { at: 6300, type: 1, pattern: 'spread', count: 3 },
      { at: 8000, type: 2, group: true },
      { at: 16000, type: 1, pattern: 'spread', count: 4 },
      { at: 19000, type: 2, group: true, level: 2 },
      { at: 23900, type: 1, level: 2, pattern: 'spread', count: 5 },
      { at: 29000, type: 2, level: 2, pattern: 'orbit', count: 10 },
      { at: 32800, type: 1, level: 2, pattern: 'spread', count: 5 },
      { at: 39900, type: 1, level: 2, pattern: 'line', count: 10 },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave3') {
    // CÉU FECHADO: ataques sobrepostos que exigem priorizar alvos.
    // Onda deliberadamente mais longa: deixa o terceiro upgrade ser usado
    // por mais tempo, mesmo que o jogador tenha escolhido 3 países distintos
    // e ainda não tenha desbloqueado uma torre automática.
    const events = Array.from({ length: 30 }, (_, index) => ({
      at: 550 + index * 1510,
      type: 1,
      level: index >= 16 && index % 3 === 0 ? 2 : 1,
      index,
    }));
    events.push(
      // 1. Bombardeio inicial, com básicos ocupando o resto da tela.
      { at: 3500, type: 3, warning: 'ALERTA! BOMBARDEIO NOS ESCUDOS!' },
      { at: 7200, type: 1, pattern: 'spread', count: 4 },
      { at: 9800, type: 2, group: true },
      { at: 13300, type: 3 },
      // 2. Formação circular + invasores laterais.
      { at: 16000, type: 1, pattern: 'spread', count: 4 },
      { at: 18200, type: 2, pattern: 'orbit', level: 2, count: 10 },
      { at: 22400, type: 1, level: 2, pattern: 'spread', count: 5 },
      // 3. Caças cruzados + bomba: avisos sequenciados para legibilidade.
      { at: 24500, type: 4, warning: 'ATENÇÃO: ATAQUES CRUZADOS!' },
      { at: 26800, type: 3, level: 2 },
      { at: 29500, type: 4 },
      { at: 30700, type: 2, group: true, level: 2 },
      { at: 33100, type: 1, pattern: 'spread', count: 5 },
      { at: 35200, type: 4, level: 2 },
      { at: 38200, type: 3, level: 2 },
      // 4. Saturação final. Bombardeiro central + linha Tipo 1 rápida.
      { at: 40700, type: 1, level: 2, pattern: 'spread', count: 5 },
      { at: 43000, type: 4 },
      { at: 45100, type: 3, level: 2, warning: 'ÚLTIMA OFENSIVA!' },
      { at: 48900, type: 1, level: 2, pattern: 'line', count: 10 },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (mode === 'wave4') {
    // ATAQUE EM PINÇA: 80 inimigos, todos nível 3 (HP 2/4/10/6).
    // 47 básicos (30 individuais + 4+4+5+4), 20 de formação
    // (grupos de 3+3+4 e órbita de 10), 5 bombardeiros e 8 caças.
    // O nível 3 não muda o tamanho de nenhuma nave. Só acrescenta HP e cor.
    const level = 3;
    const events = Array.from({ length: 30 }, (_, index) => ({
      at: 520 + index * 2150,
      type: 1, level, index,
    }));
    events.push(
      // 0–12 s: reconhecimento; primeira leitura da blindagem maior.
      { at: 4300, type: 1, level, pattern: 'spread', count: 4 },
      { at: 7000, type: 2, level, group: true, count: 3 },
      { at: 9550, type: 1, level, pattern: 'spread', count: 4 },

      // 12–27 s: pinça simultânea de dois caças; centro ainda ameaçado.
      { at: 13800, type: 4, level, pattern: 'pincer',
        warning: 'ALERTA! ATAQUE PELOS DOIS LADOS!' },
      { at: 20800, type: 2, level, group: true, count: 3 },

      // 27–37 s: brecha para mirar nos bombardeiros protegidos pela formação.
      { at: 28500, type: 3, level, warning: 'BOMBARDEIROS APROXIMANDO!' },
      { at: 32500, type: 3, level },
      { at: 34400, type: 2, level, group: true, count: 4 },

      // 37–55 s: duas pinças retardadas; segundo caça chega 1,5 s depois.
      { at: 38500, type: 4, level, side: 'left',
        warning: 'PINÇA RETARDADA — OLHE OS FLANCOS!' },
      { at: 40000, type: 4, level, side: 'right' },
      { at: 42000, type: 1, level, pattern: 'spread', count: 5 },
      { at: 46000, type: 4, level, side: 'right' },
      { at: 47000, type: 3, level },
      { at: 47500, type: 4, level, side: 'left' },
      { at: 52700, type: 3, level },

      // 55–70 s: segundo ataque simultâneo + círculo + saturação final.
      { at: 56500, type: 2, level, pattern: 'orbit', count: 10 },
      { at: 57800, type: 4, level, pattern: 'pincer',
        warning: 'PINÇA FINAL! DEFENDA O CENTRO!' },
      { at: 62000, type: 3, level },
      { at: 63800, type: 1, level, pattern: 'spread', count: 4,
        warning: 'ÚLTIMA FORMAÇÃO DE INVASORES!' },
    );
    return events.sort((a, b) => a.at - b.at);
  }
  if (Object.hasOwn(ADVANCED_WAVE_METADATA, mode)) {
    return getAdvancedWaveEvents(mode);
  }
  if (mode === 'wave10' || mode === 'wave11') return getFinalWaveEvents(mode,state);
  if (mode === 'lab') {
    return [
      { at: 800, type: 2, group: true },
      { at: 3900, type: 1 },
      { at: 5500, type: 3 },
      { at: 11000, type: 3, level: 2 },
      { at: 15100, type: 4, level: 2 },
      { at: 21200, type: 5 },
      // Comparação direta entre o trio básico e os dez em círculo.
      { at: 28000, type: 2, level: 2, pattern: 'orbit', count: 10 },
    ];
  }
  throw new Error(`Modo desconhecido: ${mode}`);
}


export function getWaveEvents(mode, state = {}) {
  const events = getOriginalWaveEvents(mode,state);
  return /^wave[0-9]$/.test(mode) ? fitWaveEventsToWindow(events) : events;
}

export function scheduledEnemyCount(events) {
  // Uma entrada da agenda pode representar vários OVNIs simultâneos.
  return events.reduce((total, event) => {
    if (event.pattern === 'spread' || event.pattern === 'line' ||
        event.pattern === 'orbit' || event.pattern === 'swarm' ||
        event.pattern === 'tactical') return total + event.count;
    if (event.pattern === 'pincer' && event.type === 4) return total + 2;
    if (event.pattern === 'escort' && event.type === 3) return total + 1 + event.count;
    if (event.pattern === 'bomberFan' && event.type === 3) return total + event.count;
    if (event.group && event.type === 2) return total + (event.count ?? 3);
    return total + 1;
  }, 0);
}

// Resultado de noite: vitória por céu limpo ou por resistir até o amanhecer.
// O relógio de campanha nunca aguarda a limpeza de inimigos restantes em 00:00.
// Os laboratórios mantêm o encerramento antigo e independente.
export function waveOutcome({ mode, elapsed, spawned, scheduled, enemies, hostileShots }) {
  if (mode === 'upgradeLab') return null;
  // Confrontos finais são decididos pela destruição dos chefes ou pelo limite.
  if (mode === 'wave10' || mode === 'wave11') return null;
  if (/^wave[0-9]$/.test(mode)) {
    if (elapsed >= WAVE_DURATION_MS) return 'survived';
    if (spawned === scheduled && scheduled > 0 && enemies === 0 && hostileShots === 0) {
      return 'cleared';
    }
    return null;
  }
  return elapsed >= MODES[mode].minDuration &&
    spawned === scheduled && enemies === 0 && hostileShots === 0 ? 'cleared' : null;
}

export function waveIsFinished(state) {
  return waveOutcome(state) !== null;
}
