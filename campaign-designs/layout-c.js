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

/* Expanded route companion. The initial C study remains available for comparison. */
(function () {
  'use strict';
  var originalRoute = window.CampaignLayouts.c;
  window.CampaignLayouts.c = function (ctx) {
    if (!ctx.expanded) return originalRoute(ctx);
    var h = ctx.h;
    var icon = ctx.icon;
    var chapter = ctx.chapter;
    var selected = ctx.stage;
    var locked = selected.status === 'locked';
    var storyIds = ctx.storyStageIds;
    var isStory = function (entry) {
      return !!(storyIds && (typeof storyIds.has === 'function' ? storyIds.has(entry.id) || storyIds.has(String(entry.id)) : storyIds.indexOf(entry.id) !== -1 || storyIds.indexOf(String(entry.id)) !== -1));
    };
    var isBoss = function (entry) { return /boss/i.test(entry.kind); };
    var stateLabel = function (entry) { return entry.status === 'current' ? 'Next encounter' : entry.status === 'cleared' ? 'Cleared' : 'Locked'; };
    var offsets = [0, 18, -2, -15, 3, 19, -2, 14];
    var route = ctx.route.map(function (entry, index) {
      var active = entry.id === selected.id;
      var boss = isBoss(entry);
      var story = isStory(entry);
      var marker = entry.status === 'locked' ? 'lock' : boss ? 'crown' : entry.status === 'cleared' ? 'check' : story ? 'story' : 'sword';
      var kind = /finalboss/i.test(entry.kind) ? 'Chapter boss' : boss ? 'Boss' : story ? 'Story' : 'Encounter';
      return '<div class="cx-stop" style="--stop-offset:' + offsets[index] + 'px">' +
        '<button class="cx-node ' + h(entry.status) + (active ? ' selected' : '') + (boss ? ' boss' : '') + (story ? ' story' : '') + '" data-stage="' + h(entry.id) + '" aria-pressed="' + active + '" aria-label="' + h('Stage ' + entry.code + ', ' + entry.title + ', ' + kind + (story && boss ? ', Story scene' : '') + ', ' + stateLabel(entry)) + '">' +
          '<span class="cx-node-marker" aria-hidden="true"><span>' + icon(marker) + '</span></span>' +
          '<span class="cx-node-code">' + h(entry.code) + '</span>' +
          '<span class="cx-node-title">' + h(entry.title) + '</span>' +
          '<span class="cx-node-kind">' + (boss ? icon('crown') : story ? icon('story') : '') + h(kind) + '</span>' +
          '<span class="cx-node-state">' + h(stateLabel(entry)) + '</span>' +
        '</button></div>';
    }).join('');
    var selectedKind = (/finalboss/i.test(selected.kind) ? 'Chapter boss' : isBoss(selected) ? 'Boss encounter' : isStory(selected) ? 'Story encounter' : 'Campaign encounter') + (isBoss(selected) && isStory(selected) ? ' · Story scene' : '');
    return '<div class="cx-expedition' + (ctx.difficulty === 'Hard' ? ' cx-night' : '') + '">' +
      '<div class="cx-scenery" aria-hidden="true"></div>' +
      '<header class="cx-header">' +
        '<button class="cx-campaign-link" data-action="campaign-view" aria-label="Return to campaign">' + icon('back') + '<span>Campaign</span></button>' +
        '<div class="cx-heading"><span class="eyebrow">CHAPTER ' + h(String(chapter.id).padStart(2, '0')) + ' <i>·</i> ' + h(chapter.region) + '</span><h2>' + h(chapter.name) + '</h2></div>' +
        '<div class="cx-header-tools"><button class="cx-region-link" data-action="chapters" aria-label="Choose chapter">' + icon('map') + '<span>Chapters</span>' + icon('chevron') + '</button><div class="cx-difficulty" aria-label="Route difficulty">' + ['Normal', 'Hard'].map(function (value) { return '<button data-action="difficulty" data-value="' + value + '" class="' + (ctx.difficulty === value ? 'active' : '') + '" aria-pressed="' + (ctx.difficulty === value) + '">' + value + '</button>'; }).join('') + '</div></div>' +
      '</header>' +
      '<section class="cx-route-area" aria-label="Expanded chapter route">' +
        '<div class="cx-route-toolbar"><div class="cx-segment"><span>CHAPTER ROUTE</span><strong>' + h(ctx.route[0].code) + '<i>—</i>' + h(ctx.route[ctx.route.length - 1].code) + '</strong></div>' +
          '<div class="cx-route-controls"><button class="cx-current-button" data-action="current-stage" aria-label="Next encounter">' + icon('compass') + '<span>Next encounter</span></button><div class="cx-pagination"><button class="icon-button" data-action="route-prev" aria-label="Previous eight stages"' + (ctx.page === 0 ? ' disabled' : '') + '>' + icon('back') + '</button><span>' + h(ctx.page + 1) + ' / 3</span><button class="icon-button" data-action="route-next" aria-label="Next eight stages"' + (ctx.page >= 2 ? ' disabled' : '') + '>' + icon('chevron') + '</button></div></div></div>' +
        '<div class="cx-route-track"><svg class="cx-route-line" viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true"><path class="cx-route-shadow" d="M75 47 C130 47 165 65 225 65 S315 45 375 45 S465 32 525 32 S615 50 675 50 S765 66 825 66 S915 45 975 45 S1065 61 1125 61"/><path d="M75 47 C130 47 165 65 225 65 S315 45 375 45 S465 32 525 32 S615 50 675 50 S765 66 825 66 S915 45 975 45 S1065 61 1125 61"/></svg>' + route + '</div>' +
        '<div class="cx-route-legend" aria-label="Stage marker legend"><span><i class="cx-legend-next"></i> Next encounter</span><span>' + icon('crown') + ' Boss</span><span>' + icon('story') + ' Story</span><span>' + icon('lock') + ' Locked</span></div>' +
      '</section>' +
      '<div class="cx-company"><div class="cx-ground" aria-hidden="true"></div>' + ctx.party('full') + '<span class="cx-company-label">DAWNWARD COMPANY <i>·</i> FIVE HEROES</span></div>' +
      '<footer class="cx-dock"><div class="cx-stage-crest' + (isBoss(selected) ? ' boss' : '') + '" aria-hidden="true">' + icon(locked ? 'lock' : isBoss(selected) ? 'crown' : isStory(selected) ? 'story' : 'sword') + '</div>' +
        '<div class="cx-selected-copy"><span class="cx-selected-state">' + h(stateLabel(selected)) + ' <i>·</i> ' + h(selectedKind) + '</span><h3><span>' + h(selected.code) + '</span> ' + h(selected.title) + '</h3><p>' + h(selected.waves) + ' waves <i>·</i> Rec. power ' + h(Number(selected.power).toLocaleString('en-US')) + '</p></div>' +
        '<div class="cx-dock-actions"><button class="cx-mission-button" data-action="brief">' + icon('story') + '<span>Mission details</span></button><button class="cx-deploy" data-action="deploy"' + (locked ? ' disabled' : '') + '><span>' + (locked ? icon('lock') + ' Stage locked' : 'Prepare party ' + icon('arrow')) + '</span><small>' + icon('energy') + h(selected.cost) + ' stamina</small></button></div></footer>' +
      '<div class="cx-chapter-progress"><span>CHAPTER PROGRESS</span>' + ctx.progress() + '<span>Formation is set before entering battle.</span></div>' +
    '</div>';
  };
}());
