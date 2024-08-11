import { RUNES, VERSIONS } from "$lib/rw";
import type { Bases } from "$lib/rw";
import BASES from "$lib/data/itemtypes.json";

const BASES_DATA = BASES as Bases;

export let rune_inventory: number[] = $state(new Array(RUNES.length).fill(0));


export let all_bases: string[] = [];
for (let key in BASES_DATA) {
	for (let i = 0; i < BASES_DATA[key].length; i++) {
		if (!all_bases.includes(BASES_DATA[key][i])) {
			all_bases.push(BASES_DATA[key][i]);
		}
	}
}

export let filter_options: FilterOptions = $state({
	search: "",
	can_make: true,
	ladder_d2r: true,
	ladder_d2lod: true,
	versions: Object.fromEntries(VERSIONS.map(v => [v, true])),
	sockets: { min: 2, max: 6 },
	levelreq: { min: 1, max: 99 },
	bases: Object.fromEntries(all_bases.map((base_name) => [base_name, true])),
	required_runes: new Array(RUNES.length).fill(false)
});

// export function make_filter_options() {
// 	let filter_search = $state('');
// 	let filter_can_make = $state(true);
// 	let filter_ladder_d2r = $state(true);
// 	let filter_ladder_d2lod = $state(true);
// 	let filter_versions = $state({
// 		'1.09': true,
// 		'1.10': true,
// 		'1.11': true,
// 		'2.4': true,
// 		'2.6': true
// 	});
// 	let filter_sockets = $state({ min: 2, max: 6 });
// 	let filter_levelreq = $state({ min: 1, max: 99 });

// 	let filter_bases = $state(Object.fromEntries(all_bases.map((base_name) => [base_name, true])));
// 	let filter_required_runes = $state(new Array(RUNES.length).fill(false));

// 	const options = $derived.by(() => {
// 		return {
// 			filter_search: filter_search,
// 			filter_can_make: filter_can_make,
// 			filter_ladder_d2r: filter_ladder_d2r,
// 			filter_ladder_d2lod: filter_ladder_d2lod,
// 			filter_versions: filter_versions,
// 			filter_sockets: { min: filter_sockets.min, max: filter_sockets.max },
// 			filter_levelreq: { min: filter_levelreq.min, max: filter_levelreq.max },
// 			filter_bases: filter_bases,
// 			filter_required_runes: RUNES.map(r => false)
// 		}
// 	});


// 	const filter_options = {
// 		get filter_search() {
// 			return filter_search;
// 		},
// 		set filter_search(value: string) {
// 			filter_search = value;
// 		},
// 		get filter_can_make() {
// 			return filter_can_make;
// 		},
// 		set filter_can_make(value: boolean) {
// 			filter_can_make = value;
// 		},
// 		get filter_ladder_d2r() {
// 			return filter_ladder_d2r;
// 		},
// 		set filter_ladder_d2r(value: boolean) {
// 			filter_ladder_d2r = value;
// 		},
// 		get filter_ladder_d2lod() {
// 			return filter_ladder_d2lod;
// 		},
// 		set filter_ladder_d2lod(value: boolean) {
// 			filter_ladder_d2lod = value;
// 		},
// 		get filter_versions() {
// 			return filter_versions;
// 		},
// 		get filter_sockets() {
// 			return filter_sockets;
// 		},
// 		set filter_sockets(value: { min: number, max: number }) {
// 			filter_sockets = value;
// 		},
// 		get filter_levelreq() {
// 			return filter_levelreq;
// 		},
// 		set filter_levelreq(value: { min: number, max: number }) {
// 			filter_levelreq = value;
// 		},
// 		get filter_bases() {
// 			return filter_bases;
// 		},
// 		set filter_bases(value: { [key: string]: boolean }) {
// 			filter_bases = value;
// 		},
// 		get filter_required_runes() {
// 			return filter_required_runes;
// 		},
// 		set filter_required_runes(value: boolean[]) {
// 			filter_required_runes = value;
// 		},

// 	}

// 	return filter_options;
// };

//export const filter_options = make_filter_options();
console.log(filter_options);

interface FilterOptions {
	search: string;
	can_make: boolean;
	ladder_d2r: boolean;
	ladder_d2lod: boolean;
	versions: { [key: string]: boolean };
	sockets: { min: number, max: number };
	levelreq: { min: number, max: number };
	bases: { [key: string]: boolean };
	required_runes: boolean[];
}