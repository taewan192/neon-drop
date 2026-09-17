const fs=require('fs');let settings=fs.readFileSync('work/settings.js','utf8'),app=fs.readFileSync('work/app.js','utf8');
settings=settings.replace("$('language-select').value=language;", "document.querySelectorAll('[data-action]').forEach((n,i)=>n.setAttribute('aria-label',controlNames[language][i]));$('settings-open').title=tr('settings');$('language-select').value=language;");
app=app.replace('const color=colors[type];',"const color=theme==='light'?({I:'#128c80',O:'#a37b08',T:'#8755d4',S:'#24804e',Z:'#c54772',J:'#3568c6',L:'#bc661b'}[type]):colors[type];");
fs.writeFileSync('work/settings.js',settings);fs.writeFileSync('work/app.js',app);
