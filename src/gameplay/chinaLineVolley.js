// Balística experimental do Laboratório: projéteis individuais, jamais feixe.
export const CHINA_TRANSITION_MS=1500;
export function chinaLineFocus(ageMs,focusMs=2500){
  const age=Math.max(0,Number(ageMs)||0),duration=Math.max(0,Number(focusMs)||0);
  const total=CHINA_TRANSITION_MS*2+duration;
  if(age>=total)return 0;
  if(age<CHINA_TRANSITION_MS)return age/CHINA_TRANSITION_MS;
  if(age<CHINA_TRANSITION_MS+duration)return 1;
  return (total-age)/CHINA_TRANSITION_MS;
}
export function chinaLineDuration(focusMs=2500){
  return 2*CHINA_TRANSITION_MS+Math.max(0,Number(focusMs)||0);
}
// Disparos podem ser multiplicados por efeitos chineses, mas existe limite
// físico de 30 ms entre tiros para não exceder ~33 projéteis/segundo.
export function chinaLineShotInterval(baseIntervalMs=300,baseCount=1,hasSplit=false,
  copyFraction=.5,rateFactor=1){
  const units=Math.max(1,Number(baseCount)||1)*
    (hasSplit?1+Math.max(0,Number(copyFraction)||0):1);
  return Math.max(30,Math.round((Math.max(40,baseIntervalMs)/units)*
    Math.max(.1,Number(rateFactor)||1)));
}
export function chinaLineShotAngle(aimAngle,focus,shotIndex){
  const residual=1-Math.max(0,Math.min(1,focus));
  const lane=((Math.max(0,shotIndex)%5)-2)/2;
  return aimAngle+lane*residual*.14;
}
