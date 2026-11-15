import { RUNES } from '#lib/data/runes.ts';
import { INTRODUCED_IN } from '#lib/data/runewords.ts';
import { all_bases } from '#lib/data/bases.ts';
import { DEFAULT_PROFILE, type Profile } from '#lib/data/rulesets.ts';

export const rune_inventory: number[] = $state(new Array(RUNES.length).fill(0));

export interface FilterOptions {
	search: string;
	only_can_make: boolean;
	compact_mode: boolean;
	introduced_in: { [key: string]: boolean };
	sockets: { min: number; max: number };
	levelreq: { min: number; max: number };
	bases: { [key: string]: boolean };
	required_runes: boolean[];
}

export const default_filter_options: FilterOptions = {
	search: '',
	only_can_make: false,
	compact_mode: false,
	introduced_in: Object.fromEntries(INTRODUCED_IN.map(({ id }) => [id, true])),
	sockets: { min: 2, max: 6 },
	levelreq: { min: 1, max: 99 },
	bases: Object.fromEntries(all_bases.map((base_name) => [base_name, true])),
	required_runes: new Array(RUNES.length).fill(false)
};

export const filter_options: FilterOptions = $state({ ...default_filter_options });

export interface ISettings {
	profile: Profile;
	max_steps: number;
	expand_bases: boolean;
	missing_runes_cube_mode: boolean; // if true, missing runes will show as lowest 'rune value' and require cubing, otherwise just the literal missing runes
}

export const default_settings: ISettings = {
	profile: { ...DEFAULT_PROFILE },
	max_steps: 100,
	expand_bases: false,
	missing_runes_cube_mode: false
};

export const settings: ISettings = $state({
	...default_settings,
	profile: { ...DEFAULT_PROFILE }
});
