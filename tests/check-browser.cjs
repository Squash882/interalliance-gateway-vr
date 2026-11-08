// Headless Chromium acceptance test, requiring Chromium to be installed.
// The 3D runtime is optional for DOM interactivity; headset performance must be tested manually.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gateway-test-'));
try {
  for (const name of ['index.html','styles.css','app.js','content.js']) {
    fs.copyFileSync(path.join(root,name), path.join(tmp,name));
  }
  const pathToIndex = path.join(tmp,'index.html');
  const html = fs.readFileSync(pathToIndex,'utf8').replace(/<script src="https:\/\/aframe\.io\/releases\/1\.8\.0\/aframe\.min\.js"><\/script>/, '');
  const injected = `<script>
  (function(){
    function run(){
      try {
        if(typeof GATEWAY_STATUS!=='function') throw Error('App did not initialize');
        const initial = GATEWAY_STATUS();
        if(initial.completed!==0||initial.xp!==0) throw Error('Unexpected initial progress');
        const ch = window.GATEWAY_CHAPTERS;
        for(let i=0;i<ch.length;i++){
          window.dispatchEvent(new KeyboardEvent('keydown',{key:String(i+1)}));
          for(let j=0;j<ch[i].rounds.length;j++){
            const round=ch[i].rounds[j];
            const buttons=()=>document.querySelectorAll('#choices button');
            if(buttons().length!==3) throw Error('Missing options at stage '+i+'/'+j);
            if(round.kind==='timeline') round.sequence.forEach(choice=>buttons()[choice].click());
            else if(round.kind==='dispatch') round.tickets.forEach(ticket=>buttons()[ticket.answer].click());
            else buttons()[round.options.findIndex(x=>x.correct)].click();
            if(j<ch[i].rounds.length-1) document.getElementById('next').click();
          }
        }
        const result=GATEWAY_STATUS();
        if(result.completed!==5||result.xp!==1000||result.path!=='BUILD') throw Error('Wrong final state: '+JSON.stringify(result));
        document.getElementById('reset').click();
        if(GATEWAY_STATUS().completed!==0) throw Error('Reset failed');
        document.body.insertAdjacentHTML('afterbegin','<output id="browser-test-result">PASS: full journey and reset</output>');
      } catch(e){ document.body.insertAdjacentHTML('afterbegin','<output id="browser-test-result">FAIL: '+e.message+'</output>'); }
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run); else run();
  })();
  </script>`;
  fs.writeFileSync(pathToIndex, html.replace('</body>',injected+'</body>'));
  const browser=process.env.CHROMIUM_BIN || '/usr/bin/chromium';
  const res=spawnSync(browser,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--disable-extensions','--disable-software-rasterizer','--virtual-time-budget=1500','--dump-dom','file://'+pathToIndex],{encoding:'utf8',timeout:12000,maxBuffer:4*1024*1024});
  if(res.error)throw res.error;
  assert.match(res.stdout, /id="browser-test-result">PASS: full journey and reset/);
  console.log('PASS: headless Chromium completed all 10 checkpoints, awarded XP, selected path, and reset.');
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
