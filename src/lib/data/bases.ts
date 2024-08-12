export type Bases = { [key: string]: string[] };

export const BASES: Bases = {
	'Off-hands': ['Paladin Shields', 'Shields', 'Necromancer Shrunken Heads'],
	Helms: ['Helms', 'Barbarian Helms', 'Druid Pelts', 'Circlets'],
	Armors: ['Body Armors'],
	'Missile Weapons': ['Amazon Bows', 'Bows', 'Crossbows'],
	'Melee Weapons': [
		'Amazon Spears',
		'Assassin Katars',
		'Axes',
		'Clubs',
		'Daggers',
		'Hammers',
		'Maces',
		'Polearms',
		'Scepters',
		'Spears',
		'Staves',
		'Swords',
		'Wands'
	],
	Weapons: [
		'Amazon Bows',
		'Amazon Spears',
		'Assassin Katars',
		'Axes',
		'Bows',
		'Clubs',
		'Daggers',
		'Crossbows',
		'Hammers',
		'Maces',
		'Polearms',
		'Scepters',
		'Sorceress Orbs',
		'Spears',
		'Staves',
		'Swords',
		'Wands'
	]
};

export let all_bases: string[] = [];
for (let key in BASES) {
	for (let i = 0; i < BASES[key].length; i++) {
		if (!all_bases.includes(BASES[key][i])) {
			all_bases.push(BASES[key][i]);
		}
	}
}

export function isAnyBaseSelected(
	available_bases: string[],
	selected_bases: { [key: string]: boolean }
): boolean {
	let final_bases: string[] = [];
	for (let i = 0; i < available_bases.length; i++) {
		if (available_bases[i] in BASES) {
			final_bases = final_bases.concat(BASES[available_bases[i]]);
		} else {
			final_bases.push(available_bases[i]);
		}
	}
	return final_bases.some((x) => selected_bases[x]);
}
