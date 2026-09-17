const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve('work/android'),jdk='C:/Users/fhgkf/Documents/Codex/2026-09-06/x20/work/tools/jdk-17.0.20.1+1',sdk='C:/Users/fhgkf/Documents/Codex/2026-09-06/x20/work/android-tools/sdk',gradle='C:/Users/fhgkf/Documents/Codex/2026-09-06/x20/work/android-tools/gradle/gradle-8.13/bin/gradle.bat';
fs.mkdirSync('work/signing',{recursive:true});const configFile='work/signing/signing.json';
if(!fs.existsSync(configFile))fs.writeFileSync(configFile,JSON.stringify({storePassword:crypto.randomBytes(24).toString('hex'),alias:'neondrop-upload'},null,2));
const secret=JSON.parse(fs.readFileSync(configFile));const key=path.resolve('work/signing/neon-drop-upload.jks');
const env={...process.env,JAVA_HOME:jdk,ANDROID_HOME:sdk,NEON_KEYSTORE:key,NEON_STORE_PASSWORD:secret.storePassword,NEON_KEY_PASSWORD:secret.storePassword};
if(!fs.existsSync(key)){const result=cp.spawnSync(jdk+'/bin/keytool.exe',['-genkeypair','-keystore',key,'-storetype','JKS','-alias',secret.alias,'-keyalg','RSA','-keysize','3072','-validity','10000','-dname','CN=NEON DROP Upload, OU=Mobile, O=NEON DROP, C=KR','-storepass:env','NEON_STORE_PASSWORD','-keypass:env','NEON_KEY_PASSWORD'],{env,encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);}
fs.mkdirSync(root+'/app/src/main/assets',{recursive:true});fs.copyFileSync('outputs/neon-drop.html',root+'/app/src/main/assets/neon-drop.html');fs.writeFileSync(root+'/local.properties','sdk.dir='+sdk+'\n');
fs.writeFileSync(root+'/build.gradle',fs.readFileSync(root+'/build.gradle','utf8').replace("version '8.13.0'","version '8.13.2'"));
const proc=cp.spawn('cmd.exe',['/d','/s','/c',`${gradle} --no-daemon bundleRelease assembleRelease`],{cwd:root,env,stdio:'inherit'});proc.on('exit',code=>process.exit(code??1));

