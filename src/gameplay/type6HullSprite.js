// Atlas das quatro fases visuais do casco alienígena do Tipo 6.
// Todas as texturas compartilham o mesmo ponto de ancoragem e tamanho.
// Não altera HP, hitboxes nem a ordem de módulos.
export const TYPE6_HULL_SHEET=Object.freeze({
 key:'tipo6_hull_alien',
 frameWidth:840,
 frameHeight:280,
 displayWidth:840,
 displayHeight:280,
 frames:Object.freeze(['integro','avariado','nucleo_exposto','destruido']),
});

// Apenas a versão alienígena usa a arte aprovada. Nações traidoras continuam
// com cascos procedurais até receberem spritesheets próprias.
export function type6HullFrame(state){
 if(state?.defeated)return 3;
 if(state?.coreExposed)return 2;
 const broken=state?.modules?.filter(m=>m.broken).length??0;
 return broken>=2?1:0;
}
export function type6HullUsesSheet(state,hasTexture){
 return state?.country==='alien'&&Boolean(hasTexture);
}
