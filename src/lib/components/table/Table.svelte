<script lang="ts">
	import '$lib/css/sortable.css';

	import { RUNEWORDS } from '$lib/data/runewords';
	import { RUNES } from '$lib/data/runes';
	import { SYNONYMS } from '$lib/data/synonyms';

	import type { Runeword } from '$lib/data/runewords';

	import { isAnyBaseSelected } from '$lib/data/bases';
	import { rune_inventory, filter_options, type FilterOptions } from '$lib/options.svelte';
	import { calc_runeword, get_el_value } from '$lib/runewordcalc';

	import Name from '$lib/components/table/cols/Name.svelte';
	import Possible from '$lib/components/table/cols/Possible.svelte';
	import Version from '$lib/components/table/cols/Version.svelte';
	import Bases from '$lib/components/table/cols/Bases.svelte';
	import Stats from '$lib/components/table/cols/Stats.svelte';
	import Cubed from '$lib/components/table/cols/Cubed.svelte';

	import Mark from 'mark.js';

	import { onMount } from 'svelte';

	interface RunewordRow extends Runeword {
		el_value: number;
		upgs_done: number[];
		success: boolean;
		missing: number[];
	}

	let default_sort_th: HTMLElement;
	let mark_instance: Mark;

	onMount(() => {
		default_sort_th.click();
	});

	$effect(() => {
		if (mark_instance) {
			mark_instance.unmark();
		}
		mark_instance = new Mark(document.querySelectorAll('#rwtable tr:not([hidden]) .searchable'));
		mark_instance.mark(filter_options.search.toLowerCase(), {
			separateWordSearch: false,
			synonyms: SYNONYMS
		});
	});

	let runewords: RunewordRow[] = $derived.by(() => {
		return RUNEWORDS.map((rw) => {
			let { success, upgs_done, missing } = calc_runeword(rune_inventory, rw.runes);
			let el_value = rw.runes
				.map((x) => get_el_value(RUNES.indexOf(x)))
				.reduce((partialSum, a) => partialSum + a, 0);
			return { ...rw, success, upgs_done, missing, el_value };
		});
	});

	let runeword_rows = $derived.by(() => {
		let shown = [];
		for (let i = 0; i < runewords.length; i++) {
			shown.push(filter_rw(runewords[i], filter_options));
		}
		return shown;
	});

	function filter_rw(rw: RunewordRow, filter_options: FilterOptions): boolean {
		function search(search_term: string): boolean {
			if (
				rw.name.toLowerCase().includes(search_term) ||
				rw.runes.join(' ').toLowerCase().includes(search_term) ||
				rw.stats.some((x) => x.toLowerCase().includes(search_term)) ||
				rw.bases.some((x) => x.toLowerCase().includes(search_term)) ||
				rw.bases_d2r.some((x) => x.toLowerCase().includes(search_term))
			) {
				return true;
			}
			return false;
		}

		let rw_bases: string[] = Array.from(new Set(Array.from(rw.bases).concat(rw.bases_d2r)));
		let required_runes = filter_options.required_runes
			.map((r, index) => (r ? index : 0))
			.filter((r) => r > 0);
		let show = true;
		if (
			(!filter_options.ladder_d2lod && rw.ladder.d2lod) ||
			(!filter_options.ladder_d2r && rw.ladder.d2r) ||
			(!filter_options.show_d2r_only && rw.d2r_only) ||
			(filter_options.only_can_make && !rw.success) ||
			!filter_options.versions[rw.version] ||
			rw.sockets < filter_options.sockets.min ||
			rw.sockets > filter_options.sockets.max ||
			rw.levelreq < filter_options.levelreq.min ||
			rw.levelreq > filter_options.levelreq.max ||
			required_runes.some((r_index) => rw.runes.indexOf(RUNES[r_index]) == -1) ||
			!isAnyBaseSelected(rw_bases, filter_options.bases)
		) {
			show = false;
		}

		// search bar
		let search_term = filter_options.search.toLowerCase();
		if (show && search_term != '') {
			show = search(search_term);
			// If the row is not already shown, try again with synonym of search term
			if (!show && search_term in SYNONYMS) {
				show = search(SYNONYMS[search_term]);
			}
		}

		return show;
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortable-tablesort@3.2.3/sortable.min.js"></script>
</svelte:head>

<section>
	<section>
		<p id="runeword-nb">
			Showing {runeword_rows.filter(Boolean).length}/{runeword_rows.length} ({(
				(runeword_rows.filter(Boolean).length * 100) /
				runeword_rows.length
			).toFixed(2)}%)
		</p>
	</section>
	<section class="overflow-auto">
		<table id="rwtable" class="striped sortable asc">
			<thead>
				<tr>
					<th>Can Make</th>
					<th>Version</th>
					<th bind:this={default_sort_th}>Name</th>
					<th>Bases</th>
					<th>Sockets</th>
					<th> Runes </th>
					<th class="no-sort">Stats</th>
					<th>Level Req.</th>
					<th>Cubed Runes</th>
				</tr>
			</thead>
			<tbody>
				{#each runewords as rw, rw_index}
					<tr hidden={!runeword_rows[rw_index]}>
						<td data-sort={rw.success} class="possible">
							<Possible possible={rw.success} />
						</td>
						<td>
							<Version version={rw.version} />
						</td>
						<td class="searchable">
							<Name
								name={rw.name}
								d2r_only={rw.d2r_only}
								d2r_ladder={rw.ladder.d2r}
								d2lod_ladder={rw.ladder.d2lod}
							/>
						</td>
						<td class="searchable">
							<Bases bases={rw.bases} bases_d2r={rw.bases_d2r} />
						</td>
						<td class="sockets">
							{rw.sockets}
						</td>
						<td data-sort={rw.el_value} class="runes searchable">
							{rw.runes.join(' ')}
						</td>
						<td class="searchable"><Stats stats={rw.stats} /> </td>
						<td class="levelreq">
							{rw.levelreq}
						</td>
						<td data-sort={rw.success ? 0 : rw.upgs_done.filter((x) => x > 0).length}
							><Cubed
								show={rw.success}
								upgs_done={rw.upgs_done}
								rw_runes={rw.runes}
								missing={rw.missing}
							/></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>
{#if runeword_rows.filter(Boolean).length > 10}
	<section>
		<button class="reset outline" style="width: 100%; text-align:center;" onclick={() => {document.documentElement.scrollTop = 0;}}>Back to Top</button>
	</section>
{/if}

<style>
	#rwtable thead th {
		position: sticky;
		top: 0;
		z-index: 9;
	}

	#rwtable th,
	td {
		text-align: center;
	}

	#rwtable tbody tr:hover td {
		background: rgba(127, 127, 127, 0.1) !important;
	}

	#runeword-nb {
		text-align: center;
		font-style: italic;
		color: var(--color-grey);
	}

	.runes {
		color: var(--color-craft);
	}

	.levelreq,
	.sockets {
		font-size: large;
		font-weight: light;
	}


	.levelreq,
	.sockets,
	.possible {
		width: min-content;
	}
</style>
