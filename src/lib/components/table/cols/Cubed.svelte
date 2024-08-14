<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { UPG_GEM, upg_cost } from '$lib/runewordcalc';
	import { ArrowRight } from 'lucide-svelte';

	interface cubedProps {
		show: boolean;
		upgs_done: number[];
		rw_runes: string[];
		missing: number[];
	}
	let { show, upgs_done, rw_runes, missing }: cubedProps = $props();
</script>

<div>
	{#if show && upgs_done}
		{#each upgs_done as upgNb, rune_index}
			{#if upgNb > 0}
				<span
					>{upgNb * upg_cost(rune_index)}
					<span class="rune">
						{RUNES[rune_index]}
					</span>
					{#if UPG_GEM[rune_index]}
						+ {upgNb}
						<span class={UPG_GEM[rune_index].toLowerCase()}>{UPG_GEM[rune_index]}</span>
					{/if}
					<ArrowRight size="1em" />
					{#if rw_runes.includes(RUNES[rune_index + 1])}
						<span class="highlight"
							>{upgNb}
							<span class="rune">{RUNES[rune_index + 1]}</span>
						</span>
					{:else}
						{upgNb}
						<span class="rune">{RUNES[rune_index + 1]}</span>
					{/if}
				</span>
				<br />
			{/if}
		{/each}
	{:else}
		<p>Missing:</p>
		{#each missing as nb, rune_index}
			{#if nb > 0}
				<span
					>{nb}
					<span class="rune">{RUNES[rune_index]}</span>
				</span>
				<br />
			{/if}
		{/each}
	{/if}
</div>

<style>
	.highlight {
		text-decoration: underline;
	}
	.rune {
		color: var(--color-craft);
	}
	.topaz {
		color: var(--color-topaz);
	}

	.amethyst {
		color: var(--color-amethyst);
	}

	.sapphire {
		color: var(--color-sapphire);
	}

	.ruby {
		color: var(--color-ruby);
	}

	.emerald {
		color: var(--color-emerald);
	}

	.diamond {
		color: var(--color-diamond);
	}
</style>
