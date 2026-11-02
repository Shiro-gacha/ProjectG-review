(function () {
  'use strict';

  window.CampaignLayouts = window.CampaignLayouts || {};
  window.CampaignLayouts.c = function (ctx) {
    var h = ctx.h;
    var stage = ctx.stage;
    var chapter = ctx.chapter;
    var locked = stage.status === 'locked';
    var boss = function (entry) { return /boss/i.test(entry.kind); };
    var currentLabel = locked ? 'Locked stage' : stage.status === 'cleared' ? 'Revisit stage' : 'Next encounter';
    var offsets = [10, -7, 11, 26, 5, -14, 5, 14];
    var nodes = ctx.route.map(function (entry, index) {
      var selected = String(entry.id) === String(stage.id);
      var isBoss = boss(entry);
      var state = entry.status === 'cleared' ? 'Cleared' : entry.status === 'locked' ? 'Locked' : 'Available';
      var icon = entry.status === 'locked' ? 'lock' : isBoss ? 'crown' : entry.status === 'cleared' ? 'check' : 'sword';
      return '<div class="c-route-stop' + (isBoss ? ' c-boss-stop' : '') + '" style="--node-offset:' + offsets[index] + 'px">' +
        '<button class="c-node ' + h(entry.status) + (selected ? ' selected' : '') + (isBoss ? ' boss' : '') + '" data-stage="' + h(entry.id) + '" aria-pressed="' + selected + '" aria-label="' + h('Stage ' + entry.code + ', ' + entry.title + ', ' + state) + '">' +
          '<span class="c-node-cursor" aria-hidden="true">' + ctx.icon('chevron') + '</span>' +
          '<span class="c-node-marker" aria-hidden="true"><span>' + ctx.icon(icon) + '</span></span>' +
          '<span class="c-node-code">' + h(entry.code) + (isBoss ? '<span class="c-boss-word">BOSS</span>' : '') + '</span>' +
          '<span class="c-node-title">' + h(entry.title) + '</span>' +
          '<span class="c-node-state">' + h(state) + '</span>' +
        '</button></div>';
    }).join('');

    return '<div class="c-expedition' + (ctx.difficulty === 'Hard' ? ' c-night' : '') + '">' +
      '<div class="c-scenery" aria-hidden="true"></div>' +
      '<header class="c-chapter-head">' +
        '<div class="c-chapter-copy"><span class="eyebrow">CHAPTER ' + h(String(chapter.id).padStart(2, '0')) + ' <span class="c-heading-separator">/</span> ' + h(chapter.region) + '</span>' +
          '<h2>' + h(chapter.name) + '</h2><p>' + h(stage.briefing) + '</p></div>' +
        '<div class="c-map-tools"><div class="c-difficulty" aria-label="Difficulty">' +
          '<button data-action="difficulty" data-value="Normal" class="' + (ctx.difficulty === 'Normal' ? 'active' : '') + '" aria-pressed="' + (ctx.difficulty === 'Normal') + '">Normal</button>' +
          '<button data-action="difficulty" data-value="Hard" class="' + (ctx.difficulty === 'Hard' ? 'active' : '') + '" aria-pressed="' + (ctx.difficulty === 'Hard') + '">Hard</button></div>' +
          '<button class="c-chapter-picker" data-action="chapters">' + ctx.icon('map') + '<span>Chapters</span>' + ctx.icon('chevron') + '</button></div>' +
      '</header>' +
      '<section class="c-route-area" aria-label="Chapter stage route">' +
        '<div class="c-route-topline"><span class="c-route-label">THE ROAD AHEAD</span>' +
          '<div class="c-route-pagination"><button class="icon-button" data-action="route-prev" aria-label="Previous eight stages"' + (ctx.page === 0 ? ' disabled' : '') + '>' + ctx.icon('back') + '</button>' +
          '<span>' + h(ctx.route[0].code) + ' <span aria-hidden="true">—</span> ' + h(ctx.route[ctx.route.length - 1].code) + '</span>' +
          '<button class="icon-button" data-action="route-next" aria-label="Next eight stages"' + (ctx.page >= 2 ? ' disabled' : '') + '>' + ctx.icon('chevron') + '</button></div></div>' +
        '<div class="c-route-track"><svg class="c-route-line" viewBox="0 0 1120 100" preserveAspectRatio="none" aria-hidden="true"><path class="c-route-shadow" d="M70 55 C115 55 150 38 210 38 S300 56 350 56 S435 71 490 71 S585 50 630 50 S720 31 770 31 S865 50 910 50 S1000 59 1050 59"/><path d="M70 55 C115 55 150 38 210 38 S300 56 350 56 S435 71 490 71 S585 50 630 50 S720 31 770 31 S865 50 910 50 S1000 59 1050 59"/></svg>' + nodes + '</div>' +
      '</section>' +
      '<div class="c-party-scene"><div class="c-party-ground" aria-hidden="true"></div>' + ctx.party('full') + '<span class="c-party-caption">YOUR EXPEDITION <span>5 heroes · formation set before battle</span></span></div>' +
      '<footer class="c-journey-footer"><div class="c-progress-block"><span class="eyebrow">CHAPTER PROGRESS</span>' + ctx.progress() + '</div>' +
        '<div class="c-stage-summary"><div><span class="c-selected-kicker">' + h(currentLabel) + '</span><strong>' + h(stage.code) + ' <span>' + h(stage.title) + '</span></strong>' +
          '<span class="c-selected-meta">' + h(stage.waves) + ' waves <span>·</span> Recommended ' + h(Number(stage.power).toLocaleString('en-US')) + '</span></div>' +
          '<button class="c-brief-button" data-action="brief" aria-label="Read stage ' + h(stage.code) + ' briefing">Briefing ' + ctx.icon('story') + '</button></div>' +
        '<button class="game-button primary c-enter" data-action="deploy"' + (locked ? ' disabled' : '') + '><span>' + (locked ? ctx.icon('lock') + ' Stage locked' : 'Enter stage ' + ctx.icon('arrow')) + '</span><small>' + ctx.icon('energy') + h(stage.cost) + ' energy</small></button>' +
      '</footer></div>';
  };
}());
