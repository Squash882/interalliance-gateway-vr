// Dependency-free interaction simulation, including multistep missions and saved progress.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class FakeElement {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children=[]; this.attributes={}; this.events={}; this.textContent='';
    this.hidden=true; this.style={};
    const classes=new Set();
    this.classList={add:(value)=>classes.add(value),toggle:(value,yes)=>yes?classes.add(value):classes.delete(value),contains:(value)=>classes.has(value)};
  }
  appendChild(child) {this.children.push(child);child.parent=this;return child;}
  setAttribute(name,value,extra) {this.attributes[name]=extra===undefined?value:`${value}=${extra}`;}
  addEventListener(event,handler) {(this.events[event]||=[]).push(handler);}
  click(){(this.events.click||[]).forEach(fn=>fn());}
  replaceChildren(...children){this.children=[];children.forEach(child=>this.appendChild(child));}
  get firstChild(){return this.children[0];}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
  insertAdjacentText(){}
}
const html=fs.readFileSync('index.html','utf8');
const elements=new Map();
for(const match of html.matchAll(/\bid="([^"]+)"/g)) elements.set(match[1], new FakeElement());
const scene=new FakeElement('a-scene');
const events={};
const storage=new Map();
const context={
  window: { addEventListener:(name,handler)=>events[name]=handler, speechSynthesis:{cancel(){},speak(){}}, AFRAME:{} },
  document: {
    getElementById:(id)=>{assert.ok(elements.has(id),`Missing element ${id}`);return elements.get(id);},
    querySelector:(selector)=>selector==='a-scene'?scene:null,
    createElement:(tag)=>new FakeElement(tag),body:new FakeElement('body')
  },
  HTMLElement:FakeElement,
  localStorage:{getItem:(key)=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},
  setTimeout:()=>{},SpeechSynthesisUtterance:class {}
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('content.js','utf8'),context);
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
const chapters=context.window.GATEWAY_CHAPTERS;
const get=id=>elements.get(id);
const status=()=>context.window.GATEWAY_STATUS();
function switchTo(index){events.keydown({key:String(index+1),target:new FakeElement('body')});}
function pick(index){get('choices').children[index].click();}
function next(){get('next').click();}
assert.equal(status().chapter,'origins');
assert.equal(status().xp,0);
assert.equal(get('choices').children.length,3);
assert.equal(get('missionRoot').children.length,3,'Timeline should have 3 physical selectors');
// Wrong chronological selection cannot advance or grant XP.
pick(0);assert.equal(status().missionStep,0);assert.equal(status().xp,0);
assert.match(get('feedback').textContent,/Try again/);
// Two correct milestones are progress but not a finished mission.
pick(1);pick(2);
assert.equal(status().missionStep,2);assert.equal(status().xp,0);
assert.equal(get('missionSteps').children.length,3);
assert.ok(get('choices').children[1].classList.contains('locked'));
// Duplicate choice must not progress.
pick(2);assert.equal(status().missionStep,2);
pick(0);assert.equal(status().xp,100);
assert.equal(status().missionStep,3);
// Second origins checkpoint.
next();pick(0);assert.equal(status().xp,200);
// Finish mission and programs quizzes.
for(let i=1;i<=2;i++){
  switchTo(i);
  for(let r=0;r<chapters[i].rounds.length;r++){
    pick(chapters[i].rounds[r].options.findIndex(x=>x.correct));
    if(r<chapters[i].rounds.length-1)next();
  }
}
assert.equal(status().xp,600);
switchTo(3);
assert.equal(get('missionRoot').children.length,3,'Operations should show 3 routing terminals');
// The three-ticket ILC routing mission.
pick(2);assert.equal(status().missionStep,0);
pick(0);pick(1);assert.equal(status().missionStep,2);assert.equal(status().xp,600);
pick(2);assert.equal(status().missionStep,3);assert.equal(status().xp,700);
next();pick(1);next();pick(0);
assert.equal(status().xp,900);
switchTo(4);pick(1); // Choose LEAD instead of the default BUILD.
assert.equal(status().xp,1000);
assert.equal(status().path,'LEAD');
assert.equal(status().completed,5);
assert.equal(get('pathResult').hidden,false);
assert.match(get('pathResult').children[0].textContent,/LEADER/);
const saved=JSON.parse(storage.get('interalliance-gateway-progress-v3'));
assert.equal(saved.missionStep[0][0],3);
assert.equal(saved.missionStep[3][0],3);
get('reset').click();
assert.equal(status().completed,0);
assert.equal(status().xp,0);
assert.equal(status().path,null);
assert.equal(status().missionStep,0);
assert.equal(get('pathResult').hidden,true);
console.log('PASS: timeline order, duplicate protection, operations dispatch, all 10 checkpoints, custom path, persistence, reset.');
