// Cinema espacial de 4 s de cruzeiro, além de decolagem/pouso.
export const VOYAGE_LAUNCH_MS=900;
export const VOYAGE_SPACE_MS=4000;
export const VOYAGE_LANDING_MS=1000;
export const VOYAGE_TOTAL_MS=VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS+VOYAGE_LANDING_MS;
export function voyageTravelPhase(ms){
  const t=Math.max(0,Number(ms)||0);
  if(t<VOYAGE_LAUNCH_MS)return 'launch';
  if(t<VOYAGE_LAUNCH_MS+VOYAGE_SPACE_MS)return 'space';
  if(t<VOYAGE_TOTAL_MS)return 'landing';
  return 'done';
}
export function voyageStarfield(count=85,width=960,height=540){
  return Array.from({length:count},(_,i)=>({
    x:(i*193+17)%width,
    y:(i*113+41)%height,
    speed:95+(i*29)%210,
    size:i%9===0?3:i%3===0?2:1,
  }));
}
export function voyageStarAt(star,elapsedMs,width=960){
  const x=((star.x-star.speed*Math.max(0,elapsedMs)/1000)%width+width)%width;
  return {...star,x};
}
