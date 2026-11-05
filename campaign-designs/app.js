/* Five layout candidates share one deliberately isolated review state. */
(async function () {
  'use strict';
  const root = document.getElementById('campaign-root');
  const dialog = document.getElementById('study-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const prefKey = 'projectg-campaign-layout-study-20261102-v1';
  const expandedPrefKey = 'projectg-campaign-expanded-study-20261102-v1';
  const designs = {
    a: {name:'Expedition hub',short:'Party hub',copy:'A scenic party vignette, a prominent next encounter and a compact route. Inspired by historical Idle Heroes Normal Campaign.'},
    b: {name:'The scenic expedition',short:'Stage list',copy:'A chapter list beside your party, with a persistent stage dossier. Inspired by Lost Sword’s campaign composition.'},
    c: {name:'The road ahead',short:'Route map',copy:'A spacious stage route over the landscape, with briefing one tap away. Inspired by Star Savior’s Operation map.'},
    d: {name:'The Asterra atlas',short:'Atlas',copy:'An illustrated regional map with a winding route and a compact encounter dock. A ProjectG interpretation of map-led progression.'},
    e: {name:'Chronicles of Asterra',short:'Chapters',copy:'A chapter shelf with clear story identity, an episode grid and a focused mission panel. A more editorial ProjectG direction.'}
  };
  const heroes = [
    {name:'Soryn Veilglass',file:'combat-draft-assets/draft-soryn-veilglass-coarse-v1.png'},
    {name:'Liora Fernveil',file:'combat-draft-assets/draft-liora-fernveil-coarse-v1.png'},
    {name:'Roselle Vey',file:'combat-draft-assets/draft-roselle-vey-coarse-v1.png'},
    {name:'Isavelle Frostmere',file:'combat-draft-assets/draft-isavelle-frostmere-coarse-v1.png'},
    {name:'Nerielle Wavecrest',file:'combat-draft-assets/draft-nerielle-wavecrest-coarse-v1.png'}
  ];
  const paths = {
    sword:'m5 19 3-3M8 16l-3-3m3 3 11-11 1 4-9 9m-3-2 3 3',
    map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16',
    chevron:'m9 5 7 7-7 7',back:'m15 5-7 7 7 7',lock:'M6 10h12v11H6ZM8 10V7a4 4 0 0 1 8 0v3m-4 5v2',
    check:'m5 12 5 5L20 6',star:'m12 3 3 6 6 1-4.5 4.5L18 21l-6-3-6 3 1.5-6.5L3 10l6-1Z',
    chest:'M3 11h18v9H3Zm0 0V6l4-3h10l4 3v5m-10-1h2v5h-2ZM7 4v7m10-7v7',
    coin:'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5v10m3-8H11a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9',
    gem:'m3 9 4-5h10l4 5-9 12Zm0 0h18M7 4l5 17L17 4',
    story:'M4 4h7l1 2 1-2h7v15h-7l-1 2-1-2H4Zm8 2v15M7 8h2m6 0h2M7 12h2m6 0h2',
    formation:'M3 3h5v5H3Zm7 0h5v5h-5Zm7 0h4v5h-4ZM3 10h5v5H3Zm7 0h5v5h-5Zm7 0h4v5h-4ZM3 17h5v4H3Zm7 0h5v4h-5Zm7 0h4v4h-4Z',
    crown:'m3 6 5 5 4-7 4 7 5-5-2 13H5Zm3 10h12',arrow:'M3 12h17m-6-6 6 6-6 6',
    compass:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-3-2 4-4 2 2-4Z',close:'m5 5 14 14M19 5 5 19',flag:'M5 22V3m0 0h13l-3 4 3 4H5'
  };
  const h = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.star}"/></svg>`;
  let data,storyIndex;
  try { const responses=await Promise.all([fetch('campaign-designs/data.json'),fetch('campaign-designs/story-index.json')]); if(responses.some(r=>!r.ok))throw Error('Campaign data unavailable'); [data,storyIndex]=await Promise.all(responses.map(r=>r.json())); }
  catch(error){root.innerHTML='<p class="loading">The campaign study could not load. Please reload the page.</p>';return;}
  const params = new URLSearchParams(location.search);
  const reached=[8,32,168].includes(Number(params.get('progress')))?Number(params.get('progress')):8;
  const initialDesign=designs[params.get('design')]?params.get('design'):'b';
  const expanded=params.get('expanded')!=='0'&&['b','c'].includes(initialDesign);
  const state = {design:initialDesign,expanded,detailsOpen:params.get('details')==='1',stage:Number(params.get('stage'))||reached,difficulty:params.get('difficulty')==='Hard'?'Hard':'Normal',reached,page:0,formation:[0,-1,-1,1,2,-1,3,-1,4],chosen:null,returnFocus:null};
  const storyStageIds=new Set(storyIndex.storyStageIds);
  if(!data.stages.some(s=>s.id===state.stage))state.stage=8;
  const initial=data.stages.find(s=>s.id===state.stage); state.page=Math.floor((initial.number-1)/8);
  const status = stage => stage.id<state.reached?'cleared':stage.id===state.reached?'current':'locked';
  const stage = () => ({...data.stages.find(s=>s.id===state.stage),status:status(data.stages.find(s=>s.id===state.stage))});
  const chapter = () => data.chapters.find(c=>c.id===stage().chapter);
  const stages = () => data.stages.filter(s=>s.chapter===stage().chapter).map(s=>({...s,status:status(s)}));
  const fmt = n => Number(n).toLocaleString('en-US');
  const backdrop = theme => theme==='forest'?'campaign-assets/regalia-night.png':'campaign-assets/regalia-day.png';
  const party = (size='full')=>`<div class="party party-${h(size)}">${heroes.map((hero,i)=>`<div class="party-unit" data-hero="${i}"><img src="${hero.file}" alt="${hero.name}" draggable="false"></div>`).join('')}</div>`;
  const stageButton = (entry,extra='') => `<button class="stage-button ${entry.status} ${entry.id===state.stage?'selected':''} ${h(extra)}" data-stage="${entry.id}" aria-pressed="${entry.id===state.stage}" aria-label="Stage ${h(entry.code)}, ${h(entry.title)}, ${entry.status}"><span class="stage-seal">${icon(entry.status==='locked'?'lock':/boss/i.test(entry.kind)?'crown':entry.status==='cleared'?'check':'sword')}</span><span class="stage-code">${h(entry.code)}</span><span class="stage-title">${h(entry.title)}</span><span class="stage-state">${entry.status==='current'?'Next':entry.status}</span></button>`;
  const rewards = () => `<ul class="reward-list"><li>${icon('coin')}<span><strong>${fmt(stage().gold)}</strong><small>Gold · first clear</small></span></li><li>${icon('star')}<span><strong>${fmt(stage().xp)}</strong><small>Unit XP · first clear</small></span></li><li>${icon('gem')}<span><strong>10</strong><small>Gems · all 3 objectives</small></span></li></ul>`;
  const progress = () => {const count=stages().filter(s=>s.status==='cleared').length;return `<div class="progress-block"><span>${count} / 24</span><span class="progress-track"><i style="width:${count/24*100}%"></i></span></div>`;};
  const brief = () => {const s=stage();return `<div class="brief-grid"><div><p class="eyebrow">${h(chapter().region)} · ${h(state.difficulty)}</p><h3 class="brief-title">${h(s.code)} · ${h(s.title)}</h3><p class="brief-text">${h(s.briefing)}</p><div class="stage-facts"><span>Enemy Lv. ${s.enemyLevel}</span><span>${s.waves} waves</span><span>${/boss/i.test(s.kind)?'Boss encounter':'Campaign encounter'}</span></div>${s.status==='locked'?`<p class="locked-message">Clear the preceding stages to unlock this encounter. You can still read its briefing.</p>`:''}<button class="game-button ghost" data-action="story">${icon('story')} Story preview</button></div><div><p class="section-label">RECOMMENDED POWER</p><h3 class="brief-title">${fmt(s.power)}</h3><p class="section-label">${s.status==='cleared'?'FIRST-CLEAR REWARDS · ALREADY COLLECTED':'FIRST-CLEAR REWARDS'}</p>${rewards()}<p class="first-clear">One-time rewards. Completing all three objectives awards 10 gems once. Revisit does not grant the regular clear rewards again.</p><div class="dialog-actions"><button class="game-button primary" data-action="deploy" ${s.status==='locked'?'disabled':''}>${icon('formation')} Prepare party</button></div></div></div>`;};
  function render(){
    const entries=stages();
    const ctx={chapter:chapter(),stage:stage(),stages:entries,route:entries.slice(state.page*8,state.page*8+8),difficulty:state.difficulty,clearedCount:entries.filter(s=>s.status==='cleared').length,chapterCount:24,page:state.page,h,icon,party,stageButton,rewards,brief,progress,expanded:state.expanded,detailsOpen:state.detailsOpen,storyStageIds};
    root.className=`campaign-surface design-${state.design}${state.expanded?' is-expanded':''}`;
    document.getElementById('campaign-screen').classList.toggle('expanded-flow',state.expanded);
    document.body.classList.toggle('expanded-review',state.expanded);
    root.innerHTML=window.CampaignLayouts[state.design](ctx);
    document.getElementById('mobile-deploy').innerHTML=`<div><small>${stage().status==='locked'?'STAGE LOCKED':stage().status==='cleared'?'REVISIT STAGE':'NEXT ENCOUNTER'} · ${h(stage().code)}</small><strong>${h(stage().title)}</strong></div><button class="game-button primary" data-action="deploy" ${stage().status==='locked'?'disabled':''}>${icon(stage().status==='locked'?'lock':'formation')}${stage().status==='locked'?'Stage locked':'Prepare Battle'}${stage().status==='locked'?'':icon('arrow')}</button>`;
    const selectedRow=root.querySelector('.b-stage-list .selected');
    const stageList=root.querySelector('.b-stage-list');
    if(selectedRow&&stageList){const r=selectedRow.getBoundingClientRect(),v=stageList.getBoundingClientRect();stageList.scrollTop+=Math.max(0,r.bottom-v.bottom+6);stageList.scrollLeft+=Math.max(0,r.right-v.right+8);}
    const sealTray=root.querySelector('.a-stage-strip');
    const selectedSeal=sealTray?.querySelector('.selected');
    if(selectedSeal&&sealTray){sealTray.scrollLeft=Math.max(0,selectedSeal.offsetLeft-sealTray.offsetLeft-sealTray.clientWidth+selectedSeal.offsetWidth+12);}
    document.getElementById('hud-chapter').textContent=`Chapter ${chapter().id} · ${chapter().region}`;
    const views=state.expanded?[['b',{short:'Campaign'}],['c',{short:'Chapter route'}]]:Object.entries(designs);
    document.getElementById('design-tabs').innerHTML=views.map(([id,d])=>`<button class="design-tab ${id===state.design?'active':''}" data-design="${id}" aria-pressed="${id===state.design}"><b>${id.toUpperCase()}</b><span>${d.short}</span></button>`).join('');
    document.querySelector('.hud-title strong').textContent=state.expanded&&state.design==='c'?'Chapter route':'Campaign';
    document.getElementById('study-kicker').textContent=state.expanded?'B + C · EXPANDED CAMPAIGN FLOW':'INITIAL FIVE DIRECTIONS';
    document.getElementById('study-title').textContent=state.expanded?'One expedition. Two ways to explore.':'The road through Asterra';
    document.getElementById('study-intro').innerHTML=state.expanded?'Select a mission, explore its route and prepare your party.<br><span>Expanded design preview · sample progress · awaiting review</span>':'Explore the original five layouts.<br><span>Initial concepts · sample progress · awaiting your selection</span>';
    document.getElementById('study-mode').textContent=state.expanded?'Initial five studies':'Expanded B + C';
    document.getElementById('caption-id').textContent=state.design.toUpperCase();document.getElementById('caption-title').textContent=state.expanded?(state.design==='b'?'The scenic expedition · expanded':'The chapter route · expanded'):designs[state.design].name;document.getElementById('caption-copy').textContent=state.expanded?(state.design==='b'?'All 24 missions, authored story and boss markers, a compact briefing and battle entry. Open Chapter route to explore the same selection.':'The connected regional route keeps your selected mission and party. Return to Campaign to see its dossier, or prepare directly.'):designs[state.design].copy;
    let saved=null;try{saved=JSON.parse(localStorage.getItem(state.expanded?expandedPrefKey:prefKey));}catch{}
    const palette=window.ProjectGPalettes?.get()||'regalia';
    const savedPalette=window.ProjectGPalettes?.list().find(p=>p.id===(saved?.palette||'regalia'))?.name||'Asterra Regalia';
    document.getElementById('saved-status').textContent=saved?.design?`Saved on this browser: ${saved.design.toUpperCase()} · ${designs[saved.design]?.short||''} · ${savedPalette}`:'';
    document.getElementById('favorite-button').textContent=saved?.design===state.design&&(saved.palette||'regalia')===palette?'Preference saved ✓':'Save preference';
    document.getElementById('sample-progress').value=String(state.reached);
    const url=new URL(location.href);url.searchParams.set('design',state.design);url.searchParams.set('difficulty',state.difficulty);url.searchParams.set('progress',state.reached);url.searchParams.set('expanded',state.expanded?'1':'0');url.searchParams.set('details',state.detailsOpen?'1':'0');url.searchParams.set('stage',state.stage);history.replaceState(null,'',url);
  }
  function open(title,content,kicker='CAMPAIGN STUDY'){
    const replacing=dialog.open;
    if(!dialog.open)state.returnFocus=document.activeElement;
    document.body.classList.add('dialog-open');
    document.getElementById('dialog-title').textContent=title;document.getElementById('dialog-kicker').textContent=kicker;dialogContent.innerHTML=content;
    if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
    if(replacing){document.getElementById('dialog-title').setAttribute('tabindex','-1');document.getElementById('dialog-title').focus({preventScroll:true});}
  }
  function focusStage(selector){const target=(selector&&root.querySelector(selector))||root.querySelector('[data-stage].selected');target?.focus({preventScroll:true});}
  function close(){dialog.close();state.returnFocus?.isConnected&&state.returnFocus.focus();}
  const toast = message => {const el=document.getElementById('toast');el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,4000);};
  function compare(){open('Choose a road through Asterra',`<p class="brief-text">Five ways to navigate the same campaign. Switch freely: the selected stage, sample progress and prebattle formation carry across designs.</p><div class="comparison-grid">${Object.entries(designs).map(([id,d])=>`<button class="comparison-card" data-design="${id}"><span class="compare-art" style="background-image:url('${id==='d'?'campaign-assets/asterra-atlas.svg':id==='e'?'campaign-assets/regalia-night.png':'campaign-assets/regalia-day.png'}')"><strong>${id.toUpperCase()}</strong></span><span><b>${d.name}</b><small>${d.copy}</small></span></button>`).join('')}</div>`);}
  function chapters(){open('Chapters of Asterra',`<p class="brief-text">Three sample regions from the 15-chapter campaign. Future stages can be inspected; changing the sample progress above makes later regions playable in the preview.</p><div class="chapter-grid">${data.chapters.map(c=>`<button class="chapter-card ${c.id===chapter().id?'active':''}" data-chapter="${c.id}"><span class="chapter-art" style="background-image:url('${backdrop(c.theme)}')"><strong>${String(c.id).padStart(2,'0')}</strong></span><span><small>${h(c.region)}</small><b>${h(c.name)}</b><br>24 stages · ${data.stages.filter(s=>s.chapter===c.id&&status(s)==='cleared').length} cleared</span></button>`).join('')}</div>`);}
  function showStory(){
    const scenes=storyIndex.scenes.filter(s=>s.stageId===state.stage);
    const timing={ChapterIntro:'Chapter opening',PreBattle:'Before battle',PostBattle:'After victory',ChapterOutro:'Chapter ending'};
    open(`Story · ${stage().code}`,`<p class="eyebrow">${h(chapter().name)}</p><h3 class="brief-title">${h(stage().title)}</h3><p class="brief-text">${h(stage().briefing)}</p>${scenes.length?`<div class="story-scene-list">${scenes.map(scene=>`<article><span>${icon('story')}</span><div><small>${h(timing[scene.trigger]||scene.trigger)}</small><h4>${h(scene.title)}</h4></div></article>`).join('')}</div>`:'<p class="first-clear">This encounter has no attached story scene. Its mission briefing is shown above.</p>'}<p class="first-clear">Authored scene titles are shown for this design preview; full dialogue plays in the game.</p><div class="dialog-actions"><button class="game-button" data-action="brief">Mission details</button><button class="game-button primary" data-action="deploy" ${stage().status==='locked'?'disabled':''}>Prepare party ${icon('arrow')}</button></div>`,'CHAPTER STORY');
  }
  function research(){open('Research & design approach',`<div class="research-grid"><article><h3>Lost Sword</h3><p>The publisher’s Taiwan chapter 31 screenshot uses a vertical stage list at left, party scenery in the middle and a persistent encounter panel at right.</p><p><b>Applied to B:</b> rapid stage browsing with the information always visible.</p><a href="https://tw.ncsoft.com/lostsword/news/notice/view?newsNo=41" target="_blank" rel="noopener">Publisher update · August 2025 ↗</a><p class="muted">A dated Taiwan build, not a claim about every current regional version.</p></article><article><h3>Idle Heroes</h3><p>Historical Normal Campaign centers the idle party vignette and next Battle button, with stage seals below. A 2025 Void Campaign screenshot instead uses sparse island pins and a large Battle action.</p><p><b>Applied to A / D:</b> a living party hub and a map-led alternative.</p><a href="https://game-maps.com/Idle-Heroes/Idle-Heroes-Campaign.asp" target="_blank" rel="noopener">Historical Normal Campaign guide ↗</a><br><a href="https://www.reddit.com/r/IdleHeroes/comments/1j80gaa/seven_years_of_idle_heroes/" target="_blank" rel="noopener">Void Campaign player evidence · 2025 ↗</a><p class="muted">These are separate modes; the older guide does not establish the 2026 UI.</p></article><article><h3>Star Savior</h3><p>Official Operation imagery places a dotted route across a scenic map, a small chapter heading above, party below and one Enter button. Its later prebattle screen keeps party setup separate.</p><p><b>Applied to C:</b> a spacious route with briefing on demand.</p><a href="https://www.starsavior.com/en/news/019d47ca-cac7-76a2-a604-9e4a900e04a1" target="_blank" rel="noopener">Official Operation map · April 2026 ↗</a><br><a href="https://www.starsavior.com/en/news/01a15d9d-d27e-73fd-be8d-caf4d6afb523" target="_blank" rel="noopener">Official prebattle update · October 2026 ↗</a><p class="muted">Operation is the campaign reference; Journey is a separate training mode.</p></article></div><p class="research-footer"><b>ProjectG adaptation:</b> ivory, restrained gold and teal; five pixel-art heroes; readable phone layouts; prebattle-only 3×3 formation. E explores a chapter shelf with stronger story identity. Existing ProjectG illustrations and sprites are reused. No competitor artwork is included. These are candidates for your selection, with no native campaign replacement yet.</p>`,'OBSERVED REFERENCES · ORIGINAL LAYOUT CANDIDATES');}
  function formation(){if(stage().status==='locked')return;state.chosen=null;renderFormation();}
  function renderFormation(){
    open(`Prepare · ${stage().code} ${stage().title}`,`${state.expanded?'<div class="flow-steps"><span class="complete">01 Mission</span><i></i><span class="active">02 Formation</span><i></i><span>03 Battle</span></div>':''}<div class="formation-layout"><div class="formation-board"><div class="rank-labels"><span>BACK</span><span>MIDDLE</span><span>FRONT</span></div><div class="formation-cells">${state.formation.map((hero,i)=>`<button class="formation-cell ${hero<0?'empty':''} ${state.chosen===i?'chosen':''}" data-cell="${i}" aria-label="${['Top','Middle','Bottom'][Math.floor(i/3)]} lane, ${['back','middle','front'][i%3]} rank${hero>=0?', '+heroes[hero].name:', empty'}" aria-pressed="${state.chosen===i}"><span>${i+1}</span>${hero>=0?`<img src="${heroes[hero].file}" alt="${heroes[hero].name}">`:''}</button>`).join('')}</div></div><div><p class="eyebrow">FIVE HEROES · NINE FIXED CELLS</p><h3 class="brief-title">Set your formation</h3><p class="formation-help">Select a hero, then a cell to move or swap. Columns set depth; rows set the lane. Your five heroes keep these positions once battle begins.</p><p class="formation-selection">${state.chosen===null?'Choose a hero to move.':`Moving ${h(heroes[state.formation[state.chosen]].name)}. Choose a destination.`}</p><div class="prebattle-stage paper-panel"><span class="eyebrow">${h(state.difficulty)} · ${h(stage().code)}</span><strong>${h(stage().title)}</strong><div class="stage-facts"><span>${stage().waves} waves</span><span>Recommended ${fmt(stage().power)}</span></div></div><p class="first-clear">Placement is frozen when you enter. This design preview does not change your game account.</p><div class="dialog-actions"><button class="game-button primary" data-action="enter">Enter battle preview ${icon('arrow')}</button><button class="game-button" data-action="close">Cancel</button></div></div></div>`,'PREBATTLE · FORMATION EDITING');
  }
  function enter(){const frozen=state.formation.slice();open('Battle preview',`<div class="battle-preview"><div class="battle-banner"><strong>${h(stage().code)} · ${h(stage().title)}</strong>Wave 01 / ${stage().waves} · formation locked</div><div class="frozen-party">${frozen.map((hero,i)=>hero<0?'':`<img class="battle-hero" style="left:${(i%3)*24}%;bottom:${(2-Math.floor(i/3))*21}%" src="${heroes[hero].file}" alt="${heroes[hero].name}">`).join('')}</div><img class="battle-enemy" src="combat-draft-assets/draft-seraxis-chrome-empress-coarse-v1.png" alt="Sample enemy placement"></div><p class="first-clear">Static flow demonstration with sample enemy art. The formation editor is hidden throughout battle; actual enemy composition, combat and rewards remain in the native game.</p><button class="game-button primary" data-action="close">Return to campaign</button>`,'BATTLE · FIXED PLACEMENT');}
  document.addEventListener('click',event=>{
    const el=event.target.closest('button');if(!el||el.disabled)return;
    if(el.dataset.design){state.design=el.dataset.design;if(!['b','c'].includes(state.design))state.expanded=false;if(dialog.open)close();render();document.querySelector(`[data-design="${state.design}"]`)?.focus({preventScroll:true});return;}
    if(el.dataset.stage){state.stage=Number(el.dataset.stage);state.page=Math.floor((stage().number-1)/8);render();root.querySelector(`[data-stage="${state.stage}"]`)?.focus({preventScroll:true});return;}
    if(el.dataset.chapter){const entries=data.stages.filter(s=>s.chapter===Number(el.dataset.chapter));state.stage=(entries.find(s=>status(s)==='current')||entries.find(s=>status(s)==='locked')||entries[0]).id;state.page=Math.floor((stage().number-1)/8);if(dialog.open)close();render();focusStage();return;}
    if(el.dataset.cell!==undefined){const cell=Number(el.dataset.cell);if(state.chosen===null){if(state.formation[cell]>=0)state.chosen=cell;}else{[state.formation[cell],state.formation[state.chosen]]=[state.formation[state.chosen],state.formation[cell]];state.chosen=null;}renderFormation();dialogContent.querySelector(`[data-cell="${cell}"]`)?.focus();return;}
    const action=el.dataset.action;
    if(action==='close')close();
    else if(action==='research')research();
    else if(action==='compare')compare();
    else if(action==='home')state.expanded?chapters():compare();
    else if(action==='study-mode'){state.expanded=!state.expanded;if(state.expanded&&!['b','c'].includes(state.design))state.design='b';render();document.getElementById('study-mode').focus({preventScroll:true});}
    else if(action==='route-view'||action==='campaign-view'){state.expanded=true;state.design=action==='route-view'?'c':'b';state.page=Math.floor((stage().number-1)/8);render();document.getElementById('campaign-screen').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});focusStage();}
    else if(action==='current-stage'){state.stage=state.reached;state.page=Math.floor((stage().number-1)/8);render();root.querySelector(`[data-stage="${state.stage}"]`)?.focus({preventScroll:true});}
    else if(action==='toggle-details'){state.detailsOpen=!state.detailsOpen;render();root.querySelector('[data-action="toggle-details"]')?.focus({preventScroll:true});}
    else if(action==='chapters')chapters();
    else if(action==='difficulty'){state.difficulty=el.dataset.value;render();focusStage(`[data-action="difficulty"][data-value="${state.difficulty}"]`);}
    else if(action==='route-prev'||action==='route-next'){state.page=Math.max(0,Math.min(2,state.page+(action==='route-next'?1:-1)));state.stage=stages()[state.page*8].id;render();focusStage(`[data-action="${action}"]:not(:disabled)`);}
    else if(action==='brief')open(`${stage().code} · Stage briefing`,brief());
    else if(action==='story')showStory();
    else if(action==='deploy'||action==='formation')formation();
    else if(action==='enter')enter();
    else if(action==='loot')open('Your expedition cache',`<p class="eyebrow">IDLE REWARDS · PRESENTATION PREVIEW</p><h3 class="brief-title">The expedition continues</h3><p class="brief-text">Keep the existing idle cache close at hand while your party advances through the campaign.</p><p class="first-clear">This layout demonstrates the entry point only. Existing idle reward timing, caps and amounts are unchanged; this preview does not collect account rewards.</p><button class="game-button primary" data-action="cache-demo">Preview collection ${icon('chest')}</button>`);
    else if(action==='cache-demo'){close();toast('Cache collection previewed. No account rewards changed.');}
    else if(action==='favorite'){try{localStorage.setItem(state.expanded?expandedPrefKey:prefKey,JSON.stringify({design:state.design,palette:window.ProjectGPalettes?.get()||'regalia',date:new Date().toISOString()}));render();toast(`Saved ${state.design.toUpperCase()} on this browser. The URL shares the design across devices.`);}catch{toast('Browser storage unavailable. Keep the design URL to save your preference.');}}
  });
  document.getElementById('sample-progress').addEventListener('change',event=>{state.reached=Number(event.target.value);state.stage=state.reached;state.page=Math.floor((stage().number-1)/8);render();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  const entryObserver=new IntersectionObserver(entries=>{document.getElementById('mobile-deploy').dataset.visible=String(entries[0].isIntersecting);},{threshold:0});
  entryObserver.observe(document.getElementById('campaign-screen'));
  document.addEventListener('projectg-palette-change',()=>render());
  render();
}());
