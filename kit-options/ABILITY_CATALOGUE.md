# ProjectG ability and synergy notebook

109 mechanic/keyword/history records, 53 connections, 425 named abilities across 29 runtime and 11 proposed units.

Existing runtime, proposed-kit interactions and future ideas are separate. Similar names never establish compatibility. See ability-catalogue.json for the complete searchable ability index.

## Connections

### Burn → Lantern Without End

**Existing runtime**. Cerys or Soryn Caldris can supply Burn for Veyra Wick to copy, refresh or extend. Those Wick actions trigger her gauge/charge passive; an ally's initial application does not directly charge Wick.

### Burn → Wyrmheart Resonance

**Existing runtime**. Cerys strengthens only Burn applications made through her applicable skill path, rather than amplifying every allied Burn.

### Burn → Aerie Supremacy

**Existing runtime**. Soryn Caldris strengthens her own Burn applications by 10%; this does not globally amplify an existing allied Burn.

### Shadowfire → Duskbound Coil

**Existing runtime**. Veyra Dusk strengthens her own Shadowfire applications. Wick's Burn system remains separate.

### Shadowfire → Burn

**Future idea**. Future idea: let selected Burn consumers recognize Shadowfire, or give both a shared Burning tag. Current consumers check burn only; this requires a deliberate design and code change.

### Poison → Toxin

**Future idea**. Future idea: let an explicitly selected venom skill benefit from either Poison or Toxin. Today Nerisse's Toxin spreading and consumption do not consume Aveline's Poison.

### Poison → Quarantine Doctrine

**Existing runtime**. Aveline gets gauge only when her application reaches a not-yet-Poisoned target. Another source pre-Poisoning that target would prevent that particular bonus.

### Poison → Poison

**Existing runtime**. Bitter Eden reads pre-existing Poison for 25% more direct damage, without checking the source. Toxin does not qualify.

### Toxin → Corroded

**Existing runtime**. Measured in Threes Corrodes a target that already had Toxin; the Ultimate also Corrodes survivors when consuming 3 pre-cast stacks. The phrase already poisoned in content text means Toxin here, not Poison.

### Corroded → Conductive

**Existing runtime**. Nerisse's Resistance penalty helps Zahra land Conductive. Corroded also amplifies Zahra's ordinary hits and separate concept lightning arcs by 15%; the statuses remain separate.

### Weakened → Dreamfed Covenant

**Existing runtime**. Caelia's Noonwall Weakened enables Veloura's 14% damage bonus. The consumer does not require Veloura to own the debuff.

### Chill → Rimebound Oath

**Existing runtime**. Any Chill enables Yselle's 16% damage bonus. Winterstep adds its own 28% shatter bonus, then consumes Chill. These content files currently provide no other hero who applies Chill.

### Exposed → Closed Case

**Existing runtime**. Sevrin/Rhea Pierce and Party Break can set up Nemea's 16% bonus. No-Witness Step gains another 25% and consumes Exposed, removing its shared vulnerability for later allies.

### Break / Broken → Exposed

**Existing runtime**. A friendly break adds 28 Party Burst and attempts Exposed on each other living enemy, supporting damage beyond the broken boss.

### Calcified → Petrify / Petrified

**Existing runtime**. Calcified raises Thessa's Petrify chance and her Accuracy. Successful Petrify consumes it; resistance leaves it intact.

### Petrify / Petrified → Quarried

**Existing runtime**. Successful Petrify on an unbroken boss substitutes 35 gauge loss and Quarried. A currently Broken boss no longer passes that unbroken-boss check.

### Calcified → Conductive

**Existing runtime**. Calcified lowers Resistance by 10, helping Zahra apply Conductive and helping other checked hostile statuses. It does not add Conductive stacks by itself.

### Clearwater → Diluted

**Existing runtime**. Both protect against checked debuffs: Clearwater raises allied Resistance, Diluted lowers hostile Accuracy. The two meet in the same application-chance formula.

### Hartbound → Spirit Arrow

**Existing runtime**. Hartbound must be present before Maelis's action to earn the arrow; applying it that same action does not immediately fire one. Her Ultimate raises arrow power and can extend the buff.

### Covering Line → Temper

**Existing runtime**. An intercepted hit adds Temper and triggers Adela's counter afterward. The hit only benefits from stacks already present before the new one is granted.

### Temper → Screened

**Existing runtime**. Thermal Screen spends Temper for 10% plus 3% reduction per stack, capped at 19%. Furnace Standard instead sets Temper to 3 and separately grants 18% Screened.

### Screened → Frostplate

**Existing runtime**. Adela's Screened and Sivra's consumed Frostplate can reduce the same direct hit multiplicatively. Frostplate is a charge rather than Shield; its consumption reactions can still occur.

### Frostplate → White Strait Vigil

**Existing runtime**. Consumed allied Frostplate heals living Sivra for 1.5% Max HP once per affected ally for that action. The reaction finds Sivra without checking the plate's source owner.

### Frostplate → Breakwater

**Existing runtime**. With Breakwater active, allied Frostplate consumption triggers Sivra's counterwave once per enemy action, even if several allies lose plates.

### Frostplate → Chill

**Future idea**. Future idea: a selected frost skill could apply Chill when Frostplate is consumed. They are unrelated today, so Sivra does not automatically feed Yselle's shatter loop.

### Barrier / Shield → The Gate Stays Open

**Existing runtime**. Any teammate's Shield can maintain Caelia's 15 Resistance condition because it checks her Shield value, not its source. DoT ticks still bypass the shield.

### Cleanse → Nothing Worth Saving Is Lost

**Existing runtime**. Maelin's dedicated cleanse-heal skills give her bonus heal and charge. A heal/cleanse from another hero does not invoke that bonus.

### Nothing Worth Saving Is Lost → Barrier / Shield

**Existing runtime**. Stillwater's barrier equals 8% of each recipient's Max HP plus 4% per debuff removed, capped at 20%. More cleanse work directly raises its prevention.

### Verdant Chorus → Spirit Arrow

**Existing runtime**. Jianne's Chorus improves Maelis's ordinary attacks and effective Speed, but the Spirit Arrow helper does not read Chorus's damage bonus. Do not grant the arrow the same bonus in catalogue calculations.

### Verdant Chorus → Conductive

**Existing runtime**. Chorus improves Zahra's ordinary hits and turn frequency. Her separate lightning arcs do not read its damage bonus, though Corroded explicitly amplifies them.

### Life Engine → Blue Renewal

**Existing runtime**. Iori's 10% Healing Received boost raises Luna's turn-start Max-HP heal, which explicitly reads that stat.

### Living Refrain → Cleanse

**Existing runtime**. Jianne's Healing Received boost improves ordinary healing. Her own heals also cleanse through the standard resolver, but the boost does not increase debuffs removed.

### Nova Relay → Ultimate Charge

**Existing runtime**. Astra grants 12 starting charge and gauge to every ally, bringing Ultimate setups forward without a repeating engine.

### Ink Bloom → Party Burst

**Existing runtime**. Tamsin's 18 opening Party Burst combines with normal hit/break gains. A later friendly non-Basic action spends the shared meter at 100.

### Panic Tax → Conductive

**Existing runtime**. Rhea's starting Resistance reduction helps Zahra's checked Conductive applications and other checked debuffs. Its Speed reduction is a direct stat change rather than a slow status.

### Type Domain → Party Burst

**Existing runtime**. A hero Ultimate deploys its Domain and adds 24 Party Burst before ActionScale checks the meter, so it can fill and spend the meter in the same action.

### Root → Break / Broken

**Existing runtime**. Unbroken bosses receive Root's 30-gauge fallback. A Broken boss no longer passes that test, allowing normal Root if the application succeeds.

### Corroded → Covering Line

**Existing runtime**. Nerisse's Corroded amplifies Adela's counter because the concept-reaction helper explicitly reads corroded, without requiring ownership.

### Shadowfire → Lantern Without End

**Future idea**. Future idea: let a Wick skill convert or copy Shadowfire as Burn to create a deliberate Dusk–Wick pairing. Current Borrow the Wick cannot copy Shadowfire, and its refresh cannot extend it.

### Shields → Roselle Vey · After the Bubble Breaks (D)

**Proposed kits**. Roselle's shield-break healing accepts temporary HP shields from any hero. Enemy damage must break them; expiry and voluntary consumption do not count. Frostplate charges are not automatically HP shields.

### Shields → Isavelle Frostmere · First Layer of Ice (B)

**Proposed kits**. Isavelle's straightforward guardian passive protects allies with any hero's shield. Roselle or the court supports can provide those shields.

### Speed down → Liora Fernveil · Briar Openings (B)

**Proposed kits**. Liora reads Speed down from any source. Isavelle, Orivelle or Miravelle can supply it; no private mark is required.

### Speed down → Nyssara Silksong · Listening Threads (A)

**Proposed kits**. Nyssara's straightforward control passive reads ordinary Speed down from allies as well as herself.

### Healing reduction → Seressa Valemire · No Exceptions (D)

**Proposed kits**. Seressa's damage bonus reads any healing-reduction debuff. Nerielle's brackish kit can set it up.

### Healing reduction → Nerielle Wavecrest · Salt Remembers (E)

**Proposed kits**. Nerielle also reads any healing reduction, so Seressa's anti-heal attacks can set up her bonus.

### Burn → Valdra Rosethorn · Heat Behind the Steel (E)

**Proposed kits**. Valdra's passive accepts any ordinary Burn or her own Rosebrand. Her Ultimate still consumes only her own Rosebrand, never an ally's Burn.

### Boss break → Soryn Veilglass · A Crack in the Veil (D)

**Proposed kits**. Soryn's follow-up can be enabled by any ally newly breaking a surviving enemy. It keeps its once-per-Soryn-turn limit.

### Basic attacks → Seressa Valemire · Witness for the Crown (E)

**Proposed kits**. Seressa rewards another ally using a Basic. Basic-focused resource generators can benefit from this team style, but her follow-up does not generate their private resources.

### Ultimates → Soryn Veilglass · Steady the Lanterns (E)

**Proposed kits**. Soryn heals another ally after that ally uses an Ultimate. Ordinary charge supports can enable the cadence; the triggered heal grants no new charge.

### Venomweave → Poison

**Future idea**. Possible future link: let Poison-family bonuses recognize Venomweave while keeping Nyssara's stack ownership and consumption private. Today ordinary Poison cannot fuel her Venomweave spenders.

### Rosebrand → Burn

**Future idea**. Possible future link: explicitly tag Rosebrand as a Burn subtype for readers such as Veyra Wick. Do not assume her Burn copy/refresh currently accepts Rosebrand, or allow her to spend Valdra's owned brand.

### Shields → Roselle Vey · After the Bubble Breaks (Your assembled kit)

**Proposed kits**. Roselle's assembled kit heals when enemy damage breaks any hero's HP shield on an ally. It shares two triggers during each unit's turn; voluntary Ultimate consumption never triggers it.

### Shields → Roselle Vey · Crown in a Thousand Drops (Your assembled kit)

**Proposed kits**. Allied HP shields on Roselle can fuel her assembled Ultimate: spend once, convert 50%, cap the bonus at 35% Roselle Max HP per enemy. Reaching it needs 70% Max HP of current shielding. Separate named source layers are a proposed implementation; current runtime ordinary barriers use one maximum Shield value. Allies retain shields on themselves.

## Mechanics and history

### Burn · Shared keyword

Ordinary Burn is a shared damage-over-time keyword. Shadowfire and owned Rosebrand do not automatically count as ordinary Burn.



### Poison · Shared keyword

Ordinary Poison is separate from Toxin and Nyssara's private Venomweave stacks.



### Shields · Shared keyword

Temporary HP shields can connect straightforward protection kits. Named guard charges such as Frostplate are not automatically HP shields.



### Shield breaking · Shared keyword

Enemy damage breaking a shield can trigger recovery. Expiry, dispel and voluntary consumption are separate events.



### Healing · Shared keyword

Direct healing, regeneration and life drain may have different trigger rules. Check which source and healing type an ability reads.



### Overheal · Shared keyword

Healing beyond missing HP can reward a kit, without adding a new shared resource to every healer.



### Cleansing · Shared keyword

Removing debuffs can support cleanse-triggered recovery. Own-caster and any-source triggers are different.



### Buff removal · Shared keyword

Removing enemy buffs can enable anti-buff passives. Encounter-locked buffs are not assumed removable.



### Speed down · Shared keyword

Ordinary Speed down can set up several heroes without requiring a private mark. Similar movement debuffs are not automatic aliases.



### Healing reduction · Shared keyword

Anti-healing debuffs can supply another hero's damage condition. Use the strongest generic reduction, rather than adding copies.



### Boss break · Shared keyword

Shared offensive Break is Basic 0 / Active 1 / Ultimate 2, plus 1 for elemental advantage, once per target per action. Boss capacities scale around 20–40+ by content. Reactions and pure support add none. A target with no gauge is not already Broken.



### Basic attacks · Shared keyword

Basic-focused heroes can receive team support while still generating only their own explicitly defined resources.



### Ultimates · Shared keyword

Ultimate-use triggers and charge gifts can create a team cadence. Triggered effects do not automatically refund charge.



### Critical hits · Shared keyword

Crit buffs, reductions and conditional bonuses may interact; strongest generic buff rules still apply.



### Regeneration · Shared keyword

Recurring healing is not a direct heal for every passive. Keep its trigger identity explicit.



### Buffs · Shared keyword

Straightforward team buffs and enemy-buff conditions can form useful teams without new stack systems.



### Burn · Existing runtime

A nonstacking damage-over-time status. It ticks directly against HP on its bearer's turn, bypassing shields. Consumers check the burn key regardless of the source. Shadowfire does not qualify; refreshes keep higher power and duration.



### Shadowfire · Existing runtime

Veyra Dusk's separate damage-over-time status, usually 2 turns or 3 from her Ultimate. It can coexist with Burn, with separate power. It ticks directly against HP but does not activate code that specifically checks Burn.



### Chill · Existing runtime

Reduces effective Speed by its stored power, currently 22% from Yselle. Her Winterstep Requiem gains 28% damage against Chill and consumes it. Rimebound Oath also benefits before consumption; Chill is distinct from Frostplate.



### Exposed · Existing runtime

Targets take 12% more ordinary direct damage. Mark and Pierce apply it; a friendly boss break can expose other enemies. Nemea benefits from any source, and No-Witness Step consumes it for another 25% damage.



### Weakened · Existing runtime

Reduces outgoing ordinary direct damage by 18% from Veloura or 15% from Caelia. Dreamfed Covenant benefits from any Weakened target. Legacy effects named charm and charm_aoe apply this debuff; they do not redirect attacks or deny actions.



### Tethered · Existing runtime

Veyra Dusk lowers effective Speed by 22% for 2 turns with Tethering Coil, or 18% for 3 turns with Nightfall Scourge. This is a slow, not an action-denying bind.



### Poison · Existing runtime

Aveline's one nonstacking Poison stores power equal to 18% of her ATK and ticks directly against HP. Bitter Eden deals 25% more direct damage to a target already carrying Poison. The separate Toxin status does not satisfy that check.



### Toxin · Existing runtime

Nerisse's separate damage-over-time status caps at 3 stacks, with stored power based on 8% of her ATK per stack. Skills add and spread it; her Ultimate consumes pre-cast stacks for extra damage, then applies a fresh stack. Poison does not count.



### Corroded · Existing runtime

Targets take 15% more ordinary direct and concept-reaction damage and lose 10 Effect Resistance. Nerisse applies it to pre-Toxined targets with Measured in Threes, or to survivors when her Ultimate consumes 3 pre-cast stacks.



### Calcified · Existing runtime

Thessa's 2-turn setup debuff lowers Speed by 8% and Effect Resistance by 10. She gains 20 Effect Accuracy against Calcified targets; her Petrify skills use higher base chances. Successful Petrify removes Calcified; resistance leaves it intact.



### Petrify / Petrified · Existing runtime

Ordinary targets lose their next action and have 25% incoming direct-damage reduction while Petrified. An unbroken boss instead loses 35 action gauge and gains Quarried for 2 turns. Successful application consumes Calcified.



### Quarried · Existing runtime

The current unbroken-boss substitute for Petrify lowers Speed by 15% for 2 turns after 35 action-gauge loss. It is distinct from Calcified and does not inherit its Resistance penalty.



### Root · Existing runtime

Aveline's Root skips the next action of an ordinary target. An unbroken boss instead loses 30 action gauge. These are current runtime rules; the new review proposals retain their own explicitly written boss substitutes.



### Provoke / Provoked · Existing runtime

Caelia applies 2-turn source-linked Provoke. Default target selection resolves the living opposing source; area skills still strike their normal group. This is not Charm and does not force use of Basic.



### Clearwater · Existing runtime

Maelin grants 25 Effect Resistance for 2 turns with Pearl-Rinse, or 30 with Stillwater Absolution. This improves resistance to checked debuffs rather than granting guaranteed immunity.



### Diluted · Existing runtime

Maelin's 2-turn debuff lowers the affected actor's Effect Accuracy by 12. It changes checked hostile-status reliability, not attack damage or Hit Rate.



### Hartbound · Existing runtime

Maelis gains a 3-turn self buff that gives 12 Crit chance and enables later Spirit Arrows. Her Ultimate can extend it by 2 turns, capped at 4; natural expiry gives 12 action gauge while Wayhart's Instinct is present.



### Spirit Arrow · Existing runtime

If Maelis had Hartbound before her action, she follows up against its surviving primary target: power 42 normally, 90 after her Ultimate, increased 15% against a boss. This separate reaction does not use normal hit, crit, charge or break processing.



### Temper · Existing runtime

Adela's resource caps at 3 stacks, each reducing incoming direct damage by 4%. She starts at 1 and gains it when each ally first falls below half HP and after intercepting a hit. Thermal Screen consumes stacks to strengthen team protection.



### Covering Line · Existing runtime

Adela's 2-turn stance intercepts an enemy's eligible single-target attack aimed at another hero, once per enemy action. The intercepted hit deals 28% less damage; she gains Temper and counters the living attacker with power 60. Redirect is specifically coded for allied Adela.



### Screened · Existing runtime

Adela's 2-turn team direct-damage reduction. Thermal Screen consumes Temper for 10% plus 3% per stack, capped at 19%; her Ultimate supplies 18%. Separate reduction systems multiply, subject to the combat damage floor.



### Conductive · Existing runtime

Zahra builds up to 3 stacks for 3 turns. They improve her Crit chance and lightning skills. Forked Decree uses pre-cast stacks for extra targets; Golden Deluge consumes total pre-cast stacks for capped arcs. Conductive does no tick damage itself.



### Frostplate · Existing runtime

Protective charges cap at 3 per ally. The first direct hostile hit of an action against that ally consumes one to reduce that hit by 16%. Consumption can heal living Sivra and trigger Breakwater. This is separate from Chill and from the Shield value.



### Breakwater · Existing runtime

Sivra's 2-turn Ultimate stance. When an enemy action consumes an allied Frostplate, she counterwaves all living enemies with power 42, once per enemy action. The trigger finds a living Sivra with the stance, without requiring her to own the original plate.



### Verdant Chorus · Existing runtime

Jianne grants 3-turn ordinary direct-damage and effective-Speed buffs: 14% with First Chord, 16% with Canopy Chorus, 18% with Sevenfold Spring. Stored DoT ticks and concept-reaction damage do not read this buff. Same-key refresh keeps stronger power and duration.



### Barrier / Shield · Existing runtime

The shared Shield value absorbs ordinary direct and concept-reaction damage before HP. Runtime shields have no duration; granting methods either keep the stronger value or add an amount. DoT ticks bypass shields. The review proposals separately define their 2-turn shield rules.



### Cleanse · Existing runtime

Ordinary action healing removes all harmful statuses except Broken. Maelin's dedicated skills instead have explicit limits: two on one ally, one on each ally, or all on each ally. Her limited cleanses prioritize control before damage-over-time statuses.



### Break / Broken · Existing runtime

Successful offensive Basics deal 0 Break, Actives 1 and Ultimates 2; elemental advantage adds 1, once per target per chosen action. Multi-hit components, reactions, DoTs and pure support add none. Boss capacities scale by content: normal Campaign 20–40, Hard 28–48, Tower 24–48, Event 32, Raid 48, Labyrinth 20–56 by depth/difficulty. At zero, 2-turn Broken increases ordinary direct damage by 28%; friendly breaks add 28 Party Burst and may Expose other enemies. Gauge refills on expiry.



### Party Burst · Existing runtime

A shared meter caps at 100. Friendly hits, misses, breaks and Ultimates build it; the next friendly non-Basic action at full meter consumes it for 32% more action scale, affecting supported damage or healing. Ink Bloom adds 18 at battle start.



### Type Domain · Existing runtime

Every Ultimate sets the active Domain to its skill type for 5 global acting-unit turns from a hero, or 3 from an enemy. Matching skills gain 10% action scale for heroes or 5% for enemies. Another Ultimate replaces the Domain.



### Ultimate Charge · Existing runtime

Ultimates require and spend 100 charge. Basics give 18, Actives 26, once per action; direct damage taken or shield absorption can add charge. Specific passives and Maelin's cleanse skills add bonuses. Charge caps at 100.



### Action Gauge · Existing runtime

A persistent Speed-based scheduler builds the action queue from gauge. Opening passives and specific triggers add it; Root and Petrify boss substitutes remove it. A gauge change is not a separate immediate extra-turn API.



### Drain · Existing runtime

Veloura's Dreamdrinker restores a fixed 18% of her own Max HP after attacking if she remains alive. Current runtime drain is not a fraction of damage dealt and does not require Weakened.



### Guard / Brace · Existing runtime

The generic Vanguard Guard attack deals reduced damage, heals using half the caster's DEF, and adds a DEF-sized Shield up to half the caster's Max HP. It is self-protection rather than an allied intercept or formal counter stance.



### Revive Heal · Existing runtime

The original Support Ultimate revives one fallen ally at 25% Max HP, then heals living allies and cleanses harmful statuses except Broken. This older-roster behavior does not grant resurrection to the new review proposals.



### DEF Pierce · Existing runtime

Generic Pierce lowers the DEF contribution and can apply Exposed. Maelis's Thread the Briar uses a multiplier equivalent to ignoring 35% of the ordinary DEF contribution. This is not an ongoing team DEF-down debuff.



### Low-HP Execute Bonus · Existing runtime

Nemea's Violet Null deals 45% more damage if the target is at or below 50% HP before damage. It does not instantly kill or bypass shields; the name does not imply an execution threshold.



### Lantern Without End · Existing runtime

Veyra Wick gains 4 action gauge and 2 Ultimate charge when she applies, copies, extends or refreshes Burn, once per target per action. Her skills can read another hero's Burn. Shadowfire is not accepted.



### Aerie Supremacy · Existing runtime

Soryn Caldris gains 4% direct damage per extra living enemy beyond the first, up to 16%. Her own Burn applications gain 10% tick power. This runtime dragon heroine is distinct from the accepted fox candidate Soryn Veilglass.



### Wyrmheart Resonance · Existing runtime

Cerys gains 10% ATK at battle start. Her normal Burn skill applications gain 20% power and 1 extra turn. This strengthens her applications rather than globally multiplying an ally's existing Burn.



### Duskbound Coil · Existing runtime

Veyra Dusk gains 8% Speed at battle start and her Shadowfire applications gain 20% power. It neither strengthens Veyra Wick's Burn nor enables Burn-only consumers.



### Dreamfed Covenant · Existing runtime

Veloura gains 14 Effect Accuracy and deals 14% more ordinary direct damage to any Weakened enemy. The consumer checks the status key, so Caelia's Weakened enables it too.



### Rimebound Oath · Existing runtime

Yselle gains 10 Crit chance and deals 16% more ordinary direct damage to any Chilled target. This works alongside her 28% Winterstep shatter bonus before that skill consumes Chill.



### Closed Case · Existing runtime

Nemea starts with 16 extra action gauge and deals 16% more ordinary direct damage to any Exposed enemy. Other heroes' Pierce or Party Break can provide setup; her No-Witness Step consumes it.



### Quarantine Doctrine · Existing runtime

Aveline gains 18 Effect Accuracy. Successfully applying Poison to a not-yet-Poisoned enemy gives 5 action gauge, once per target per action. Refreshing existing Poison does not give the new-Poison bonus.



### Weight Before Silence · Existing runtime

Thessa gains 20 Effect Accuracy against Calcified enemies. A resisted Calcified or Petrify application gives her 8 action gauge, once per target per action; success does not give that refund.



### Nothing Worth Saving Is Lost · Existing runtime

Maelin's dedicated heal resolver gives a cleansed ally an extra 3% Max HP heal and Maelin 3 Ultimate charge, once per ally actually cleansed per action. Another hero's heal/cleanse does not call her bonus resolver.



### Storm Seeks Ground · Existing runtime

Zahra gains 10 Crit chance against Conductive enemies. Applying Conductive gives 2 action gauge once per target per action, capped at 10 over up to five targets. Her application gives gauge; the target's status enables Crit chance.



### White Strait Vigil · Existing runtime

Sivra gives every ally a Frostplate at battle start. When the first direct hit of an enemy action consumes an ally's plate, living Sivra heals for 1.5% of her Max HP, once per affected ally for that action.



### The Gate Stays Open · Existing runtime

Caelia grants all allies a starting Shield worth 6% of her Max HP. Having any Shield gives Caelia 15 Effect Resistance; the runtime condition accepts shields from teammates too.



### Life Engine · Existing runtime

At battle start, Iori increases every ally's DEF and Healing Received by 10%. These are direct battle-start stat changes rather than temporary cleanseable status entries.



### Living Refrain · Existing runtime

Jianne increases every ally's Speed and Healing Received by 8% at battle start. Her separate Verdant Chorus can add temporary direct-damage and effective-Speed support.



### Nova Relay · Existing runtime

Astra gives all allies 12 Ultimate charge and 12 action gauge at battle start, respecting their caps. This is opening support rather than a repeatable meter engine.



### Ink Bloom · Existing runtime

Tamsin starts battle with 18 Party Burst and gives all allies 8 Effect Accuracy. This helps checked debuffs but does not automatically apply a status.



### Panic Tax · Existing runtime

Rhea reduces each starting enemy's Speed by 12% and Effect Resistance by 15. These are direct stat changes, not named slow statuses that activate status-key consumers.



### Wide Fuse · Existing runtime

Dax deals 14% more damage with Actives and his Ultimate. Basics do not receive the bonus; there are no stacks or team triggers.



### Blue Renewal · Existing runtime

At Luna's turn start, heal the lowest-HP living ally for 6% of its Max HP, modified by Healing Received. It does not call the action-heal resolver, so this Passive heal does not cleanse.



### Molten Stand · Existing runtime

Brann starts with an 18% Max HP shield and 18 Effect Resistance. It gives opening durability without a repeated shield-break trigger or counter.



### Shatter Cover · Existing runtime

Kael starts with 16% more DEF and a shield equal to 12% of his Max HP. Despite the name, the passive does not consume Chill or trigger a shatter attack.



### Blackout · Existing runtime

Mika gains 14 Crit chance, 14 Crit Damage and 10 action gauge at battle start. There is no stealth or darkness status in this passive.



### Dawn Pierce · Existing runtime

Nyx gains 15 Crit chance and 25 Crit Damage at battle start. The passive itself does not apply Exposed or grant the generic Pierce skill effect.



### Battle Instinct · Existing runtime

The reusable fallback passive grants 8% ATK and DEF at battle start. The default named heroes override it with their own named passives.



### Backdraft · Existing runtime

Sevrin gains 12% ATK and 20 Effect Accuracy at battle start. This helps his checked Pierce-to-Exposed application but does not apply Burn despite its fire-themed name.



### Shelter · Existing runtime

Selene gives every ally a starting Shield equal to 10% of the recipient's Max HP. This shares the Shield value with other barriers and supports Caelia's shielded Resistance condition.



### Elasticity · Proposed kits

Roselle alone starts each wave with 1 Elasticity, maximum 4. Reservoir Body grants 1 after an enemy action deals direct HP or shield damage to her, once per enemy action regardless of hits; DoTs and friendly damage do not grant stacks. Cushion Court and Grand Embrace may spend them as specified. Stacks have no turn expiry and clear at wave end. Only Reservoir Body enables this resource; importing spenders does not create it. Auto spends the maximum available up to the skill's stated limit; manual play may spend less where the skill says up to.



### Shield consumption · Proposed kits

Scatter the Facets and Crown in a Thousand Drops may spend only Roselle-applied shields currently on Roselle. Auto spends the maximum stated amount; manual play may decline. Spend oldest shields first up to the listed fraction of Roselle's Max HP. Partial shields keep their expiry. Consuming a shield never counts as enemy damage or shield break, and never triggers a heal, reaction or charge. The base attacks work without a shield. All shield amounts use Roselle's Max HP.



### Focus · Proposed kits

Liora alone starts each wave with 0 Focus, maximum 3. Patient Hunter grants 1 after she resolves a Basic or a skill in Active1, once per action even if no damage lands; triggered actions do not grant it. Needle Horizon spends up to 2 and Thousand-Leaf Line up to 3 before damage. No turn expiry; clear at wave end. Patient Hunter alone enables Focus, including when other Basic or Active1 choices are imported. Auto spends the maximum available up to the skill's stated limit; manual play may spend less where the skill says up to.



### Trailmark · Proposed kits

Enemies begin each wave without Liora's Trailmark. Chart the Quarry and One Road Through attempt one nonstacking mark for 2 target turns, checked once per target per action; refresh duration on reapplication. Ordinary allied direct action attacks against that target gain 10 percentage points of Crit chance for that action, using the strongest generic Crit-chance increase instead of adding it to another such buff. Only that marked target receives the contextual bonus, including during AoE. The mark is removable, clears on target or Liora defeat, expiry or wave end, and has no reaction damage. Surveyor's Eye can add an 8% direct-damage bonus against an already marked enemy, once per acting ally and at most three allied actions total per Liora turn. Its allowances begin available at wave entry and reset at the start of Liora's turns; the mark's Crit bonus works without the passive. This Liora owns at most one marked enemy: a successful new placement replaces her old mark; a resisted placement preserves it. Per-ally and total trigger allowances are shared across mark replacements and never reset by re-marking.



### Broodlets · Proposed kits

Nyssara alone starts each wave with 2 Broodlets, cap 4. Silk Nursery grants 1 at the start of each of her turns, including her first turn of a wave. They are a resource counter, not targetable summons, and never receive independent actions. Carapace Shelter may spend up to 2, Matron's Rebuke 1, and Silken Citadel up to 4; no turn expiry, clear at wave end. Only Silk Nursery enables this resource. Auto spends the maximum available up to the skill's stated limit; manual play may spend less where the skill says up to.



### Venomweave · Proposed kits

Each enemy starts at 0 Nyssara-owned Venomweave stacks, maximum 3. Venom Canticle attempts to add 1 after her ordinary Basic or Active1 deals direct damage, once per affected enemy per action with one Accuracy/Resistance check. A successful addition refreshes all her stacks there to 2 target turns. At the start of each of those turns, every stack deals noncritical Umbra damage equal to 18% of Nyssara's current ATK before normal mitigation. One cleanse removes one oldest stack. Venom Press may consume 1 before damage. Stacks vanish on expiry, defeat or wave end. Only Venom Canticle enables the resource; other sources of Poison do not count.



### Foxfire · Proposed kits

Soryn alone starts each wave with 0 Foxfire, cap 3. Dawnkindled grants 1 after she resolves an ordinary Basic or Active1, once per action, including imported skills in those slots. Threefold Gleam and Dawn's Foxfire spend up to 3 before damage for their stated bonuses. Stacks have no turn expiry and clear at wave end. Only Dawnkindled enables this resource. Auto spends the maximum available up to the skill's stated limit; manual play may spend less where the skill says up to.



### Spirit Oath · Proposed kits

Soryn begins each wave with no Spirit Oath holder. Foxfire Covenant places one Spirit Oath on a living ally for 2 of that ally's subsequent turns. Soryn can own only one oath: a new placement removes the previous one. Its holder gains 15% ATK, using the strongest generic ATK buff rather than adding them. The oath can be dispelled and clears on expiry, holder or Soryn defeat, or wave end. Oathkeeper's Answer can heal after that holder's Basic once per Soryn turn. Lantern Touch may read the holder; neither skill creates an oath. Quiet Procession no longer places one.



### Cinders · Proposed kits

Seressa starts each wave at 0 Cinders, maximum 3. Banked Cinders enables the resource. After a non-Ultimate action of hers successfully applies Burn to at least one enemy, gain 1 Cinder, at most once per action. Cinders have no turn expiry; they clear on her defeat or a wave transition. Furnace Decree may spend 2; Crown of Ash spends all before dealing damage. Spenders never generate Cinders by themselves. Without Banked Cinders, mixed skills have 0 Cinders and keep their base effects.



### Startrace · Proposed kits

Start each wave with no Startrace. Astral Survey enables this owned mark. After Orivelle finishes a hostile Active1 or Active2, mark its living primary enemy; an area action's primary is the enemy with highest current HP at action start. At most 1 enemy can carry her Startrace; a successful new mark removes the previous mark. Application checks Accuracy versus Resistance. It lasts 2 marked-enemy turns, refreshes without stacking, and is dispellable. It clears on Orivelle's defeat, target defeat, or a wave change. Falling Horizon consumes it after damage; other skills only read it. Friendly support Actives do not mark. Without Astral Survey, mixed skills keep their base effects but never create Startrace.



### Thorn Vow · Proposed kits

Start with no Vow. Thornbound Promise enables it and attempts to mark the highest-ATK enemy at wave entry. After Elowyn finishes a hostile Active1 or Active2, it attempts to mark that action's living primary enemy. At most 1 enemy carries her Vow, for 2 marked-enemy turns; one successful new mark replaces the old one. Application checks Accuracy versus Resistance; refreshes do not stack. An area import's primary is highest current HP at action start. It is dispellable and clears on Elowyn's defeat, target defeat, or wave change. Last Rose consumes it after damage. Without Thornbound Promise, Vow never exists; other skills retain base effects.



### Bloom Reserve · Proposed kits

Overflow Kept enables a personal resource, starting at 0 each wave, maximum 3. After one of Elowyn's own non-Ultimate ordinary actions directly heals at least one ally with at least 1% of that recipient's Max HP lost to overheal, gain 1 Bloom, maximum once per whole action. Regeneration, life drain, other triggered heals never qualify. Overheal is measured after healing modifiers but before discarding excess; damage and shields cannot generate Blooms. Blooms have no turn expiry and clear on Elowyn's defeat or a wave transition. Celebrate the Surplus spends 2 at action start if available; Roses in Reserve spends all at action start. Spent Blooms cannot be generated retroactively. Without Overflow Kept, mixed skills have 0 Blooms and keep their base effects.



### Barbed Accord · Proposed kits

A dispellable Miravelle-owned enemy mark, maximum 1. Start each wave with no mark. Sign in Thorns attempts it for 2 target turns; The Devil's Terms attempts it for 3. A successful new application replaces her old mark; a resisted one leaves the old mark intact. After its bearer finishes its own ordinary Active1 or Active2 action while Miravelle is alive, deal 40% of Miravelle's ATK to that living bearer, at most once per bearer turn. Basics, Passives, Ultimates, denied/skipped actions, counters and follow-ups do not trigger it. Damage cannot crit, grant charge, inflict break or trigger any reactions. If either owner or bearer dies before the trigger, no damage occurs. The mark expires at the end of its stated subsequent bearer turns and clears on owner defeat, bearer defeat or wave transition; no independent turns or action delay.



### Facets · Proposed kits

Enabled only by Perfect Fracture. Start at zero, cap four, persist until spent or the wave ends. Gain one after completing a Basic or Active action that dealt direct damage to at least one enemy alive immediately before its hit, including a killing blow, once per action and after all spending. Ultimates, counters, follow-ups and damage over time grant none. Needle Through Stone may spend up to two; Splinterstorm may spend one; Crownfall Fracture spends all. Auto spends the maximum allowed on each selected spender. The resource is personal, cannot transfer and clears between waves or on defeat.



### Icebound Reprisal · Proposed kits

Applied only by Seal of the Quiet Lake or The Long Cold Answer after their direct damage, through one normal hostile accuracy/resistance check on a living enemy. Start with no mark. This Isavelle owns at most one marked enemy; a successful new mark replaces the old one, while a resisted application leaves the old mark. Cap one per enemy from this Isavelle; duration two marked-target turns, refreshed by reapplication. When the marked enemy's next direct hostile action deals positive damage to any allied HP or shield, including a killing blow, consume the mark after the whole action and retaliate once at that enemy for 60% of Isavelle's ATK snapshotted on mark application. Both Isavelle and the attacker must still be alive after that action; otherwise the mark clears without retaliation. A shield-only hit qualifies; misses, fully prevented damage, damage over time and reactions do not. Retaliation cannot crit, grant charge or trigger any reaction. A mark that expires unused deals no damage. It clears on either unit's defeat or wave transition; duplicate marks never multiply a single Isavelle's trigger.



### Crests · Proposed kits

Enabled only by Reforming Current. Start at zero, cap three. Completing Nerielle's own Basic action grants one Crest once, even if its damage is absorbed; actives, Ultimates and reactions grant none. Persist until spent, defeat or wave end. At the start of each own turn with at least one Crest, heal self for 4% of own Max HP without consuming a Crest; no more than once per own turn. Compressed Torrent and Curling Bastion each spend one if available; Falling Ocean spends all, up to three. Auto spends the maximum allowed on the chosen spender. Personal, nontransferable, reset between waves.



### Waterbound Link · Proposed kits

Applied by Tributary Bond or One Sea Between Us to one other living ally, without a hostile check. Start with no link. Nerielle owns at most one linked ally and cannot link herself; a new link replaces the old, refreshes for two linked-recipient turns, and never stacks with another Waterbound Link. When a direct enemy action would damage that ally's HP after the ally's shields and reductions, transfer 20% of that post-shield HP damage to Nerielle, limited to a total of 8% of Nerielle's Max HP across the entire enemy action, including all hits. Further damage stays on the ally. Transfer cannot be shielded or reduced again and is limited to Nerielle's current HP minus one; any untransferable amount remains with the ally. Thus it never kills Nerielle by itself or makes the ally immune. Transfer is neither an attack nor damage over time and cannot crit, grant charge or trigger any damage reaction or resource gain, except the single bounded end-of-action heal explicitly granted by A Body That Reforms. Shield-only damage creates no transfer. Check each hit while both units live; killing blows may be reduced but any excess can still defeat the linked ally. The link clears on either unit's defeat or wave transition. The cap resets for each direct enemy action, never per hit.



### Rally Point · Proposed kits

Applied by Set the Line or Crimson Standard after their damage through the normal hostile accuracy check. Start with no mark. This Valdra owns at most one marked enemy; a successful new application removes her previous mark, while a failed application leaves it untouched. Duration two marked-target turns, refresh on reapplication, expire on target defeat, Valdra defeat or wave end. Allies' direct action damage to that target is increased by 8% multiplicatively. Only one Rally Point damage bonus may apply across duplicate Valdras. Reactions and damage over time do not benefit. Steady Orders may add a charge reward but is not required for the mark's damage effect.



### Rosebrand · Proposed kits

Applied by Kindling Point, Searing Rose Thrust or Field of Embers after direct damage through one normal hostile accuracy/resistance check per surviving target. Start with no brands. This Valdra can own one Rosebrand per enemy, with no stack count. It burns for its listed 20% or 30% of Valdra's ATK, snapshotted on application, at the START of each of the target's next two turns; expiry is at the END of its second subsequent turn. Reapplication refreshes to two target turns and uses the higher remaining or new tick damage, never adds tick damage or duration; it cannot trigger an immediate tick. These are owned burns: multiple Valdras' Rosebrands on a target use only the strongest tick and do not produce simultaneous stacks, though each caster can consume only her own. Burn cannot crit, grant charge or trigger reactions. Lance Through Ash may consume the whole owned brand before damage to add at most two unticked scheduled ticks, capped at 60% of Valdra's current ATK in total. A tick already dealt is never included. Brand removal, target defeat, Valdra defeat or wave transition clears any remaining ticks without damage; a killing application places no brand.



### Shared shield conversion · Proposed kits

For this proposal, distinct named HP shields on Roselle retain separate source/expiry layers and their remaining amounts form her shield pool. Reapplying the same named shield keeps the larger remaining/new amount; it does not add another layer. Each layer lasts its stated recipient turns. The Ultimate may consume any source's HP shield layers on Roselle only, up to 70% of her Max HP, and converts half into bonus damage per enemy capped at 35% Max HP. Consumption never triggers shield-break healing. Existing runtime uses one non-stacking Shield value; source-layer storage and consumption remain proposed implementation work.



### Erosion · History

An enemy can hold up to 3 Roselle-owned Erosion stacks, initially 0. Velvet Dissolution attempts to add 1 stack after each Roselle action dealing direct damage, once per affected enemy per action, with one Accuracy/Resistance check per enemy. A successful addition refreshes all her stacks on that enemy to at least 2 of its subsequent turns, preserving any longer remaining duration up to 3 turns. At the start of those turns each stack deals noncritical Tide damage equal to 12% of Roselle's current ATK before normal mitigation. Only the owning passive enables stacks. Slimeflow may extend remaining duration to at most 3 turns; Crownless Undertow can consume them. Expiry, cleansing, target defeat or wave end removes them; one cleanse removes one stack, oldest first.

Removed from current kits. Retained as an idea archive, not an active ability.

### Threadbound · History

Each enemy starts with no Nyssara-owned Threadbound mark. Binding Weave and Grand Lattice each attempt to apply 1 nonstacking mark for 2 of the target's subsequent turns, with one Accuracy/Resistance check per target per action. Reapplication refreshes duration; cleansing, defeat, expiry or wave end removes it. The mark alone does not reduce stats or deny actions. Listening Threads reacts after a marked enemy completes an ordinary action, subject to that passive's limits; denied turns, triggered actions and DoT ticks do not qualify. Cut the Supporting Thread can read the mark without that passive.

Removed from current kits. Retained as an idea archive, not an active ability.

### Frayed Contract · History

Enemies start with no Nyssara-owned Frayed Contract. Inkless Bargain attempts one nonstacking mark for 2 target turns, with one Accuracy/Resistance check; reapplication refreshes duration. The mark itself changes no stats. While Contract's Due is selected and Nyssara is alive, it can react after an ordinary enemy action applies or refreshes at least one removable buff on a living marked enemy, including self-buffs. One recipient qualifies only once per action, one reaction per marked recipient and two reactions total between starts of Nyssara's turns; allowances start unused at wave entry and reset at her turn start. Actions triggered by reactions and natural buff ticks do not qualify. Resolve after the enemy action; defeat of the recipient or Nyssara prevents the reaction. A mark clears on cleansing, expiry, either defeat or wave transition.

Removed from current kits. Retained as an idea archive, not an active ability.

### Mirage · History

Each ally can hold one Soryn-owned Mirage, initially none. Trickster's Guard and False Dawn grant it for 2 recipient turns; reapplying refreshes duration without stacking. Mirage reduces all direct damage from the next enemy action that directly damages that ally by 35%, including multi-hit damage within that same action, then is consumed at that action's end. A fully shield-absorbed direct hit still consumes it; DoTs and friendly damage do not. Expiry without a hit grants nothing. Glasslight Reflex may react to damage consumption, but Mirage's reduction works without that passive. Clear at wave end.

Removed from current kits. Retained as an idea archive, not an active ability.

### Roseward · History

Start with no Roseward. Glasshouse Sanctuary gives each living ally 1 owned Roseward for 2 recipient turns; cap 1 per ally, refresh never adds charges. After a hostile debuff would pass its normal Accuracy versus Resistance check, consume Roseward to block that one application. It does not block damage, break, gauge reduction, buff removal, mark consumption, or existing debuffs. Immune or resisted applications do not consume it. If an action applies several debuffs, only the first successful application is blocked; later debuffs can land. Wards clear on recipient defeat, Elowyn's defeat, or wave change. They cannot block unpreventable encounter mechanics.

Removed from current kits. Retained as an idea archive, not an active ability.

### Nectar Seal · History

A dispellable Elowyn-owned enemy mark, maximum 1 marked enemy. No mark at wave entry. Borrowed Nectar or Briar Communion attempts to place it after damage; a successful new application replaces her old mark, while a resisted application leaves the old mark unchanged. Borrowed Nectar lasts 2 target turns; Briar Communion lasts 3. After a living ally finishes its own ordinary damaging action that dealt direct HP damage to the marked enemy, heal that acting ally for 3% of its own Max HP, at most once per recipient between Elowyn's turns; allowances start unused at wave entry and reset at her turn start. Killing the marked enemy still earns this heal for a surviving attacker, then clears the mark. Shield-only hits, damage over time, counters, follow-ups, self-damage and other reactions do not qualify. Healing cannot crit or trigger any reactions. Mark and allowances clear on Elowyn's defeat or wave transition; target defeat also clears the mark. Each action checks the mark immediately before its first direct hit; it cannot earn this heal merely by applying a new Seal after that hit.

Removed from current kits. Retained as an idea archive, not an active ability.

### Rimeward · History

Enabled only by First Layer of Ice. Start with no marks. Whenever an Isavelle action grants a shield, each shield recipient gains one Rimeward mark, at most once per action. A mark reduces the first incoming direct enemy-action damage event by 15% before shield absorption, then is consumed; a multi-hit action consumes it on its first damaging hit only. It cannot reduce damage over time or reaction damage. Cap one per ally, never stack reductions, refresh for two recipient turns, and expire earlier if no shield granted by this Isavelle remains. Marks clear between waves and when Isavelle is defeated.

Removed from current kits. Retained as an idea archive, not an active ability.

### Reservoir · History

Enabled only by Unending Source. Start at zero, cap three, persist until spent, defeat or the wave ends. Gain one after her Basic or Active action restores at least one point of missing HP to any ally, at most once per action after spending. Overheal, regeneration ticks, other units' heals and Ultimates grant none. Springwater Touch spends one for an extra cleanse if available; Wellspring Incarnate spends all, up to three, for shielding. Auto spends the maximum allowed. This personal resource cannot transfer.

Removed from current kits. Retained as an idea archive, not an active ability.

### Retorts · History

Enabled only by Held Ground. Start at zero, cap two, persist until spent, defeat or wave end. The first enemy action to deal positive direct damage to Valdra or a shield on her grants one Retort; maximum one gain from combat start to her first turn and one between each pair of her turns, reset at the start of her turn. Multi-hit, area hits, counters, damage over time and follow-ups cannot grant additional stacks. Answering Point spends up to two; no other skill spends them. Auto spends the maximum available. Personal and nontransferable.

Removed from current kits. Retained as an idea archive, not an active ability.
