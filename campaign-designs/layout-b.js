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
            <span class="b-energy-cost">${icon('energy')} ${h(stage.cost)} stamina</span>
            <button class="b-deploy-button" data-action="deploy" ${locked ? 'disabled aria-disabled="true"' : ''}>${icon(locked ? 'lock' : 'sword')}<span>${locked ? 'Stage locked' : 'Prepare for battle'}</span>${locked ? '' : icon('arrow')}</button>
          </div>
        </footer>
      </aside>
    </div>`;
};
