const fs=require('fs');
const file='work/page.html';
const old='<g fill="#b78aff" stroke="#d6bfff" stroke-width="2"><rect x="145" y="43" width="50" height="50" rx="10"/><rect x="88" y="100" width="50" height="50" rx="10"/><rect x="145" y="100" width="50" height="50" rx="10"/><rect x="202" y="100" width="50" height="50" rx="10"/></g>';
const updated='<g fill="#b78aff" stroke="#d6bfff" stroke-width="2"><rect x="145" y="43" width="50" height="50" rx="10"/><rect x="202" y="43" width="50" height="50" rx="10"/><rect x="88" y="100" width="50" height="50" rx="10"/><rect x="145" y="100" width="50" height="50" rx="10"/></g>';
const page=fs.readFileSync(file,'utf8');
if(!page.includes(old))throw Error('Expected home artwork not found');
fs.writeFileSync(file,page.replace(old,updated));
