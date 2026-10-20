// Botão de pausa fora da câmera Phaser: permanece visível durante zoom,
// telas redimensionadas e barras dinâmicas do navegador.
const TOP_MARGIN = 16;
const MIN_BOTTOM_SPACE = 58;

export function pauseButtonTop({
  viewportTop = 0, viewportHeight = 540, broadcastTop = 0, safeTop = 0,
} = {}) {
  const ceiling = Math.max(0, safeTop) + TOP_MARGIN;
  const preferred = broadcastTop - viewportTop + TOP_MARGIN;
  return Math.max(ceiling, Math.min(preferred, Math.max(ceiling, viewportHeight - MIN_BOTTOM_SPACE)));
}

export function mountPauseHudButton(scene, onPause, {
  doc = globalThis.document,
  win = globalThis.window,
} = {}) {
  const root=doc?.getElementById?.('viewport');
  const broadcast=doc?.getElementById?.('broadcast');
  if(!root || !broadcast || !doc?.createElement) return null;

  // O viewport ocupa a área visível inteira; ao contrário de um objeto
  // Phaser, o botão não participa do zoom/screen shake da câmera principal.
  const button=doc.createElement('button');
  button.type='button';
  button.className='soberana-pause-hud';
  button.textContent='Ⅱ  PAUSAR [P]';
  button.setAttribute('aria-label','Pausar jogo (tecla P ou Esc)');
  Object.assign(button.style,{
    position:'absolute',
    zIndex:'15',
    left:'50%',
    transform:'translateX(-50%)',
    boxSizing:'border-box',
    minWidth:'148px',
    height:'40px',
    padding:'7px 18px',
    fontFamily:"'IBM Plex Sans',system-ui,sans-serif",
    fontWeight:'700',
    fontSize:'14px',
    lineHeight:'20px',
    letterSpacing:'0.02em',
    color:'#e9f5ff',
    background:'rgba(20,53,74,0.96)',
    border:'2px solid #86c8e0',
    borderRadius:'3px',
    boxShadow:'3px 4px 0 rgba(4,12,23,0.65)',
    whiteSpace:'nowrap',
    cursor:'pointer',
    touchAction:'manipulation',
  });
  const refreshPosition=()=>{
    if(!root.isConnected)return;
    const rr=root.getBoundingClientRect();
    const br=broadcast.getBoundingClientRect();
    const safeTop=Number.parseFloat(win?.getComputedStyle?.(root)?.paddingTop)||0;
    button.style.top=pauseButtonTop({
      viewportTop:rr.top,viewportHeight:rr.height,
      broadcastTop:br.top,safeTop,
    })+'px';
  };
  const onClick=(event)=>{
    event.stopPropagation();
    event.preventDefault();
    if(scene.scene.isActive('GameScene')&&!scene.scene.isPaused('GameScene'))
      onPause();
  };
  const shieldPointer=event=>event.stopPropagation();
  const hide=()=>{button.hidden=true;};
  const show=()=>{button.hidden=false;refreshPosition();};
  button.addEventListener('click',onClick);
  button.addEventListener('pointerdown',shieldPointer);
  root.appendChild(button);
  scene.events.on('pause',hide);
  scene.events.on('resume',show);
  scene.game.events.on('cubo-layout-change',refreshPosition);
  win?.addEventListener?.('resize',refreshPosition);
  win?.visualViewport?.addEventListener?.('resize',refreshPosition);
  scene.scale?.on?.('resize',refreshPosition);
  refreshPosition();
  scene.events.once('shutdown',()=>{
    button.removeEventListener('click',onClick);
    button.removeEventListener('pointerdown',shieldPointer);
    scene.events.off('pause',hide);
    scene.events.off('resume',show);
    scene.game.events.off('cubo-layout-change',refreshPosition);
    win?.removeEventListener?.('resize',refreshPosition);
    win?.visualViewport?.removeEventListener?.('resize',refreshPosition);
    scene.scale?.off?.('resize',refreshPosition);
    button.remove();
  });
  return button;
}
