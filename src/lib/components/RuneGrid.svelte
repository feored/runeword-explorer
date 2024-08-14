<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { rune_inventory } from '$lib/options.svelte';

	let all_set_nb = $state(1);
	let ranges = [
		{start: 0, end: 33, display: 'All'},
		{start: 0, end: 11, display: 'El to Amn'},
		{start: 11, end: 22, display: 'Sol to Um'},
		{start: 22, end: 33, display: 'Mal to Zod'}
	];
	let selected_range = $state(0);

	function setRunes(value: number): void {
		let rune_range = ranges[selected_range];
		for (let i = rune_range.start; i < rune_range.end; i++) {
			rune_inventory[i] = value;
		}
	}
</script>

<article id="runes">
	{#each [0, 1, 2] as row}
		<div class="rune-grid" style="align-items:center; margin:auto;">
			{#each RUNES.slice(row*11, (row+1)*11) as rune, index}
				<div>
					<input
						type="number"
						id={rune + '-input'}
						name={rune}
						min="0"
						step="1"
						bind:value={rune_inventory[row*11 + index]}
					/>
					<small id={rune + '-label'}>{rune}</small>
				</div>
			{/each}
		</div>	
	{/each}
	<hr />
	<fieldset class="flex" style="justify-content: space-between;">
		<button
			class="reset outline"
			type="button"
			onclick={() => {
				setRunes(0);
			}}
		>Reset</button>
		<div aria-labelledby="all_runes" class="set-runes">
			
				<input
				type="number"
				aria-describedby="all_runes"
				id="all_runes"
				name="all_runes"
				bind:value={all_set_nb}
				min="0"
				step="1"
			/>
			<div role="group">
				<input
					type="button"
					value="Set"
					onclick={() => {
						setRunes(all_set_nb);
					}}
				/>
				<select name="rune-range" aria-label="Range of runes to set" bind:value={selected_range}>
					{#each ranges as range, index}
						<option value={index}>{range.display}</option>
					{/each}
				</select>
			</div>
		</div>
	</fieldset>
</article>


<style>

	#runes small {
		font-size: medium;
	}

	.set-runes {
		display: flex;
		justify-content: space-between;
		gap: var(--pico-form-element-spacing-horizontal);
	}
	
	.rune-grid {
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: repeat(11, 1fr);
		justify-items: center;
		column-gap: var(--pico-grid-column-gap);
		row-gap: var(--pico-grid-row-gap);
	}


	input[type='number'] {
		min-width: 3rem;
		max-width: 5rem;
	}
</style>
