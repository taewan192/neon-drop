class NeonGame {
  static shapes = {I:[[0,0],[1,0],[2,0],[3,0]],O:[[1,0],[2,0],[1,1],[2,1]],T:[[1,0],[0,1],[1,1],[2,1]],S:[[1,0],[2,0],[0,1],[1,1]],Z:[[0,0],[1,0],[1,1],[2,1]],J:[[0,0],[0,1],[1,1],[2,1]],L:[[2,0],[0,1],[1,1],[2,1]]};
  constructor(random=Math.random){this.random=random;this.reset();}
  reset(){this.board=Array.from({length:20},()=>Array(10).fill(null));this.queue=[];this.bag=[];this.score=0;this.lines=0;this.level=1;this.held=null;this.holdUsed=false;this.over=false;this.time=0;this.lockTime=0;this.lockResets=0;this.combo=-1;this.cleared=[];this.fillQueue();this.spawn();}
  next(){if(!this.bag.length){this.bag=Object.keys(NeonGame.shapes);for(let i=6;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}}return this.bag.pop();}
  fillQueue(){while(this.queue.length<5)this.queue.push(this.next());}
  spawn(type){this.type=type||this.queue.shift();this.fillQueue();this.cells=NeonGame.shapes[this.type].map(p=>[...p]);this.x=3;this.y=0;this.time=0;this.lockTime=0;this.lockResets=0;if(!this.valid())this.over=true;}
  valid(cells=this.cells,x=this.x,y=this.y){return cells.every(([cx,cy])=>x+cx>=0&&x+cx<10&&y+cy<20&&(y+cy<0||!this.board[y+cy][x+cx]));}
  grounded(){return !this.valid(this.cells,this.x,this.y+1);}
  resetLock(){if(this.lockResets<15){this.lockTime=0;this.lockResets++;}}
  move(dx,dy=0){if(this.over||!this.valid(this.cells,this.x+dx,this.y+dy))return false;const grounded=this.grounded();this.x+=dx;this.y+=dy;if(dx&&grounded)this.resetLock();if(dy)this.lockTime=0;return true;}
  rotate(){if(this.over||this.type==='O')return false;const pivot=this.type==='I'?1.5:1;const cells=this.cells.map(([x,y])=>[pivot-(y-pivot),pivot+(x-pivot)]);for(const [dx,dy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1],[-1,-1],[1,-1],[0,-2]]){if(this.valid(cells,this.x+dx,this.y+dy)){const grounded=this.grounded();this.cells=cells;this.x+=dx;this.y+=dy;if(grounded)this.resetLock();return true;}}return false;}
  ghostY(){let y=this.y;while(this.valid(this.cells,this.x,y+1))y++;return y;}
  soft(){if(this.move(0,1)){this.score++;return true;}return false;}
  drop(){if(this.over)return;const y=this.ghostY();this.score+=(y-this.y)*2;this.y=y;this.lock();}
  hold(){if(this.over||this.holdUsed)return false;const old=this.held;this.held=this.type;this.spawn(old);this.holdUsed=true;return true;}
  lock(){if(this.over)return;for(const [x,y] of this.cells){if(this.y+y<0){this.over=true;return;}this.board[this.y+y][this.x+x]=this.type;}const full=[];this.board.forEach((r,i)=>{if(r.every(Boolean))full.push(i);});this.cleared=full;this.board=this.board.filter((_,i)=>!full.includes(i));while(this.board.length<20)this.board.unshift(Array(10).fill(null));if(full.length){this.combo++;this.score+=([0,100,300,500,800][full.length]+50*this.combo)*this.level;this.lines+=full.length;this.level=1+Math.floor(this.lines/10);}else this.combo=-1;this.holdUsed=false;this.spawn();}
  tick(dt){if(this.over)return;this.time+=dt;const speed=Math.max(75,850*Math.pow(.8,this.level-1));while(this.time>=speed){this.time-=speed;if(!this.move(0,1))break;}if(this.grounded()){this.lockTime+=dt;if(this.lockTime>=500)this.lock();}else this.lockTime=0;}
}
