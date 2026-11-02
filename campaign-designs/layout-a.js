window.CampaignLayouts = window.CampaignLayouts || {};
window.CampaignLayouts.a = function (ctx) {
  const {chapter, stage, route, h, icon} = ctx;
  const locked = stage.status === 'locked';
  const stageKind = /boss/i.test(stage.kind) ? 'Boss encounter' : 'Campaign encounter';
  const first = route.length ? route[0].number : 1;
  const last = route.length ? route[route.length - 1].number : 8;
  return `
    <div class="a-vignette" data-theme="${h(chapter.theme)}">
      <div class="a-scene-hud">
        <div class="a-destination">
          <button class="a-map-link" data-action="chapters" aria-label="Open chapter map">
            <span class="a-map-medallion">${icon('map')}</span>
            <span><span class="a-chapter-kicker">CHAPTER ${String(chapter.id).padStart(2, '0')}</span><strong>${h(chapter.region)}</strong></span>
            <span class="a-map-chevron">${icon('chevron')}</span>
          </button>
          <div class="a-destination-subline">
            <span>${h(chapter.name)}</span>
            <div class="a-difficulty" role="group" aria-label="Campaign difficulty">
              ${['Normal', 'Hard'].map(value => `<button class="${ctx.difficulty === value ? 'is-active' : ''}" data-action="difficulty" data-value="${value}" aria-pressed="${ctx.difficulty === value}">${value}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="a-cache">
          <span class="a-cache-icon">${icon('chest')}</span>
          <span class="a-cache-copy"><span class="a-chapter-kicker">IDLE REWARDS</span><strong>Your expedition cache</strong></span>
          <button class="a-claim" data-action="loot">Claim ${icon('arrow')}</button>
        </div>
      </div>
      <div class="a-party-setting" aria-label="Your five-hero expedition">
        <div class="a-party-ground"></div>
        ${ctx.party('full')}
        <span class="a-expedition-caption">DAWNWARD COMPANY</span>
      </div>
      <div class="a-current-stage">
        <div class="a-stage-emblem" aria-hidden="true">${icon(locked ? 'lock' : /boss/i.test(stage.kind) ? 'crown' : 'sword')}</div>
        <div class="a-stage-copy">
          <div class="a-stage-eyebrow"><span>${h(stage.code)}</span><span>${h(stageKind)}</span>${locked ? '<span class="a-locked-note">Locked</span>' : stage.status === 'cleared' ? '<span class="a-cleared-note">Cleared</span>' : '<span class="a-current-note">Next encounter</span>'}</div>
          <h2>${h(stage.title)}</h2>
          <div class="a-stage-facts"><span>${icon('flag')} ${h(stage.waves)} waves</span><span>Enemy Lv. ${h(stage.enemyLevel)}</span><span>Rec. power <b>${Number(stage.power).toLocaleString('en-US')}</b></span></div>
        </div>
        <div class="a-stage-actions">
          <button class="a-details" data-action="brief">Details ${icon('chevron')}</button>
          <button class="a-deploy" data-action="deploy" ${locked ? 'disabled' : ''}><span>${icon(locked ? 'lock' : 'sword')} ${locked ? 'Stage locked' : 'Prepare battle'}</span><small>${icon('energy')} ${h(stage.cost)} stamina</small></button>
        </div>
      </div>
    </div>
    <div class="a-route-panel">
      <div class="a-route-heading">
        <div class="a-route-heading-title"><span class="a-route-line"></span><span>YOUR CAMPAIGN ROUTE</span></div>
        <span class="a-progress-copy">${h(ctx.clearedCount)} / ${h(ctx.chapterCount)} cleared</span>
        <button class="a-world-map" data-action="chapters">${icon('map')} Chapter map</button>
      </div>
      <div class="a-stage-navigation">
        <button class="a-route-arrow a-route-arrow-prev" data-action="route-prev" aria-label="Previous eight stages" ${ctx.page === 0 ? 'disabled' : ''}>${icon('back')}</button>
        <div class="a-stage-strip">${route.map(item => ctx.stageButton(item, 'a-stage-button')).join('')}</div>
        <button class="a-route-arrow" data-action="route-next" aria-label="Next eight stages" ${ctx.page === 2 ? 'disabled' : ''}>${icon('chevron')}</button>
      </div>
      <div class="a-route-footnote"><span>Stages ${first}–${last} of ${h(ctx.chapterCount)}</span><span class="a-route-legend"><i></i> Current route <span>◆</span> Boss landmark</span></div>
    </div>`;
};
