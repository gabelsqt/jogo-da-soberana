// Tiros coreanos discretos: nenhuma fenda residual do Lightstick.
export function koreanSalvoAngles(aim,count=3,spread=.11){
  const n=Math.max(1,Math.min(16,Math.floor(count)));
  return Array.from({length:n},(_,i)=>aim+(i-(n-1)/2)*spread);
}
export function nextKoreanRicochet(fromX,fromY,enemies,visited,maxDistance=220){
  let chosen=null,best=maxDistance;
  for(const enemy of enemies??[]){
    if(!enemy?.sprite?.active||enemy.type===6||visited?.has(enemy.uid))continue;
    const d=Math.hypot(enemy.sprite.x-fromX,enemy.sprite.y-fromY);
    if(d<3||d>best)continue;
    chosen=enemy;best=d;
  }
  return chosen;
}
export function koreanRicochetDamage(damage,retention=.65){
  return Math.max(0,damage)*Math.min(1,Math.max(0,retention));
}
export function koreanSalvoStats(stage=0,transformed=false){
  const n=Math.max(0,Math.min(4,Math.floor(stage)));
  return {
    count:transformed?9:[3,3,4,5,6][n],
    bounces:[0,1,2,3,4][n],
    bounceRange:[0,180,215,260,320][n],
    retention:.7,
  };
}
