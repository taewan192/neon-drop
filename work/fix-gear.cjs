const fs=require('fs');
const points=[];
for(let i=0;i<8;i++)for(const [offset,r] of [[-17,7.7],[-11,10],[11,10],[17,7.7]]){const angle=(i*45+offset)*Math.PI/180;points.push(`${(12+r*Math.cos(angle)).toFixed(2)},${(12+r*Math.sin(angle)).toFixed(2)}`);}
const svg=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M${points.join('L')}Z"/><circle cx="12" cy="12" r="3.2"/></svg>`;
let page=fs.readFileSync('work/page.html','utf8');page=page.replace(/(<button class="sound settings-trigger"[^>]*>)<svg[\s\S]*?<\/svg>/,(_,button)=>button+svg);fs.writeFileSync('work/page.html',page);
