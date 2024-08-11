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

	let active_runewords = $derived.by(() => {
		console.log('Updating runewords');
		let rws: Runeword[] = [];
		for (let i = 0; i < RUNEWORDS.length; i++) {
			let rw = RUNEWORDS[i];
			console.log('Actual stats');
			console.log(rw.stats);
			let { success, upgsDone, missing } = getPathRw(rune_inventory, rw.runes);
			// console.log('upgsDone', upgsDone);
			// rw.success = success;
			// rw.upgsDone = upgsDone;
			// rw.missing = missing;
			// rw.el_value = rw.runes
			// 	.map((x) => getElValue(RUNES.indexOf(x)))
			// 	.reduce((partialSum, a) => partialSum + a, 0);

			rws.push(rw);

			// console.log(rw);
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
			Showing {active_runewords.length}/{RUNEWORDS.length} ({active_runewords.length /
				RUNEWORDS.length}%)
		</p>
	</section>
	<section class="overflow-auto">
		<table id="rwtable" class="striped sortable asc">
			<thead>
				<tr>
					<th>Can Make</th>
					<th>Version</th>
					<th>Name</th>
					<th>Bases</th>
					<th>Sockets</th>
					<th> Runes </th>
					<th class="no-sort">Stats</th>
					<th>Level Req.</th>
					<th>Cubed Runes</th>
				</tr>
			</thead>
			<tbody>
				{#each active_runewords as rw}
					<tr>
						<td class="possible">
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
						<td class="runes">
							{rw.runes.join(' ')}
						</td>
						<td><RunewordStats stats={rw.stats} /> </td>
						<td class="levelreq">
							{rw.levelreq}
						</td>
						<td><RunewordCubed upgs={rw.upgsDone} rw_runes={rw.runes} /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>

<style>
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
