<script lang="ts">
	import { BASES } from '$lib/data/bases';

	interface BasesProps {
		expand: boolean;
		bases: string[];
		bases_d2r: string[];
	}

	let { expand, bases, bases_d2r }: BasesProps = $props();

	const tooltips = {
		d2lod: 'Bases available in Diablo II: Lord of Destruction.',
		d2r: 'Bases available in Diablo II: Resurrected.'
	};
</script>

{#snippet BaseDisplay(base_name: string)}
	{#if base_name in BASES}
		{#if expand}
			{#each BASES[base_name] as expanded_base_name}
				<span>{expanded_base_name}</span><br />
			{/each}
		{:else}
			<span class="tooltip" data-html="true" data-tooltip={BASES[base_name].join(',\n')}
				>{base_name}</span
			>
		{/if}
	{:else}
		<span>{base_name}</span>
	{/if}
	<br />
{/snippet}

<div>
	{#if bases_d2r.length > 0}
		<div class="bases_group">
			<small data-tooltip={tooltips.d2r} class="warning d2r_only">D2R</small>
			<div class="bases">
				{#each bases_d2r as base_name}
					{@render BaseDisplay(base_name)}
				{/each}
			</div>
		</div>
		<div class="bases_group">
			<small data-tooltip={tooltips.d2lod} class="warning d2lod_only">D2LOD</small>
			<div class="bases">
				{#each bases as base_name}
					{@render BaseDisplay(base_name)}
				{/each}
			</div>
		</div>
	{:else}
		{#each bases as base_name}
			{@render BaseDisplay(base_name)}
		{/each}
	{/if}
</div>

<style>
	.bases_group {
		border-radius: var(--pico-border-radius);
		border: var(--pico-border-width) solid #28354f;
	}

	.tooltip {
		border-bottom: 1px dotted;
	}

	.bases {
		padding: calc(var(--pico-spacing) / 2);
	}

	.bases_group:first-child {
		margin-bottom: var(--pico-spacing);
	}

	.bases_group small {
		bottom: 1em;
	}
</style>
