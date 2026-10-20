// Atlas normalizado dos quatro módulos da fortaleza alienígena.
// Quatro linhas x sete colunas de 212x260; metal alinhado no y=142.
// Escudos, hitboxes, vida e ataques não dependem destes sprites.
export const TYPE6_MODULE_SHEET=Object.freeze({
 key:'tipo6_modules_alien',
 frameWidth:212,frameHeight:260,columns:7,rows:4,
 displayWidth:128,displayHeight:157,bodyOriginY:142/260,
 stages:Object.freeze(['parado','carregando','ativo','avaria_1','avaria_2','avaria_3','destruido']),
 roleRows:Object.freeze({bombardment:0,hangar:1,laser:2,generator:3}),
});
export function type6ModuleUsesSheet(state,hasTexture){
 return state?.country==='alien'&&Boolean(hasTexture);
}
export function type6ModuleDamageFrame(module){
 if(module?.broken)return 6;
 if(!module||module.shield>0||!module.maxHp)return 0;
 const fraction=module.hp/module.maxHp;
 return fraction<=0.18?5:fraction<=0.38?4:fraction<=0.68?3:0;
}
export function type6ModuleFrame(state,module,nowMs=0){
 const row=TYPE6_MODULE_SHEET.roleRows[module?.role];
 if(row===undefined)return 0;
 const damage=type6ModuleDamageFrame(module);
 if(damage>=3)return row*7+damage;
 const action=state?.action;
 if(action?.moduleId===module.id){
   if(action.kind==='laserFire')return row*7+2;
   if(action.kind==='bomb'&&action.elapsed>=0.44)return row*7+2;
   if(['laserCharge','barrier','hangar','bomb'].includes(action.kind))
     return row*7+1;
 }
 if(Number.isFinite(module.activeUntil)&&module.activeUntil>nowMs)
   return row*7+2;
 if(module.role==='generator'&&state?.barrier?.active)
   return row*7+2;
 return row*7;
}
