<script lang="ts">
	import { RUNES, UPG_GEM, upgCost } from '$lib/rw.ts';
	import { ArrowRight } from 'lucide-svelte';

	interface cubedProps {
		upgsDone: number[];
		rw_runes: string[];
	}
	let { upgsDone, rw_runes }: cubedProps = $props();
</script>

<div>
	{#if upgsDone}
		{upgsDone}
		<!-- {#each upgsDone as upgNb, runeIndex}
			{#if upgNb > 0}
				<span
					>{upgNb * upgCost(runeIndex)}
					<span class="rune">
						{RUNES[runeIndex]}
					</span>
					{#if UPG_GEM[runeIndex]}
						+ {upgNb}
						<span class={UPG_GEM[runeIndex].toLowerCase()}>{UPG_GEM[runeIndex]}</span>
					{/if}
					<ArrowRight size="1em" />
					{#if rw_runes.includes(RUNES[runeIndex + 1])}
						<span class="highlight"
							>{upgNb}
							<span class="rune">{RUNES[runeIndex + 1]}</span>
						</span>
					{:else}
						{upgNb}
						<span class="rune">{RUNES[runeIndex + 1]}</span>
					{/if}
				</span>
			{/if}
		{/each} -->
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
