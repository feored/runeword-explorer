import { RUNES } from '$lib/data/runes';
import { VERSIONS } from '$lib/data/versions';
import { all_bases } from '$lib/data/bases';

export interface FilterOptions {
	search: string;
	only_can_make: boolean;
	ladder_d2r: boolean;
	ladder_d2lod: boolean;
	show_d2r_only: boolean;
	versions: { [key: string]: boolean };
	sockets: { min: number; max: number };
	levelreq: { min: number; max: number };
	bases: { [key: string]: boolean };
	required_runes: boolean[];
}

export let rune_inventory: number[] = $state(new Array(RUNES.length).fill(0));

export const default_filter_options: FilterOptions = {
	search: '',
	only_can_make: true,
	ladder_d2r: true,
	ladder_d2lod: true,
	show_d2r_only: true,
	versions: Object.fromEntries(VERSIONS.map((v) => [v, true])),
	sockets: { min: 2, max: 6 },
	levelreq: { min: 1, max: 99 },
	bases: Object.fromEntries(all_bases.map((base_name) => [base_name, true])),
	required_runes: new Array(RUNES.length).fill(false)
};

export let filter_options: FilterOptions = $state({ ...default_filter_options });
