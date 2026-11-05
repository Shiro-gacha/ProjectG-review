/* Shared, browser-local color studies. Layout and game state stay independent. */
(function () {
  'use strict';
  const KEY = 'projectg-review-palette-20261105-v1';
  const palettes = [
    {id:'regalia', name:'Asterra Regalia', note:'Ivory · teal · soft gold', colors:['#f7f2e7','#e9dfca','#237d79','#233b43','#a27c3c'], dark:false},
    {id:'sapphire', name:'Midnight Sapphire', note:'Navy · ice blue · silver', colors:['#0b1423','#15243a','#99c8f2','#eef4ff','#bdcfdf'], dark:true},
    {id:'amethyst', name:'Moonlit Amethyst', note:'Deep plum · lilac · pearl', colors:['#17121f','#272034','#cfb0f1','#f5effc','#c6b5da'], dark:true},
    {id:'crimson', name:'Crimson Court', note:'Warm ivory · burgundy', colors:['#fbf4ea','#eee0d6','#812e47','#442c33','#a88464'], dark:false},
    {id:'verdant', name:'Verdant Sanctuary', note:'Sage · forest · parchment', colors:['#f5f6ea','#e3e9d6','#376951','#263f35','#8c8055'], dark:false},
    {id:'rose', name:'Rose Quartz', note:'Blush · dusty rose · cream', colors:['#fff5f1','#f1dfdf','#97556c','#513744','#a57d69'], dark:false}
  ];
  const find = id => palettes.find(p => p.id === id);
  let selected = 'regalia';
  function render() {
    document.querySelectorAll('[data-palette-controls]').forEach(mount => {
      const target = mount.dataset.paletteTarget === 'interface-preview' ? 'interface-preview' : 'campaign-screen';
      mount.innerHTML = '<div class="palette-heading"><div><span>COLOR STUDIES</span><h2>Choose a color scheme</h2></div><p>Same layout and artwork. Share the URL to compare on your phone.</p></div><div class="palette-options" role="group" aria-label="Color scheme">' + palettes.map(p => '<button type="button" class="palette-option" data-palette="'+p.id+'" aria-pressed="'+(p.id===selected)+'"><span class="palette-swatches" aria-hidden="true">'+p.colors.map(color=>'<i style="background:'+color+'"></i>').join('')+'</span><strong>'+p.name+'</strong><small>'+p.note+'</small></button>').join('')+'</div><div class="palette-footer"><p class="palette-caption" role="status">'+find(selected).name+' · color proposal for review</p><a href="#'+target+'">View preview ↓</a></div>';
    });
  }
  function apply(id, options = {}) {
    const p = find(id);
    if (!p) return false;
    selected = id;
    document.documentElement.dataset.reviewPalette = id;
    document.documentElement.dataset.paletteTone = p.dark ? 'dark' : 'light';
    if (options.persist !== false) {
      try { localStorage.setItem(KEY, id); } catch (_) { /* URL remains shareable. */ }
    }
    if (options.url !== false) {
      const url = new URL(location.href);
      url.searchParams.set('palette', id);
      history.replaceState(history.state, '', url);
    }
    render();
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href.startsWith('#') || href.startsWith('?')) return;
      const url = new URL(href, location.href);
      if (url.origin===location.origin && /\/(campaign-designs|interfaces)\.html$/.test(url.pathname)) {
        url.searchParams.set('palette', id);
        a.setAttribute('href', url.pathname.split('/').pop()+url.search+url.hash);
      }
    });
    document.dispatchEvent(new CustomEvent('projectg-palette-change', {detail:{id, name:p.name}}));
    return true;
  }
  function start() {
    let saved;
    try { saved = localStorage.getItem(KEY); } catch (_) { /* Use the default. */ }
    const requested = new URL(location.href).searchParams.get('palette');
    apply(find(requested) ? requested : find(saved) ? saved : 'regalia', {persist:false});
    document.addEventListener('click', event => {
      const button = event.target.closest('button[data-palette]');
      if (!button) return;
      const id = button.dataset.palette;
      apply(id);
      document.querySelector('[data-palette="'+id+'"]')?.focus({preventScroll:true});
    });
    window.addEventListener('popstate', () => {
      const id = new URL(location.href).searchParams.get('palette');
      apply(find(id) ? id : 'regalia', {persist:false, url:false});
    });
  }
  window.ProjectGPalettes = {get:()=>selected, set:apply, valid:id=>!!find(id), list:()=>palettes.map(p=>({...p,colors:p.colors.slice()}))};
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
}());
