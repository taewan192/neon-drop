const fs = require('fs');
const path = require('path');
const {chromium} = require('C:/Users/fhgkf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const out = path.resolve(__dirname,'../outputs');
const blocks = (cells, x, y, size, color) => cells.map(([a,b])=>`<rect x="${x+a*(size+7)}" y="${y+b*(size+7)}" width="${size}" height="${size}" rx="10" fill="${color}" stroke="#ffffff" stroke-opacity=".24"/><path d="M${x+a*(size+7)+12} ${y+b*(size+7)+9}h${size-24}" stroke="white" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>`).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
<defs><radialGradient id="glow"><stop stop-color="#264454"/><stop offset="1" stop-color="#101527"/></radialGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#8194c3" stroke-opacity=".07"/></pattern><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="13" flood-color="#000" flood-opacity=".4"/></filter></defs>
<rect width="1024" height="500" fill="#101527"/><ellipse cx="815" cy="245" rx="480" ry="390" fill="url(#glow)"/><rect x="536" width="488" height="500" fill="url(#grid)"/>
<path d="M566 415L964 17M637 488L1024 101" stroke="#55e5d0" stroke-opacity=".12"/>
<g font-family="Arial, sans-serif"><text x="64" y="86" fill="#55e5d0" font-size="15" font-weight="700" letter-spacing="5">ARCANA</text>
<text x="58" y="202" fill="#f5f7ff" font-size="94" font-weight="900" letter-spacing="-5">NEON</text><text x="58" y="291" fill="#55e5d0" font-size="94" font-weight="900" letter-spacing="-5">DROP</text>
<rect x="64" y="325" width="40" height="4" rx="2" fill="#aa87ff"/><text x="64" y="376" fill="#d7dfef" font-size="25" font-weight="400">One line at a time.</text></g>
<g filter="url(#shadow)">${blocks([[1,0],[2,0],[0,1],[1,1]],623,164,71,'#aa87ff')}${blocks([[0,0],[1,0],[2,0],[3,0]],624,351,58,'#55e5d0')}${blocks([[0,0],[1,0],[0,1],[1,1]],866,65,36,'#f1d46a')}</g>
<g fill="#55e5d0"><circle cx="605" cy="106" r="3"/><circle cx="940" cy="304" r="4"/></g><g fill="#aa87ff"><circle cx="580" cy="319" r="3"/><circle cx="837" cy="93" r="2"/></g>
</svg>`;
fs.writeFileSync(path.join(out,'neon-drop-feature-graphic.svg'),svg);
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1024,height:500},deviceScaleFactor:1});await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);await page.screenshot({path:path.join(out,'neon-drop-feature-graphic-1024x500.png')});await browser.close();fs.copyFileSync(path.join(out,'neon-drop-figma-icon-512.png'),path.join(out,'neon-drop-store-icon-512.png'));console.log('Exported app icon and feature graphic.');})();
