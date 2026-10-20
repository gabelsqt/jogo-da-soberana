import { ENEMY_TYPES, enemyStats } from './enemies.js';
export const ENEMY_MAKER_KEY='soberana-enemy-maker-drafts-v1';
const editable=['hp','speed','shotInterval','volleyCount'];
const valid=(k,n)=>Number.isFinite(n)&&n>=0&&(k==='hp'||k==='volleyCount'?Number.isInteger(n)&&n>=1:n>0);
export function defaultEnemyDraft(type,level=1){
 const stats=enemyStats(type,level);
 return {type,level,values:Object.fromEntries(editable.filter(k=>Number.isFinite(stats[k])).map(k=>[k,stats[k]]))};
}
export function readEnemyDraft(storage,type,level=1){
 const base=defaultEnemyDraft(type,level);
 try{const raw=JSON.parse(storage?.getItem(ENEMY_MAKER_KEY)||'{}');
  const item=raw?.[type+'-'+level];
  if(item&&typeof item==='object')for(const k of editable){
    if(valid(k,item[k]))base.values[k]=item[k];
  }
 }catch{}
 return base;
}
export function saveEnemyDraft(storage,draft){
 if(!ENEMY_TYPES[draft.type])return false;
 const key=draft.type+'-'+draft.level;
 try{
  const current=JSON.parse(storage?.getItem(ENEMY_MAKER_KEY)||'{}');
  const safe={};
  for(const k of editable)if(valid(k,Number(draft.values[k])))safe[k]=Number(draft.values[k]);
  storage?.setItem(ENEMY_MAKER_KEY,JSON.stringify({...current,[key]:safe}));
  return true;
 }catch{return false;}
}
