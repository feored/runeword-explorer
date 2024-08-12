<script lang="ts">
	import { RUNES } from '$lib/data/runes';
	import { rune_inventory } from '$lib/options.svelte';

	let all_set_nb = $state(1);

	function setRunes(start: number, end: number, value: number): void {
		for (let i = start; i < end; i++) {
			rune_inventory[i] = value;
		}
	}
</script>

<article id="runes">
	<fieldset class="custom-grid">
		{#each RUNES as rune, index}
			<div>
				<input
					type="number"
					id={rune + '-input'}
					name={rune}
					min="0"
					step="1"
					bind:value={rune_inventory[index]}
				/>
				<small id={rune + '-label'}>{rune}</small>
			</div>
		{/each}
	</fieldset>
</article>
<hr />
<fieldset class="flex" style="justify-content: space-between;">
	<input
		type="button"
		value="Reset All"
		onclick={() => {
			setRunes(0, 33, 0);
		}}
		class="auto-width"
	/>
	<div role="group" aria-labelledby="all_runes" class="auto-width">
		<input
			type="number"
			aria-describedby="all_runes"
			id="all_runes"
			name="all_runes"
			bind:value={all_set_nb}
			min="0"
			step="1"
		/>
		<input
			type="button"
			value="Set All"
			onclick={() => {
				setRunes(0, 33, all_set_nb);
			}}
		/>
	</div>
</fieldset>

<style>
	#runes small {
		font-size: medium;
	}
</style>
