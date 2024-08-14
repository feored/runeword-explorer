<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { UPG_GEM, upg_cost } from '$lib/runewordcalc';
	import { ArrowRight } from 'lucide-svelte';
	import { calc_missing } from '$lib/runewordcalc';
	import { CircleHelp } from 'lucide-svelte';


	interface cubedProps {
		success: boolean;
		upgs_done: number[];
		rw_runes: string[];
		inventory: number[];
		cubing_steps: number;
	}
	let { success, upgs_done, rw_runes, inventory, cubing_steps }: cubedProps = $props();
	

	let gem_td_required = $derived.by(()=> {
		const LOWEST_RUNE_INDEX_GEM_REQUIRED = 9;
		let highest = 0;
		if (!success || !upgs_done){
			return highest;
		}
		for (let i = 0; i < upgs_done.length; i++){
			if (upgs_done[i] > 0){
				highest = i;
				if (i >= LOWEST_RUNE_INDEX_GEM_REQUIRED){
					break;
				}
			}
		}
		return highest >= LOWEST_RUNE_INDEX_GEM_REQUIRED;
	})

</script>

<div>
	{#if success}
		{#if cubing_steps > 0}
			<details open={cubing_steps <= 100}>
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
									</td>{#if gem_td_required}
									<td>{#if UPG_GEM[rune_index]}
									
										
											{upg_nb}
											<span class={UPG_GEM[rune_index].toLowerCase()}>{UPG_GEM[rune_index]}</span>
										{/if}</td>{/if}
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
			<em
				style="font-size: smallest;"
				data-html="true"
				data-tooltip="The smallest number of runes required&#10;&#13; to cube up to this runeword."
				><CircleHelp size="1rem" /></em
			>
		</details>
	{/if}
</div>

<style>

	:root {
		--color-topaz: rgb(255, 255, 0);
		--color-amethyst: rgb(153, 50, 204);
		--color-sapphire: rgb(79, 164, 230);
		--color-ruby: rgb(173, 26, 12);
		--color-emerald: rgb(27, 180, 47);
		--color-diamond: rgb(134, 134, 134);
	}

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
