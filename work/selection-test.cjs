const {chromium}=require('C:/Users/fhgkf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await page.goto('file:///'+path.resolve('outputs/neon-drop.html').replaceAll('\\','/'));
  await page.click('#start');
  const result=await page.locator('#drop').evaluate(button=>({
    userSelect:getComputedStyle(button).userSelect,
    webkitUserSelect:getComputedStyle(button).webkitUserSelect,
    webkitTouchCallout:getComputedStyle(button).webkitTouchCallout
  }));
  if(result.userSelect!=='none'&&result.webkitUserSelect!=='none')throw Error('Hard drop text selection is enabled');
  await page.locator('#drop').dispatchEvent('pointerdown',{pointerType:'touch',isPrimary:true});
  await page.waitForTimeout(900);
  const selected=await page.evaluate(()=>getSelection()?.toString()||'');
  if(selected)throw Error('Long press selected hard drop text: '+selected);
  await page.locator('#drop').dispatchEvent('pointerup',{pointerType:'touch',isPrimary:true});
  await browser.close();
  console.log('PASS: hard drop text remains unselected after long press',result);
})();
