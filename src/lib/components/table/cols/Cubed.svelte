<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { UPG_GEM, upgCost } from '$lib/runewordcalc';
	import { ArrowRight } from 'lucide-svelte';

	interface cubedProps {
		show: boolean;
		upgs_done: number[];
		rw_runes: string[];
	}
	let { show, upgs_done, rw_runes }: cubedProps = $props();

	function sum_steps(upgs){
		var total = 0;
		var i = upgs.length; 

		while (i--) {
			total += upgs_done[i];
		}

		return total;
	}
</script>

<div>
	{#if show && upgs_done}
	<details>
		<summary>{sum_steps(upgs_done)} Steps</summary>
	<table>
		{#each upgs_done as upgNb, runeIndex}
			{#if upgNb > 0}
				<tr>
					<td>
						<span
					>{upgNb * upgCost(runeIndex)}
					<span class="rune">
						{RUNES[runeIndex]}
					</span>
					</span>
				</td>
				<td>
					{#if UPG_GEM[runeIndex]}
					
						{upgNb}
						<span class={UPG_GEM[runeIndex].toLowerCase()}>{UPG_GEM[runeIndex]}</span>
					
					{/if}</td>
					<td>
					<ArrowRight size="1em" />
					</td>
					<td>
					{#if rw_runes.includes(RUNES[runeIndex + 1])}
						<span class="highlight"
							>{upgNb}
							<span class="rune">{RUNES[runeIndex + 1]}</span>
						</span>
					{:else}
						{upgNb}
						<span class="rune">{RUNES[runeIndex + 1]}</span>
					{/if}
					</td>
			</tr>
			{/if}
		{/each}
			</table>
			</details>
	{/if}
</div>

<style>

	td {
		border: none;
		min-width:0;
		padding:0.25rem;
		background-color: black !important;
	}

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
