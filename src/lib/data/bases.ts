import type { Edition } from './rulesets.ts';

export type Bases = { [key: string]: string[] };

export const BASES: Bases = {
	'Off-hands': ['Paladin Shields', 'Shields', 'Necromancer Shrunken Heads', 'Grimoires'],
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

export const all_bases = [...new Set(Object.values(BASES).flat())];

export function isAnyBaseSelected(
	available_bases: string[],
	selected_bases: { [key: string]: boolean },
	edition: Edition,
	sockets: number
): boolean {
	return available_bases
		.flatMap((base) => expand_base(base, edition, sockets))
		.some((base) => selected_bases[base]);
}

export function expand_base(base: string, edition: Edition, sockets?: number): string[] {
	return (BASES[base] ?? [base]).filter((candidate) => {
		if (candidate !== 'Grimoires') return true;
		return edition === 'rotw' && (sockets === undefined || sockets <= 3);
	});
}
