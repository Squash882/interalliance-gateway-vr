(() => {
  'use strict';

  const chapters = window.GATEWAY_CHAPTERS;
  if (!Array.isArray(chapters) || chapters.length !== 5) {
    document.body.insertAdjacentText('afterbegin', 'Unable to load the INTERalliance orientation content.');
    return;
  }

  const $ = (id) => document.getElementById(id);
  const scene = document.querySelector('a-scene');
  const STORE_KEY = 'interalliance-gateway-progress-v3';
  const PATH_RESOURCES = {
    BUILD: { title: 'THE BUILDER', description: 'Explore a school chapter, try competitions and workshops, then check out TechOlympics.', url: 'https://interalliance.org/chapters/', link: 'Explore school chapters' },
    LEAD: { title: 'THE LEADER', description: 'Organize a chapter activity, then investigate the six ILC teams and how to get involved.', url: 'https://interalliance.org/programs/ilc/', link: 'Explore ILC' },
    LAUNCH: { title: 'THE LAUNCHER', description: 'Build a professional network, try training opportunities, and review paid INTERnship eligibility.', url: 'https://interalliance.org/programs/', link: 'Explore INTERalliance programs' }
  };
  const missionLength = (round) => round.kind === 'timeline' ? round.sequence.length : round.kind === 'dispatch' ? round.tickets.length : 0;
  const state = {
    current: 0,
    round: chapters.map(() => 0),
    passed: chapters.map((chapter) => chapter.rounds.map(() => false)),
    answers: chapters.map((chapter) => chapter.rounds.map(() => -1)),
    missionStep: chapters.map((chapter) => chapter.rounds.map(() => 0)),
    feedback: chapters.map(() => ''),
    path: null,
    completionCelebrated: false,
    factIndex: chapters.map(() => 0)
  };
  const kioskElements = [];
  let sceneInitialized = false;

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (!saved || !Array.isArray(saved.passed)) return;
      for (let i = 0; i < chapters.length; i++) {
        if (!Array.isArray(saved.passed[i]) || saved.passed[i].length !== chapters[i].rounds.length) return;
        state.passed[i] = saved.passed[i].map(Boolean);
        state.round[i] = Number.isInteger(saved.round?.[i])
          ? Math.max(0, Math.min(saved.round[i], chapters[i].rounds.length - 1)) : 0;
        state.answers[i] = Array.isArray(saved.answers?.[i]) && saved.answers[i].length === chapters[i].rounds.length
          ? saved.answers[i].map((x) => Number.isInteger(x) ? x : -1) : state.answers[i];
        state.missionStep[i] = chapters[i].rounds.map((round, r) => {
          const progress = saved.missionStep?.[i]?.[r];
          return state.passed[i][r] ? missionLength(round) :
            Number.isInteger(progress) ? Math.max(0, Math.min(progress, missionLength(round))) : 0;
        });
      }
      state.current = Number.isInteger(saved.current) ? Math.max(0, Math.min(4, saved.current)) : 0;
      state.path = ['BUILD', 'LEAD', 'LAUNCH'].includes(saved.path) ? saved.path : null;
      state.completionCelebrated = allComplete();
    } catch (_) {
      // Private browsing and local file restrictions must never break a live demo.
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        current: state.current, round: state.round, passed: state.passed,
        answers: state.answers, missionStep: state.missionStep, path: state.path
      }));
    } catch (_) {}
  }

  function done(i) { return state.passed[i].every(Boolean); }
  function allComplete() { return chapters.every((_, i) => done(i)); }
  function score() { return state.passed.reduce((sum, stages) => sum + stages.filter(Boolean).length * 100, 0); }
  function currentRound() { return chapters[state.current].rounds[state.round[state.current]]; }
  function currentMissionStep() { return state.missionStep[state.current][state.round[state.current]]; }
  function isSelectedTimelineItem(round, choiceIndex) {
    return round.kind === 'timeline' && round.sequence.slice(0, currentMissionStep()).includes(choiceIndex);
  }
  function missionPrompt(round, forVR = false) {
    if (round.kind === 'timeline') {
      return currentMissionStep() === missionLength(round)
        ? (forVR ? 'TIMELINE REPAIRED. ALL EVENTS IN ORDER!' : 'Timeline restored! You placed each milestone in its correct historical order.')
        : (forVR ? round.vrQuestion : `${round.question} (${currentMissionStep() + 1} of ${missionLength(round)})`);
    }
    if (round.kind === 'dispatch') {
      const ticket = round.tickets[Math.min(currentMissionStep(), round.tickets.length - 1)];
      return currentMissionStep() === round.tickets.length
        ? (forVR ? 'INBOX CLEAR. ALL REQUESTS DISPATCHED!' : 'ILC operations desk cleared! All three requests reached the right teams.')
        : (forVR ? ticket.vr : `${round.question} ${ticket.label}`);
    }
    return forVR ? round.vrQuestion : round.question;
  }
  function missionProgressLabel(round) {
    if (!missionLength(round)) return '';
    return `${round.kind === 'timeline' ? 'TIMELINE' : 'OPERATIONS'} · ${currentMissionStep()} / ${missionLength(round)} COMPLETE`;
  }

  function make(tag, attributes = {}, parent = $('kioskRoot')) {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
    parent.appendChild(el);
    return el;
  }

  function buildKiosks() {
    // A horseshoe layout keeps the mission board visible from the starting point.
    const locations = [
      [-5.3, -2.5], [-3.1, -1.2], [0, 2.9], [3.1, -1.2], [5.3, -2.5]
    ];
    chapters.forEach((chapter, index) => {
      const [x, z] = locations[index];
      const root = make('a-entity', { position: `${x} 0 ${z}` });
      make('a-cylinder', { radius: '.7', height: '.25', color: '#17344e', position: '0 .13 0', material: 'metalness:.7; roughness:.25' }, root);
      make('a-ring', { 'radius-inner': '.52', 'radius-outer': '.56', rotation: '-90 0 0', position: '0 .29 0', color: chapter.color, material: `emissive:${chapter.color}; emissiveIntensity:.7; side:double` }, root);
      const crystal = make('a-octahedron', {
        radius: '.37', position: '0 .92 0', color: chapter.color,
        material: `color:${chapter.color}; emissive:${chapter.color}; emissiveIntensity:.5; metalness:.2`,
        animation: `property:rotation; to:0 360 0; loop:true; dur:${7300 + index * 440}; easing:linear`
      }, root);
      const hotspot = make('a-box', { class: 'clickable', geometry: 'depth:1.3; height:1.5; width:1.3', material: 'opacity:0; transparent:true', position: '0 .9 0' }, root);
      hotspot.addEventListener('click', () => chooseExhibit(index));
      make('a-text', { value: chapter.short, position: '0 1.55 0', align: 'center', color: '#f0fcff', width: '3.4', 'wrap-count': '15' }, root);
      make('a-text', { value: `0${index + 1}`, position: '0 .36 .53', align: 'center', color: chapter.color, width: '2' }, root);
      kioskElements.push({ crystal });
    });
  }

  function buildMissionProps(round) {
    // Three physical, interactable holograms surround the player's first step.
    // They duplicate the VR answer buttons, so either controller interaction works.
    const root = $('missionRoot');
    while (root.firstChild) root.firstChild.remove();
    if (!missionLength(round)) return;
    const progress = currentMissionStep();
    round.options.forEach((option, i) => {
      const x = (i - 1) * 1.9;
      const selected = isSelectedTimelineItem(round, i);
      const pedestal = make('a-entity', {position: `${x} 0 -2.0`}, root);
      make('a-cylinder', {position: '0 .15 0', radius: '.58', height: '.30', color: '#112d43', material: 'metalness:.5; roughness:.3'}, pedestal);
      make('a-torus', {position: '0 .32 0', rotation: '-90 0 0', radius: '.46', 'radius-tubular': '.022', color: selected ? '#65ead0' : '#7090c5', material: 'emissiveIntensity:.7'}, pedestal);
      const crystal = make('a-box', {
        class: 'clickable', width: '1.25', height: '.78', depth: '.06', position: '0 1.05 0',
        color: selected ? '#1b675c' : '#214765', material: 'opacity:.93; transparent:true; side:double',
        animation: `property:position; to:0 1.12 0; dir:alternate; loop:true; dur:${1300+i*200}; easing:easeInOutSine`
      }, pedestal);
      crystal.addEventListener('click', () => answer(i));
      const short = round.kind === 'timeline' ? option.label.split(' · ')[0] : option.label.toUpperCase();
      make('a-text', {value: selected ? '✓ '+short : short, position:'0 1.0 .04', align:'center', color:'#f7ffff', width:'2.6', 'wrap-count':'18'}, pedestal);
      make('a-text', {value:round.kind === 'timeline' ? 'TIME CAPSULE' : 'ROUTE TO', position:'0 .43 .38', align:'center', color:'#b6e1f5', width:'1.6'}, pedestal);
    });
  }

  function renderVR() {
    if (!sceneInitialized) return;
    const chapter = chapters[state.current];
    const round = currentRound();
    const index = state.round[state.current];
    $('vrEyebrow').setAttribute('value', `${chapter.kicker}  /  ${index + 1} OF ${chapter.rounds.length}`);
    $('vrHeading').setAttribute('value', chapter.title.toUpperCase());
    $('vrHeading').setAttribute('color', chapter.color);
    $('vrStory').setAttribute('value', chapter.vr);
    $('vrFact').setAttribute('value', chapter.facts[state.factIndex[state.current]]);
    $('vrFactLabel').setAttribute('value', `FACT ${state.factIndex[state.current] + 1} OF ${chapter.facts.length}`);
    $('vrQuestion').setAttribute('value', missionPrompt(round, true));
    $('vrMiniInfo').setAttribute('value', missionProgressLabel(round));
    $('vrFeedback').setAttribute('value', state.feedback[state.current] || 'AIM AT A CHOICE; SELECT USING CONTROLLER TRIGGER, GAZE, OR MOUSE.');
    const root = $('vrOptions');
    while (root.firstChild) root.firstChild.remove();
    const positions = round.options.length === 3 ? [-2.3, 0, 2.3] : [-1.15, 1.15];
    round.options.forEach((option, choiceIndex) => {
      const picked = state.answers[state.current][index] === choiceIndex;
      const unlocked = isSelectedTimelineItem(round, choiceIndex);
      const activeColor = unlocked || (picked && state.passed[state.current][index]) ? '#1e6a5f' : picked ? '#734651' : '#213d58';
      const button = make('a-plane', {
        class: 'clickable', width: '2.16', height: '.48', position: `${positions[choiceIndex]} -1.06 .09`,
        color: activeColor, material: 'side:double'
      }, root);
      make('a-text', {
        value: option.label.toUpperCase().replace(' · ', ' / '), align: 'center', color: '#ffffff',
        width: '2.02', 'wrap-count': '22', position: `${positions[choiceIndex]} -1.1 .12`
      }, root);
      button.addEventListener('click', () => answer(choiceIndex));
    });
    $('vrNextLabel').setAttribute('value', nextLabel(true));
    buildMissionProps(round);
    kioskElements.forEach(({ crystal }, i) => {
      crystal.setAttribute('scale', i === state.current ? '1.22 1.22 1.22' : '1 1 1');
      crystal.setAttribute('material', 'emissiveIntensity', done(i) ? '.95' : (i === state.current ? '.75' : '.3'));
    });
  }

  function nextFact() {
    const i = state.current;
    state.factIndex[i] = (state.factIndex[i] + 1) % chapters[i].facts.length;
    renderVR();
  }

  function nextLabel(short = false) {
    const i = state.current;
    if (allComplete() && i === chapters.length - 1 && state.round[i] === chapters[i].rounds.length - 1) return short ? 'REPLAY' : 'Replay ↻';
    if (state.passed[i][state.round[i]] && state.round[i] < chapters[i].rounds.length - 1) return short ? 'NEXT TASK' : 'Next challenge →';
    return short ? 'NEXT ROOM' : 'Next exhibit →';
  }

  function renderHUD() {
    const chapter = chapters[state.current];
    const round = currentRound();
    const roundIndex = state.round[state.current];
    $('eyebrow').textContent = chapter.kicker;
    $('heading').textContent = chapter.title;
    $('subtitle').textContent = chapter.subtitle;
    $('story').textContent = chapter.story;
    $('roundCount').textContent = `CHECKPOINT ${roundIndex + 1} / ${chapter.rounds.length}` + (missionLength(round) ? ` · ${missionProgressLabel(round)}` : '');
    $('facts').replaceChildren(...chapter.facts.map((fact) => {
      const item = document.createElement('li');
      item.textContent = fact;
      return item;
    }));
    $('questLabel').textContent = state.current === 4 ? 'YOUR PERSONALIZED PATH' : round.kind === 'timeline' ? 'REPAIR THE TIMELINE' : round.kind === 'dispatch' ? 'ILC OPERATIONS DESK' : 'MISSION CHECKPOINT';
    $('question').textContent = missionPrompt(round);
    $('missionSteps').replaceChildren(...Array.from({length: missionLength(round)}, (_, step) => {
      const pip = document.createElement('span');
      pip.className = 'mission-step' + (step < currentMissionStep() ? ' complete' : step === currentMissionStep() ? ' current' : '');
      pip.textContent = `${step < currentMissionStep() ? '✓ ' : ''}${round.kind === 'timeline' ? 'ERA' : 'TICKET'} ${step + 1}`;
      return pip;
    }));
    $('source').href = chapter.source;
    $('choices').replaceChildren(...round.options.map((option, index) => {
      const b = document.createElement('button');
      b.className = 'choice';
      b.textContent = option.label;
      if (isSelectedTimelineItem(round, index)) { b.classList.add('locked'); b.setAttribute('aria-label', option.label + ' already activated'); }
      else if (state.answers[state.current][roundIndex] === index) b.classList.add(state.passed[state.current][roundIndex] ? 'correct' : 'wrong');
      b.addEventListener('click', () => answer(index));
      return b;
    }));
    $('progress').replaceChildren(...chapters.map((item, index) => {
      const pip = document.createElement('span');
      pip.className = 'pip' + (done(index) ? ' active' : '');
      pip.title = item.name + (done(index) ? ' — complete' : ' — in progress');
      return pip;
    }));
    $('progressText').textContent = `${chapters.filter((_, i) => done(i)).length} of ${chapters.length} exhibits completed`;
    $('score').textContent = `${score()} XP`;
    chapters.forEach((_, index) => {
      const portal = $(`portal-${index}`);
      portal.classList.toggle('selected', index === state.current);
      portal.classList.toggle('cleared', done(index));
      portal.setAttribute('aria-pressed', index === state.current ? 'true' : 'false');
      portal.setAttribute('aria-label', `${chapters[index].name}, ${done(index) ? 'completed' : 'not yet completed'}`);
    });
    $('footerMeta').textContent = allComplete() ? `GATEWAY UNLOCKED${state.path ? ' · ' + state.path : ''}` : `Exhibit ${state.current + 1} of ${chapters.length}`;
    $('next').textContent = nextLabel();
    $('feedback').textContent = state.feedback[state.current];
    $('feedback').classList.toggle('show', Boolean(state.feedback[state.current]));
    renderPathResult();
    renderVR();
  }

  function renderPathResult() {
    let result = $('pathResult');
    if (!result) return;
    result.replaceChildren();
    result.hidden = !(allComplete() && state.path);
    if (result.hidden) return;
    const data = PATH_RESOURCES[state.path];
    const title = document.createElement('strong'); title.textContent = `GATEWAY UNLOCKED · ${data.title}`;
    const description = document.createElement('p'); description.textContent = data.description;
    const link = document.createElement('a'); link.href = data.url; link.textContent = data.link + ' ↗';
    link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener noreferrer');
    result.replaceChildren(title, description, link);
  }

  function chooseExhibit(i) {
    state.current = Math.max(0, Math.min(chapters.length - 1, i));
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    persist();
    renderHUD();
  }

  function answer(choiceIndex) {
    const chapterIndex = state.current;
    const roundIndex = state.round[chapterIndex];
    const round = currentRound();
    const option = round.options[choiceIndex];
    if (!option) return;
    const previouslyPassed = state.passed[chapterIndex][roundIndex];
    if (previouslyPassed && missionLength(round)) {
      state.feedback[chapterIndex] = '✓ Mission already completed. Continue to the next checkpoint.';
      renderHUD();
      return;
    }
    if (round.kind === 'timeline' && isSelectedTimelineItem(round, choiceIndex)) {
      state.feedback[chapterIndex] = 'This milestone is already on the timeline. Select the next historical event.';
      renderHUD();
      return;
    }
    const step = currentMissionStep();
    const isCorrect = round.kind === 'timeline' ? choiceIndex === round.sequence[step] :
      round.kind === 'dispatch' ? choiceIndex === round.tickets[step].answer : Boolean(option.correct);
    state.answers[chapterIndex][roundIndex] = choiceIndex;
    if (isCorrect) {
      if (missionLength(round)) {
        state.missionStep[chapterIndex][roundIndex]++;
      }
      const taskDone = !missionLength(round) || currentMissionStep() === missionLength(round);
      if (taskDone) {
        state.passed[chapterIndex][roundIndex] = true;
        if (option.path) state.path = option.path;
      } else {
        state.answers[chapterIndex][roundIndex] = -1;
      }
      const explanation = round.kind === 'dispatch' ? round.tickets[step].why : option.why;
      const suffix = taskDone ? (done(chapterIndex) ? ' EXHIBIT COMPLETE!' : ' Select NEXT CHALLENGE to continue.')
        : ` ${missionLength(round) - currentMissionStep()} step(s) remain.`;
      state.feedback[chapterIndex] = `✓ ${explanation}${suffix}`;
      if (allComplete() && !state.completionCelebrated) {
        state.completionCelebrated = true;
        celebrate();
      }
    } else if (previouslyPassed) {
      state.feedback[chapterIndex] = 'You already cleared this checkpoint. Select a correct answer to review it.';
    } else {
      state.feedback[chapterIndex] = `Try again. ${round.kind === 'dispatch' ? 'Look at which team owns this responsibility.' : option.why}`;
    }
    persist();
    renderHUD();
  }

  function advance() {
    if (allComplete() && state.current === 4 && state.round[4] === chapters[4].rounds.length - 1) {
      reset();
      return;
    }
    const i = state.current;
    if (state.passed[i][state.round[i]] && state.round[i] < chapters[i].rounds.length - 1) {
      state.round[i]++;
      state.feedback[i] = '';
      persist();
      renderHUD();
      return;
    }
    chooseExhibit((i + 1) % chapters.length);
  }

  function reset() {
    state.current = 0;
    state.round = chapters.map(() => 0);
    state.passed = chapters.map((chapter) => chapter.rounds.map(() => false));
    state.answers = chapters.map((chapter) => chapter.rounds.map(() => -1));
    state.missionStep = chapters.map((chapter) => chapter.rounds.map(() => 0));
    state.feedback = chapters.map(() => '');
    state.path = null;
    state.factIndex = chapters.map(() => 0);
    state.completionCelebrated = false;
    persist();
    renderHUD();
  }

  function celebrate() {
    if (!sceneInitialized) return;
    for (let k = 0; k < 30; k++) {
      const x = -4.2 + (k % 11) * .82;
      const y = 1.6 + (k % 6) * .5;
      const orb = make('a-sphere', {
        radius: '.048', color: k % 2 ? '#65ead0' : '#b49aff', position: `${x} ${y} -3.9`,
        animation: `property:position; to:${x} ${y + 1.7} -3.9; dur:${1300 + k * 28}; easing:easeOutQuad`,
        material: 'emissive:#65ead0; emissiveIntensity:.9'
      }, scene);
      setTimeout(() => orb.remove(), 2900);
    }
  }

  function narrate() {
    if (!('speechSynthesis' in window)) {
      state.feedback[state.current] = 'Narration is unavailable in this browser. The full exhibit text is shown.';
      renderHUD();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chapters[state.current].narration);
    utterance.rate = .94;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  chapters.forEach((_, index) => $(`portal-${index}`).addEventListener('click', () => chooseExhibit(index)));
  $('next').addEventListener('click', advance);
  $('reset').addEventListener('click', reset);
  $('speak').addEventListener('click', narrate);
  $('vrNext').addEventListener('click', advance);
  $('vrFactNext').addEventListener('click', nextFact);
  window.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
    if (/^[1-5]$/.test(event.key)) chooseExhibit(Number(event.key) - 1);
    else if (event.key === 'ArrowRight') advance();
    else if (/^[abc]$/i.test(event.key)) answer('abc'.indexOf(event.key.toLowerCase()));
    else if (event.key.toLowerCase() === 'n') narrate();
    else if (event.key.toLowerCase() === 'r' && event.shiftKey) reset();
  });
  scene.addEventListener('enter-vr', () => document.body.classList.add('vr-active'));
  scene.addEventListener('exit-vr', () => document.body.classList.remove('vr-active'));

  // A-Frame does not have to load for HTML learning mode to remain usable.
  const desktopMode = !window.AFRAME || (window.location && new URLSearchParams(window.location.search).has('desktop'));
  if (desktopMode) {
    document.body.classList.add('no-vr');
    $('runtimeNotice').hidden = false;
    $('runtimeNotice').textContent = window.AFRAME ? 'Desktop showcase mode selected. Remove ?desktop from the URL to return to the 3D VR scene.' :
      'Desktop mode active. Internet access is needed to load the optional 3D VR engine; all exhibits and challenges still work.';
  }
  loadProgress();
  buildKiosks();
  sceneInitialized = true;
  renderHUD();
  // Read-only debug/status API used by the dependency-free smoke tests.
  window.GATEWAY_STATUS = () => ({
    chapter: chapters[state.current].id,
    checkpoint: state.round[state.current] + 1,
    completed: chapters.filter((_, i) => done(i)).length,
    xp: score(),
    path: state.path,
    missionStep: currentMissionStep()
  });
})();

