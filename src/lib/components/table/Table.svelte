<script lang="ts">
	import '$lib/css/sortable.css';
	import RUNEWORDS from '$lib/data/runewords.json';
	import { rune_inventory, filter_options } from '$lib/runewords.svelte.ts';
	import type { Runeword } from '$lib/rw';
	import { RUNES, getPathRw, getElValue } from '$lib/rw.ts';
	import RunewordName from '$lib/components/table/RunewordName.svelte';
	import RunewordPossible from '$lib/components/table/RunewordPossible.svelte';
	import RunewordVersion from '$lib/components/table/RunewordVersion.svelte';
	import RunewordBases from '$lib/components/table/RunewordBases.svelte';
	import RunewordStats from '$lib/components/table/RunewordStats.svelte';
	import RunewordCubed from '$lib/components/table/RunewordCubed.svelte';
	import { onMount } from 'svelte';

	let last_clicked_th;
	let default_sort_th;

	onMount(() => {
		default_sort_th.click();
	});

	let runewords = $derived.by(() => {
		console.log('Updating runewords');
		let rws: Runeword[] = [];
		for (let i = 0; i < RUNEWORDS.length; i++) {
			let rw = RUNEWORDS[i];
			let { success, upgsDone, missing } = getPathRw(rune_inventory, rw.runes);
			rw.success = success;
			rw.upgsDone = upgsDone;
			rw.missing = missing;
			rw.el_value = rw.runes
				.map((x) => getElValue(RUNES.indexOf(x)))
				.reduce((partialSum, a) => partialSum + a, 0);

			rws.push(rw);
		}
		return rws;
	});
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/sortable-tablesort@3.2.3/sortable.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/mark.js@8.11.1/dist/mark.min.js"></script>
</svelte:head>

<section>
	<section>
		<p id="runeword-nb">
			Showing {runewords.length}/{RUNEWORDS.length} ({(runewords.length * 100) / RUNEWORDS.length}%)
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
				{#each runewords as rw}
					<tr>
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
							/>
						</td>
						<td>
							<RunewordBases bases={rw.bases} bases_d2r={rw.bases_d2r} />
						</td>
						<td class="sockets">
							{rw.sockets}
						</td>
						<td data-sort={rw.el_value} class="runes">
							{rw.runes.join(' ')}
						</td>
						<td><RunewordStats stats={rw.stats} /> </td>
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
