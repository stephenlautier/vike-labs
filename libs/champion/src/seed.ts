import type { Champion } from "./champion";
import type { ChampionAbility } from "./champion-ability";
import type { ChampionSkin } from "./champion-skin";
import type { ChampionTier } from "./champion-tier";

// Riot Data Dragon base — patch 14.10 (stable)
const DDR = "https://ddragon.leagueoflegends.com/cdn";
const PATCH = "14.10.1";
const splash = (name: string, num = 0) => `${DDR}/img/champion/splash/${name}_${num}.jpg`;
const square = (name: string) => `${DDR}/${PATCH}/img/champion/${name}.png`;

export const SEED_CHAMPIONS: Champion[] = [
	{
		id: "ahri",
		name: "Ahri",
		roles: ["Mid"],
		difficulty: 5,
		stats: { hp: 526, mp: 418, armor: 21, spellBlock: 30, attackDamage: 53, attackSpeed: 0.668 },
		splashArtUrl: splash("Ahri"),
		squareIconUrl: square("Ahri"),
		lore: "Innately connected to the latent power of Runeterra, Ahri is a vastaya who can reshape magic into orbs of raw energy. She revels in toying with her prey by manipulating their emotions before devouring their life essence.",
	},
	{
		id: "jinx",
		name: "Jinx",
		roles: ["ADC"],
		difficulty: 6,
		stats: { hp: 610, mp: 245, armor: 24, spellBlock: 30, attackDamage: 57, attackSpeed: 0.679 },
		splashArtUrl: splash("Jinx"),
		squareIconUrl: square("Jinx"),
		lore: "A manic and impulsive criminal from Zaun, Jinx lives to wreak havoc without care for the consequences. With an arsenal of deadly weapons, she unleashes the loudest and most colorful chaos imaginable.",
	},
	{
		id: "thresh",
		name: "Thresh",
		roles: ["Support"],
		difficulty: 7,
		stats: { hp: 561, mp: 273, armor: 24, spellBlock: 32, attackDamage: 56, attackSpeed: 0.625 },
		splashArtUrl: splash("Thresh"),
		squareIconUrl: square("Thresh"),
		lore: "An ambitious and sadistic spirit of the Shadow Isles, Thresh hunts the souls of the living to add to his lantern. He enjoys the slow torture of hope before he crushes it entirely.",
	},
	{
		id: "zed",
		name: "Zed",
		roles: ["Mid", "Jungle"],
		difficulty: 8,
		stats: { hp: 584, mp: 200, armor: 32, spellBlock: 32, attackDamage: 63, attackSpeed: 0.651 },
		splashArtUrl: splash("Zed"),
		squareIconUrl: square("Zed"),
		lore: "The master of the Order of Shadow, Zed is a ruthless, calculating warrior-assassin who kills without passion, remorse, or hesitation. Using forbidden shadow techniques, he carved out a place at the head of Noxus's deadliest organization.",
	},
	{
		id: "vi",
		name: "Vi",
		roles: ["Jungle"],
		difficulty: 4,
		stats: { hp: 599, mp: 287, armor: 33, spellBlock: 32, attackDamage: 60, attackSpeed: 0.644 },
		splashArtUrl: splash("Vi"),
		squareIconUrl: square("Vi"),
		lore: "Violet is a former criminal from the mean streets of Zaun who now serves as a Sheriff's deputy in Piltover. Heedless of the past, she charges into every situation fists-first.",
	},
	{
		id: "lux",
		name: "Lux",
		roles: ["Mid", "Support"],
		difficulty: 5,
		stats: { hp: 490, mp: 480, armor: 19, spellBlock: 30, attackDamage: 53, attackSpeed: 0.669 },
		splashArtUrl: splash("Lux"),
		squareIconUrl: square("Lux"),
		lore: "A proud daughter of the prestigious Crownguard family, Luxanna Crownguard wields the power of light against the enemies of Demacia. While her brother is celebrated as a hero, Lux uses her gifts in secret.",
	},
	{
		id: "yasuo",
		name: "Yasuo",
		roles: ["Mid", "Top"],
		difficulty: 9,
		stats: { hp: 523, mp: 0, armor: 30, spellBlock: 32, attackDamage: 60, attackSpeed: 0.697 },
		splashArtUrl: splash("Yasuo"),
		squareIconUrl: square("Yasuo"),
		lore: "An Ionian of deep resolve, Yasuo is an agile swordsman who wields the wind itself as a weapon. Exiled after being falsely accused of murdering his master, he now wanders the world in search of truth.",
	},
	{
		id: "caitlyn",
		name: "Caitlyn",
		roles: ["ADC"],
		difficulty: 6,
		stats: { hp: 534, mp: 338, armor: 23, spellBlock: 30, attackDamage: 62, attackSpeed: 0.681 },
		splashArtUrl: splash("Caitlyn"),
		squareIconUrl: square("Caitlyn"),
		lore: "As the Sheriff of Piltover, Caitlyn is also the city's best shot at ridding herself of the crime that has begun to take root in it. Often paired with Vi, she is always vigilant for those who would disobey the law.",
	},
	{
		id: "leona",
		name: "Leona",
		roles: ["Support"],
		difficulty: 4,
		stats: { hp: 576, mp: 302, armor: 33, spellBlock: 32, attackDamage: 58, attackSpeed: 0.625 },
		splashArtUrl: splash("Leona"),
		squareIconUrl: square("Leona"),
		lore: "Imbued with the fire of the sun, Leona is a holy warrior of the Solari who defends Mount Targon with her shining armor and radiant blade. She can unleash that power in battle, engulfing enemies in searing light.",
	},
	{
		id: "graves",
		name: "Graves",
		roles: ["Jungle", "ADC"],
		difficulty: 6,
		stats: { hp: 568, mp: 322, armor: 35, spellBlock: 32, attackDamage: 68, attackSpeed: 0.625 },
		splashArtUrl: splash("Graves"),
		squareIconUrl: square("Graves"),
		lore: "Malcolm Graves is a renowned mercenary, gambler, and thief — a wanted man in every city and empire he has visited. Even so, he has his own personal code of honor.",
	},
];

export const SEED_ABILITIES: ChampionAbility[] = [
	// Ahri
	{
		id: "ahri-p",
		championId: "ahri",
		slot: "P",
		name: "Essence Theft",
		description:
			"Ahri gains an Essence stack for each enemy she hits with a spell, and restores health when she collects 9 stacks.",
		cooldown: undefined,
	},
	{
		id: "ahri-q",
		championId: "ahri",
		slot: "Q",
		name: "Orb of Deception",
		description:
			"Ahri sends out an orb of eldritch energy that deals magic damage to enemies it passes through and true damage on its return.",
		cooldown: 7,
	},
	{
		id: "ahri-w",
		championId: "ahri",
		slot: "W",
		name: "Fox-Fire",
		description:
			"Ahri conjures three spectral flames that orbit her and burst through nearby enemies, preferring champions.",
		cooldown: 9,
	},
	{
		id: "ahri-e",
		championId: "ahri",
		slot: "E",
		name: "Charm",
		description:
			"Ahri blows a kiss that enchants an enemy, causing them to walk harmlessly toward her while taking magic damage.",
		cooldown: 12,
	},
	{
		id: "ahri-r",
		championId: "ahri",
		slot: "R",
		name: "Spirit Rush",
		description:
			"Ahri dashes forward and fires essence bolts at nearby enemies. Spirit Rush can be cast up to three times within a few seconds before triggering its cooldown.",
		cooldown: 130,
	},

	// Jinx
	{
		id: "jinx-p",
		championId: "jinx",
		slot: "P",
		name: "Get Excited!",
		description: "Jinx receives a speed boost whenever she scores a takedown or destroys a structure.",
		cooldown: undefined,
	},
	{
		id: "jinx-q",
		championId: "jinx",
		slot: "Q",
		name: "Switcheroo!",
		description:
			"Jinx swaps between Pow-Pow, her minigun, and Fishbones, her rocket launcher, to deal bonus AoE damage at the cost of mana.",
		cooldown: 1,
	},
	{
		id: "jinx-w",
		championId: "jinx",
		slot: "W",
		name: "Zap!",
		description: "Jinx fires a shock blast that deals physical damage and slows the first enemy hit.",
		cooldown: 8,
	},
	{
		id: "jinx-e",
		championId: "jinx",
		slot: "E",
		name: "Flame Chompers!",
		description: "Jinx tosses out three chompers that root the first enemy that walks over them.",
		cooldown: 24,
	},
	{
		id: "jinx-r",
		championId: "jinx",
		slot: "R",
		name: "Super Mega Death Rocket!",
		description:
			"Jinx fires a super rocket that gains damage the further it travels. Deals a portion of the target's missing health as bonus damage.",
		cooldown: 90,
	},

	// Thresh
	{
		id: "thresh-p",
		championId: "thresh",
		slot: "P",
		name: "Damnation",
		description:
			"Thresh can harvest the souls of enemies that die near him, permanently granting him Ability Power and Armor.",
		cooldown: undefined,
	},
	{
		id: "thresh-q",
		championId: "thresh",
		slot: "Q",
		name: "Death Sentence",
		description: "Thresh hooks an enemy with his scythe, dragging them toward him and briefly stunning them.",
		cooldown: 20,
	},
	{
		id: "thresh-w",
		championId: "thresh",
		slot: "W",
		name: "Dark Passage",
		description:
			"Thresh throws his lantern to an ally, granting them a shield. An ally can click the lantern to be pulled to Thresh.",
		cooldown: 22,
	},
	{
		id: "thresh-e",
		championId: "thresh",
		slot: "E",
		name: "Flay",
		description: "Thresh sweeps his chain, knocking all nearby enemies in the direction of the chain's arc.",
		cooldown: 9,
	},
	{
		id: "thresh-r",
		championId: "thresh",
		slot: "R",
		name: "The Box",
		description:
			"Thresh creates a prison of spectral walls around himself. Enemies who break the walls are slowed and take magic damage.",
		cooldown: 140,
	},

	// Zed
	{
		id: "zed-p",
		championId: "zed",
		slot: "P",
		name: "Contempt for the Weak",
		description:
			"Zed's basic attacks against targets below 50% health deal bonus magic damage equal to a percentage of their maximum health.",
		cooldown: undefined,
	},
	{
		id: "zed-q",
		championId: "zed",
		slot: "Q",
		name: "Razor Shuriken",
		description: "Zed throws his spinning blades forward, dealing physical damage to the first enemy struck.",
		cooldown: 6,
	},
	{
		id: "zed-w",
		championId: "zed",
		slot: "W",
		name: "Living Shadow",
		description:
			"Passive: Zed gains bonus Energy. Active: Zed's shadow dashes forward and remains stationary. Activating again swaps Zed's position with his shadow.",
		cooldown: 20,
	},
	{
		id: "zed-e",
		championId: "zed",
		slot: "E",
		name: "Shadow Slash",
		description: "Zed and his shadows each slash nearby enemies, dealing physical damage and slowing them.",
		cooldown: 4,
	},
	{
		id: "zed-r",
		championId: "zed",
		slot: "R",
		name: "Death Mark",
		description:
			"Zed becomes untargetable and dashes to target enemy champion. Upon return, a living shadow is created that mimics Zed. A lethal mark explodes for bonus damage.",
		cooldown: 120,
	},

	// Vi
	{
		id: "vi-p",
		championId: "vi",
		slot: "P",
		name: "Blast Shield",
		description: "Vi periodically charges up a shield that triggers when she uses an ability.",
		cooldown: undefined,
	},
	{
		id: "vi-q",
		championId: "vi",
		slot: "Q",
		name: "Vault Breaker",
		description:
			"Vi charges a powerful punch that knocks back all enemies in its path. Charging longer increases the range and damage.",
		cooldown: 12,
	},
	{
		id: "vi-w",
		championId: "vi",
		slot: "W",
		name: "Denting Blows",
		description:
			"Every third hit against the same target deals bonus damage, reduces armor, and grants Vi Attack Speed.",
		cooldown: undefined,
	},
	{
		id: "vi-e",
		championId: "vi",
		slot: "E",
		name: "Relentless Force",
		description:
			"Vi smashes her gauntlets together and gains bonus Attack Speed for her next few attacks, which deal bonus magic damage.",
		cooldown: 9,
	},
	{
		id: "vi-r",
		championId: "vi",
		slot: "R",
		name: "Assault and Battery",
		description:
			"Vi targets an enemy champion and rams them, knocking aside and dealing damage to all enemies in her path.",
		cooldown: 130,
	},

	// Lux
	{
		id: "lux-p",
		championId: "lux",
		slot: "P",
		name: "Illumination",
		description:
			"Lux's damaging spells charge enemies with energy for a couple seconds, and her basic attack will ignite the charge, dealing bonus magic damage.",
		cooldown: undefined,
	},
	{
		id: "lux-q",
		championId: "lux",
		slot: "Q",
		name: "Light Binding",
		description: "Lux releases a sphere of light that binds and damages up to two enemies.",
		cooldown: 15,
	},
	{
		id: "lux-w",
		championId: "lux",
		slot: "W",
		name: "Prismatic Barrier",
		description:
			"Lux throws out her wand and bends the light around any friendly target, shielding them from incoming damage.",
		cooldown: 14,
	},
	{
		id: "lux-e",
		championId: "lux",
		slot: "E",
		name: "Lucent Singularity",
		description:
			"Fires an anomaly of twisted light to an area, where it slows nearby enemies. Lux can detonate it to damage enemies in the area.",
		cooldown: 10,
	},
	{
		id: "lux-r",
		championId: "lux",
		slot: "R",
		name: "Final Spark",
		description:
			"After gathering energy, Lux fires a giant beam of light that deals massive damage to all enemies in the area.",
		cooldown: 60,
	},

	// Yasuo
	{
		id: "yasuo-p",
		championId: "yasuo",
		slot: "P",
		name: "Way of the Wanderer",
		description:
			"Intent: Yasuo's Critical Strike Chance is doubled. Resolve: Yasuo builds a Flow as he moves. When full, he activates a brief shield when damaged.",
		cooldown: undefined,
	},
	{
		id: "yasuo-q",
		championId: "yasuo",
		slot: "Q",
		name: "Steel Tempest",
		description:
			"Yasuo thrusts his sword, dealing physical damage in a line. On three hits, creates a whirlwind that knocks up enemies.",
		cooldown: 4,
	},
	{
		id: "yasuo-w",
		championId: "yasuo",
		slot: "W",
		name: "Wind Wall",
		description: "Yasuo creates a moving wall of wind that blocks all enemy projectiles for several seconds.",
		cooldown: 26,
	},
	{
		id: "yasuo-e",
		championId: "yasuo",
		slot: "E",
		name: "Sweeping Blade",
		description:
			"Yasuo dashes through an enemy, dealing magic damage and temporarily marking them. Repeated casts increase the damage.",
		cooldown: 0.5,
	},
	{
		id: "yasuo-r",
		championId: "yasuo",
		slot: "R",
		name: "Last Breath",
		description:
			"Yasuo blinks to a nearby airborne enemy champion, keeping them and all surrounding airborne enemies in the air. He then slashes all nearby enemies suspended by wind.",
		cooldown: 80,
	},

	// Caitlyn
	{
		id: "caitlyn-p",
		championId: "caitlyn",
		slot: "P",
		name: "Headshot",
		description:
			"Caitlyn periodically sets up a trap when moving through brushes or firing from a trap or net. Her next shot deals double damage and ranges farther.",
		cooldown: undefined,
	},
	{
		id: "caitlyn-q",
		championId: "caitlyn",
		slot: "Q",
		name: "Piltover Peacemaker",
		description: "Caitlyn winds up and fires a penetrating shot that deals physical damage to all enemies in a line.",
		cooldown: 10,
	},
	{
		id: "caitlyn-w",
		championId: "caitlyn",
		slot: "W",
		name: "Yordle Snap Trap",
		description: "Caitlyn sets a trap to root enemy champions. Up to three traps can be active at once.",
		cooldown: 30,
	},
	{
		id: "caitlyn-e",
		championId: "caitlyn",
		slot: "E",
		name: "90 Caliber Net",
		description: "Caitlyn fires a heavy net to slow her target and knock herself backward.",
		cooldown: 16,
	},
	{
		id: "caitlyn-r",
		championId: "caitlyn",
		slot: "R",
		name: "Ace in the Hole",
		description:
			"Caitlyn takes time to line up a shot targeting a specific enemy champion. She fires a bullet that will kill anything in its path, except enemy champions.",
		cooldown: 90,
	},

	// Leona
	{
		id: "leona-p",
		championId: "leona",
		slot: "P",
		name: "Sunlight",
		description:
			"Leona's damaging spells afflict enemies with Sunlight for 1.5s. Leona's allies champion that damages these enemies will consume the Sunlight to deal bonus magic damage.",
		cooldown: undefined,
	},
	{
		id: "leona-q",
		championId: "leona",
		slot: "Q",
		name: "Shield of Daybreak",
		description: "Leona uses her shield to stun the target for 1.25 seconds and deal magic damage.",
		cooldown: 6,
	},
	{
		id: "leona-w",
		championId: "leona",
		slot: "W",
		name: "Eclipse",
		description:
			"Leona raises her shield to gain Armor and Magic Resist. When the effect ends, she deals magic damage and retains the bonus resistances if she hit an enemy.",
		cooldown: 14,
	},
	{
		id: "leona-e",
		championId: "leona",
		slot: "E",
		name: "Zenith Blade",
		description:
			"Leona projects a solar image of her sword, dealing magic damage to all enemies it passes through and dashing to the last champion struck.",
		cooldown: 13,
	},
	{
		id: "leona-r",
		championId: "leona",
		slot: "R",
		name: "Solar Flare",
		description:
			"Leona calls down a flare, dealing magic damage. Enemies in the center are stunned while enemies on the outside are slowed.",
		cooldown: 120,
	},

	// Graves
	{
		id: "graves-p",
		championId: "graves",
		slot: "P",
		name: "New Destiny",
		description:
			"Graves' basic attacks fire a cone of 4 pellets. Each pellet that hits an enemy generates Grit which increases Graves' Armor and Magic Resist.",
		cooldown: undefined,
	},
	{
		id: "graves-q",
		championId: "graves",
		slot: "Q",
		name: "End of the Line",
		description:
			"Graves fires an explosive shell that detonates after 0.6 seconds. If the initial bullet hits a wall, it detonates immediately.",
		cooldown: 13,
	},
	{
		id: "graves-w",
		championId: "graves",
		slot: "W",
		name: "Smoke Screen",
		description:
			"Graves fires a canister that creates a cloud of smoke on impact. Enemies in the smoke lose sight of nearby allies and are slowed.",
		cooldown: 26,
	},
	{
		id: "graves-e",
		championId: "graves",
		slot: "E",
		name: "Quickdraw",
		description: "Graves dashes forward and reloads one shell. He gains stacks of True Grit on nearby enemy champions.",
		cooldown: 16,
	},
	{
		id: "graves-r",
		championId: "graves",
		slot: "R",
		name: "Collateral Damage",
		description:
			"Graves fires an explosive shell with such force that he is knocked back. The shell deals heavy damage to the first champion hit and continues on, exploding to deal damage in a cone.",
		cooldown: 120,
	},
];

export const SEED_SKINS: ChampionSkin[] = [
	// Ahri
	{
		id: "ahri-0",
		championId: "ahri",
		name: "Classic Ahri",
		rpPrice: 0,
		splashArtUrl: splash("Ahri", 0),
		rarity: "common",
	},
	{
		id: "ahri-1",
		championId: "ahri",
		name: "Popstar Ahri",
		rpPrice: 975,
		splashArtUrl: splash("Ahri", 1),
		rarity: "common",
	},
	{
		id: "ahri-2",
		championId: "ahri",
		name: "Arcade Ahri",
		rpPrice: 1350,
		splashArtUrl: splash("Ahri", 4),
		rarity: "epic",
	},
	// Jinx
	{
		id: "jinx-0",
		championId: "jinx",
		name: "Classic Jinx",
		rpPrice: 0,
		splashArtUrl: splash("Jinx", 0),
		rarity: "common",
	},
	{
		id: "jinx-1",
		championId: "jinx",
		name: "Mafia Jinx",
		rpPrice: 750,
		splashArtUrl: splash("Jinx", 1),
		rarity: "common",
	},
	{
		id: "jinx-2",
		championId: "jinx",
		name: "Star Guardian Jinx",
		rpPrice: 1350,
		splashArtUrl: splash("Jinx", 3),
		rarity: "epic",
	},
	// Thresh
	{
		id: "thresh-0",
		championId: "thresh",
		name: "Classic Thresh",
		rpPrice: 0,
		splashArtUrl: splash("Thresh", 0),
		rarity: "common",
	},
	{
		id: "thresh-1",
		championId: "thresh",
		name: "SSW Thresh",
		rpPrice: 975,
		splashArtUrl: splash("Thresh", 1),
		rarity: "common",
	},
	{
		id: "thresh-2",
		championId: "thresh",
		name: "Dark Star Thresh",
		rpPrice: 1350,
		splashArtUrl: splash("Thresh", 4),
		rarity: "epic",
	},
	// Zed
	{ id: "zed-0", championId: "zed", name: "Classic Zed", rpPrice: 0, splashArtUrl: splash("Zed", 0), rarity: "common" },
	{
		id: "zed-1",
		championId: "zed",
		name: "SKT T1 Zed",
		rpPrice: 975,
		splashArtUrl: splash("Zed", 2),
		rarity: "common",
	},
	{
		id: "zed-2",
		championId: "zed",
		name: "Death Sworn Zed",
		rpPrice: 1350,
		splashArtUrl: splash("Zed", 5),
		rarity: "epic",
	},
	// Vi
	{ id: "vi-0", championId: "vi", name: "Classic Vi", rpPrice: 0, splashArtUrl: splash("Vi", 0), rarity: "common" },
	{
		id: "vi-1",
		championId: "vi",
		name: "Neon Strike Vi",
		rpPrice: 975,
		splashArtUrl: splash("Vi", 1),
		rarity: "common",
	},
	{ id: "vi-2", championId: "vi", name: "Officer Vi", rpPrice: 750, splashArtUrl: splash("Vi", 2), rarity: "common" },
	// Lux
	{ id: "lux-0", championId: "lux", name: "Classic Lux", rpPrice: 0, splashArtUrl: splash("Lux", 0), rarity: "common" },
	{
		id: "lux-1",
		championId: "lux",
		name: "Spellthief Lux",
		rpPrice: 520,
		splashArtUrl: splash("Lux", 1),
		rarity: "common",
	},
	{
		id: "lux-2",
		championId: "lux",
		name: "Elementalist Lux",
		rpPrice: 3250,
		splashArtUrl: splash("Lux", 7),
		rarity: "ultimate",
	},
	// Yasuo
	{
		id: "yasuo-0",
		championId: "yasuo",
		name: "Classic Yasuo",
		rpPrice: 0,
		splashArtUrl: splash("Yasuo", 0),
		rarity: "common",
	},
	{
		id: "yasuo-1",
		championId: "yasuo",
		name: "PROJECT: Yasuo",
		rpPrice: 1350,
		splashArtUrl: splash("Yasuo", 3),
		rarity: "epic",
	},
	{
		id: "yasuo-2",
		championId: "yasuo",
		name: "High Noon Yasuo",
		rpPrice: 1350,
		splashArtUrl: splash("Yasuo", 4),
		rarity: "epic",
	},
	// Caitlyn
	{
		id: "caitlyn-0",
		championId: "caitlyn",
		name: "Classic Caitlyn",
		rpPrice: 0,
		splashArtUrl: splash("Caitlyn", 0),
		rarity: "common",
	},
	{
		id: "caitlyn-1",
		championId: "caitlyn",
		name: "Officer Caitlyn",
		rpPrice: 750,
		splashArtUrl: splash("Caitlyn", 3),
		rarity: "common",
	},
	{
		id: "caitlyn-2",
		championId: "caitlyn",
		name: "Arcane Caitlyn",
		rpPrice: 1350,
		splashArtUrl: splash("Caitlyn", 9),
		rarity: "epic",
	},
	// Leona
	{
		id: "leona-0",
		championId: "leona",
		name: "Classic Leona",
		rpPrice: 0,
		splashArtUrl: splash("Leona", 0),
		rarity: "common",
	},
	{
		id: "leona-1",
		championId: "leona",
		name: "Valkyrie Leona",
		rpPrice: 520,
		splashArtUrl: splash("Leona", 1),
		rarity: "common",
	},
	{
		id: "leona-2",
		championId: "leona",
		name: "Solar Eclipse Leona",
		rpPrice: 1350,
		splashArtUrl: splash("Leona", 7),
		rarity: "legendary",
	},
	// Graves
	{
		id: "graves-0",
		championId: "graves",
		name: "Classic Graves",
		rpPrice: 0,
		splashArtUrl: splash("Graves", 0),
		rarity: "common",
	},
	{
		id: "graves-1",
		championId: "graves",
		name: "Mafia Graves",
		rpPrice: 975,
		splashArtUrl: splash("Graves", 1),
		rarity: "common",
	},
	{
		id: "graves-2",
		championId: "graves",
		name: "Pool Party Graves",
		rpPrice: 975,
		splashArtUrl: splash("Graves", 4),
		rarity: "common",
	},
];

const PATCH_CURRENT = "14.10";

export const SEED_TIERS: ChampionTier[] = [
	{
		id: "ahri-mid-14.10",
		championId: "ahri",
		tier: "A",
		role: "Mid",
		patch: PATCH_CURRENT,
		winRate: 52.4,
		pickRate: 11.3,
	},
	{
		id: "jinx-adc-14.10",
		championId: "jinx",
		tier: "S",
		role: "ADC",
		patch: PATCH_CURRENT,
		winRate: 54.1,
		pickRate: 14.7,
	},
	{
		id: "thresh-support-14.10",
		championId: "thresh",
		tier: "A",
		role: "Support",
		patch: PATCH_CURRENT,
		winRate: 51.8,
		pickRate: 16.2,
	},
	{
		id: "zed-mid-14.10",
		championId: "zed",
		tier: "B",
		role: "Mid",
		patch: PATCH_CURRENT,
		winRate: 50.2,
		pickRate: 8.9,
	},
	{
		id: "zed-jungle-14.10",
		championId: "zed",
		tier: "C",
		role: "Jungle",
		patch: PATCH_CURRENT,
		winRate: 48.5,
		pickRate: 3.1,
	},
	{
		id: "vi-jungle-14.10",
		championId: "vi",
		tier: "A",
		role: "Jungle",
		patch: PATCH_CURRENT,
		winRate: 52.9,
		pickRate: 9.4,
	},
	{
		id: "lux-mid-14.10",
		championId: "lux",
		tier: "B",
		role: "Mid",
		patch: PATCH_CURRENT,
		winRate: 51.1,
		pickRate: 6.7,
	},
	{
		id: "lux-support-14.10",
		championId: "lux",
		tier: "S",
		role: "Support",
		patch: PATCH_CURRENT,
		winRate: 53.7,
		pickRate: 12.1,
	},
	{
		id: "yasuo-mid-14.10",
		championId: "yasuo",
		tier: "B",
		role: "Mid",
		patch: PATCH_CURRENT,
		winRate: 49.8,
		pickRate: 10.3,
	},
	{
		id: "yasuo-top-14.10",
		championId: "yasuo",
		tier: "C",
		role: "Top",
		patch: PATCH_CURRENT,
		winRate: 48.1,
		pickRate: 5.2,
	},
	{
		id: "caitlyn-adc-14.10",
		championId: "caitlyn",
		tier: "S",
		role: "ADC",
		patch: PATCH_CURRENT,
		winRate: 53.2,
		pickRate: 18.5,
	},
	{
		id: "leona-support-14.10",
		championId: "leona",
		tier: "A",
		role: "Support",
		patch: PATCH_CURRENT,
		winRate: 52.6,
		pickRate: 10.8,
	},
	{
		id: "graves-jungle-14.10",
		championId: "graves",
		tier: "A",
		role: "Jungle",
		patch: PATCH_CURRENT,
		winRate: 51.4,
		pickRate: 7.6,
	},
	{
		id: "graves-adc-14.10",
		championId: "graves",
		tier: "D",
		role: "ADC",
		patch: PATCH_CURRENT,
		winRate: 46.9,
		pickRate: 1.8,
	},
];
