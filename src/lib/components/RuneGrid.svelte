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

<div class="space-y-8 rounded border border-stone-500 bg-stone-800 p-4">
	<article>
		<fieldset class="grid grid-cols-11 gap-4">
			{#each RUNES as rune, index}
				<div class="flex w-2/3 flex-col">
					<input
						type="number"
						id={rune + '-input'}
						name={rune}
						min="0"
						step="1"
						bind:value={rune_inventory[index]}
						class="rounded border border-stone-500 bg-stone-700 text-right"
					/>
					<small class="text-right text-sm text-amber-400" id={rune + '-label'}>{rune}</small>
				</div>
			{/each}
		</fieldset>
	</article>
	<!-- <hr class="my-4 h-px border-0 bg-stone-950" /> -->
	<fieldset class="flex place-content-between">
		<button
			type="button"
			onclick={() => {
				setRunes(0, 33, 0);
			}}
			class="rounded border border-stone-600 bg-stone-700 px-4 py-2 text-amber-400"
		>Reset All</button>
		<div role="group" aria-labelledby="all_runes" class="auto-width">
			<input
				type="number"
				aria-describedby="all_runes"
				id="all_runes"
				name="all_runes"
				bind:value={all_set_nb}
				min="0"
				step="1"
				class="rounded border border-stone-500 bg-stone-700 text-right py-2"
			/>
			<button
				type="button"
				
				onclick={() => {
					setRunes(0, 33, all_set_nb);
				}}
				class="rounded border border-stone-600 bg-stone-700 px-4 py-2 text-amber-400"
			>Set All</button>
		</div>
	</fieldset>
</div>

<style>
</style>
