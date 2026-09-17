const {chromium}=require('C:/Users/fhgkf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const fs=require('fs');
(async()=>{
 const dir=path.resolve('outputs/phone-screenshots');fs.mkdirSync(dir,{recursive:true});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:432,height:768},deviceScaleFactor:2.5,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve('outputs/neon-drop.html').replaceAll('\\','/'));
 await page.evaluate(()=>{localStorage.clear();});await page.reload();
 await page.screenshot({path:path.join(dir,'01-home.png')});
 await page.click('#start');
 await page.evaluate(()=>{
  // Play legal moves through the real engine, choosing low stacks with few holes.
  sound=false;
  for(let turn=0;turn<24&&!game.over;turn++){
   let choice=null;
   for(let rot=0;rot<4;rot++)for(let target=-2;target<10;target++){
    const trial=new NeonGame();Object.assign(trial,JSON.parse(JSON.stringify(game)));trial.random=Math.random;
    for(let r=0;r<rot;r++)trial.rotate();
    while(trial.x<target&&trial.move(1)){}while(trial.x>target&&trial.move(-1)){}
    if(trial.x!==target)continue;trial.drop();if(trial.over)continue;
    const heights=[];let holes=0;
    for(let x=0;x<10;x++){let hit=false,h=0;for(let y=0;y<20;y++){if(trial.board[y][x]){if(!hit)h=20-y;hit=true;}else if(hit)holes++;}heights.push(h);}
    const rank=holes*30+heights.reduce((a,b)=>a+b,0)+heights.slice(1).reduce((a,h,i)=>a+Math.abs(h-heights[i]),0)*2-trial.cleared.length*12;
    if(!choice||rank<choice.rank)choice={rot,target,rank};
   }
   if(!choice)break;
   for(let r=0;r<choice.rot;r++)game.rotate();while(game.x<choice.target&&game.move(1)){}while(game.x>choice.target&&game.move(-1)){}
   game.drop();check();
  }
  game.move(0,4);state='capture';render();
 });
 await page.waitForTimeout(1200);
 await page.screenshot({path:path.join(dir,'02-dark-gameplay.png')});
 await page.evaluate(()=>{theme='light';applyPreferences();});
 await page.screenshot({path:path.join(dir,'03-light-gameplay.png')});
 await page.evaluate(()=>{state='home';$('play').hidden=true;$('home').hidden=false;theme='dark';sound=true;applyPreferences();});
 await page.click('#settings-open');
 await page.screenshot({path:path.join(dir,'04-settings.png')});
 const dimensions=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth}));
 await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({files:fs.readdirSync(dir),dimensions,errors}));
})();

