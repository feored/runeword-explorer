<script lang="ts">
	import { BASES, expand_base } from '#lib/data/bases.ts';
	import type { Edition } from '#lib/data/rulesets.ts';
	let {
		expand,
		bases,
		edition,
		sockets
	}: {
		expand: boolean;
		bases: string[];
		edition: Edition;
		sockets: number;
	} = $props();
</script>

<div>
	{#each bases as base (base)}
		{@const candidates = expand_base(base, edition, sockets)}
		{#if expand || !(base in BASES)}
			{#each candidates as candidate (candidate)}
				<span>{candidate}</span><br />
			{/each}
		{:else if candidates.length}
			<span class="tooltip" data-tooltip={candidates.join(',\n')}>{base}</span><br />
		{/if}
	{/each}
</div>

<style>
	.tooltip {
		border-bottom: 1px dotted;
	}
</style>
