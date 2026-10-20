// Escudos como SPRITES reais (texturas pixel-art geradas uma única vez).
// Os sprites não alteram colisões, raios ou valores de defesa.
import { CANNON_DOME_RADIUS, cannonShieldColor } from './shieldDome049.js';

function texture(scene,radius){
  const key='soberana-shield-pixel-'+radius;
  if(scene.textures.exists(key))return key;
  const margin=12,size=Math.ceil((radius+margin)*2),mid=size/2;
  const art=scene.add.graphics();
  // Segmentos alinhados a pixels dão leitura 16-bit, não um círculo suave.
  for(let step=0;step<64;step++){
    const a=Math.PI+step*Math.PI/64, b=a+Math.PI/64*0.86;
    const x1=Math.round(mid+radius*Math.cos(a)),y1=Math.round(mid+radius*Math.sin(a));
    const x2=Math.round(mid+radius*Math.cos(b)),y2=Math.round(mid+radius*Math.sin(b));
    art.lineStyle(5,0xffffff,0.95).lineBetween(x1,y1,x2,y2);
    if(step%4===0){
      art.lineStyle(2,0xffffff,0.42).lineBetween(
        Math.round(mid+(radius+7)*Math.cos(a)),
        Math.round(mid+(radius+7)*Math.sin(a)),
        Math.round(mid+(radius+7)*Math.cos(b)),
        Math.round(mid+(radius+7)*Math.sin(b)));
    }
  }
  art.generateTexture(key,size,size);
  art.destroy();
  return key;
}
function shardTexture(scene){
  const key='soberana-shield-crystal-shard';
  if(scene.textures.exists(key))return key;
  const g=scene.add.graphics();
  g.fillStyle(0xffffff).fillTriangle(6,0,12,18,0,14);
  g.fillStyle(0xdceaff).fillTriangle(6,3,10,15,6,13);
  g.generateTexture(key,14,20);g.destroy();
  return key;
}
export function installShieldSprites(scene){
  const cannonKey=texture(scene,Math.round(CANNON_DOME_RADIUS));
  const towerKey=texture(scene,46);
  shardTexture(scene);
  scene.shieldSpriteKeys={cannon:cannonKey,tower:towerKey};
  scene.cannonDomeSprite=scene.add.image(480,504,cannonKey).setDepth(23);
  scene.towerDomeSprites=new Map();
}
export function updateShieldSprites(scene,cannonX,cannonY,towers){
  if(!scene.cannonDomeSprite)return;
  const shield=scene.shield, max=scene.shieldMax;
  const f=max>0?shield/max:0;
  scene.cannonDomeSprite.setPosition(cannonX,cannonY)
    .setVisible(shield>0)
    .setTint(cannonShieldColor(shield,max))
    .setAlpha(f<=0.25?0.68+Math.sin(scene.time.now*0.024)*0.12:0.72+0.25*f);
  const live=new Set();
  for(const tower of towers){
    if(tower.health<=0)continue;
    live.add(tower);
    let sprite=scene.towerDomeSprites.get(tower);
    if(!sprite){
      sprite=scene.add.image(tower.x,tower.y+10,scene.shieldSpriteKeys.tower).setDepth(23);
      scene.towerDomeSprites.set(tower,sprite);
    }
    sprite.setPosition(tower.x,tower.y+10)
      .setScale(tower.shieldRadius/46)
      .setVisible(tower.shield>0)
      .setTint(cannonShieldColor(tower.shield,tower.shieldMax))
      .setAlpha(0.82);
  }
  for(const [tower,sprite] of scene.towerDomeSprites){
    if(!live.has(tower)){sprite.destroy();scene.towerDomeSprites.delete(tower);}
  }
}
// Quebra somente quando o escudo sai da faixa vermelha e atinge zero.
export function shatterShieldSprite(scene,x,y,radius,color=0xf04a52){
  if(!scene.shieldSpriteKeys)return;
  const count=10;
  for(let i=0;i<count;i++){
    const angle=Math.PI+(i+0.5)*Math.PI/count;
    const sx=x+Math.cos(angle)*radius,sy=y+Math.sin(angle)*radius;
    const shard=scene.add.image(sx,sy,'soberana-shield-crystal-shard')
      .setTint(i%3===0?0xffffff:color).setDepth(61)
      .setRotation(angle).setScale(0.8);
    const dx=Math.cos(angle)*(18+(i%3)*10);
    const dy=Math.sin(angle)*18+22+(i%2)*12;
    scene.tweens.add({targets:shard,x:sx+dx,y:sy+dy,angle:shard.angle+(i%2?60:-60),
      alpha:0,scale:0.15,duration:300+(i%3)*70,ease:'Cubic.Out',
      onComplete:()=>shard.destroy()});
  }
}
