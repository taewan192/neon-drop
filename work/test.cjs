const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync('work/engine.js','utf8')+';globalThis.Game=NeonGame;',ctx);const G=ctx.Game;
let g=new G(()=>.42);assert.equal(new Set([g.type,...g.queue,g.next()]).size,7,'seven-bag provides seven unique pieces');
for(let i=0;i<30;i++)g.move(-1);assert(g.cells.every(([x])=>g.x+x>=0));for(let i=0;i<30;i++)g.move(1);assert(g.cells.every(([x])=>g.x+x<10));
g=new G();const first=g.type;assert(g.hold());assert.equal(g.held,first);assert.equal(g.hold(),false);g.drop();assert.equal(g.holdUsed,false);assert(g.hold());assert.equal(g.type,first);
for(const type of Object.keys(G.shapes)){g=new G();g.spawn(type);const original=JSON.stringify(g.cells);for(let i=0;i<4;i++)g.rotate();assert.equal(JSON.stringify(g.cells),original,type+' four rotations');g.y=g.ghostY();g.rotate();assert(g.valid(),type+' floor rotation');}
g=new G();g.board[19].fill('J');g.board[19][4]=null;g.board[19][5]=null;g.spawn('O');g.x=3;g.y=18;g.lock();assert.equal(g.lines,1);assert.equal(g.score,100);assert.equal(g.board[19][4],'O');assert.equal(g.board.length,20);
g=new G();for(let y=16;y<20;y++){g.board[y].fill('J');g.board[y][5]=null;}g.spawn('I');g.rotate();g.x=2;g.y=16;assert(g.valid());g.lock();assert.equal(g.lines,4);assert.equal(g.score,800);assert(g.board.every(r=>r.every(v=>!v)));
g=new G();g.lines=9;g.board[19].fill('J');g.board[19][4]=null;g.board[19][5]=null;g.spawn('O');g.x=3;g.y=18;g.lock();assert.equal(g.level,2);
g=new G();g.y=g.ghostY();const t=g.type;g.tick(499);assert.equal(g.board.flat().filter(Boolean).length,0);g.tick(1);assert.equal(g.board.flat().filter(Boolean).length,4);
g=new G();g.board[0].fill('J');g.spawn('T');assert(g.over);const score=g.score;g.drop();assert.equal(g.score,score);
console.log('PASS: bag, walls, hold/swap, rotations, floor kicks, line clears, four-line score, level, lock delay, top-out');

