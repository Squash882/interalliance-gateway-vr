// Source-content and challenge structure validation; no dependencies.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const scope = { window: {} };
vm.runInNewContext(fs.readFileSync('content.js', 'utf8'), scope);
const chapters = scope.window.GATEWAY_CHAPTERS;
assert.equal(chapters.length, 5);
assert.deepEqual(Array.from(chapters, ch => ch.id), ['origins','mission','programs','leadership','path']);
let challengeCount = 0;
let multiStepMissions = 0;
for (const chapter of chapters) {
  assert.ok(chapter.title && chapter.story && chapter.narration && chapter.vr, `${chapter.id} needs prose and VR content`);
  assert.ok(chapter.source.startsWith('https://interalliance.org/'), `${chapter.id} must cite a first-party source`);
  assert.ok(chapter.facts.length >= 3, `${chapter.id} must teach several facts`);
  for (const round of chapter.rounds) {
    challengeCount++;
    assert.ok(round.question && round.vrQuestion);
    assert.equal(round.options.length,3, `${chapter.id} needs three controller targets`);
    round.options.forEach(option => assert.ok(option.label && option.why));
    if (round.kind === 'timeline') {
      multiStepMissions++;
      assert.equal(round.sequence.length,3);
      assert.deepEqual(Array.from(round.sequence).sort(),[0,1,2], 'timeline must use each milestone once');
      assert.deepEqual(Array.from(round.options, option => Number(option.label.slice(0,4))).sort(),[2007,2008,2010]);
    } else if (round.kind === 'dispatch') {
      multiStepMissions++;
      assert.ok(round.tickets.length >= 3);
      round.tickets.forEach(ticket => assert.ok(ticket.label && ticket.vr && ticket.why && ticket.answer >= 0 && ticket.answer < round.options.length));
    } else {
      assert.ok(round.options.some(x => x.correct), `${chapter.id} needs a correct option`);
    }
  }
}
assert.equal(challengeCount,10);
assert.equal(multiStepMissions,2);
assert.match(chapters[0].facts.join(' '), /2007/);
assert.match(chapters[3].facts.join(' '), /SYSTEMS/);
assert.match(chapters[3].facts.join(' '), /FINANCE/);
assert.deepEqual(Array.from(chapters[4].rounds[0].options, x=>x.path), ['BUILD','LEAD','LAUNCH']);
console.log('PASS: sourced 5 exhibits, 10 checkpoints, two multi-step missions, six teams, three paths.');
