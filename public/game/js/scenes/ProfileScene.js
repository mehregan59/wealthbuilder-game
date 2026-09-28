class ProfileScene extends Phaser.Scene {
  constructor(){ super({ key:'ProfileScene' }); }

  create(data) {
    this.W = this.scale.width; this.H = this.scale.height;
    this.S = Math.max(0.9, Math.min(1.9, this.H / 720));
    this.stats = (data && data.stats) || { happiness:50, development:50, resources:50 };
    this.scores  = this._computeScores();
    this.persona = this._assignPersona(this.scores);
    this.tip = null;
    this._bg();
    this._curtainDrop();
  }
  s(v){ return Math.round(v * this.S); }

  _bg() {
    const g = this.add.graphics().setDepth(-5);
    g.fillStyle(0x061019,1); g.fillRect(0,0,this.W,this.H);
    const sil = this.add.graphics().setDepth(-4);
    sil.fillStyle(0x0b1725,1);
    for (let x=0; x<this.W; x+=Phaser.Math.Between(70,120)) {
      const h = Phaser.Math.Between(40,130);
      sil.fillRect(x, this.H-h, Phaser.Math.Between(55,100), h);
    }
    this.starGfx = this.add.graphics().setDepth(-4);
    this.stars = [];
    for (let i=0;i<50;i++) this.stars.push({x:Phaser.Math.Between(0,this.W),y:Phaser.Math.Between(0,this.H-240),r:Math.random()+0.4,p:Math.random()*Math.PI*2});
  }

  _curtainDrop() {
    const W=this.W, H=this.H, de=(typeof currentLang!=='undefined'&&currentLang==='de');
    const lines = de ? [
      'Sieh dir die Stadt an, die du gebaut hast.',
      'Du hast den Boom navigiert, den Sturm überstanden und Entscheidungen\ngetroffen, die deine Bürger vorangebracht haben.',
      'Jede Entscheidung hat deine natürlichen Instinkte\nfür Planung und Anpassung offenbart.'
    ] : [
      'Take a look at the city you\u2019ve built.',
      'You navigated the boom, weathered the storm, and made choices\nto keep your citizens moving forward.',
      'Every decision you made revealed your natural instincts\nfor planning and adapting.'
    ];

    const objs=[];
    lines.forEach((txt,i)=>{
      const t=this.add.text(W/2, H/2 - this.s(76) + i*this.s(70), txt, {
        fontFamily:'Playfair Display, Georgia, serif',
        fontSize: i===0 ? this.s(30) : this.s(20),
        color: i===0 ? '#e2a840' : '#dbe8f4',
        align:'center', lineSpacing:this.s(9), wordWrap:{width:Math.min(this.s(900),W-this.s(120))}
      }).setOrigin(0.5).setDepth(100).setAlpha(0);
      objs.push(t);
      this.tweens.add({targets:t,alpha:1,y:t.y-this.s(9),duration:1400,delay:600+i*2600,ease:'Sine.easeOut'});
    });
    const totalIn = 600 + (lines.length-1)*2600 + 1400;

    const trans=this.add.text(W/2, H/2+this.s(150), de
      ? 'So wie beim Bauen einer Stadt geht es bei der Planung deiner Zukunft darum,\ndie richtige Balance für dich zu finden.'
      : 'Just like building a city, planning for your future is about\nfinding the right balance for you.', {
      fontFamily:'Inter, Arial, sans-serif', fontSize:this.s(16), color:'#96b0c8',
      align:'center', lineSpacing:this.s(7), fontStyle:'italic'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    this.tweens.add({targets:trans,alpha:1,duration:1300,delay:totalIn+700});

    this.time.delayedCall(totalIn+4200,()=>{
      this.tweens.add({targets:objs.concat([trans]),alpha:0,duration:1500,
        onComplete:()=>{objs.forEach(o=>o.destroy());trans.destroy();this._dashboard();}});
    });

    const skip=this.add.text(W-this.s(30),H-this.s(26),de?'Überspringen \u203A':'Skip \u203A',{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:'#456a8c'
    }).setOrigin(1,0.5).setDepth(120).setInteractive({useHandCursor:true});
    skip.on('pointerover',()=>skip.setColor('#a8c0d8'));
    skip.on('pointerout',()=>skip.setColor('#456a8c'));
    skip.on('pointerdown',()=>{
      this.tweens.killAll();
      objs.forEach(o=>{try{o.destroy();}catch(e){}});
      try{trans.destroy();}catch(e){} skip.destroy();
      this._dashboard();
    });
  }

  _dashboard() {
    const W=this.W,H=this.H,cx=W/2;
    const de=(typeof currentLang!=='undefined'&&currentLang==='de');

    const head=this.add.text(cx,this.s(46),de?'Dein Entscheidungsstil':'Your Decision Style',{
      fontFamily:'Playfair Display, Georgia, serif',fontSize:this.s(30),color:'#e2a840'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    this.tweens.add({targets:head,alpha:1,duration:900});

    const cardW=Math.min(this.s(620),W-this.s(90)), cardX=cx-cardW/2;
    const cardY=this.s(80), cardH=this.s(116);
    const card=this.add.graphics().setDepth(99).setAlpha(0);
    card.fillStyle(0x0b1725,0.96); card.fillRoundedRect(cardX,cardY,cardW,cardH,this.s(14));
    card.lineStyle(1,0x2c4767,1); card.strokeRoundedRect(cardX,cardY,cardW,cardH,this.s(14));
    card.fillStyle(0xe2a840,0.9); card.fillRect(cardX,cardY,cardW,this.s(4));
    this.tweens.add({targets:card,alpha:1,duration:900,delay:250});

    const pIcon=this.add.text(cardX+this.s(42),cardY+this.s(58),this.persona.icon,{fontSize:this.s(36)}).setOrigin(0.5).setDepth(100).setAlpha(0);
    const pName=this.add.text(cardX+this.s(78),cardY+this.s(34),this.persona.name,{
      fontFamily:'Playfair Display, Georgia, serif',fontSize:this.s(23),color:'#f0c060'}).setDepth(100).setAlpha(0);
    const pDesc=this.add.text(cardX+this.s(78),cardY+this.s(64),this.persona.desc,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(14),color:'#b0c6da',
      wordWrap:{width:cardW-this.s(110)},lineSpacing:this.s(5)}).setDepth(100).setAlpha(0);
    this.tweens.add({targets:[pIcon,pName,pDesc],alpha:1,duration:900,delay:500});

    // Trait rows with hover explanations
    const T = this._traitInfo(de);
    const keys=['riskPreference','lossAversion','patience','diversification','greedFomo','reactionToNoise','learning','resilience','disposition','overconfidence'];
    const colW=Math.min(this.s(340),(W-this.s(150))/2);
    const startX=cx-colW-this.s(14);
    const startY=cardY+cardH+this.s(34);
    const rowH=this.s(40);

    keys.forEach((key,i)=>{
      const col=i%2, row=Math.floor(i/2);
      const bx=startX+col*(colW+this.s(28)), by=startY+row*rowH;
      const val=this.scores[key];
      const info=T[key];

      const lb=this.add.text(bx,by,info.label,{
        fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(14),color:'#a8c0d8'
      }).setDepth(100).setAlpha(0);
      const q=this.add.text(bx+lb.width+this.s(7),by+this.s(1),'\u24D8',{
        fontFamily:'Arial, sans-serif',fontSize:this.s(13),color:'#3f6288'
      }).setDepth(100).setAlpha(0);
      const missing=(val===null||val===undefined);
      const vt=this.add.text(bx+colW,by,missing?(de?'Nicht beobachtet':'Not observed'):this._label(val),{
        fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:missing?'#5a7d9e':'#e2a840',fontStyle:'700'
      }).setOrigin(1,0).setDepth(100).setAlpha(0);
      const bg=this.add.graphics().setDepth(99).setAlpha(0);
      bg.fillStyle(0x152744,1); bg.fillRoundedRect(bx,by+this.s(22),colW,this.s(8),this.s(4));
      const fl=this.add.graphics().setDepth(100).setAlpha(0);

      this.tweens.add({targets:[lb,q,vt,bg,fl],alpha:1,duration:550,delay:800+i*95});
      const o={v:0};
      this.tweens.add({targets:o,v:missing?0:val,duration:950,delay:900+i*95,ease:'Power2.easeOut',
        onUpdate:()=>{
          fl.clear();
          if(missing) return;
          // Neutral single colour: a high value is a description, not "better".
          fl.fillStyle(0x7fa6c9,0.95);
          fl.fillRoundedRect(bx,by+this.s(22),Math.max(this.s(8),colW*(o.v/100)),this.s(8),this.s(4));
        }});

      // Hover zone across the whole row
      const hit=this.add.rectangle(bx+colW/2,by+this.s(14),colW,this.s(38),0xffffff,0)
        .setInteractive({useHandCursor:true}).setDepth(102);
      hit.on('pointerover',()=>{ q.setColor('#e2a840'); this._showTip(info.label, info.text, bx+colW/2, by); });
      hit.on('pointerout', ()=>{ q.setColor('#3f6288'); this._hideTip(); });
    });

    // Retirement note (existing context note) + new retirement section
    const noteY=startY+Math.ceil(keys.length/2)*rowH+this.s(14);
    const nW=Math.min(this.s(760),W-this.s(110));
    const nBg=this.add.graphics().setDepth(99).setAlpha(0);
    nBg.fillStyle(0x0b1725,0.92); nBg.fillRoundedRect(cx-nW/2,noteY,nW,this.s(78),this.s(12));
    nBg.lineStyle(1,0x2c4767,1); nBg.strokeRoundedRect(cx-nW/2,noteY,nW,this.s(78),this.s(12));
    nBg.lineStyle(this.s(4),0x4ecdc4,0.75); nBg.lineBetween(cx-nW/2,noteY+this.s(12),cx-nW/2,noteY+this.s(66));
    const nTx=this.add.text(cx,noteY+this.s(39),this._contextNote(window.retirementContext||{},de),{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(14),color:'#c0d4e6',
      align:'center',wordWrap:{width:nW-this.s(54)},lineSpacing:this.s(6)
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    this.tweens.add({targets:[nBg,nTx],alpha:1,duration:900,delay:1700});

    // ── Retirement in Germany: personalised, badged, educational ──
    const retY=noteY+this.s(92);
    const ret=this._retirementLines(de);
    const rBg=this.add.graphics().setDepth(99).setAlpha(0);
    const rTx=this.add.text(cx,retY+this.s(14),ret.body,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(12),color:'#b8cde0',
      align:'center',wordWrap:{width:nW-this.s(54)},lineSpacing:this.s(5)
    }).setOrigin(0.5,0).setDepth(100).setAlpha(0);
    const rH=rTx.height+this.s(58);
    rBg.fillStyle(0x0b1725,0.92); rBg.fillRoundedRect(cx-nW/2,retY,nW,rH,this.s(12));
    rBg.lineStyle(1,0x2c4767,1); rBg.strokeRoundedRect(cx-nW/2,retY,nW,rH,this.s(12));
    rBg.lineStyle(this.s(4),0xe2a840,0.75); rBg.lineBetween(cx-nW/2,retY+this.s(12),cx-nW/2,retY+rH-this.s(12));
    // Status badges row
    const badgeY=retY+rTx.height+this.s(24);
    let bxOff=cx-(ret.badges.length*this.s(118))/2;
    const badgeObjs=[];
    ret.badges.forEach(b=>{
      const col=b.status==='LAW'?0x4ecdc4:(b.status==='EFFECTIVE 2027'?0xe2a840:0x7fa6c9);
      const bg=this.add.graphics().setDepth(100).setAlpha(0);
      bg.fillStyle(col,0.16); bg.fillRoundedRect(bxOff,badgeY,this.s(110),this.s(20),this.s(10));
      bg.lineStyle(1,col,0.8); bg.strokeRoundedRect(bxOff,badgeY,this.s(110),this.s(20),this.s(10));
      const bt=this.add.text(bxOff+this.s(55),badgeY+this.s(10),b.status,{
        fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(10),color:'#dbe8f4',fontStyle:'700'
      }).setOrigin(0.5).setDepth(100).setAlpha(0);
      badgeObjs.push(bg,bt);
      bxOff+=this.s(118);
    });
    this.tweens.add({targets:[rBg,rTx].concat(badgeObjs),alpha:1,duration:900,delay:1900});

    const disc=this.add.text(cx,retY+rH+this.s(14),de
      ? 'Dieses Profil spiegelt nur diese Sitzung wider. Es ist keine Finanzberatung. Rentenangaben zuletzt geprüft: '+(typeof PensionContent!=='undefined'?PensionContent.lastVerified:'—')
      : 'This profile reflects this session only. It is not financial advice. Pension facts last verified: '+(typeof PensionContent!=='undefined'?PensionContent.lastVerified:'—'),{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(12),color:'#456a8c',align:'center'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    this.tweens.add({targets:disc,alpha:1,duration:800,delay:2100});

    // Buttons: Play Again + real-world CTA adapted to the player's situation
    const bY=retY+rH+this.s(40), bW=this.s(220), bH=this.s(48), gap=this.s(20);
    const btnBg=this.add.graphics().setDepth(99).setAlpha(0);
    btnBg.fillStyle(0xe2a840,1); btnBg.fillRoundedRect(cx-bW-gap/2,bY,bW,bH,this.s(11));
    const btnTx=this.add.text(cx-bW/2-gap/2,bY+bH/2,de?'Nochmal spielen':'Play Again',{
      fontFamily:'Playfair Display, Georgia, serif',fontSize:this.s(18),color:'#0b1725',fontStyle:'700'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    const ctaBg=this.add.graphics().setDepth(99).setAlpha(0);
    const ctaLabel=this._ctaLabel(de);
    const ctaW=Math.max(bW,this.s(24)+ctaLabel.length*this.s(7));
    ctaBg.fillStyle(0x0b1725,1); ctaBg.fillRoundedRect(cx+gap/2,bY,ctaW,bH,this.s(11));
    ctaBg.lineStyle(1,0x4ecdc4,0.9); ctaBg.strokeRoundedRect(cx+gap/2,bY,ctaW,bH,this.s(11));
    const ctaTx=this.add.text(cx+gap/2+ctaW/2,bY+bH/2,ctaLabel,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:'#4ecdc4',fontStyle:'600'
    }).setOrigin(0.5).setDepth(100).setAlpha(0);
    this.tweens.add({targets:[btnBg,btnTx,ctaBg,ctaTx],alpha:1,duration:800,delay:2300});
    const hit=this.add.rectangle(cx-bW/2-gap/2,bY+bH/2,bW,bH,0xffffff,0).setDepth(101).setInteractive({useHandCursor:true});
    hit.on('pointerdown',()=>{ if(typeof ScoringEngine!=='undefined') ScoringEngine.reset(); this.scene.start('PlayerSetup'); });
    const ctaHit=this.add.rectangle(cx+gap/2+ctaW/2,bY+bH/2,ctaW,bH,0xffffff,0).setDepth(101).setInteractive({useHandCursor:true});
    ctaHit.on('pointerdown',()=>this._showTip(ctaLabel,this._ctaBody(de),cx+gap/2+ctaW/2,bY));

    this._detailsButton(de);
    console.log('[WealthSim] Scores:',this.scores,'Persona:',this.persona.key);
  }

  // ── Corner button + "How we got this" details panel ─────────────
  _detailsButton(de) {
    const lbl=de?'\u24D8  So entstand dein Ergebnis':'\u24D8  How we got this result';
    const t=this.add.text(this.W-this.s(20),this.s(20),lbl,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:'#e2a840',fontStyle:'600',
      backgroundColor:'#0b1725',padding:{x:this.s(12),y:this.s(8)}
    }).setOrigin(1,0).setDepth(130).setAlpha(0).setInteractive({useHandCursor:true});
    this.tweens.add({targets:t,alpha:1,duration:800,delay:2400});
    t.on('pointerover',()=>t.setColor('#ffe090')); t.on('pointerout',()=>t.setColor('#e2a840'));
    t.on('pointerdown',()=>this._openDetails(de));
  }

  _openDetails(de) {
    if (this.details) return;
    this._hideTip();
    const W=this.W,H=this.H;
    const D=(typeof ScoringEngine!=='undefined'&&ScoringEngine.decisions)?ScoringEngine.decisions:[];
    const A=(typeof ScoringEngine!=='undefined'&&ScoringEngine.startingAnswers)?ScoringEngine.startingAnswers:[];
    const rows=Assessment.evidence(D,A,this.scores);
    const c=this.add.container(0,0).setDepth(200);
    const ov=this.add.rectangle(W/2,H/2,W,H,0x000000,0.78).setInteractive();
    const bw=Math.min(this.s(980),W-this.s(40)), bh=H-this.s(40), bx=(W-bw)/2, by=this.s(20);
    const box=this.add.graphics();
    box.fillStyle(0x08121f,0.99); box.fillRoundedRect(bx,by,bw,bh,this.s(14));
    box.lineStyle(1,0xe2a840,0.55); box.strokeRoundedRect(bx,by,bw,bh,this.s(14));
    const title=this.add.text(bx+this.s(26),by+this.s(18),de?'So entstand dein Ergebnis':'How we got this result',{
      fontFamily:'Playfair Display, Georgia, serif',fontSize:this.s(22),color:'#e2a840'});
    const intro=this.add.text(bx+this.s(26),by+this.s(52),de
      ?'Jede Zeile zeigt, was du im Spiel getan hast, und wie wir es gelesen haben. Nicht Beobachtetes wird nicht bewertet.'
      :'Each row shows what you actually did in the game, and how it was read. Anything not observed is not scored.',{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(12),color:'#8fa9c2',wordWrap:{width:bw-this.s(90)}});
    c.add([ov,box,title,intro]);
    const colW=(bw-this.s(78))/2;
    let y=[by+this.s(86),by+this.s(86)];
    rows.forEach((r,i)=>{
      const col=i%2, x=bx+this.s(26)+col*(colW+this.s(26));
      const hd=this.add.text(x,y[col],r.trait,{fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:'#f0c060',fontStyle:'700'});
      const did=this.add.text(x,y[col]+hd.height+this.s(3),r.did||(de?'Nicht beobachtet in dieser Sitzung.':'Not observed in this session.'),{
        fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(12),color:r.did?'#dbe8f4':'#5a7d9e',wordWrap:{width:colW}});
      const how=this.add.text(x,did.y+did.height+this.s(2),r.how,{
        fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(11),color:'#7d97b3',fontStyle:'italic',wordWrap:{width:colW}});
      c.add([hd,did,how]);
      y[col]=how.y+how.height+this.s(12);
    });
    const foot=this.add.text(bx+this.s(26),by+bh-this.s(30),de
      ?'Nur diese Sitzung. Keine Diagnose und keine Finanzberatung.'
      :'This session only. Not a diagnosis and not financial advice.',{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(11),color:'#456a8c'});
    const close=this.add.text(bx+bw-this.s(20),by+this.s(18),de?'Schlie\u00dfen \u2715':'Close \u2715',{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(14),color:'#a8c0d8'}).setOrigin(1,0).setInteractive({useHandCursor:true});
    close.on('pointerover',()=>close.setColor('#ffffff')); close.on('pointerout',()=>close.setColor('#a8c0d8'));
    close.on('pointerdown',()=>{ c.destroy(); this.details=null; });
    c.add([foot,close]);
    // Scroll if content is taller than the box.
    const contentBottom=Math.max(y[0],y[1]), maxScroll=Math.max(0,contentBottom-(by+bh-this.s(40)));
    if (maxScroll>0) {
      const movable=c.list.slice(4).filter(o=>o!==foot&&o!==close);
      const base=movable.map(o=>o.y); let off=0;
      const mask=this.make.graphics({add:false}); mask.fillRect(bx,by+this.s(80),bw,bh-this.s(120));
      const gm=mask.createGeometryMask(); movable.forEach(o=>o.setMask(gm));
      this.input.on('wheel',(p,go,dx,dy)=>{ if(!this.details) return; off=Math.max(0,Math.min(maxScroll,off+dy*0.5)); movable.forEach((o,i)=>o.y=base[i]-off); });
    }
    this.details=c;
  }

  // ── Hover explanation popup ───────────────────────────────────────
  _showTip(title, body, x, y) {
    this._hideTip();
    const tw=Math.min(this.s(340),this.W-this.s(60));
    const pad=this.s(14);
    const tTitle=this.add.text(0,0,title,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(14),color:'#f0c060',fontStyle:'700'});
    const tBody=this.add.text(0,0,body,{
      fontFamily:'Inter, Arial, sans-serif',fontSize:this.s(13),color:'#b8cde0',
      wordWrap:{width:tw-pad*2},lineSpacing:this.s(5)});
    const th = pad*2 + tTitle.height + this.s(6) + tBody.height;
    let tx = x - tw/2;
    tx = Math.max(this.s(10), Math.min(tx, this.W - tw - this.s(10)));
    let ty = y - th - this.s(14);
    if (ty < this.s(10)) ty = y + this.s(48);

    const bg=this.add.graphics();
    bg.fillStyle(0x040c16,0.98); bg.fillRoundedRect(tx,ty,tw,th,this.s(10));
    bg.lineStyle(1,0xe2a840,0.65); bg.strokeRoundedRect(tx,ty,tw,th,this.s(10));
    bg.lineStyle(this.s(3),0xe2a840,0.7); bg.lineBetween(tx,ty+this.s(10),tx,ty+th-this.s(10));
    tTitle.setPosition(tx+pad, ty+pad);
    tBody.setPosition(tx+pad, ty+pad+tTitle.height+this.s(6));

    this.tip=this.add.container(0,0).setDepth(160);
    this.tip.add([bg,tTitle,tBody]);
    this.tip.setAlpha(0);
    this.tweens.add({targets:this.tip,alpha:1,duration:160});
  }
  _hideTip(){ if(this.tip){this.tweens.killTweensOf(this.tip);this.tip.destroy();this.tip=null;} }

  _traitInfo(de) {
    if (de) return {
      riskPreference:{label:'Risikobereitschaft',text:'Wie viel Unsicherheit du für höhere mögliche Erträge akzeptierst. Hoch heißt nicht besser — es geht um deine Zeit und deinen Komfort.'},
      lossAversion:{label:'Verlustaversion',text:'Wie stark Verluste sich für dich schlimmer anfühlen als gleich große Gewinne. Hohe Werte führen oft zu Verkäufen im ungünstigsten Moment.'},
      patience:{label:'Geduld',text:'Deine Bereitschaft, auf spätere, größere Ergebnisse zu warten statt sofortige Belohnung zu nehmen — die Basis des Zinseszinses.'},
      diversification:{label:'Diversifikation',text:'Wie breit du Ressourcen verteilst. Streuung senkt die Wirkung eines einzelnen schlechten Ergebnisses.'},
      greedFomo:{label:'FOMO-Reaktion',text:'FOMO = "Fear Of Missing Out", die Angst etwas zu verpassen. Misst, wie stark steigende Kurse dich zum Nachkaufen verleiten.'},
      reactionToNoise:{label:'Reaktion auf Nachrichten',text:'Wie stark Schlagzeilen deine Entscheidungen verändern. Niedrige Werte bedeuten, du hältst an deinem Plan fest.'},
      learning:{label:'Lernfähigkeit',text:'Ob du dein Verhalten anpasst, nachdem du Ergebnisse gesehen hast — ohne zu über- oder unterreagieren.'},
      disposition:{label:'Gewinner verkaufen',text:'Ob du Gewinner zu fr\u00fch verkaufst und Verlierer h\u00e4ltst \u2014 oder den Kaufpreis entscheiden l\u00e4sst, obwohl nur die Zukunft z\u00e4hlt.'},
      overconfidence:{label:'\u00dcberzuversicht',text:'Wie weit deine Sicherheit bei Prognosen \u00fcber deiner Trefferquote lag. Vier Prognosen beschreiben nur diese Sitzung.'},
      resilience:{label:'Resilienz',text:'Wie ruhig du in einem Abschwung bleibst und ob du deine Struktur intakt hältst, bis sich die Lage erholt.'}
    };
    return {
      riskPreference:{label:'Risk preference',text:'How much uncertainty you accept in exchange for higher possible returns. Higher is not better — it depends on your time horizon and comfort.'},
      lossAversion:{label:'Loss aversion',text:'How much worse a loss feels than an equal gain feels good. High loss aversion often leads to selling at the worst moment.'},
      patience:{label:'Patience',text:'Your willingness to wait for larger later results instead of taking an immediate reward. This is the foundation of compound growth.'},
      diversification:{label:'Diversification',text:'How widely you spread resources. Spreading reduces the impact of any single bad outcome on the whole.'},
      greedFomo:{label:'FOMO response',text:'FOMO means "Fear Of Missing Out". This measures how strongly rising prices tempt you to pile in after the gains have already happened.'},
      reactionToNoise:{label:'Reaction to news',text:'How much headlines change your decisions. Low scores mean you stick to your plan when the news gets loud.'},
      learning:{label:'Adaptability',text:'Whether you adjust your approach after seeing results — without overreacting to a single setback or success.'},
      disposition:{label:'Selling winners early',text:'Whether you sell what is up and keep what is down \u2014 or let the price you paid decide, when only the future should matter.'},
      overconfidence:{label:'Overconfidence',text:'How far your forecast confidence was above your actual hit rate. Four forecasts describe this session only.'},
      resilience:{label:'Resilience',text:'How steadily you behave during a downturn, and whether you keep your structure intact until conditions recover.'}
    };
  }

  _label(v) {
    const de=(typeof currentLang!=='undefined'&&currentLang==='de');
    if (de) return v>=80?'Sehr hoch':v>=64?'Hoch':v>=42?'Moderat':v>=26?'Niedrig':'Sehr niedrig';
    return v>=80?'Very high':v>=64?'High':v>=42?'Moderate':v>=26?'Low':'Very low';
  }

  _computeScores() {
    const D=(typeof ScoringEngine!=='undefined'&&ScoringEngine.decisions)?ScoringEngine.decisions:[];
    const A=(typeof ScoringEngine!=='undefined'&&ScoringEngine.startingAnswers)?ScoringEngine.startingAnswers:[];
    return Assessment.computeScores(D,A);
  }

  _assignPersona(s) {
    const de=(typeof currentLang!=='undefined'&&currentLang==='de');
    const P={
      strategist:{icon:'\u265F',name:de?'Der Stratege':'The Strategist',desc:de?'Geduldig, breit verteilt und du hast Berichte gelesen, bevor du entschieden hast. In diesem Durchgang hast du nicht auf Schlagzeilen überreagiert.':'Patient, spread your resources and read reports before deciding. In this session you did not overreact to headlines.'},
      guardian:{icon:'\uD83D\uDEE1',name:de?'Der Hüter':'The Guardian',desc:de?'Du hast in diesem Durchgang vorsichtig gewählt und Verluste begrenzt — achte darauf, produktives Risiko nicht ganz zu meiden.':'In this session you chose cautiously and limited losses — watch that you do not avoid productive risk entirely.'},
      challenger:{icon:'\uD83D\uDE80',name:de?'Der Herausforderer':'The Challenger',desc:de?'Wachstumsorientierte Entscheidungen und mehr Risiko bei steigenden Kursen — achte auf Konzentration.':'Growth-oriented choices and more exposure when prices rose — watch for concentration.'},
      explorer:{icon:'\uD83D\uDD2D',name:de?'Gemischtes Muster':'Mixed pattern',desc:de?'Deine Entscheidungen passen in diesem Durchgang nicht zu einem klaren Muster — je nach Situation unterschiedlich.':'Your choices in this session did not fit one clear pattern — they varied with the situation.'},
      sprinter:{icon:'\u26A1',name:de?'Der Sprinter':'The Sprinter',desc:de?'Du hast sofortige Vorteile gewählt und bei steigenden Kursen nachgelegt. Ein längerer Zeithorizont wäre eine gute Übung.':'You chose immediate rewards and added exposure when prices rose. Practising a longer time horizon would be a useful next step.'},
      reactor:{icon:'\uD83C\uDF0A',name:de?'Der Reaktor':'The Reactor',desc:de?'Deine Entscheidungen haben sich mit Schlagzeilen und Kursbewegungen verschoben. Ein schriftlicher Plan hilft in Druckmomenten.':'Your choices shifted with headlines and price moves. A written plan helps in moments of pressure.'},
      insufficient:{icon:'\u2026',name:de?'Zu wenig Daten':'Not enough evidence',desc:de?'Es wurden zu wenige Entscheidungen erfasst, um ein Muster zu beschreiben.':'Too few decisions were recorded to describe a pattern.'}
    };
    const key=Assessment.personaKey(s);
    return Object.assign({key:key},P[key]);
  }

  _contextNote(ctx,de) {
    // saule is now a multi-select array (a person can have GRV + bAV + Pillar 3
    // at once). For this single note, pick the most information-rich pillar
    // present rather than failing to match on an array key.
    const arr = Array.isArray(ctx.saule) ? ctx.saule : (ctx.saule ? [ctx.saule] : []);
    let s = 'unsure';
    if (arr.includes('s3')) s='s3';
    else if (arr.includes('bav')) s='bav';
    else if (arr.includes('grv')) s='grv';
    const y=ctx.years||'30plus';
    const EN={
      grv:{under15:'Your retirement rests mainly on the state pension with limited time remaining. Your instinct to protect makes sense here — the question is whether current reserves are enough.',
           '15-30':'You rely mainly on the state pension with a moderate horizon. Your profile can guide how much growth to pursue in the years ahead.',
           '30plus':'With the state pension and a long horizon, there is time for growth-oriented decisions to recover from setbacks.'},
      bav:{under15:'Employer programs give you a base of stability with limited time left. Consider whether private reserves should supplement them.',
           '15-30':'Employer programs plus a moderate horizon give you flexibility. Your profile shows how to use it well.',
           '30plus':'Employer support and a long horizon position you well. Your natural style has room to work.'},
      s3:{under15:'Private reserves give you flexibility many lack. With limited time, protecting what is built matters most.',
          '15-30':'Private reserves and a moderate horizon. Your profile shows how you respond under pressure — use that insight.',
          '30plus':'Private reserves and a long horizon. Your behavioural profile is especially useful — you have time to adjust.'},
      unsure:{under15:'Your pension structure is still unclear. With limited time, understanding what you already have is the important next step.',
              '15-30':'Understanding your pension structure will help you use the remaining years well.',
              '30plus':'With many years ahead, there is time to understand and strengthen your pension structure.'}
    };
    const DE={
      grv:{under15:'Deine Rente stützt sich hauptsächlich auf die GRV bei begrenzter Zeit. Dein Schutzinstinkt ist verständlich — die Frage ist, ob die Reserven reichen.',
           '15-30':'Du stützt dich auf die GRV mit einem moderaten Horizont. Dein Profil kann leiten, wie viel Wachstum du anstrebst.',
           '30plus':'Mit GRV und langem Horizont ist Zeit, dass wachstumsorientierte Entscheidungen sich erholen.'},
      bav:{under15:'Arbeitgeberprogramme geben Stabilität bei begrenzter Zeit. Überlege, ob private Reserven ergänzen sollten.',
           '15-30':'Arbeitgeberprogramme plus moderater Horizont geben Flexibilität. Dein Profil zeigt, wie du sie nutzt.',
           '30plus':'Arbeitgeberunterstützung und langer Horizont positionieren dich gut.'},
      s3:{under15:'Private Reserven geben dir Flexibilität. Bei begrenzter Zeit zählt der Schutz des Aufgebauten.',
          '15-30':'Private Reserven und moderater Horizont. Dein Profil zeigt, wie du unter Druck reagierst.',
          '30plus':'Private Reserven und langer Horizont. Dein Profil ist besonders wertvoll — du hast Zeit anzupassen.'},
      unsure:{under15:'Deine Rentenstruktur ist unklar. Bei begrenzter Zeit ist Verstehen der wichtigste nächste Schritt.',
              '15-30':'Deine Rentenstruktur zu verstehen hilft, die verbleibenden Jahre gut zu nutzen.',
              '30plus':'Mit vielen Jahren voraus ist Zeit, deine Rentenstruktur zu verstehen und zu stärken.'}
    };
    const T=de?DE:EN;
    return (T[s]&&T[s][y])||T.unsure['30plus'];
  }

  update() {
    if(!this.stars||!this.starGfx) return;
    this.starGfx.clear();
    this.stars.forEach(s=>{
      s.p+=0.02;
      this.starGfx.fillStyle(0xffffff,0.12+0.22*Math.sin(s.p));
      this.starGfx.fillCircle(s.x,s.y,s.r);
    });
  }
}
