class District {
  constructor(scene,config){
    Object.assign(this,config); this.scene=scene; this.S=config.scale||scene.S||1;
    this.health=config.health||45; this.resources=0; this.selectable=false; this.onSelect=null;
    this.isHovered=false; this.animTime=Math.random()*1000; this.turbineAngle=Math.random()*Math.PI*2;
    this.gfx=scene.add.graphics().setDepth(8); this.animGfx=scene.add.graphics().setDepth(10);
    this.citizens=[]; this._buildLabel(); this.draw(); this._addInteraction(); this._initCitizens();
  }
  s(v){return Math.round(v*this.S);}
  ix(gx,gy){return this.cx+(gx-gy)*this.s(34);}
  iy(gx,gy,gz){return this.cy+(gx+gy)*this.s(19)-(gz||0)*this.s(26);}
  _icon(){return {housing:'⌂',transport:'▤',technology:'◇',energy:'☀'}[this.id]||'•';}
  _buildLabel(){
    const txt=(typeof currentLang!=='undefined'&&currentLang==='de')?this.labelDE:this.label;
    this.labelBaseY=this.cy-this.s(126); this.labelContainer=this.scene.add.container(this.cx,this.labelBaseY).setDepth(13);
    const t=this.scene.add.text(0,0,this._icon()+'  '+txt,{fontFamily:CityTheme.body,fontSize:this.s(12),color:'#173b40',fontStyle:'700'}).setOrigin(0.5);
    const w=t.width+this.s(22),h=this.s(25),bg=this.scene.add.graphics();
    bg.fillStyle(CityTheme.colors.paper,0.94); bg.fillRoundedRect(-w/2,-h/2,w,h,this.s(6));
    bg.lineStyle(1,this.accentColor,0.56); bg.strokeRoundedRect(-w/2,-h/2,w,h,this.s(6));
    this.labelContainer.add([bg,t]); this.labelH=h;
  }
  subLabelY(){return this.labelContainer.y+this.labelH/2+this.s(19);}
  _stage(){return this.health>=78?4:this.health>=58?3:this.health>=34?2:1;}
  draw(){
    this.gfx.clear(); this._parcel(); this._streets();
    if(this.id==='housing')this._housing(); else if(this.id==='transport')this._transport();
    else if(this.id==='technology')this._technology(); else this._energy();
  }
  _poly(g,pts,color,alpha){g.fillStyle(color,alpha===undefined?1:alpha);g.beginPath();g.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)g.lineTo(pts[i].x,pts[i].y);g.closePath();g.fillPath();}
  _parcel(){
    const g=this.gfx,p=[{x:this.ix(-.25,2.5),y:this.iy(-.25,2.5,0)},{x:this.ix(2.5,2.5),y:this.iy(2.5,2.5,0)},{x:this.ix(2.5,-.25),y:this.iy(2.5,-.25,0)},{x:this.ix(-.25,-.25),y:this.iy(-.25,-.25,0)}];
    this._poly(g,p,0x83ad73,.82); g.lineStyle(1,0xe7eed9,.5);g.strokePath();
    // pavement ring integrates each neighborhood with the shared streets
    g.lineStyle(this.s(8),0xc9c9b7,.9);g.beginPath();g.moveTo(p[0].x,p[0].y);p.forEach(q=>g.lineTo(q.x,q.y));g.closePath();g.strokePath();
  }
  _streets(){
    const g=this.gfx;g.lineStyle(this.s(8),0x52615e,.9);
    g.beginPath();g.moveTo(this.ix(0,1.2),this.iy(0,1.2,.01));g.lineTo(this.ix(2.25,1.2),this.iy(2.25,1.2,.01));g.strokePath();
    g.lineStyle(1,0xf3d67b,.65);g.beginPath();g.moveTo(this.ix(.15,1.2),this.iy(.15,1.2,.02));g.lineTo(this.ix(2.1,1.2),this.iy(2.1,1.2,.02));g.strokePath();
  }
  _box(gx,gy,w,d,h,top,left,right){
    const g=this.gfx,shadow=[{x:this.ix(gx+.08,gy+d+.12),y:this.iy(gx+.08,gy+d+.12,0)},{x:this.ix(gx+w+.18,gy+d+.12),y:this.iy(gx+w+.18,gy+d+.12,0)},{x:this.ix(gx+w+.18,gy+.12),y:this.iy(gx+w+.18,gy+.12,0)}];
    this._poly(g,shadow,0x244840,.2);
    this._poly(g,[{x:this.ix(gx,gy+d),y:this.iy(gx,gy+d,0)},{x:this.ix(gx,gy+d),y:this.iy(gx,gy+d,h)},{x:this.ix(gx+w,gy+d),y:this.iy(gx+w,gy+d,h)},{x:this.ix(gx+w,gy+d),y:this.iy(gx+w,gy+d,0)}],left,.98);
    this._poly(g,[{x:this.ix(gx+w,gy),y:this.iy(gx+w,gy,0)},{x:this.ix(gx+w,gy),y:this.iy(gx+w,gy,h)},{x:this.ix(gx+w,gy+d),y:this.iy(gx+w,gy+d,h)},{x:this.ix(gx+w,gy+d),y:this.iy(gx+w,gy+d,0)}],right,.98);
    this._poly(g,[{x:this.ix(gx,gy),y:this.iy(gx,gy,h)},{x:this.ix(gx+w,gy),y:this.iy(gx+w,gy,h)},{x:this.ix(gx+w,gy+d),y:this.iy(gx+w,gy+d,h)},{x:this.ix(gx,gy+d),y:this.iy(gx,gy+d,h)}],top,1);
    return {gx,gy,w,d,h};
  }
  _windows(b,cols,rows,color){
    const g=this.gfx;g.fillStyle(color||0xbfe8e8,.9);
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const x=this.ix(b.gx+b.w*(.18+c/(cols+1)),b.gy+b.d),y=this.iy(b.gx+b.w*(.18+c/(cols+1)),b.gy+b.d,b.h*(.22+r/(rows+1)));
      g.fillRect(x-this.s(2.5),y-this.s(1.5),this.s(5),this.s(3));
    }
  }
  _tree(gx,gy,scale){const g=this.gfx,x=this.ix(gx,gy),y=this.iy(gx,gy,0),s=scale||1;g.fillStyle(0x66533c,1);g.fillRect(x-this.s(1.4*s),y-this.s(8*s),this.s(2.8*s),this.s(9*s));g.fillStyle(0x39784e,1);g.fillCircle(x,y-this.s(12*s),this.s(7*s));g.fillStyle(0x77b66f,.9);g.fillCircle(x-this.s(3*s),y-this.s(15*s),this.s(4*s));}
  _solar(gx,gy,n){const g=this.gfx;for(let i=0;i<n;i++){const x=this.ix(gx+i*.24,gy),y=this.iy(gx+i*.24,gy,.12);g.fillStyle(0x285d73,1);g.fillRoundedRect(x-this.s(7),y-this.s(3),this.s(13),this.s(6),1);g.lineStyle(1,0x8ed6df,.8);g.lineBetween(x,y-this.s(3),x,y+this.s(3));}}
  _housing(){
    const st=this._stage(),lots=[[.1,.12],[.7,.15],[1.45,.2],[.22,1.38],[1.18,1.4],[1.72,.86]];
    for(let i=0;i<Math.min(2+st,lots.length);i++){const [x,y]=lots[i],tall=st>=4&&i<2,b=this._box(x,y,tall?.48:.38,tall?.5:.38,tall?1.05:.46,0xf3e8cf,0xc69572,0xddb891);this._windows(b,tall?2:1,tall?3:1,0xb7dce0);if(st>=3&&i%2===0)this._solar(x+.08,y+.1,1);}
    for(let i=0;i<3+st;i++)this._tree(.12+i*.42,2.05,.72);
    if(st>=3){const g=this.gfx,x=this.ix(1.65,1.83),y=this.iy(1.65,1.83,0);g.fillStyle(0xe0a82e,1);g.fillRoundedRect(x-this.s(12),y-this.s(4),this.s(24),this.s(8),3);g.fillStyle(0x296b72,1);g.fillCircle(x-this.s(6),y-this.s(8),this.s(3));g.fillCircle(x+this.s(4),y-this.s(8),this.s(3));}
  }
  _transport(){
    const st=this._stage(),g=this.gfx,b=this._box(.12,.08,1.05,.48,.46+.1*st,0xdbe7e5,0x6d9597,0x93b6b4);this._windows(b,3,Math.min(2,st),0xe9f6f3);
    // platform, shelter, rails, bus fleet and cycle lane
    this._poly(g,[{x:this.ix(.05,1.35),y:this.iy(.05,1.35,.02)},{x:this.ix(2.2,1.35),y:this.iy(2.2,1.35,.02)},{x:this.ix(2.2,1.62),y:this.iy(2.2,1.62,.02)},{x:this.ix(.05,1.62),y:this.iy(.05,1.62,.02)}],0x7c8784,1);
    g.lineStyle(1,0xe7e0ca,.9);for(let k=0;k<2;k++){g.beginPath();g.moveTo(this.ix(.05,1.43+k*.1),this.iy(.05,1.43+k*.1,.03));g.lineTo(this.ix(2.2,1.43+k*.1),this.iy(2.2,1.43+k*.1,.03));g.strokePath();}
    for(let i=0;i<st;i++){const x=.2+i*.43;this._box(x,1.78,.32,.17,.17,i%2?0xe0a82e:0x4f9aa4,0x436b6e,0x618e91);}
    const sx=this.ix(1.72,.5),sy=this.iy(1.72,.5,0);g.fillStyle(0x296b72,1);g.fillRect(sx-this.s(1.5),sy-this.s(26),this.s(3),this.s(26));g.fillStyle(0xa7d8de,1);g.fillRoundedRect(sx-this.s(13),sy-this.s(33),this.s(26),this.s(9),3);
    if(st>=3){g.lineStyle(this.s(2),0x2c8c6b,.9);g.beginPath();g.moveTo(this.ix(.1,.78),this.iy(.1,.78,.03));g.lineTo(this.ix(2.1,.78),this.iy(2.1,.78,.03));g.strokePath();}
  }
  _technology(){
    const st=this._stage(),spots=[[.08,.12],[.63,.08],[1.24,.12],[.2,1.35],[1.05,1.28],[1.58,.78]];
    for(let i=0;i<Math.min(2+st,spots.length);i++){const [x,y]=spots[i],h=.62+st*.18+(i%2)*.18,b=this._box(x,y,.4,.4,h,0xd5e6e5,0x315e66,0x4b7b83);this._windows(b,2,Math.max(1,st),0xa7d8de);if(st>=3&&i<3)this._solar(x+.08,y+.12,1);}
    const g=this.gfx;if(st>=2){const x=this.ix(1.74,1.67),y=this.iy(1.74,1.67,0);g.fillStyle(0xf2e7c9,1);g.fillRoundedRect(x-this.s(18),y-this.s(7),this.s(36),this.s(14),4);g.fillStyle(0x5d9b62,1);g.fillCircle(x,y-this.s(2),this.s(4));}
    this._tree(1.85,1.86,.65);this._tree(.1,1.95,.65);
  }
  _energy(){
    const st=this._stage(),g=this.gfx;this._solar(.08,.2,Math.min(3+st,7));this._solar(.18,.62,Math.min(2+st,6));if(st>=3)this._solar(.3,1.02,5);
    this._box(1.48,1.36,.45,.42,.34,0xe3bd55,0x77602b,0xa88732);
    if(st>=4)this._box(1.75,.22,.32,.34,.58,0xf2e7c9,0x67847e,0x87a39b);
    this.turbinePos=[];for(let i=0;i<Math.min(1+st,4);i++){const gx=.25+i*.52,gy=1.68+(i%2)*.18,tx=this.ix(gx,gy),ty=this.iy(gx,gy,0);g.fillStyle(0xeef1e9,1);g.fillRect(tx-this.s(1.4),ty-this.s(34),this.s(2.8),this.s(34));this.turbinePos.push({x:tx,y:ty-this.s(35)});}
  }
  _addInteraction(){this.hitZone=this.scene.add.rectangle(this.cx,this.cy+this.s(4),this.s(205),this.s(145),0xffffff,0).setDepth(11).setInteractive({useHandCursor:true});this.hitZone.on('pointerover',()=>{this.isHovered=true;this._glowOn();if(this.scene.tooltipManager)this.scene.tooltipManager.show(this,this.cx,this.cy-this.s(70));});this.hitZone.on('pointerout',()=>{this.isHovered=false;this._glowOff();if(this.scene.tooltipManager)this.scene.tooltipManager.hide();});this.hitZone.on('pointerdown',()=>{if(this.selectable&&this.onSelect)this.onSelect(this);});}
  setSelectable(on,cb){this.selectable=on;this.onSelect=cb||null;if(on)this._pulseOn();else this._pulseOff();}
  _ringPts(){return [{x:this.ix(-.25,2.5),y:this.iy(-.25,2.5,0)},{x:this.ix(2.5,2.5),y:this.iy(2.5,2.5,0)},{x:this.ix(2.5,-.25),y:this.iy(2.5,-.25,0)},{x:this.ix(-.25,-.25),y:this.iy(-.25,-.25,0)}];}
  _showGlow(){this._glowOn();} _hideGlow(){this._glowOff();}
  _pulseOn(){if(this._selGfx)this._pulseOff();this._selGfx=this.scene.add.graphics().setDepth(7);const p=this._ringPts();this._selGfx.lineStyle(this.s(3),CityTheme.colors.gold,.95);this._selGfx.beginPath();this._selGfx.moveTo(p[0].x,p[0].y);p.forEach(q=>this._selGfx.lineTo(q.x,q.y));this._selGfx.closePath();this._selGfx.strokePath();this.scene.tweens.add({targets:this._selGfx,alpha:{from:1,to:.3},duration:800,yoyo:true,repeat:-1});}
  _pulseOff(){if(this._selGfx){this.scene.tweens.killTweensOf(this._selGfx);this._selGfx.destroy();this._selGfx=null;}}
  _glowOn(){if(this.glowGfx)this.glowGfx.destroy();this.glowGfx=this.scene.add.graphics().setDepth(7);const p=this._ringPts();this._poly(this.glowGfx,p,CityTheme.colors.gold,.16);this.glowGfx.lineStyle(this.s(2),CityTheme.colors.gold,.9);this.glowGfx.strokePath();}
  _glowOff(){if(this.glowGfx){this.glowGfx.destroy();this.glowGfx=null;}}
  _initCitizens(){for(let i=0;i<7;i++)this.citizens.push(this._newCitizen());}
  _newCitizen(){return {gx:.15+Math.random()*1.95,gy:.08+Math.random()*1.95,tgx:.15+Math.random()*1.95,tgy:.08+Math.random()*1.95,speed:.00012+Math.random()*.00016,bob:Math.random()*6.2,pause:0,skin:[0xe7b98f,0x9d6847,0x6f4938,0xf0c9a4][Phaser.Math.Between(0,3)],shirt:[0x296b72,0xe0a82e,0xc96b4b,0xf2e7c9][Phaser.Math.Between(0,3)]};}
  _updateCitizens(delta){const g=this.animGfx,active=Math.max(2,Math.min(7,this._stage()+2));this.citizens.forEach((c,i)=>{if(i>=active)return;if(c.pause>0)c.pause-=delta;else{const dx=c.tgx-c.gx,dy=c.tgy-c.gy,dist=Math.hypot(dx,dy);if(dist<.06){c.tgx=.15+Math.random()*1.95;c.tgy=.08+Math.random()*1.95;c.pause=300+Math.random()*900;}else{c.gx+=dx/dist*c.speed*delta;c.gy+=dy/dist*c.speed*delta;}}c.bob+=delta*.01;const x=this.ix(c.gx,c.gy),y=this.iy(c.gx,c.gy,0)-Math.abs(Math.sin(c.bob))*this.s(1.2);g.fillStyle(0x173b40,.2);g.fillEllipse(x,y+this.s(2),this.s(6),this.s(2.4));g.fillStyle(c.shirt,1);g.fillRoundedRect(x-this.s(2),y-this.s(7),this.s(4),this.s(6),1);g.fillStyle(c.skin,1);g.fillCircle(x,y-this.s(9),this.s(2.2));g.lineStyle(1,0x334f4d,.8);g.lineBetween(x-this.s(1),y-this.s(1),x-this.s(2),y+this.s(3));g.lineBetween(x+this.s(1),y-this.s(1),x+this.s(2),y+this.s(3));});}
  receiveResource(a){this.resources+=a;this._animHealth(this.health,Math.min(100,this.health+a*9),850,'Back.easeOut');this._construction();this.scene.tweens.add({targets:this.labelContainer,scaleX:1.08,scaleY:1.08,duration:180,yoyo:true});}
  takeDamage(a){this._animHealth(this.health,Math.max(6,this.health-a),950,'Power2.easeIn');this._cracks();}
  _animHealth(from,to,dur,ease){const o={h:from};this.scene.tweens.add({targets:o,h:to,duration:dur,ease,onUpdate:()=>{this.health=o.h;this.draw();},onComplete:()=>{this.health=to;this.draw();if(this.scene.statsPanel)this.scene.statsPanel.refreshPerformance();}});}
  _construction(){if(this.scene.reducedMotion)return;const crane=this.scene.add.graphics().setDepth(20),x=this.cx+this.s(18),y=this.cy-this.s(20);crane.lineStyle(this.s(2),0xe0a82e,.9);crane.lineBetween(x,y,x,y-this.s(55));crane.lineBetween(x-this.s(24),y-this.s(48),x+this.s(30),y-this.s(48));crane.lineBetween(x+this.s(20),y-this.s(48),x+this.s(20),y-this.s(24));this.scene.tweens.add({targets:crane,alpha:0,duration:850,delay:450,onComplete:()=>crane.destroy()});}
  _cracks(){for(let i=0;i<3;i++){const c=this.scene.add.graphics().setDepth(20),x=this.cx+Phaser.Math.Between(-50,50),y=this.cy+Phaser.Math.Between(-12,30);c.lineStyle(this.s(2),0xc85848,.9);c.beginPath();c.moveTo(x,y);c.lineTo(x+Phaser.Math.Between(-12,12),y+this.s(15));c.strokePath();this.scene.tweens.add({targets:c,alpha:0,duration:2400,delay:500,onComplete:()=>c.destroy()});}}
  celebrate(){this._construction();}
  setStorm(on){this.scene.tweens.add({targets:[this.gfx,this.animGfx],alpha:on?.48:1,duration:1200});this.scene.tweens.add({targets:this.labelContainer,alpha:on?.65:1,duration:1200});}
  update(time,delta){this.animTime+=delta;this.animGfx.clear();this._updateCitizens(delta);if(this.id==='energy')this._blades(delta);}
  _blades(delta){if(!this.turbinePos)return;this.turbineAngle+=delta*.0026;const g=this.animGfx;this.turbinePos.forEach((t,i)=>{const a0=this.turbineAngle+i*.6;g.fillStyle(0xf4f5ef,1);for(let b=0;b<3;b++){const a=a0+b*Math.PI*2/3;g.beginPath();g.moveTo(t.x,t.y);g.lineTo(t.x+Math.cos(a)*this.s(13),t.y+Math.sin(a)*this.s(13));g.lineTo(t.x+Math.cos(a+.27)*this.s(10),t.y+Math.sin(a+.27)*this.s(10));g.closePath();g.fillPath();}g.fillStyle(0x6f8786,1);g.fillCircle(t.x,t.y,this.s(2.2));});}
  getName(){return (typeof currentLang!=='undefined'&&currentLang==='de')?this.nameDE:this.name;}
  getTooltip(){return (typeof currentLang!=='undefined'&&currentLang==='de')?this.tooltipDE:this.tooltip;}
}
