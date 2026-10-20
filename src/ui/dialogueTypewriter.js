import {playSfx} from '../audio/sfx.js';

// Reutiliza os cliques retrô e o variador de pitch da introdução.
// Apenas caracteres visíveis soam. A cena fornece seu relógio de Phaser,
// permitindo encerrar timers ao sair e evitar sons depois de mudar de tela.
export function createDialogueTypewriter(scene,{
  delay=32,
  onCharacter=()=>playSfx('introKey',{throttle:24,volumeScale:0.27}),
}={}){
  let timer=null,target=null,chars=[],index=0,done=null,typing=false;
  const stop=()=>{
    timer?.remove();
    timer=null;
    typing=false;
  };
  const finish=()=>{
    stop();
    const callback=done;done=null;
    callback?.();
  };
  const api={
    start(textObject,value,{delay:charDelay=delay,onComplete=null}={}){
      api.cancel();
      target=textObject;
      chars=Array.from(String(value??''));
      index=0;
      done=onComplete;
      target.setText('');
      if(chars.length===0){finish();return;}
      typing=true;
      timer=scene.time.addEvent({
        delay:charDelay,loop:true,
        callback:()=>{
          if(!typing)return;
          const char=chars[index++];
          target.setText(chars.slice(0,index).join(''));
          if(/\S/u.test(char))onCharacter(char);
          if(index>=chars.length)finish();
        },
      });
    },
    complete(){
      if(!typing)return false;
      target.setText(chars.join(''));
      finish();
      return true;
    },
    cancel(){
      stop();
      done=null;
      target=null;
      chars=[];
      index=0;
    },
    get typing(){return typing;},
  };
  return api;
}
