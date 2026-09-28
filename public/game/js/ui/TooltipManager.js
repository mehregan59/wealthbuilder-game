class TooltipManager {
  constructor(scene) {
    this.scene = scene; this.visible = false;
    this.container = scene.add.container(0,0).setDepth(100);
    this.bg = scene.add.graphics();
    this.titleText = scene.add.text(0,0,'',{fontFamily:CityTheme.heading,fontSize:14,color:'#9b6c12',wordWrap:{width:220}});
    this.bodyText = scene.add.text(0,0,'',{fontFamily:CityTheme.body,fontSize:12,color:'#365d60',lineSpacing:4,wordWrap:{width:256}});
    this.container.add([this.bg,this.titleText,this.bodyText]);
    this.container.setAlpha(0);
    this._hideTimer = null;
    this._showTimer = null;
    this.pinnedSource = null;
  }

  show(source, x, y, immediate) {
    if (this._showTimer) this._showTimer.remove(false);
    if (this._hideTimer) { this._hideTimer.remove(); this._hideTimer = null; }
    const title = source.getName?source.getName():(source.name||'');
    const body = source.getPanelText?source.getPanelText():(source.getTooltip?source.getTooltip():(source.tooltip||''));
    if (!title&&!body) return;
    const pad=12,W=280;
    this.titleText.setText(title); this.bodyText.setText(body);
    const titleH=this.titleText.height,bodyH=this.bodyText.height,H=titleH+bodyH+pad*3;
    let tx=Math.min(x-W/2,this.scene.scale.width-W-10); tx=Math.max(tx,10);
    let ty=y-H-10; if(ty<10) ty=y+30;
    this.bg.clear();
    this.bg.fillStyle(0xfffbf1,0.95); this.bg.fillRoundedRect(0,0,W,H,8);
    this.bg.lineStyle(1,0xe0a82e,0.6); this.bg.strokeRoundedRect(0,0,W,H,8);
    this.bg.fillStyle(0xe0a82e,0.8); this.bg.fillRect(0,0,3,H);
    this.titleText.setPosition(pad+4,pad); this.bodyText.setPosition(pad+4,pad+titleH+4);
    const reveal=()=>{
      this._showTimer=null;
      this.container.setPosition(tx,ty);
      this.scene.tweens.killTweensOf(this.container);
      this.scene.tweens.add({targets:this.container,alpha:1,duration:180,ease:'Power2.easeOut'});
      this.visible = true;
    };
    if(immediate)reveal();else this._showTimer=this.scene.time.delayedCall(650,reveal);
  }

  hide() {
    if(this._showTimer){this._showTimer.remove(false);this._showTimer=null;}
    if(this.pinnedSource)return;
    if (!this.visible) return;
    this._hideTimer = this.scene.time.delayedCall(200, () => {
      this.scene.tweens.killTweensOf(this.container);
      this.scene.tweens.add({targets:this.container,alpha:0,duration:200});
      this.visible = false;
    });
  }

  toggle(source,x,y){if(this.pinnedSource===source){this.pinnedSource=null;this.hide();return;}this.pinnedSource=source;this.show(source,x,y,true);}

  showText(title, body, x, y, duration) {
    this.show({getName:()=>title,getTooltip:()=>body},x,y);
    if (duration) this.scene.time.delayedCall(duration,()=>this.hide());
  }
}
