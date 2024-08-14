<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { UPG_GEM, upg_cost } from '$lib/runewordcalc';
	import { ArrowRight } from 'lucide-svelte';
	import { calc_missing } from '$lib/runewordcalc';

	interface cubedProps {
		success: boolean;
		upgs_done: number[];
		rw_runes: string[];
		inventory: number[];
		cubing_steps: number;
	}
	let { success, upgs_done, rw_runes, inventory, cubing_steps }: cubedProps = $props();
</script>

<div>
	{#if success}
		{#if cubing_steps > 0}
			<details>
				<summary>{cubing_steps} Steps</summary>
				<table>
					<tbody>
						{#each upgs_done as upg_nb, rune_index}
							{#if upg_nb > 0}
								<tr>
									<td>
										<span
											>{upg_nb * upg_cost(rune_index)}
											<span class="rune">
												{RUNES[rune_index]}
											</span>
										</span>
									</td>
									<td>
										{#if UPG_GEM[rune_index]}
											{upg_nb}
											<span class={UPG_GEM[rune_index].toLowerCase()}>{UPG_GEM[rune_index]}</span>
										{/if}</td
									>
									<td>
										<ArrowRight size="1em" />
									</td>
									<td>
										{#if rw_runes.includes(RUNES[rune_index + 1])}
											<span class="highlight"
												>{upg_nb}
												<span class="rune">{RUNES[rune_index + 1]}</span>
											</span>
										{:else}
											{upg_nb}
											<span class="rune">{RUNES[rune_index + 1]}</span>
										{/if}
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</details>
		{/if}
	{:else}
		<details>
			<summary>Missing Runes</summary>
			
			<table>
				<tbody>
					{#each calc_missing(inventory, rw_runes) as nb, rune_index}
						{#if nb > 0}
							<tr>
								<td>
									{nb}
								</td>
								<td>
									<span class="rune">{RUNES[rune_index]}</span>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
			<em style="font-size: smallest;" data-html="true" data-tooltip="The smallest number of runes required&#10;&#13; to cube up to this runeword.">?<em>
		</details>
	{/if}
</div>

<style>
	td {
		border: none;
		min-width: 0;
		padding: 0.25rem;
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
