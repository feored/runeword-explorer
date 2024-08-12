<script lang="ts">
	import { BASES } from '$lib/data/bases';
	import { filter_options } from '$lib/options.svelte';

	let filter_bases = $state({ ...filter_options.bases });
	$effect(() => {
		filter_options.bases = { ...filter_bases };
	});

	export function setBases(base_type: string, value: boolean): void {
		for (let i = 0; i < BASES[base_type].length; i++) {
			filter_bases[BASES[base_type][i]] = value;
		}
		filter_bases = { ...filter_bases };
	}

	export function setAllBases(value: boolean): void {
		Object.keys(BASES).forEach((base_type) => {
			setBases(base_type, value);
		});
	}
</script>

{#snippet all_none(base_type: string)}
	<div class="flex">
		<h6>{base_type}</h6>
		<div class="all_or_none">
			<button class="outline" onclick={() => setBases(base_type, true)}> All </button>
			<p>/</p>
			<button class="outline secondary" onclick={() => setBases(base_type, false)}> None </button>
		</div>
	</div>
{/snippet}

{#snippet base_list(base_type: string)}
	<fieldset class="custom-grid">
		{#each BASES[base_type] as base}
			<label>
				<input type="checkbox" name={base_type} value={base} bind:checked={filter_bases[base]} />
				{base}
			</label>
		{/each}
	</fieldset>
{/snippet}

<div id="bases">
	<hr />
	<div class="flex">
		<h5>Bases</h5>
		<div class="all_or_none">
			<button class="outline" onclick={() => setAllBases(true)}> All Bases </button>
			<p>/</p>
			<button class="outline secondary" onclick={() => setAllBases(false)}> None </button>
		</div>
	</div>
	<br />
	<!--Off-hands-->
	{#each ['Off-hands', 'Armors', 'Helms'] as base_type}
		<article id={base_type}>
			{@render all_none(base_type)}
			{@render base_list(base_type)}
		</article>
		<hr />
	{/each}
	<!--Weapons-->
	<article id="Weapons">
		{@render all_none('Weapons')}
		<br />
		<p><b>Missile Weapons</b></p>
		{@render base_list('Missile Weapons')}
		<hr />
		<p><b>Melee Weapons</b></p>
		{@render base_list('Melee Weapons')}
	</article>
</div>
