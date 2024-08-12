<script lang="ts">
	import '$lib/css/sortable.css';
	import RUNEWORDS from '$lib/data/runewords.json';
	import { rune_inventory, filter_options, isAnyBaseSelected } from '$lib/runewords.svelte.ts';
	import type { Runeword } from '$lib/rw';
	import { RUNES, D2R_VERSIONS, getPathRw, getElValue } from '$lib/rw.ts';
	import RunewordName from '$lib/components/table/RunewordName.svelte';
	import RunewordPossible from '$lib/components/table/RunewordPossible.svelte';
	import RunewordVersion from '$lib/components/table/RunewordVersion.svelte';
	import RunewordBases from '$lib/components/table/RunewordBases.svelte';
	import RunewordStats from '$lib/components/table/RunewordStats.svelte';
	import RunewordCubed from '$lib/components/table/RunewordCubed.svelte';
	import { onMount } from 'svelte';

	interface RunewordRow extends Runeword {
		el_value?: number;
		upgsDone?: number[];
		success?: boolean;
		missing?: string[];
	}

	let last_clicked_th;
	let default_sort_th;
	let mark_instance;

	onMount(() => {
		default_sort_th.click();
	});

	$effect(() => {
		console.log('Marking stuff again');
		if (mark_instance) mark_instance.unmark();
		mark_instance = new Mark(
			document.querySelectorAll('#rwtable tr:not([hidden]) .searchable')
		).mark(filter_options.search.toLowerCase(), { separateWordSearch: false });
	});

	let runewords: RunewordRow[] = $derived.by(() => {
		let rws = [];
		for (let i = 0; i < RUNEWORDS.length; i++) {
			let { success, upgsDone, missing } = getPathRw(rune_inventory, RUNEWORDS[i].runes);
			RUNEWORDS[i].success = success;
			RUNEWORDS[i].upgsDone = upgsDone;
			RUNEWORDS[i].missing = missing;
			RUNEWORDS[i].el_value = RUNEWORDS[i].runes
				.map((x) => getElValue(RUNES.indexOf(x)))
				.reduce((partialSum, a) => partialSum + a, 0);
			rws.push({ ...RUNEWORDS[i] });
		}
		return rws;
	});

	let shown_rows = $derived.by(() => {
		let shown = [];
		for (let i = 0; i < runewords.length; i++) {
			shown.push(filter_rw(runewords[i], filter_options));
		}
		return shown;
	});

	function filter_rw(rw, filter_options) {
		let rw_bases: string[] = Array.from(new Set([].concat(rw.bases, rw.bases_d2r)));
		let show = true;
		if (
			(!filter_options.ladder_d2lod && rw.ladder.d2lod) ||
			(!filter_options.ladder_d2r && rw.ladder.d2r) ||
			(!filter_options.d2r_only && D2R_VERSIONS.indexOf(rw.version) != -1) ||
			(filter_options.only_can_make && !rw.success) ||
			!filter_options.versions[rw.version] ||
			rw.sockets < filter_options.sockets.min ||
			rw.sockets > filter_options.sockets.max ||
			rw.levelreq < filter_options.levelreq.min ||
			rw.levelreq > filter_options.levelreq.max ||
			filter_options.required_runes.filter(Boolean).some((x) => rw.runes.indexOf(x) == -1) ||
			!isAnyBaseSelected(rw_bases, filter_options.bases)
		) {
			show = false;
		}

		// search bar
		let search_term = filter_options.search.toLowerCase();
		if (show && search_term != '') {
			console.log('searching' + search_term + ' in ' + rw.name);
			show = false;
			if (
				rw.name.toLowerCase().includes(search_term) ||
				rw.runes.join(' ').toLowerCase().includes(search_term) ||
				rw.stats.some((x) => x.toLowerCase().includes(search_term)) ||
				rw.bases.some((x) => x.toLowerCase().includes(search_term)) ||
				rw.bases_d2r.some((x) => x.toLowerCase().includes(search_term))
			) {
				console.log('Found');
				show = true;
			} else {
				console.log('Not Found');
			}
		}
		return show;
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortable-tablesort@3.2.3/sortable.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js"></script>
</svelte:head>

<section>
	<section>
		<p id="runeword-nb">
			Showing {shown_rows.filter(Boolean).length}/{shown_rows.length} ({(
				(shown_rows.filter(Boolean).length * 100) /
				shown_rows.length
			).toFixed(2)}%)
		</p>
	</section>
	<section class="overflow-auto">
		<table id="rwtable" class="striped sortable asc">
			<thead>
				<tr>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Can Make</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Version</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}
						bind:this={default_sort_th}>Name</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Bases</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Sockets</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}
					>
						Runes
					</th>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}
						class="no-sort">Stats</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Level Req.</th
					>
					<th
						onclick={() => {
							last_clicked_th = this;
						}}>Cubed Runes</th
					>
				</tr>
			</thead>
			<tbody>
				{#each runewords as rw, rw_index}
					<tr hidden={!shown_rows[rw_index]}>
						<td data-sort={rw.success} class="possible">
							<RunewordPossible possible={rw.success} />
						</td>
						<td>
							<RunewordVersion version={rw.version} />
						</td>
						<td>
							<RunewordName
								name={rw.name}
								d2r_only={rw.d2r_only}
								d2r_ladder={rw.ladder.d2r}
								d2lod_ladder={rw.ladder.d2lod}
								class="searchable"
							/>
						</td>
						<td>
							<RunewordBases bases={rw.bases} bases_d2r={rw.bases_d2r} class="searchable" />
						</td>
						<td class="sockets">
							{rw.sockets}
						</td>
						<td data-sort={rw.el_value} class="runes searchable">
							{rw.runes.join(' ')}
						</td>
						<td><RunewordStats stats={rw.stats} class="searchable" /> </td>
						<td class="levelreq">
							{rw.levelreq}
						</td>
						<td data-sort={rw.success ? 0 : rw.upgsDone.filter((x) => x > 0).length}
							><RunewordCubed show={rw.success} upgsDone={rw.upgsDone} rw_runes={rw.runes} /></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>

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
