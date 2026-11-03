(function () {
  'use strict';
  const W = window;
  const slots = ['Head', 'Chest', 'Legs', 'Boots', 'Gloves', 'Ring', 'Amulet'];
  const typeIcon = { Radiant: 'sun', Ember: 'flame', Tide: 'drop', Verdant: 'leaf', Umbra: 'moon' };
  const sets = {
    Assault: ['2 pieces · ATK +10%', '4 pieces · ATK +22%, Skill +8%'],
    Guardian: ['2 pieces · HP +8%, DEF +6%', '4 pieces · HP +20%, DEF +15%'],
    Tempo: ['2 pieces · SPD +6%', '4 pieces · SPD +14%, Skill +8%'],
    Focus: ['2 pieces · Skill +12%', '4 pieces · Skill +26%, ATK +8%']
  };
  const fmt = n => Number(n || 0).toLocaleString('en-US');
  const mainStat = slot => ({ Head: 'HP', Chest: 'DEF', Legs: 'DEF', Boots: 'SPD', Gloves: 'ATK', Ring: 'Skill', Amulet: 'HP' }[slot]);
  const maxLevel = g => g.rarity === 'SSR' ? 15 : g.rarity === 'SR' ? 10 : 6;
  const maxRefine = g => g.rarity === 'SSR' ? 5 : g.rarity === 'SR' ? 4 : 3;
  const enhanceCost = g => { const n = g.rarity === 'SSR' ? 900 : g.rarity === 'SR' ? 520 : 260; return n + Math.floor(g.level * n / 2) + Math.max(0, g.stage - 1) * 18; };
  const refineCost = g => { const n = g.rarity === 'SSR' ? 1700 : g.rarity === 'SR' ? 980 : 520; return n + Math.floor(g.refine * n / 2) + Math.max(0, g.stage - 1) * 24; };
  const refineCores = g => g.rarity === 'SSR' ? 4 + g.refine : g.rarity === 'SR' ? 2 + g.refine : 1 + Math.floor(g.refine / 2);
  const gearValue = g => Math.max(1, g.power + g.level * (g.rarity === 'SSR' ? 6 : g.rarity === 'SR' ? 4 : 3) + g.refine * (g.rarity === 'SSR' ? 9 : g.rarity === 'SR' ? 6 : 3));
  const heroBy = (ctx, id) => ctx.data.heroes.find(h => h.id === id) || ctx.data.heroes[0];
  const labelSlot = s => ({ Active1: 'Active I', Active2: 'Active II' }[s] || s);
  function init(ctx) {
    const s = ctx.state.collection || (ctx.state.collection = {});
    if (!s.ready) {
      const seededMaterials = { ...(s.materials || {}) };
      Object.assign(s, { ready: true, search: '', aspect: 'All', ownedOnly: false, slot: 'Gloves', selectedGear: 'sample-4', selectedMemory: 'memory-1', selectedImprint: 'imprint-2', selectedSkill: '', tab: 'memories', materials: { crystals: 42, crafting: 18, refine: 12, shards: 86, medals: 24 }, progress: {}, gear: [], memories: [], imprints: [], presets: [null, null, null], equipped: {}, memoryEquipped: {}, imprintEquipped: {}, receipt: null, removal: '', extractionDone: false, pendingReward: true, resource: 'crystals', support: ctx.data.supports[0].id, filter: 'All', proposalLocks: {}, proposalRarity: 'All', transactions: [], owned: ctx.data.heroes.slice(0, 17).map(h => h.id) });
      Object.assign(s.materials, seededMaterials);
      (ctx.data.party || []).forEach(id => { if (!s.owned.includes(id)) s.owned.push(id); });
      slots.forEach((slot, i) => {
        const set = ['Assault', 'Guardian', 'Tempo', 'Focus'][i % 4];
        s.gear.push({ id: 'sample-' + i, name: 'Refined ' + set + ' ' + slot, slot, set, rarity: 'SR', level: i < 3 ? 3 : 0, refine: i < 2 ? 1 : 0, stage: 8, power: 65 + i * 4, owner: i < 3 ? 'astra' : '' });
        if (i < 3) { s.equipped.astra = s.equipped.astra || {}; s.equipped.astra[slot] = 'sample-' + i; }
      });
      s.gear.push({ id: 'sample-7', name: 'Astral Tempo Gloves', slot: 'Gloves', set: 'Tempo', rarity: 'SSR', level: 1, refine: 0, stage: 8, power: 98, owner: '' });
      s.gear.push({ id: 'sample-8', name: 'Refined Guardian Chest', slot: 'Chest', set: 'Guardian', rarity: 'SR', level: 2, refine: 0, stage: 8, power: 72, owner: '' });
      s.memories = ['astra', 'adela', 'maelis'].map((id, i) => ({ id: 'memory-' + (i + 1), hero: heroBy(ctx, id).id, name: heroBy(ctx, id).name + ' · Route Memory', rank: ['A', 'B', 'A'][i], owner: i === 1 ? 'adela' : '', condition: ['Steady', 'Good', 'Steady'][i] }));
      s.memoryEquipped.adela = 'memory-2';
      const active = ctx.data.heroes.flatMap(h => h.skills.filter(k => k.slot !== 'Passive').map(k => ({ hero: h, skill: k }))).slice(0, 12);
      s.imprints = active.map((x, i) => ({ id: 'imprint-' + i, name: x.skill.name + ' Imprint', hero: x.hero.id, type: x.hero.type, slot: x.skill.slot, text: x.skill.text, favorite: i === 0, owner: i === 1 ? 'adela' : '', skillId: i === 1 ? heroBy(ctx, 'adela').skills.find(k => k.slot === 'Active1').id : '' }));
      const occupied = s.imprints.find(x => x.owner);
      s.imprintEquipped.adela = occupied ? { [occupied.skillId]: occupied.id } : {};
    }
    if (ctx.state.wallet.medals === undefined) ctx.state.wallet.medals = 32;
    s.materials.medals = ctx.state.wallet.medals;
    const id = ctx.hero().id;
    if (!s.progress[id]) s.progress[id] = { level: 20, stars: 2, board: 2, transcend: 0, specialty: 1, resonance: 0, skills: {} };
    if (!s.equipped[id]) s.equipped[id] = {};
    if (!s.imprintEquipped[id]) s.imprintEquipped[id] = {};
    return s;
  }
  function btn(ctx, text, action, data, primary, disabled, cls) {
    const attrs = Object.entries(data || {}).map(([k, v]) => ' data-' + k + '="' + ctx.h(v) + '"').join('');
    return '<button type="button" class="ux-button ' + (primary ? 'ux-primary ' : '') + (cls || '') + '" data-ui="collection:' + action + '"' + attrs + (disabled ? ' disabled' : '') + '>' + text + '</button>';
  }
  const go = (ctx, text, id, primary) => ctx.ui.button(text, { go: id, primary: !!primary });
  const icon = (ctx, name) => ctx.icon(name);
  const empty = (ctx, title, text, destination, button) => '<div class="cx-empty">' + icon(ctx, 'book') + '<h3>' + title + '</h3><p>' + text + '</p>' + (destination ? go(ctx, button || 'Continue', destination, true) : '') + '</div>';
  function shell(ctx, title, subtitle, body, section) {
    return '<div class="cx-screen ux-screen">' + ctx.ui.header(title, subtitle) + '<div class="cx-body">' + body + '</div>' + ctx.ui.nav(section || 'roster') + '</div>';
  }
  function receipt(ctx) {
    const r = init(ctx).receipt;
    return r ? '<section class="cx-receipt" role="status">' + icon(ctx, r.error ? 'info' : 'check') + '<div><strong>' + ctx.h(r.title) + '</strong><p>' + ctx.h(r.text) + '</p></div>' + btn(ctx, 'Dismiss', 'dismiss', {}, false, false, 'cx-quiet') + '</section>' : '';
  }
  function identity(ctx, compact) {
    const h = ctx.hero(), s = init(ctx), p = s.progress[h.id], owned = s.owned.includes(h.id);
    return '<section class="cx-identity ' + (compact ? 'cx-compact' : '') + '"><div class="cx-aspect">' + icon(ctx, typeIcon[h.type]) + '<span>' + ctx.h(h.type) + '</span></div><span class="ux-eyebrow">' + ctx.h(h.rarity + ' · ' + h.role) + '</span><h2>' + ctx.h(h.name) + '</h2><div class="cx-identity-meta">' + ctx.ui.pill(owned ? 'Lv. ' + p.level : 'Unowned · preview') + ctx.ui.pill('★'.repeat(p.stars)) + '</div></section>';
  }
  function art(ctx, cls) {
    return '<div class="cx-art ' + (cls || '') + '"><div class="cx-halo"></div>' + ctx.ui.art(ctx.hero().id, 'cx-character-art') + '<span class="cx-art-label">' + ctx.h(ctx.hero().name) + '</span></div>';
  }
  function rosterTabs(ctx, active) {
    return ctx.ui.tabs([{ label: 'Growth', go: 'roster-growth', active: active === 'growth' }, { label: 'Equipment', go: 'roster-gear', active: active === 'gear' }, { label: 'Memories & Imprints', go: 'roster-memory', active: active === 'memory' }]);
  }
  function heroGrid(ctx, rail) {
    const s = init(ctx), hero = ctx.hero();
    const heroes = ctx.data.heroes.filter(h => (!s.ownedOnly || s.owned.includes(h.id)) && (s.aspect === 'All' || h.type === s.aspect) && (!s.search || (h.name + ' ' + h.role + ' ' + h.type).toLowerCase().includes(s.search.toLowerCase())));
    return '<section class="cx-roster ' + (rail ? 'cx-roster-rail' : '') + '"><div class="cx-roster-heading"><span class="ux-eyebrow">Company roster</span><strong>' + s.owned.length + ' / ' + ctx.data.heroes.length + '</strong></div><label class="cx-search">' + icon(ctx, 'search') + '<input data-field="collection.search" value="' + ctx.h(s.search) + '" placeholder="Find a hero" aria-label="Find a hero"></label><div class="cx-filters">' + btn(ctx, 'All', 'filter', { value: 'All' }, false, false, s.aspect === 'All' && !s.ownedOnly ? 'is-active' : '') + btn(ctx, 'Owned', 'owned', {}, false, false, s.ownedOnly ? 'is-active' : '') + btn(ctx, s.aspect === 'All' ? 'Aspect' : s.aspect, 'aspect', {}, false, false, s.aspect !== 'All' ? 'is-active' : '') + '</div><div class="cx-hero-grid">' + (heroes.length ? heroes.map(h => '<button type="button" data-hero="' + ctx.h(h.id) + '" class="cx-hero-card ' + (h.id === hero.id ? 'is-selected' : '') + (!s.owned.includes(h.id) ? ' is-unowned' : '') + '" title="' + ctx.h(h.name) + '">' + ctx.ui.portrait(h.id, 'cx-roster-portrait') + '<span class="cx-rarity">' + ctx.h(h.rarity) + '</span><span class="cx-card-name">' + ctx.h(h.name) + '</span><span class="cx-card-role">' + ctx.h(h.role) + '</span></button>').join('') : '<p class="cx-no-match">No matching heroes. ' + btn(ctx, 'Clear filters', 'filter', { value: 'All' }) + '</p>') + '</div></section>';
  }
  function statStrip(ctx) {
    const h = ctx.hero();
    return '<div class="cx-stat-strip" aria-label="Authored base attributes">' + Object.entries({ HP: h.stats.hp, ATK: h.stats.atk, DEF: h.stats.def, SPD: h.stats.spd }).map(([k, v]) => '<div><span>' + k + '</span><strong>' + fmt(v) + '</strong></div>').join('') + '<small>Base attributes</small></div>';
  }
  function skillList(ctx, compact) {
    const h = ctx.hero(), p = init(ctx).progress[h.id];
    return '<div class="cx-skills ' + (compact ? 'cx-skills-compact' : '') + '">' + h.skills.map(k => '<article class="cx-skill"><span class="cx-skill-emblem">' + icon(ctx, k.slot === 'Ultimate' ? 'crown' : k.slot === 'Passive' ? 'star' : 'sword') + '</span><div><span class="ux-eyebrow">' + labelSlot(k.slot) + ' · Lv. ' + (p.skills[k.id] || 1) + '</span><h4>' + ctx.h(k.name) + '</h4><p>' + ctx.h(k.text) + '</p></div>' + (k.cooldown ? '<span class="cx-cd">CD ' + k.cooldown + '</span>' : '') + '</article>').join('') + '</div>';
  }
  function growthLedger(ctx, full) {
    const s = init(ctx), h = ctx.hero(), p = s.progress[h.id], own = s.owned.includes(h.id);
    const cost = 120 + p.level * 32, xp = 1 + Math.floor((p.level - 1) / 8);
    const rows = [
      ['Awaken', p.stars + ' stars', Math.max(12, p.stars * 18) + ' shards', 'awaken', 'star'],
      ['Memory board', p.board + ' / 12 nodes', (10 + p.board * 2) + ' shards + ' + fmt(800 + p.board * 220) + ' Gold', 'board', 'book'],
      ['Transcend', p.transcend + ' / 5', p.stars < 3 ? 'Requires 3 stars' : (24 + p.transcend * 16) + ' shards + ' + (8 + p.transcend * 4) + ' Medals', 'transcend', 'sun'],
      ['Specialty', 'Lv. ' + p.specialty + ' / 10', fmt(560 + p.specialty * 220) + ' Gold + ' + (1 + Math.floor(p.specialty / 3)) + ' XP crystal', 'specialty', 'sword'],
      ['Resonance', p.resonance + ' / 6', (8 + p.resonance * 4) + ' shards + ' + (3 + p.resonance * 2) + ' Medals', 'resonance', 'gem']
    ];
    return '<section class="cx-growth-ledger"><div class="cx-level-up"><div><span class="ux-eyebrow">Next level</span><div class="cx-level-pair"><strong>' + p.level + '</strong>' + icon(ctx, 'arrow') + '<strong>' + Math.min(120, p.level + 1) + '</strong></div><p>' + xp + ' XP crystals · ' + fmt(cost) + ' Gold</p></div>' + btn(ctx, p.level >= 120 ? 'Level cap' : 'Level up', 'grow', { kind: 'level' }, true, !own || p.level >= 120 || s.materials.crystals < xp || ctx.state.wallet.gold < cost) + '</div><div class="cx-growth-resources"><span>' + icon(ctx, 'gem') + fmt(s.materials.crystals) + ' XP crystals</span><span>' + icon(ctx, 'star') + s.materials.shards + ' shards</span><span>' + icon(ctx, 'coin') + s.materials.medals + ' medals</span></div>' + (full ? rows : rows.slice(0, 3)).map(([name, progress, price, kind, symbol]) => '<div class="cx-upgrade-row"><span class="cx-upgrade-symbol">' + icon(ctx, symbol) + '</span><div><strong>' + name + '</strong><span>' + progress + '</span><small>' + price + '</small></div>' + btn(ctx, icon(ctx, 'plus') + '<span class="cx-sr-only">' + name + '</span>', 'grow', { kind }, false, !own || (kind === 'transcend' && p.stars < 3), 'cx-square') + '</div>').join('') + '<div class="cx-upgrade-row"><span class="cx-upgrade-symbol">' + icon(ctx, 'sword') + '</span><div><strong>Skill training</strong><span>Upgrade the lowest-level skill</span><small>Current skill levels are shown below</small></div>' + btn(ctx, 'Train', 'grow', { kind: 'skill' }, false, !own) + '</div></section>';
  }
  function growth(ctx) {
    const v = ctx.variant;
    let body;
    if (v === 'stage') body = '<div class="cx-growth-stage">' + heroGrid(ctx) + '<div class="cx-hero-stage">' + art(ctx) + identity(ctx) + '</div><section class="cx-detail ux-paper">' + rosterTabs(ctx, 'growth') + statStrip(ctx) + growthLedger(ctx, true) + '<h3 class="cx-section-title">Combat skills</h3>' + skillList(ctx, false) + '</section></div>';
    else if (v === 'journey') body = '<div class="cx-growth-journey"><section class="cx-journey-main"><div class="cx-journey-title">' + identity(ctx, true) + '<div>' + rosterTabs(ctx, 'growth') + statStrip(ctx) + '</div></div><div class="cx-progress-track"><span>Hero level</span><i></i><span>Awakening</span><i></i><span>Memory board</span><i></i><span>Transcendence</span></div><div class="cx-journey-columns"><section class="ux-paper">' + growthLedger(ctx, true) + '</section><section><h3 class="cx-section-title">The current repertoire</h3>' + skillList(ctx, true) + '</section></div></section><aside class="cx-journey-art">' + art(ctx) + heroGrid(ctx, true) + '</aside></div>';
    else body = '<div class="cx-growth-focus">' + heroGrid(ctx, true) + '<section class="cx-focus-work"><div class="cx-focus-identity">' + ctx.ui.portrait(ctx.hero().id, 'cx-focus-portrait') + identity(ctx, true) + '<div>' + rosterTabs(ctx, 'growth') + statStrip(ctx) + '</div></div><div class="cx-focus-columns"><section class="ux-paper"><h3 class="cx-section-title">Choose an improvement</h3>' + growthLedger(ctx, true) + '</section><section class="cx-skill-dossier"><h3 class="cx-section-title">Skill dossier</h3>' + skillList(ctx, false) + '</section></div></section></div>';
    return shell(ctx, 'Heroes', 'Your company · character growth', receipt(ctx) + body);
  }
  function gearTile(ctx, g, selected, action) {
    return '<button type="button" class="cx-gear-tile ' + (selected ? 'is-selected' : '') + ' rarity-' + g.rarity.toLowerCase() + '" data-ui="collection:' + (action || 'pick-gear') + '" data-id="' + ctx.h(g.id) + '"><span class="cx-gear-glyph">' + icon(ctx, g.slot === 'Ring' || g.slot === 'Amulet' ? 'gem' : g.slot === 'Gloves' ? 'sword' : 'shield') + '</span><span class="cx-gear-rarity">' + ctx.h(g.rarity) + '</span><strong>' + ctx.h(g.name) + '</strong><span>' + mainStat(g.slot) + ' +' + gearValue(g) + ' · +' + g.level + ' / R' + g.refine + '</span><small>' + (g.owner ? ctx.h(heroBy(ctx, g.owner).name) : 'Available') + '</small></button>';
  }
  function gearSlots(ctx) {
    const s = init(ctx), equipped = s.equipped[ctx.hero().id];
    return '<div class="cx-seven-slots">' + (ctx.data.gearSlots || slots).map(slot => {
      const g = s.gear.find(g => g.id === equipped[slot]);
      return '<button type="button" class="cx-slot ' + (slot === s.slot ? 'is-selected' : '') + (g ? ' has-gear' : '') + '" data-ui="collection:slot" data-slot="' + slot + '">' + icon(ctx, slot === 'Gloves' ? 'sword' : slot === 'Amulet' || slot === 'Ring' ? 'gem' : 'shield') + '<strong>' + slot + '</strong><span>' + (g ? g.rarity + ' +' + g.level : 'Empty') + '</span></button>';
    }).join('') + '</div>';
  }
  function setSummary(ctx) {
    const s = init(ctx), eq = Object.values(s.equipped[ctx.hero().id]), counts = {};
    s.gear.filter(g => eq.includes(g.id)).forEach(g => counts[g.set] = (counts[g.set] || 0) + 1);
    return '<div class="cx-set-summary"><span class="ux-eyebrow">Set effects</span>' + (Object.keys(counts).length ? Object.entries(counts).map(([set, count]) => '<div><strong>' + set + ' <b>' + count + '</b></strong><span class="' + (count >= 2 ? 'is-live' : '') + '">' + sets[set][0] + '</span></div>').join('') : '<p>Equip matching set pieces to activate bonuses.</p>') + '</div>';
  }
  function gearDetail(ctx, comparison) {
    const s = init(ctx), h = ctx.hero(), g = s.gear.find(x => x.id === s.selectedGear) || s.gear.find(x => x.slot === s.slot);
    if (!g) return empty(ctx, 'No equipment in this slot', 'Craft a piece or collect equipment from idle rewards.', 'gear-crafting', 'Visit the forge');
    const worn = s.gear.find(x => x.id === s.equipped[h.id][g.slot]), same = worn && worn.id === g.id;
    return '<section class="cx-gear-detail ux-paper"><div class="cx-item-heading"><span class="cx-large-glyph">' + icon(ctx, g.slot === 'Gloves' ? 'sword' : 'shield') + '</span><div><span class="ux-eyebrow">' + g.rarity + ' · ' + g.slot + '</span><h3>' + ctx.h(g.name) + '</h3><span>' + g.set + ' set · +' + g.level + ' / R' + g.refine + '</span></div></div><div class="cx-item-mainstat"><span>' + mainStat(g.slot) + '</span><strong>+' + gearValue(g) + '</strong><small>Example equipment roll</small></div>' + (comparison && worn && !same ? '<div class="cx-compare-line"><div><span>Equipped</span><strong>' + ctx.h(worn.name) + '</strong><b>' + mainStat(g.slot) + ' +' + gearValue(worn) + '</b></div>' + icon(ctx, 'arrow') + '<div><span>Selected</span><strong>' + ctx.h(g.name) + '</strong><b>' + (gearValue(g) >= gearValue(worn) ? '+' : '') + (gearValue(g) - gearValue(worn)) + ' main stat</b></div></div>' : '') + '<div class="cx-item-set"><strong>' + g.set + '</strong><p>' + sets[g.set].join('<br>') + '</p></div><div class="cx-item-owner">' + icon(ctx, g.owner ? 'users' : 'check') + (g.owner ? 'Equipped by ' + ctx.h(heroBy(ctx, g.owner).name) : 'Not equipped') + '</div><div class="cx-actions">' + (same ? btn(ctx, 'Unequip', 'unequip', { slot: g.slot }) : btn(ctx, 'Equip on ' + ctx.h(h.name.split(' ')[0]), 'equip', { id: g.id }, true, !!g.owner || !s.owned.includes(h.id))) + ((ctx.surface.view || ctx.surface.id) === 'gear-upgrade' ? '' : go(ctx, 'Upgrade', 'gear-upgrade', false)) + '</div><small class="cx-sample-note">Sample owned gear; current native set, slot and cost rules.</small></section>';
  }
  function gearInventory(ctx, all) {
    const s = init(ctx);
    const filtered = s.gear.filter(g => all || g.slot === s.slot);
    return '<section class="cx-equipment-list"><div class="cx-list-heading"><h3>' + (all ? 'Equipment stock' : s.slot + ' equipment') + '</h3><span>' + filtered.length + ' pieces</span></div><div class="cx-equipment-grid">' + filtered.map(g => gearTile(ctx, g, g.id === s.selectedGear)).join('') + '</div></section>';
  }
  function presets(ctx) {
    const s = init(ctx);
    return '<section class="cx-presets"><h3 class="cx-section-title">Global loadouts</h3>' + s.presets.map((p, i) => '<article><span class="cx-preset-number">0' + (i + 1) + '</span><div><strong>Loadout ' + (i + 1) + '</strong><span>' + (p ? Object.keys(p).length + ' / 7 slots saved' : 'Empty preset') + '</span></div>' + btn(ctx, 'Save', 'save-preset', { index: i }, false, !s.owned.includes(ctx.hero().id)) + btn(ctx, 'Apply', 'apply-preset', { index: i }, true, !p || !Object.keys(p).length || !s.owned.includes(ctx.hero().id)) + '</article>').join('') + '</section>';
  }
  function equipment(ctx) {
    const s = init(ctx), eq = Object.keys(s.equipped[ctx.hero().id]).length;
    const tools = '<div class="cx-equipment-tools"><span>' + eq + ' / 7 slots equipped</span>' + btn(ctx, 'Auto equip', 'auto-equip', {}, true, !s.owned.includes(ctx.hero().id)) + go(ctx, 'Loadouts', 'gear-presets') + '</div>';
    let content;
    if (ctx.variant === 'stage') content = '<div class="cx-equipment-stage"><section class="cx-equipment-mannequin">' + identity(ctx, true) + art(ctx) + gearSlots(ctx) + '</section><section class="cx-equipment-work">' + rosterTabs(ctx, 'gear') + tools + setSummary(ctx) + gearInventory(ctx) + '</section>' + gearDetail(ctx, false) + '</div>';
    else if (ctx.variant === 'journey') content = '<div class="cx-equipment-journey"><aside class="cx-loadout-sidebar">' + identity(ctx, true) + presets(ctx) + setSummary(ctx) + '</aside><section class="cx-equipment-work">' + rosterTabs(ctx, 'gear') + tools + gearSlots(ctx) + '<div class="cx-inventory-and-detail">' + gearInventory(ctx) + gearDetail(ctx, true) + '</div></section></div>';
    else content = '<div class="cx-equipment-focus"><section class="cx-equipment-work"><div class="cx-focus-identity">' + ctx.ui.portrait(ctx.hero().id, 'cx-focus-portrait') + identity(ctx, true) + rosterTabs(ctx, 'gear') + '</div>' + gearSlots(ctx) + tools + gearInventory(ctx, true) + '</section><aside>' + gearDetail(ctx, true) + setSummary(ctx) + '</aside></div>';
    return shell(ctx, 'Equipment', ctx.hero().name + ' · seven equipment slots', receipt(ctx) + content);
  }

  function storageTabs(ctx, active) {
    return ctx.ui.tabs([['resources', 'Resources'], ['equipment', 'Equipment'], ['memories', 'Memories'], ['imprints', 'Imprints'], ['support', 'Support cards'], ['transactions', 'Transactions']].map(([key, label]) => ({ label, go: 'storage-' + key, active: active === key })));
  }
  function memoryCard(ctx, m, pick) {
    const s = init(ctx);
    return '<article class="cx-memory-card ' + (m.id === s.selectedMemory ? 'is-selected' : '') + '"><div class="cx-memory-cover">' + ctx.ui.portrait(m.hero, 'cx-memory-portrait') + '<span>' + m.rank + '</span></div><div><span class="ux-eyebrow">Saved Reminiscence</span><h4>' + ctx.h(m.name) + '</h4><p>' + m.condition + ' condition · example route archive</p><span class="cx-ownership">' + (m.owner ? 'Equipped · ' + ctx.h(heroBy(ctx, m.owner).name) : 'Available') + '</span></div>' + (pick ? btn(ctx, m.owner ? 'In use' : 'Select', 'pick-memory', { id: m.id }, m.id === s.selectedMemory, !!m.owner) : go(ctx, 'Equip in Heroes', 'memory-equip')) + '</article>';
  }
  function imprintCard(ctx, im, mode) {
    const s = init(ctx), protectedItem = !!im.owner || im.favorite, selected = s.removal === im.id;
    return '<article class="cx-imprint-card ' + (selected ? 'is-selected' : '') + '"><div class="cx-imprint-seal">' + icon(ctx, typeIcon[im.type]) + '</div><div class="cx-imprint-copy"><span class="ux-eyebrow">' + ctx.h(im.type) + ' · ' + labelSlot(im.slot) + '</span><h4>' + ctx.h(im.name) + '</h4><p>' + ctx.h(im.text) + '</p><span class="cx-ownership">' + (im.owner ? 'Equipped · ' + ctx.h(heroBy(ctx, im.owner).name) : 'Unequipped') + (im.favorite ? ' · Favorite' : '') + '</span></div><div class="cx-imprint-controls">' + (mode === 'equip' ? btn(ctx, im.owner ? 'In use' : 'Select', 'pick-imprint', { id: im.id }, s.selectedImprint === im.id, !!im.owner) : btn(ctx, icon(ctx, 'star') + '<span>' + (im.favorite ? 'Favorited' : 'Favorite') + '</span>', 'favorite', { id: im.id }, im.favorite)) + (mode === 'library' || mode === 'replace' ? btn(ctx, protectedItem ? icon(ctx, 'lock') + ' Protected' : selected ? 'Selected' : mode === 'replace' ? 'Replace' : 'Discard', 'remove-select', { id: im.id }, selected, protectedItem) : '') + '</div></article>';
  }
  function attachmentBoard(ctx) {
    const s = init(ctx), h = ctx.hero(), memory = s.memories.find(x => x.id === s.memoryEquipped[h.id]), imprints = s.imprintEquipped[h.id], count = Object.keys(imprints).length;
    return '<section class="cx-attachment-board"><div class="cx-attachment-heading"><h3>Reminiscence Memory</h3>' + ctx.ui.pill(memory ? '1 equipped' : 'Empty') + '</div><div class="cx-memory-socket">' + icon(ctx, 'book') + '<div><strong>' + (memory ? ctx.h(memory.name) : 'No Memory equipped') + '</strong><p>' + (memory ? 'Permanent route archive attached to this hero.' : 'Complete a Reminiscence route to create a permanent Memory.') + '</p></div>' + (memory ? btn(ctx, 'Unequip', 'unequip-memory') : go(ctx, 'Choose Memory', 'memory-equip', true)) + '</div><div class="cx-attachment-heading"><h3>Activated skill Imprints</h3>' + ctx.ui.pill(count + ' / 2 equipped') + '</div><p class="cx-help">Imprints replace activated skills. The passive remains unchanged.</p><div class="cx-skill-sockets">' + h.skills.filter(k => k.slot !== 'Passive').map(k => {
      const im = s.imprints.find(x => x.id === imprints[k.id]);
      return '<article><span class="cx-skill-emblem">' + icon(ctx, k.slot === 'Ultimate' ? 'crown' : 'sword') + '</span><div><span class="ux-eyebrow">' + labelSlot(k.slot) + (im ? ' · Imprinted' : ' · Original skill') + '</span><h4>' + ctx.h(im ? im.name : k.name) + '</h4><p>' + ctx.h(im ? im.text : k.text) + '</p></div>' + (im ? btn(ctx, 'Unequip', 'unequip-imprint', { skill: k.id }) : btn(ctx, 'Choose', 'open-imprint', { skill: k.id }, false, count >= 2)) + '</article>';
    }).join('') + '</div><div class="cx-passive-note">' + icon(ctx, 'lock') + '<span><strong>' + ctx.h(h.skills.find(k => k.slot === 'Passive').name) + '</strong> · Passive skill cannot receive an Imprint.</span></div></section>';
  }
  function memoryPage(ctx) {
    const s = init(ctx);
    let content;
    if (ctx.variant === 'stage') content = '<div class="cx-memory-stage"><aside>' + art(ctx) + identity(ctx, true) + '</aside><section class="ux-paper">' + rosterTabs(ctx, 'memory') + attachmentBoard(ctx) + '</section></div>';
    else if (ctx.variant === 'journey') content = '<div class="cx-memory-journey"><div class="cx-journey-title">' + identity(ctx, true) + rosterTabs(ctx, 'memory') + '</div><section class="cx-library-shelves"><div><h3 class="cx-section-title">Permanent Memories</h3>' + s.memories.map(m => memoryCard(ctx, m, false)).join('') + '</div><div><div class="cx-list-heading"><h3>Portable Imprints</h3>' + ctx.ui.pill(s.imprints.length + ' / 12') + '</div>' + s.imprints.slice(0, 3).map(im => imprintCard(ctx, im, 'browse')).join('') + go(ctx, 'Open protected library', 'imprint-library-management') + '</div></section></div>';
    else content = '<div class="cx-memory-focus"><aside>' + identity(ctx, true) + '<div class="cx-library-count"><strong>' + s.imprints.length + '<small>/12</small></strong><span>Saved Imprints</span></div>' + go(ctx, 'Manage library', 'imprint-library-management') + go(ctx, 'Saved Memories', 'storage-memories') + '</aside><section class="ux-paper">' + rosterTabs(ctx, 'memory') + attachmentBoard(ctx) + '</section></div>';
    return shell(ctx, 'Memories & Imprints', ctx.hero().name + ' · permanent route rewards', receipt(ctx) + content);
  }
  function resourcePage(ctx) {
    const s = init(ctx), w = ctx.state.wallet;
    const resources = [
      ['gold', 'Gold', fmt(w.gold), 'coin', 'Level heroes, enhance equipment and exchange for supplies.', 'home', 'Claim idle rewards'],
      ['gems', 'Gems', fmt(w.gems), 'gem', 'Recruitment and eligible in-game exchanges.', 'missions-daily', 'View missions'],
      ['tickets', 'Recruit tickets', w.tickets, 'ticket', 'Use tickets on eligible recruitment banners.', 'pulls', 'View recruitment'],
      ['medals', 'Medals', w.medals, 'star', 'Hero progression and medal exchange stock.', 'shop-medal', 'Open medal exchange'],
      ['keys', 'Labyrinth keys', (ctx.state.adventures.labKeys ?? 3) + ' / 3', 'map', 'Separate expedition entry keys. Free recovery is independent of Campaign.', 'labyrinth-hub', 'Plan an expedition'],
      ['farm', 'Farming stamina', w.farmEnergy + ' / 120', 'energy', 'For explicitly designated Material farming stages. Story and ordinary Event/Arena/Raid encounters do not consume it.', 'challenges', 'View material stages'],
      ['test-gems', 'Test paid gems', fmt(w.paidGems), 'gem', 'Local sandbox currency only. No real-money purchase is connected.', 'shop-test', 'View sandbox grants'],
      ['crystals', 'XP crystals', s.materials.crystals, 'gem', 'Consumed by hero level and specialty training.', 'challenges', 'Find material stages'],
      ['crafting', 'Crafting cores', s.materials.crafting, 'gear', 'Craft SR Gloves or Chest for 6 cores and 4,200 Gold.', 'gear-crafting', 'Visit the forge'],
      ['refine', 'Refine cores', s.materials.refine, 'shield', 'Refine equipment. Exact cost depends on rarity and refinement.', 'gear-upgrade', 'Refine equipment']
    ];
    const selected = resources.find(r => r[0] === s.resource) || resources[0];
    const ledger = '<div class="cx-resource-ledger">' + resources.map(r => '<button type="button" data-ui="collection:resource" data-id="' + r[0] + '" class="' + (r[0] === selected[0] ? 'is-selected' : '') + '"><span>' + icon(ctx, r[3]) + '</span><div><strong>' + r[1] + '</strong><small>Company supplies</small></div><b>' + r[2] + '</b></button>').join('') + '</div>';
    const detail = '<section class="cx-resource-detail ux-paper"><span class="cx-large-glyph">' + icon(ctx, selected[3]) + '</span><span class="ux-eyebrow">Selected resource</span><h2>' + selected[1] + '</h2><strong class="cx-resource-total">' + selected[2] + '</strong><p>' + selected[4] + '</p>' + go(ctx, selected[6], selected[5], true) + '<div class="cx-resource-rule">' + icon(ctx, 'info') + '<p>Account stamina is only for designated farming. Campaign has no entry energy cost.</p></div></section>';
    if (ctx.variant === 'stage') return '<div class="cx-storage-stage">' + detail + ledger + '</div>';
    if (ctx.variant === 'journey') return '<div class="cx-resource-journey"><div class="cx-supply-banner"><span class="ux-eyebrow">From rewards to growth</span><h2>Keep your company moving</h2><p>Choose a resource to see its current uses and next destination.</p></div><div class="cx-storage-focus">' + ledger + detail + '</div></div>';
    return '<div class="cx-storage-focus">' + ledger + detail + '</div>';
  }
  function storageEquipment(ctx) {
    const forge = '<section class="cx-forge-callout">' + icon(ctx, 'gear') + '<div><span class="ux-eyebrow">The company forge</span><h3>Put crafting cores to use</h3><p>SR equipment · 6 cores + 4,200 Gold</p></div>' + go(ctx, 'Craft equipment', 'gear-crafting', true) + '</section>';
    if (ctx.variant === 'stage') return forge + '<div class="cx-storage-focus">' + gearInventory(ctx, true) + gearDetail(ctx, false) + '</div>';
    if (ctx.variant === 'journey') return '<div class="cx-storage-stage"><aside>' + forge + presets(ctx) + go(ctx, 'Equip on a hero', 'roster-gear') + '</aside>' + gearInventory(ctx, true) + '</div>';
    return '<div class="cx-storage-focus"><section>' + forge + gearInventory(ctx, true) + '</section>' + gearDetail(ctx, true) + '</div>';
  }
  function storageMemories(ctx) {
    const s = init(ctx), rows = s.memories.map(m => memoryCard(ctx, m, false)).join('');
    const intro = '<section class="cx-library-intro"><span class="cx-large-glyph">' + icon(ctx, 'book') + '</span><span class="ux-eyebrow">The Memory archive</span><h2>What the journey leaves behind</h2><p>Permanent Memories are created at the end of Reminiscence. One free Memory can be attached to a hero.</p>' + go(ctx, 'Begin Reminiscence', 'reminiscence-setup', true) + '</section>';
    return ctx.variant === 'journey' ? '<div class="cx-memory-archive-journey">' + intro + '<div class="cx-memory-archive-grid">' + rows + '</div></div>' : '<div class="cx-storage-' + (ctx.variant === 'stage' ? 'stage' : 'focus') + '">' + (ctx.variant === 'stage' ? intro : '<section class="cx-memory-archive">' + rows + '</section>') + (ctx.variant === 'stage' ? '<section class="cx-memory-archive">' + rows + '</section>' : intro) + '</div>';
  }
  function storageImprints(ctx) {
    const s = init(ctx), intro = '<section class="cx-imprint-intro"><span class="cx-large-glyph">' + icon(ctx, 'gem') + '</span><span class="ux-eyebrow">Labyrinth Imprints</span><h2>Carry an altered skill home</h2><p>Extract a portable upgraded activated skill after an eligible expedition. Run-only modifiers stay in that run.</p><div class="cx-library-count"><strong>' + s.imprints.length + '<small>/12</small></strong><span>Saved in this review library</span></div>' + go(ctx, 'Manage protected library', 'imprint-library-management', true) + go(ctx, 'Equip on a hero', 'roster-memory') + '</section>';
    const rows = '<div class="cx-imprint-archive">' + s.imprints.map(im => imprintCard(ctx, im, 'browse')).join('') + '</div>';
    if (ctx.variant === 'journey') return '<div class="cx-imprint-journey">' + intro + rows + '</div>';
    return '<div class="cx-storage-' + (ctx.variant === 'stage' ? 'stage' : 'focus') + '">' + (ctx.variant === 'stage' ? intro + rows : rows + intro) + '</div>';
  }
  function supportPage(ctx) {
    const s = init(ctx), selected = ctx.data.supports.find(c => c.id === s.support) || ctx.data.supports[0];
    const cards = '<div class="cx-support-grid">' + ctx.data.supports.map((c, i) => '<button type="button" class="cx-support-card ' + (c.id === selected.id ? 'is-selected' : '') + '" data-ui="collection:support" data-id="' + c.id + '"><span class="cx-support-illustration">' + icon(ctx, typeIcon[c.type]) + '<b>' + c.rarity + '</b></span><span class="ux-eyebrow">' + c.type + ' · ' + c.focus + '</span><strong>' + ctx.h(c.name) + '</strong><span>' + (['blade_senpai','aegis_mentor','field_medic','pathfinder','tactics_board'].includes(c.id) ? 'Owned · example card' : 'Not recruited') + '</span></button>').join('') + '</div>';
    const detail = '<section class="cx-support-detail ux-paper"><span class="ux-eyebrow">' + selected.rarity + ' · ' + selected.type + ' support</span><h2>' + ctx.h(selected.name) + '</h2><p>' + ctx.h(selected.text) + '</p><dl><div><dt>Matching drill</dt><dd>' + selected.focus + ' +' + selected.bonus + '</dd></div><div><dt>Reminiscence energy save</dt><dd>' + selected.energySave + '</dd></div><div><dt>Friendship bonus</dt><dd>+' + selected.friendshipBonus + '</dd></div><div><dt>Event recovery</dt><dd>' + selected.eventRecovery + '</dd></div></dl>' + go(ctx, 'Review training deck', 'reminiscence-setup', true) + go(ctx, 'Recruit support cards', 'pulls') + '</section>';
    return ctx.variant === 'stage' ? '<div class="cx-storage-stage">' + detail + cards + '</div>' : ctx.variant === 'journey' ? '<div><div class="cx-supply-banner"><span class="ux-eyebrow">Training companions</span><h2>Build around the drill</h2><p>Support cards influence Reminiscence; these are not additional battle heroes.</p></div><div class="cx-storage-focus">' + cards + detail + '</div></div>' : '<div class="cx-storage-focus">' + cards + detail + '</div>';
  }
  function transactions(ctx) {
    const s = init(ctx);
    if (!s.transactions.length) {
      const blank = empty(ctx, 'No exchanges in this review yet', 'Upgrade or craft a piece of equipment to see an itemized local preview transaction here.', 'gear-crafting', 'Open the forge');
      if (ctx.variant === 'journey') return '<div class="cx-ledger-journey"><aside><span class="ux-eyebrow">From supplies to improvement</span><h2>Every exchange leaves a record</h2><ol class="cx-ledger-steps"><li>Collect company supplies</li><li>Choose a hero or equipment improvement</li><li>Review the itemized exchange here</li></ol>' + go(ctx, 'Choose an improvement', 'roster-growth') + '</aside>' + blank + '</div>';
      if (ctx.variant === 'focus') return '<div class="cx-ledger-empty-focus"><div class="cx-ledger-head"><span>Exchange</span><span>Materials spent</span><span>Result</span></div>' + blank + '<p class="cx-help">No purchases or private account history are loaded. This ledger records review actions only.</p></div>';
      return '<div class="cx-ledger-empty-stage"><span class="cx-ledger-watermark">Company ledger</span>' + blank + '</div>';
    }
    const rows = s.transactions.slice().reverse().map((t, i) => '<article class="cx-transaction"><span class="cx-ledger-index">' + String(s.transactions.length - i).padStart(2, '0') + '</span><div><strong>' + ctx.h(t.title) + '</strong><p>' + ctx.h(t.detail) + '</p></div><span class="cx-ledger-change">' + ctx.h(t.cost) + '</span></article>').join('');
    return ctx.variant === 'journey' ? '<div class="cx-ledger-journey"><aside><span class="ux-eyebrow">Local wallet record</span><h2>A clear trail of exchanges</h2><p>Entries here reflect actions taken in this design review. They do not access an account or represent purchases.</p><strong>' + s.transactions.length + ' entries</strong></aside><div class="cx-transactions">' + rows + '</div></div>' : '<div class="cx-transactions ' + (ctx.variant === 'focus' ? 'is-compact' : '') + '">' + rows + '</div>';
  }
  function storage(ctx, tab) {
    const body = ({ resources: resourcePage, equipment: storageEquipment, memories: storageMemories, imprints: storageImprints, support: supportPage, transactions })[tab](ctx);
    return shell(ctx, 'Storage', 'The company inventory · example local account', receipt(ctx) + '<div class="cx-storage-tabs">' + storageTabs(ctx, tab) + '</div>' + body, 'storage');
  }

  function upgradePanel(ctx) {
    const s = init(ctx), g = s.gear.find(x => x.id === s.selectedGear) || s.gear[0];
    return '<div class="cx-upgrade-modal"><section>' + gearDetail(ctx, false) + '</section><section class="cx-upgrade-options"><span class="ux-eyebrow">Equipment development</span><h3>Enhance or refine</h3><div class="cx-upgrade-option"><div><h4>Enhancement +' + g.level + ' → +' + Math.min(maxLevel(g), g.level + 1) + '</h4><p>Enhancement cap: +' + maxLevel(g) + ' for ' + g.rarity + '</p><strong>' + fmt(enhanceCost(g)) + ' Gold</strong></div>' + btn(ctx, g.level >= maxLevel(g) ? 'At cap' : 'Enhance', 'enhance', { id: g.id }, true, g.level >= maxLevel(g) || ctx.state.wallet.gold < enhanceCost(g)) + '</div><div class="cx-upgrade-option"><div><h4>Refinement R' + g.refine + ' → R' + Math.min(maxRefine(g), g.refine + 1) + '</h4><p>Refinement adds or improves a substat roll.</p><strong>' + refineCores(g) + ' cores + ' + fmt(refineCost(g)) + ' Gold</strong></div>' + btn(ctx, g.refine >= maxRefine(g) ? 'At cap' : 'Refine', 'refine', { id: g.id }, false, g.refine >= maxRefine(g) || ctx.state.wallet.gold < refineCost(g) || s.materials.refine < refineCores(g)) + '</div><div class="cx-wallet-inline"><span>' + fmt(ctx.state.wallet.gold) + ' Gold</span><span>' + s.materials.refine + ' refine cores</span></div><p class="cx-help">Item rolls are examples. Displayed costs and rarity caps follow the current native rules.</p></section></div>';
  }
  function craftingPanel(ctx) {
    const s = init(ctx), afford = s.materials.crafting >= 6 && ctx.state.wallet.gold >= 4200;
    return '<div class="cx-forge-modal"><div class="cx-forge-intro"><span class="cx-forge-crest">' + icon(ctx, 'gear') + '</span><span class="ux-eyebrow">The company forge</span><h2>Craft SR equipment</h2><p>Choose a supported slot. The resulting piece is added to equipment stock.</p><div class="cx-wallet-inline"><span>' + s.materials.crafting + ' crafting cores</span><span>' + fmt(ctx.state.wallet.gold) + ' Gold</span></div></div><div class="cx-craft-options">' + ['Gloves', 'Chest'].map(slot => '<article><span class="cx-large-glyph">' + icon(ctx, slot === 'Gloves' ? 'sword' : 'shield') + '</span><span class="ux-eyebrow">SR · ' + slot + '</span><h3>' + (slot === 'Gloves' ? 'Offensive foundation' : 'A sturdier defense') + '</h3><p>Main attribute: ' + mainStat(slot) + '</p><strong>6 crafting cores<br>4,200 Gold</strong>' + btn(ctx, 'Craft ' + slot, 'craft', { slot }, true, !afford) + '</article>').join('') + '</div></div>';
  }
  function memoryPicker(ctx) {
    const s = init(ctx);
    return '<div class="cx-picker-context">' + ctx.ui.portrait(ctx.hero().id, 'cx-mini-portrait') + '<div><span class="ux-eyebrow">Attach to</span><strong>' + ctx.h(ctx.hero().name) + '</strong><p>Only a free Memory is available for selection.</p></div></div><div class="cx-picker-list">' + s.memories.map(m => memoryCard(ctx, m, true)).join('') + '</div>';
  }
  function imprintPicker(ctx) {
    const s = init(ctx), h = ctx.hero(), skill = h.skills.find(k => k.id === s.selectedSkill && k.slot !== 'Passive') || h.skills.find(k => k.slot === 'Active1');
    return '<div class="cx-picker-context">' + ctx.ui.portrait(h.id, 'cx-mini-portrait') + '<div><span class="ux-eyebrow">' + labelSlot(skill.slot) + ' · original skill</span><strong>' + ctx.h(skill.name) + '</strong><p>' + ctx.h(skill.text) + '</p></div></div><div class="cx-skill-choice">' + h.skills.filter(k => k.slot !== 'Passive').map(k => btn(ctx, labelSlot(k.slot), 'pick-skill', { skill: k.id }, skill.id === k.id)).join('') + '</div><div class="cx-picker-list">' + s.imprints.filter(im => !im.owner).map(im => imprintCard(ctx, im, 'equip')).join('') + '</div>';
  }
  function extractionPicker(ctx) {
    const s = init(ctx), h = ctx.hero();
    return '<section class="cx-extraction-intro"><span class="ux-eyebrow">Eligible portable rewards</span><h3>Choose one Imprint to take home</h3><p>The following rows demonstrate the extraction flow with current native skill identities. Exact run rolls are sample records.</p></section><div class="cx-extraction-options">' + h.skills.filter(k => k.slot !== 'Passive').slice(1).map(k => '<article><span class="cx-large-glyph">' + icon(ctx, k.slot === 'Ultimate' ? 'crown' : 'sword') + '</span><div><span class="ux-eyebrow">' + labelSlot(k.slot) + ' · Portable</span><h4>' + ctx.h(k.name) + '</h4><p>' + ctx.h(k.text) + '</p></div>' + btn(ctx, s.extractionDone ? 'Reward extracted' : 'Extract', 'extract', { skill: k.id }, true, s.extractionDone) + '</article>').join('') + '<article class="cx-run-only"><span class="cx-large-glyph">' + icon(ctx, 'lock') + '</span><div><span class="ux-eyebrow">Run-only modifiers</span><h4>Remain in this expedition</h4><p>Endless over-cap and other nonportable modifications cannot become saved Imprints.</p></div></article></div>';
  }
  function imprintLibrary(ctx, replacing) {
    const s = init(ctx), chosen = s.imprints.find(im => im.id === s.removal), valid = chosen && !chosen.owner && !chosen.favorite;
    const reward = s.newReward || ctx.hero().skills.find(k => k.slot === 'Active2');
    if (replacing && s.extractionDone) return '<div class="cx-extraction-complete">' + icon(ctx, 'check') + '<h2>Imprint extracted</h2><p>The new reward is in Storage. The library still contains ' + s.imprints.length + ' records; this reward cannot be extracted again.</p>' + go(ctx, 'View saved Imprints', 'storage-imprints', true) + '</div>';
    const guidance = '<aside class="cx-library-guidance"><span class="cx-large-glyph">' + icon(ctx, replacing ? 'chest' : 'gem') + '</span><span class="ux-eyebrow">' + (replacing ? 'Reward waiting' : 'Protected collection') + '</span><h2>' + (replacing ? 'Make room deliberately' : 'Keep the builds you value') + '</h2><div class="cx-library-count"><strong>' + s.imprints.length + '<small>/12</small></strong><span>Saved Imprints</span></div><p>' + (replacing ? 'New reward: ' + ctx.h(reward.name) + ' Imprint. Select an unequipped, non-favorite record to replace.' : 'Equipped and favorite records cannot be removed. Equipping remains in Heroes.') + '</p><div class="cx-protection-key">' + icon(ctx, 'lock') + '<span>Equipped or favorite = protected</span></div>' + (valid ? '<div class="cx-consequence"><strong>' + (replacing ? 'Confirm replacement' : 'Confirm permanent discard') + '</strong><p>' + ctx.h(chosen.name) + (replacing ? ' will be replaced by the waiting reward.' : ' will be removed from this library.') + '</p></div>' : '<p class="cx-help">Nothing changes until a valid record is selected and you confirm.</p>') + '</aside>';
    const list = '<div class="cx-picker-list">' + s.imprints.map(im => imprintCard(ctx, im, replacing ? 'replace' : 'library')).join('') + '</div>';
    if (ctx.variant === 'journey') return '<div class="cx-library-grouped">' + guidance + '<div class="cx-library-groups"><section><h3 class="cx-section-title">Available for ' + (replacing ? 'replacement' : 'removal') + '</h3>' + s.imprints.filter(im => !im.owner && !im.favorite).map(im => imprintCard(ctx, im, replacing ? 'replace' : 'library')).join('') + '</section><section><h3 class="cx-section-title">Protected builds</h3><p class="cx-help">Unequip or remove favorite status before a record becomes eligible.</p>' + s.imprints.filter(im => im.owner || im.favorite).map(im => imprintCard(ctx, im, replacing ? 'replace' : 'library')).join('') + '</section></div></div>';
    if (ctx.variant === 'focus') return '<div class="cx-library-modal-layout cx-library-record-first">' + list + guidance + '</div>';
    return '<div class="cx-library-modal-layout">' + guidance + list + '</div>';
  }
  function proposal(ctx) {
    const s = init(ctx), options = ['All', 'SR', 'SSR'], list = s.gear.filter(g => s.proposalRarity === 'All' || g.rarity === s.proposalRarity);
    const filters = '<div class="cx-proposal-filters">' + options.map(v => btn(ctx, v + ' rarity', 'proposal-filter', { value: v }, s.proposalRarity === v)).join('') + '</div>';
    const card = g => '<div>' + gearTile(ctx, g, s.selectedGear === g.id) + btn(ctx, icon(ctx, 'lock') + (s.proposalLocks[g.id] ? ' Gear protected' : ' Protect gear'), 'proposal-lock', { id: g.id }, !!s.proposalLocks[g.id]) + '</div>';
    let body = '<div class="cx-storage-focus"><div class="cx-proposal-gear-grid">' + list.map(card).join('') + '</div>' + gearDetail(ctx, true) + '</div>';
    if (ctx.variant === 'journey') body = '<div class="cx-proposed-journey"><aside><h2>Preserve a useful build</h2><p>Select a piece, compare its main attribute and mark it for protection. This is a proposal for safer collection management.</p>' + gearDetail(ctx, true) + '</aside><section>' + ['SSR', 'SR'].map(rarity => '<h3 class="cx-section-title">' + rarity + ' equipment</h3><div class="cx-proposal-gear-grid">' + list.filter(g => g.rarity === rarity).map(card).join('') + '</div>').join('') + '</section></div>';
    if (ctx.variant === 'focus') body = '<div class="cx-storage-focus"><div class="cx-proposed-table">' + list.map(g => '<article class="' + (g.id === s.selectedGear ? 'is-selected' : '') + '"><div><span class="ux-eyebrow">' + g.rarity + ' · ' + g.slot + '</span><strong>' + ctx.h(g.name) + '</strong><span>' + mainStat(g.slot) + ' +' + gearValue(g) + '</span></div>' + btn(ctx, 'Inspect', 'pick-gear', { id: g.id }) + btn(ctx, icon(ctx, 'lock') + (s.proposalLocks[g.id] ? ' Protected' : ' Protect'), 'proposal-lock', { id: g.id }, !!s.proposalLocks[g.id]) + '</article>').join('') + '</div>' + gearDetail(ctx, true) + '</div>';
    return shell(ctx, 'Equipment library · proposed tools', 'Proposal: filters, comparison and gear protection are not current native controls.', receipt(ctx) + '<div class="cx-proposal-banner">' + icon(ctx, 'info') + '<strong>Proposed addition</strong><span>These review controls demonstrate a possible inventory improvement. Gear locks are not implemented in the native game.</span></div>' + filters + body, 'storage');
  }
  function interaction(ctx, id) {
    const s = init(ctx), parent = ctx.surface.parent || 'roster-gear';
    let content = '', actions = '', title = ctx.surface.title, subtitle = ctx.hero().name, background;
    if (id === 'character-growth') { background = growth(ctx); content = growthLedger(ctx, true); actions = go(ctx, 'Return to hero', parent, true); }
    else if (id === 'gear-equip') { background = equipment(ctx); content = gearSlots(ctx) + '<div class="cx-inventory-and-detail">' + gearInventory(ctx) + gearDetail(ctx, ctx.variant !== 'stage') + '</div>'; actions = go(ctx, 'Done', parent, true); }
    else if (id === 'gear-upgrade') { background = equipment(ctx); content = upgradePanel(ctx); actions = go(ctx, 'Return to equipment', parent); }
    else if (id === 'gear-crafting') { background = storage(ctx, 'equipment'); content = craftingPanel(ctx); actions = go(ctx, 'View equipment stock', 'storage-equipment'); }
    else if (id === 'gear-presets') { background = equipment(ctx); content = '<div class="cx-preset-context">' + identity(ctx, true) + '<p>Three global presets store equipment IDs across all seven slots. Applying uses the actual available pieces.</p></div>' + presets(ctx); actions = go(ctx, 'Return to equipment', parent); }
    else if (id === 'memory-equip') { background = memoryPage(ctx); content = memoryPicker(ctx); const chosen = s.memories.find(m => m.id === s.selectedMemory); actions = go(ctx, 'Cancel', parent) + btn(ctx, 'Equip selected Memory', 'equip-memory', {}, true, !chosen || !!chosen.owner || !s.owned.includes(ctx.hero().id)); }
    else if (id === 'imprint-equip') { background = memoryPage(ctx); content = imprintPicker(ctx); const chosen = s.imprints.find(im => im.id === s.selectedImprint), count = Object.keys(s.imprintEquipped[ctx.hero().id]).length; actions = go(ctx, 'Cancel', parent) + btn(ctx, count >= 2 ? 'Two Imprints already equipped' : 'Equip selected Imprint', 'equip-imprint', {}, true, !chosen || !!chosen.owner || count >= 2 || !s.owned.includes(ctx.hero().id)); }
    else if (id === 'imprint-extraction-picker') { background = storage(ctx, 'imprints'); content = extractionPicker(ctx); subtitle = 'End of a successful expedition'; actions = go(ctx, 'Review library', 'storage-imprints'); }
    else { const replacing = id === 'imprint-capacity-replacement'; background = storage(ctx, 'imprints'); content = imprintLibrary(ctx, replacing); subtitle = replacing ? 'New extraction reward is waiting' : 'Favorites and equipment are protected'; const chosen = s.imprints.find(im => im.id === s.removal); actions = btn(ctx, replacing ? 'Keep reward waiting' : 'Close library', 'close-library', { parent }) + (s.extractionDone && replacing ? '' : btn(ctx, replacing ? 'Confirm replacement' : 'Confirm discard', replacing ? 'replace-imprint' : 'discard-imprint', {}, true, !chosen || !!chosen.owner || chosen.favorite)); }
    return '<div class="cx-modal-page"><div class="cx-parent-context" inert>' + background + '</div>' + ctx.ui.overlay(title, receipt(ctx) + '<div class="cx-modal-content">' + modalArrangement(ctx, id, content) + '</div>', actions, { subtitle, className: 'cx-dialog cx-dialog-' + id }) + '</div>';
  }
  function modalArrangement(ctx, id, content) {
    if (ctx.variant === 'stage' || id === 'imprint-library-management' || id === 'imprint-capacity-replacement') return content;
    const s = init(ctx), h = ctx.hero(), p = s.progress[h.id];
    const item = s.gear.find(g => g.id === s.selectedGear);
    const memory = s.memories.find(m => m.id === s.selectedMemory);
    const imprint = s.imprints.find(im => im.id === s.selectedImprint);
    let heading = 'Current hero', detail = h.name, state = 'Level ' + p.level + ' · ' + p.stars + ' stars', destination = 'roster-growth', label = 'Hero dossier';
    if (id.indexOf('gear-') === 0) {
      heading = id === 'gear-crafting' ? 'Available at the forge' : 'Selected equipment';
      detail = id === 'gear-crafting' ? 'SR Gloves or Chest' : item ? item.name : 'No piece selected';
      state = id === 'gear-crafting' ? s.materials.crafting + ' crafting cores · ' + fmt(ctx.state.wallet.gold) + ' Gold' : item ? mainStat(item.slot) + ' +' + gearValue(item) + ' · ' + (item.owner ? 'Equipped by ' + heroBy(ctx, item.owner).name : 'Available in stock') : 'Select a slot and available item';
      destination = 'storage-equipment'; label = 'Equipment stock';
    } else if (id === 'memory-equip') {
      heading = 'Selected archive'; detail = memory ? memory.name : 'No Memory selected'; state = memory && memory.owner ? 'Already equipped by ' + heroBy(ctx, memory.owner).name : 'Free Memory · attaches to ' + h.name; destination = 'storage-memories'; label = 'Memory archive';
    } else if (id === 'imprint-equip') {
      heading = 'Selected portable skill'; detail = imprint ? imprint.name : 'Choose a free Imprint'; state = Object.keys(s.imprintEquipped[h.id]).length + ' / 2 Imprints equipped · passive unchanged'; destination = 'storage-imprints'; label = 'Imprint archive';
    } else if (id === 'imprint-extraction-picker') {
      heading = 'Expedition reward'; detail = 'One portable activated skill'; state = s.imprints.length + ' / 12 saved · ' + (s.extractionDone ? 'Reward finalized' : 'Extraction available'); destination = 'storage-imprints'; label = 'Saved rewards';
    }
    const context = '<aside class="cx-decision-context"><span class="ux-eyebrow">' + heading + '</span><h3>' + ctx.h(detail) + '</h3><p>' + ctx.h(state) + '</p>' + go(ctx, label, destination) + '</aside>';
    if (ctx.variant === 'journey') return '<div class="cx-decision-journey"><div class="cx-decision-route"><span>1 · Choose</span><i></i><span>2 · Review ownership & cost</span><i></i><span>3 · Confirm</span></div>' + context + '<section class="cx-decision-main">' + content + '</section></div>';
    return '<div class="cx-decision-focus"><section class="cx-decision-main">' + content + '</section>' + context + '</div>';
  }
  function render(ctx) {
    init(ctx);
    const id = ctx.surface.view || ctx.surface.id;
    if (ctx.surface.kind === 'interaction') return interaction(ctx, id);
    if (id === 'roster-growth' || id === 'collection') return growth(ctx);
    if (id === 'roster-gear') return equipment(ctx);
    if (id === 'roster-memory') return memoryPage(ctx);
    if (id === 'proposal-gear-library-tools') return proposal(ctx);
    if (id.indexOf('storage-') === 0) return storage(ctx, id.slice(8));
    return growth(ctx);
  }
  function setReceipt(s, title, text, error) { s.receipt = { title, text, error: !!error }; }
  function spend(ctx, s, title, gold, costs) {
    const missing = [];
    if (ctx.state.wallet.gold < gold) missing.push(fmt(gold - ctx.state.wallet.gold) + ' Gold');
    Object.entries(costs || {}).forEach(([key, value]) => { if (s.materials[key] < value) missing.push((value - s.materials[key]) + ' ' + key); });
    if (missing.length) { setReceipt(s, title + ' unavailable', 'Still needed: ' + missing.join(' and ') + '. Your materials were not spent.', true); return false; }
    ctx.state.wallet.gold -= gold;
    Object.entries(costs || {}).forEach(([key, value]) => { if (key === 'medals') { ctx.state.wallet.medals -= value; s.materials.medals = ctx.state.wallet.medals; } else s.materials[key] -= value; });
    s.transactions.push({ title, detail: 'Review-only exchange · no account write', cost: [gold ? '−' + fmt(gold) + ' Gold' : '', ...Object.entries(costs || {}).map(([key, value]) => '−' + value + ' ' + key)].filter(Boolean).join(' · ') });
    return true;
  }
  function action(name, ds, ctx) {
    const s = init(ctx), h = ctx.hero(), p = s.progress[h.id];
    let g = s.gear.find(x => x.id === ds.id);
    if (name === 'dismiss') s.receipt = null;
    else if (name === 'filter') { s.search = ''; s.aspect = 'All'; s.ownedOnly = false; }
    else if (name === 'owned') s.ownedOnly = !s.ownedOnly;
    else if (name === 'aspect') { const types = ['All', 'Ember', 'Tide', 'Verdant', 'Radiant', 'Umbra']; s.aspect = types[(types.indexOf(s.aspect) + 1) % types.length]; }
    else if (name === 'slot') { s.slot = ds.slot; const equipped = s.equipped[h.id][s.slot]; s.selectedGear = equipped || (s.gear.find(x => x.slot === s.slot) || {}).id; }
    else if (name === 'pick-gear') { if (!g) return false; s.selectedGear = g.id; s.slot = g.slot; }
    else if (name === 'equip') {
      if (!g || g.owner || !s.owned.includes(h.id)) return false;
      const old = s.gear.find(x => x.id === s.equipped[h.id][g.slot]);
      if (old) old.owner = '';
      s.equipped[h.id][g.slot] = g.id; g.owner = h.id;
      setReceipt(s, g.slot + ' equipped', g.name + ' is now equipped by ' + h.name + (old ? '. ' + old.name + ' returned to stock.' : '.'));
    }
    else if (name === 'unequip') { const old = s.gear.find(x => x.id === s.equipped[h.id][ds.slot]); if (old) old.owner = ''; delete s.equipped[h.id][ds.slot]; setReceipt(s, ds.slot + ' cleared', 'The equipment is available in Storage again.'); }
    else if (name === 'auto-equip') {
      if (!s.owned.includes(h.id)) return false;
      let count = 0;
      slots.forEach(slot => { const old = s.gear.find(x => x.id === s.equipped[h.id][slot]); const best = s.gear.filter(x => x.slot === slot && (!x.owner || x.owner === h.id)).sort((a, b) => gearValue(b) - gearValue(a))[0]; if (best && (!old || best.id !== old.id)) { if (old) old.owner = ''; best.owner = h.id; s.equipped[h.id][slot] = best.id; count++; } });
      setReceipt(s, count ? count + ' slots equipped' : 'Current equipment kept', count ? 'Best available sample pieces were assigned across the seven slots; other heroes kept their equipment.' : 'No stronger free pieces were found.');
    }
    else if (name === 'enhance' || name === 'refine') {
      if (!g) return false;
      const refine = name === 'refine', cap = refine ? maxRefine(g) : maxLevel(g);
      if ((refine ? g.refine : g.level) >= cap) setReceipt(s, 'Rarity cap reached', g.name + ' has reached its ' + (refine ? 'refinement' : 'enhancement') + ' cap.', true);
      else if (spend(ctx, s, refine ? 'Equipment refinement' : 'Equipment enhancement', refine ? refineCost(g) : enhanceCost(g), refine ? { refine: refineCores(g) } : {})) {
        if (refine) { g.refine++; g.power += g.rarity === 'SSR' ? 10 : g.rarity === 'SR' ? 7 : 4; } else { g.level++; g.power += g.rarity === 'SSR' ? 8 : g.rarity === 'SR' ? 5 : 3; }
        setReceipt(s, g.name + ' improved', refine ? 'Refinement is now R' + g.refine + '. This preview updates the item; a native refinement also rolls or improves a substat.' : 'Enhancement is now +' + g.level + '. The new main attribute is shown on the item.');
      }
    }
    else if (name === 'craft') {
      if (!['Gloves', 'Chest'].includes(ds.slot)) return false;
      if (spend(ctx, s, 'Craft SR ' + ds.slot, 4200, { crafting: 6 })) {
        const item = { id: 'crafted-preview-' + s.gear.length, name: 'Refined Assault ' + ds.slot, slot: ds.slot, set: 'Assault', rarity: 'SR', level: 0, refine: 0, stage: 8, power: 68, owner: '' };
        s.gear.push(item); s.selectedGear = item.id; s.slot = item.slot;
        setReceipt(s, item.name + ' crafted', 'One scripted example roll was added to equipment stock. Spent 6 crafting cores and 4,200 Gold.');
      }
    }
    else if (name === 'save-preset') { if (!s.owned.includes(h.id)) return false; s.presets[Number(ds.index)] = { ...s.equipped[h.id] }; setReceipt(s, 'Loadout ' + (Number(ds.index) + 1) + ' saved', Object.keys(s.equipped[h.id]).length + ' equipment IDs saved across seven slots for this review.'); }
    else if (name === 'apply-preset') {
      const preset = s.presets[Number(ds.index)]; if (!preset || !s.owned.includes(h.id) || !Object.keys(preset).length) return false;
      Object.values(s.equipped[h.id]).forEach(id => { const item = s.gear.find(x => x.id === id); if (item) item.owner = ''; });
      s.equipped[h.id] = {}; let applied = 0;
      Object.entries(preset).forEach(([slot, id]) => { const item = s.gear.find(x => x.id === id); if (item) { if (item.owner && s.equipped[item.owner]) delete s.equipped[item.owner][slot]; item.owner = h.id; s.equipped[h.id][slot] = id; applied++; } });
      setReceipt(s, 'Loadout applied to ' + h.name, applied + ' saved pieces were assigned. Missing records were not substituted.');
    }
    else if (name === 'grow') {
      if (!s.owned.includes(h.id)) { setReceipt(s, 'Previewing an unowned hero', 'Recruit ' + h.name + ' before upgrading.', true); ctx.refresh(); return true; }
      let costs = {}, gold = 0, prop = ds.kind, title = '';
      if (prop === 'level') { if (p.level >= 120) { setReceipt(s, 'Level cap reached', 'This hero is already at the current level cap of 120.', true); ctx.refresh(); return true; } costs.crystals = 1 + Math.floor((p.level - 1) / 8); gold = 120 + p.level * 32; title = 'Hero level'; }
      else if (prop === 'awaken') { if (p.stars >= 6) { setReceipt(s, 'Awakening cap reached', 'This hero already has six stars.', true); ctx.refresh(); return true; } costs.shards = Math.max(12, p.stars * 18); title = 'Hero awakening'; }
      else if (prop === 'board') { if (p.board >= 12) { setReceipt(s, 'Memory board complete', 'All twelve current nodes have been forged.', true); ctx.refresh(); return true; } costs.shards = 10 + p.board * 2; gold = 800 + p.board * 220; title = 'Memory board'; }
      else if (prop === 'transcend') { if (p.stars < 3 || p.transcend >= 5) { setReceipt(s, 'Transcendence unavailable', p.stars < 3 ? 'Reach three stars first.' : 'Transcendence five is the current cap.', true); ctx.refresh(); return true; } costs.shards = 24 + p.transcend * 16; costs.medals = 8 + p.transcend * 4; title = 'Transcendence'; }
      else if (prop === 'specialty') { if (p.specialty >= 10) { setReceipt(s, 'Specialty cap reached', 'Specialty level ten is the current cap.', true); ctx.refresh(); return true; } gold = 560 + p.specialty * 220; costs.crystals = 1 + Math.floor(p.specialty / 3); title = 'Specialty training'; }
      else if (prop === 'resonance') { if (p.resonance >= 6) { setReceipt(s, 'Resonance cap reached', 'Resonance six is the current cap.', true); ctx.refresh(); return true; } costs.shards = 8 + p.resonance * 4; costs.medals = 3 + p.resonance * 2; title = 'Character resonance'; }
      else if (prop === 'skill') { const skill = h.skills.slice().sort((a, b) => (p.skills[a.id] || 1) - (p.skills[b.id] || 1))[0], level = p.skills[skill.id] || 1; if (level >= 10) { setReceipt(s, 'Skill cap reached', 'Every current skill is at level ten.', true); ctx.refresh(); return true; } gold = 420 + level * 260; title = skill.name; if (spend(ctx, s, title, gold, {})) { p.skills[skill.id] = level + 1; setReceipt(s, title + ' trained', 'Skill level is now ' + (level + 1) + '. The dossier shows the updated level.'); } ctx.refresh(); return true; }
      else return false;
      if (spend(ctx, s, title, gold, costs)) { const key = prop === 'awaken' ? 'stars' : prop; p[key]++; if (prop === 'resonance' && p.resonance === 3) p.board = Math.max(p.board, 3); if (prop === 'transcend' && p.transcend === 3) h.skills.forEach(k => p.skills[k.id] = Math.max(p.skills[k.id] || 1, 3)); if (prop === 'transcend' && p.transcend === 5) p.board++; setReceipt(s, title + ' improved', h.name + ': ' + (prop === 'awaken' ? p.stars + ' stars' : prop === 'board' ? p.board + ' / 12 Memory nodes' : prop + ' ' + p[key]) + '. Materials are itemized in Storage / Transactions.'); }
    }
    else if (name === 'pick-memory') s.selectedMemory = ds.id;
    else if (name === 'equip-memory') {
      const m = s.memories.find(x => x.id === s.selectedMemory); if (!m || m.owner || !s.owned.includes(h.id)) return false;
      const old = s.memories.find(x => x.id === s.memoryEquipped[h.id]); if (old) old.owner = '';
      m.owner = h.id; s.memoryEquipped[h.id] = m.id; setReceipt(s, 'Memory equipped', m.name + ' is attached to ' + h.name + '.'); ctx.route('roster-memory'); return true;
    }
    else if (name === 'unequip-memory') { const m = s.memories.find(x => x.id === s.memoryEquipped[h.id]); if (m) m.owner = ''; delete s.memoryEquipped[h.id]; setReceipt(s, 'Memory returned to archive', 'The saved route Memory is now free for another hero.'); }
    else if (name === 'open-imprint') { s.selectedSkill = ds.skill; ctx.route('imprint-equip'); return true; }
    else if (name === 'pick-skill') s.selectedSkill = ds.skill;
    else if (name === 'pick-imprint') s.selectedImprint = ds.id;
    else if (name === 'equip-imprint') {
      const im = s.imprints.find(x => x.id === s.selectedImprint), skill = h.skills.find(k => k.id === s.selectedSkill && k.slot !== 'Passive') || h.skills.find(k => k.slot === 'Active1');
      if (!im || im.owner || !s.owned.includes(h.id) || Object.keys(s.imprintEquipped[h.id]).length >= 2) return false; if (s.imprintEquipped[h.id][skill.id]) { setReceipt(s, 'Skill already Imprinted', 'Unequip its current Imprint before choosing a replacement.', true); ctx.refresh(); return true; }
      const old = s.imprints.find(x => x.id === s.imprintEquipped[h.id][skill.id]); if (old) { old.owner = ''; old.skillId = ''; }
      im.owner = h.id; im.skillId = skill.id; s.imprintEquipped[h.id][skill.id] = im.id; setReceipt(s, 'Imprint attached', im.name + ' now occupies ' + h.name + '’s ' + labelSlot(skill.slot) + ' slot. The passive is unchanged.'); ctx.route('roster-memory'); return true;
    }
    else if (name === 'unequip-imprint') { const im = s.imprints.find(x => x.id === s.imprintEquipped[h.id][ds.skill]); if (im) { im.owner = ''; im.skillId = ''; } delete s.imprintEquipped[h.id][ds.skill]; setReceipt(s, 'Original skill restored', 'The Imprint is free in Storage and no longer protected by equipment. Favorite protection still applies.'); }
    else if (name === 'favorite') { const im = s.imprints.find(x => x.id === ds.id); if (!im) return false; im.favorite = !im.favorite; if (im.favorite && s.removal === im.id) s.removal = ''; }
    else if (name === 'remove-select') { const im = s.imprints.find(x => x.id === ds.id); if (!im || im.owner || im.favorite) return false; s.removal = s.removal === im.id ? '' : im.id; }
    else if (name === 'discard-imprint' || name === 'replace-imprint') {
      const im = s.imprints.find(x => x.id === s.removal); if (!im || im.owner || im.favorite) return false;
      if (name === 'replace-imprint' && s.extractionDone) return false;
      s.imprints = s.imprints.filter(x => x.id !== im.id); s.removal = '';
      if (name === 'replace-imprint') { const reward = s.newReward || h.skills.find(k => k.slot === 'Active2'); s.imprints.push({ id: reward.rewardId || 'reward-preview', name: reward.name + ' Imprint', hero: reward.sourceHeroId || h.id, type: reward.sourceType || h.type, slot: reward.slot, text: reward.text, favorite: false, owner: '', skillId: '', sourceSkillId: reward.id, modifiers: reward.modifiers || [] }); s.extractionDone = true; s.pendingReward = false; s.selectedImprint = s.imprints[s.imprints.length - 1].id; if (W.InterfaceModules.adventures && W.InterfaceModules.adventures.finalizeLabExtraction) W.InterfaceModules.adventures.finalizeLabExtraction(ctx, s.imprints[s.imprints.length - 1]); setReceipt(s, 'Reward extracted once', im.name + ' was replaced. The new Imprint is saved and the waiting reward is finalized.'); }
      else setReceipt(s, 'Imprint discarded', im.name + ' was removed after confirmation. Equipped and favorite records remain untouched.');
    }
    else if (name === 'extract') {
      if (s.extractionDone) return false; const skill = h.skills.find(k => k.id === ds.skill && k.slot !== 'Passive'); if (!skill) return false; s.newReward = skill;
      if (s.imprints.length >= 12) { s.removal = ''; ctx.route('imprint-capacity-replacement'); return true; }
      s.imprints.push({ id: 'reward-preview', name: skill.name + ' Imprint', hero: h.id, type: h.type, slot: skill.slot, text: skill.text, favorite: false, owner: '', skillId: '' }); s.extractionDone = true; s.pendingReward = false; if (W.InterfaceModules.adventures && W.InterfaceModules.adventures.finalizeLabExtraction) W.InterfaceModules.adventures.finalizeLabExtraction(ctx, s.imprints[s.imprints.length - 1]); setReceipt(s, 'Imprint extracted', skill.name + ' was added to Storage. This reward is finalized once.'); ctx.route('storage-imprints'); return true;
    }
    else if (name === 'close-library') { s.removal = ''; ctx.route(ds.parent || 'storage-imprints'); return true; }
    else if (name === 'resource') s.resource = ds.id;
    else if (name === 'support') s.support = ds.id;
    else if (name === 'proposal-filter') s.proposalRarity = ds.value;
    else if (name === 'proposal-lock') { s.proposalLocks[ds.id] = !s.proposalLocks[ds.id]; setReceipt(s, 'Proposed gear protection ' + (s.proposalLocks[ds.id] ? 'enabled' : 'removed'), 'This design-only lock is not a current native feature. The selected sample piece shows the resulting protection state.'); }
    else return false;
    ctx.refresh(); return true;
  }
  W.InterfaceModules = W.InterfaceModules || {};
  W.InterfaceModules.collection = { render, action, ensureState: init };
}());

