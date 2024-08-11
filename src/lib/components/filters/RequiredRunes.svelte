<script lang="ts">
	import { RUNES } from '$lib/rw';
	import type { FilterOptions } from '$lib/runewords.svelte.ts';
	import { filter_options } from '$lib/runewords.svelte.ts';
	let required_runes = $state([...filter_options.required_runes]);
	$effect(() => {
		filter_options.required_runes = [...required_runes];
	});

	export function setRequiredRunes(value) {
		for (let i = 0; i < RUNES.length; i++) {
			required_runes[i] = value;
		}
		required_runes = [...required_runes];
	}
</script>

<div id="required_runes">
	<div class="flex">
		<h5>Required Runes</h5>
		<div class="flex all_or_none">
			<a href={'#'} onclick={() => setRequiredRunes(false)}> None </a>
		</div>
	</div>
	<article>
		<fieldset class="rune-grid">
			{#each RUNES as rune, index}
				<label
					><input
						type="checkbox"
						name={'required-' + rune}
						value={rune}
						bind:checked={required_runes[index]}
					/>{rune}</label
				>
			{/each}
		</fieldset>
	</article>
</div>

<style>
	.rune-grid {
		display: grid;
		grid-auto-flow: row;
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		grid-template-rows: repeat(auto-fill, 1fr);
		column-gap: var(--pico-grid-column-gap);
		row-gap: var(--pico-grid-row-gap);
	}
</style>
