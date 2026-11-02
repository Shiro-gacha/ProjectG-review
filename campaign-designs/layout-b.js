/* Review candidate B: scenic expedition. Shared app owns all interactions. */
window.CampaignLayouts = window.CampaignLayouts || {};
window.CampaignLayouts.b = ctx => {
  const { chapter, stage, h, icon } = ctx;
  const number = value => Number(value).toLocaleString('en-US');
  const chapterCode = String(chapter.id).padStart(2, '0');
  const kind = String(stage.kind || 'Encounter').replace(/([a-z])([A-Z])/g, '$1 $2');
  const isBoss = /boss/i.test(kind);
  const locked = stage.status === 'locked';
  const routeStart = ctx.page * 8 + 1;
  const routeEnd = Math.min(routeStart + 7, ctx.chapterCount);
  const encounter = `
    <button class="b-enemy-peek" data-action="brief">
      ${icon(isBoss ? 'crown' : 'sword')}
      <span><strong>${h(kind)} encounter</strong><small>Encounter details and mission objectives</small></span>
      ${icon('chevron')}
    </button>`;
  return `
    <div class="b-expedition">
      <aside class="b-stage-panel" aria-label="Chapter and mission selection">
        <div class="b-stage-header">
          <button class="b-chapter-picker" data-action="chapters" aria-label="Choose chapter">
            <span class="b-chapter-glyph">${icon('map')}</span>
            <span><small>CHAPTER ${h(chapterCode)}</small><strong>${h(chapter.name)}</strong></span>
            ${icon('chevron')}
          </button>
          <div class="b-difficulties" aria-label="Campaign difficulty">
            ${['Normal', 'Hard'].map(difficulty => `<button data-action="difficulty" data-value="${difficulty}" class="${ctx.difficulty === difficulty ? 'is-selected' : ''}" aria-pressed="${ctx.difficulty === difficulty}">${difficulty}</button>`).join('')}
          </div>
        </div>
        <div class="b-progress-area">${ctx.progress()}</div>
        <nav class="b-stage-list" aria-label="Missions ${routeStart} to ${routeEnd}">
          ${ctx.route.map(item => ctx.stageButton(item, 'b-stage-row')).join('')}
        </nav>
        <div class="b-route-footer">
          <button class="b-route-arrow" data-action="route-prev" aria-label="Previous mission group" ${ctx.page === 0 ? 'disabled' : ''}>${icon('back')}</button>
          <span><small>MISSIONS</small><strong>${routeStart}–${routeEnd} <i>/ ${ctx.chapterCount}</i></strong></span>
          <button class="b-route-arrow" data-action="route-next" aria-label="Next mission group" ${routeEnd >= ctx.chapterCount ? 'disabled' : ''}>${icon('chevron')}</button>
        </div>
      </aside>

      <section class="b-party-scene" aria-label="Your five-hero company">
        <div class="b-scenic-title">
          <span class="b-scene-line"></span>
          <p>DAWNWARD EXPEDITION</p>
          <h2>${h(chapter.region)}</h2>
          <span class="b-scene-line"></span>
        </div>
        <div class="b-ground-halo" aria-hidden="true"></div>
        ${ctx.party('full')}
        <div class="b-company-footer">
          <span class="b-company-caption">${icon('flag')} FIVE HEROES · YOUR COMPANY</span>
          <button class="b-formation-button" data-action="formation">${icon('formation')}<span>Formation <strong>3 × 3</strong></span>${icon('chevron')}</button>
        </div>
      </section>

      <aside class="b-dossier" aria-label="Selected mission briefing">
        <header class="b-mission-heading">
          <span class="b-mission-crest" aria-hidden="true">${icon(isBoss ? 'crown' : 'flag')}</span>
          <div><p>${h(ctx.difficulty.toUpperCase())} · STAGE ${h(stage.code)}</p><h2>${h(stage.title)}</h2></div>
          <span class="b-stage-tag ${locked ? 'is-locked' : ''}">${locked ? icon('lock') : stage.status === 'cleared' ? icon('check') : icon('compass')}<span>${locked ? 'Locked' : stage.status === 'cleared' ? 'Cleared' : 'Next mission'}</span></span>
        </header>
        <div class="b-dossier-body">
          <div class="b-mission-stats">
            <span><small>ENEMY LEVEL</small><strong>Lv. ${h(stage.enemyLevel)}</strong></span>
            <span><small>REC. POWER</small><strong>${number(stage.power)}</strong></span>
            <span><small>WAVES</small><strong>${h(stage.waves)}</strong></span>
          </div>
          <section class="b-enemy-section" aria-label="Encounter preview">
            <div class="b-section-heading"><h3>OPPOSITION</h3><span>${h(kind)}</span></div>
            ${encounter}
          </section>
          <section class="b-briefing-section">
            <div class="b-section-heading"><h3>MISSION</h3><button data-action="brief" aria-label="Open full mission briefing">${icon('compass')} Details</button></div>
            <p class="b-location">${h(stage.location)}</p>
            <p class="b-briefing">${h(stage.briefing)}</p>
          </section>
          <section class="b-reward-shelf" aria-label="Mission reward preview">
            <div class="b-section-heading"><h3>REWARDS</h3>${stage.status === 'cleared' ? '<span>First clear claimed</span>' : '<span>First clear</span>'}</div>
            ${ctx.rewards()}
          </section>
        </div>
        <footer class="b-deployment">
          <button class="b-story-button" data-action="story">${icon('story')} Read story</button>
          <div class="b-deploy-wrap">
            <button class="b-deploy-button" data-action="deploy" ${locked ? 'disabled aria-disabled="true"' : ''}>${icon(locked ? 'lock' : 'sword')}<span>${locked ? 'Stage locked' : 'Prepare for battle'}</span>${locked ? '' : icon('arrow')}</button>
          </div>
        </footer>
      </aside>
    </div>`;
};

/* Expanded B keeps the first-round candidate available for comparison. */
(function () {
  const original = window.CampaignLayouts.b;
  window.CampaignLayouts.b = function (ctx) {
    if (!ctx.expanded) return original(ctx);
    const {chapter, stage, h, icon} = ctx;
    const number = value => Number(value).toLocaleString('en-US');
    const storyIds = ctx.storyStageIds instanceof Set ? ctx.storyStageIds : new Set(ctx.storyStageIds || []);
    const hasStory = item => storyIds.has(Number(item.id));
    const boss = item => /boss/i.test(item.kind);
    const locked = stage.status === 'locked';
    const statusLabel = locked ? 'Locked encounter' : stage.status === 'cleared' ? 'Cleared · revisit' : 'Next encounter';
    const sceneLabel = boss(stage) ? 'Boss encounter' : hasStory(stage) ? 'Story encounter' : 'Campaign encounter';
    const detailsOpen = Boolean(ctx.detailsOpen);
    const rows = ctx.stages.map(item => {
      const markers = `<span class="bx-row-markers">${boss(item) ? `<span class="bx-mark bx-boss-mark">${icon('crown')}<i>Boss</i></span>` : ''}${hasStory(item) ? `<span class="bx-mark bx-story-mark" title="Authored story scene">${icon('story')}<i>Story</i></span>` : ''}</span>`;
      const row = ctx.stageButton(item, `b-stage-row bx-stage-row${boss(item) ? ' bx-boss-row' : ''}${hasStory(item) ? ' bx-story-row' : ''}`).replace(/aria-label="([^"]*)"/, (_, label) => `aria-label="${label}${boss(item) ? ', Boss' : ''}${hasStory(item) ? ', Story scene' : ''}"`).replace('</button>', `${markers}</button>`);
      return `${item.number % 8 === 1 ? `<div class="bx-segment-label"><span>STAGES ${String(item.number).padStart(2,'0')} — ${String(item.number + 7).padStart(2,'0')}</span><i></i></div>` : ''}${row}`;
    }).join('');
    return `<div class="bx-expedition">
      <aside class="bx-stage-panel" aria-label="All twenty-four chapter stages">
        <header class="bx-stage-header">
          <button class="bx-chapter-picker" data-action="chapters" aria-label="Choose chapter">${icon('map')}<span><small>CHAPTER ${String(chapter.id).padStart(2,'0')}</small><strong>${h(chapter.name)}</strong></span>${icon('chevron')}</button>
          <div class="bx-difficulties" role="group" aria-label="Campaign difficulty">${['Normal','Hard'].map(value => `<button class="${ctx.difficulty === value ? 'is-selected' : ''}" data-action="difficulty" data-value="${value}" aria-pressed="${ctx.difficulty === value}">${value}</button>`).join('')}</div>
        </header>
        <div class="bx-route-progress">${ctx.progress()}<button data-action="current-stage" aria-label="Follow next available encounter">${icon('compass')}<span>Next encounter</span></button></div>
        <nav class="b-stage-list bx-stage-list" aria-label="All ${ctx.chapterCount} stages">${rows}</nav>
        <footer class="bx-list-legend"><span>${icon('story')} Story scene</span><span>${icon('crown')} Boss</span><span><i></i> Next</span></footer>
      </aside>

      <section class="bx-party-scene" aria-label="Your five-hero expedition">
        <header class="bx-scene-heading"><div><p class="eyebrow">DAWNWARD EXPEDITION</p><h2>${h(chapter.region)}</h2></div><button class="bx-route-button" data-action="route-view">${icon('map')}<span>Chapter route</span>${icon('chevron')}</button></header>
        <div class="bx-encounter-banner ${boss(stage) ? 'is-boss' : ''}"><span>${icon(boss(stage) ? 'crown' : hasStory(stage) ? 'story' : 'flag')}${h(sceneLabel)}</span><strong>${h(stage.code)}</strong></div>
        <div class="bx-party-ground" aria-hidden="true"></div>${ctx.party('full')}
        <div class="bx-company-footer"><span>FIVE HEROES · YOUR COMPANY</span><button class="bx-formation-button" data-action="formation" ${locked ? 'disabled' : ''}>${icon('formation')}<span>Formation <strong>3 × 3</strong></span>${icon('chevron')}</button></div>
      </section>

      <aside class="bx-dossier ${detailsOpen ? 'details-open' : ''} ${boss(stage) ? 'boss-selected' : ''}" aria-label="Selected mission briefing">
        <header class="bx-mission-heading"><div class="bx-mission-overline"><span>${h(ctx.difficulty)} · ${h(stage.code)}</span><span class="bx-selected-status ${locked ? 'is-locked' : ''}">${icon(locked ? 'lock' : stage.status === 'cleared' ? 'check' : 'compass')}${h(statusLabel)}</span></div><h2>${h(stage.title)}</h2><div class="bx-mission-traits">${boss(stage) ? `<span class="bx-boss-trait">${icon('crown')} Boss</span>` : ''}${hasStory(stage) ? `<button data-action="story">${icon('story')} Story scene ${icon('chevron')}</button>` : `<span>${icon('flag')} Campaign stage</span>`}</div></header>
        <div class="bx-mission-stats"><span><small>RECOMMENDED</small><strong>${number(stage.power)}</strong></span><span><small>ENEMY LEVEL</small><strong>${stage.enemyLevel}</strong></span><span><small>WAVES</small><strong>${stage.waves}</strong></span></div>
        <button class="bx-detail-toggle" data-action="toggle-details" aria-expanded="${detailsOpen}" aria-controls="bx-dossier-details"><span>${icon('story')}${detailsOpen ? 'Hide mission details' : 'Mission details & rewards'}</span>${icon('chevron')}</button>
        <div class="bx-dossier-details" id="bx-dossier-details">
          <section class="bx-briefing-section"><div class="bx-section-heading"><h3>MISSION BRIEFING</h3><button data-action="brief" aria-label="Open full stage briefing">Details ${icon('chevron')}</button></div><p class="bx-location">${h(stage.location)}</p><p class="bx-briefing">${h(stage.briefing)}</p></section>
          <section class="bx-reward-section" aria-label="First-clear reward preview"><div class="bx-section-heading"><h3>FIRST-CLEAR REWARDS</h3>${stage.status === 'cleared' ? `<span>${icon('check')} Claimed</span>` : ''}</div>${ctx.rewards()}<p class="bx-reward-note">${stage.status === 'cleared' ? 'Regular clear rewards already claimed. Revisit does not grant them again.' : 'Clear rewards are granted once. All three objectives award 10 gems once.'}</p></section>
          ${locked ? `<p class="bx-locked-note">${icon('lock')} Clear the preceding encounters to unlock this stage.</p>` : ''}
        </div>
        <footer class="bx-deployment"><div class="bx-deployment-summary"><span>${locked ? 'ENCOUNTER LOCKED' : stage.status === 'cleared' ? 'REVISIT STAGE' : 'READY WHEN YOU ARE'}</span></div><button class="bx-deploy-button" data-action="deploy" ${locked ? 'disabled aria-disabled="true"' : ''}>${icon(locked ? 'lock' : 'formation')}<span>${locked ? 'Stage locked' : 'Prepare Battle'}</span>${!locked ? icon('arrow') : ''}</button><small class="bx-placement-note">Set your formation before entering battle.</small></footer>
      </aside>
    </div>`;
  };
}());
