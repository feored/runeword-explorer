<script lang="ts">
	import { INTRODUCED_IN } from '#lib/data/runewords.ts';
	import { EDITIONS, patch_ids, type Edition } from '#lib/data/rulesets.ts';
	import { filter_options } from '#lib/options.svelte.ts';

	const groups = Object.entries(EDITIONS)
		.map(([edition, label]) => ({
			edition: edition as Edition,
			label,
			introductions: patch_ids(edition as Edition).flatMap((patch) =>
				INTRODUCED_IN.filter(
					(introduction) => introduction.edition === edition && introduction.patch === patch
				)
			)
		}))
		.filter(({ introductions }) => introductions.length);

	let selected = $state({ ...filter_options.introduced_in });
	$effect(() => {
		filter_options.introduced_in = { ...selected };
	});

	export function set_all(value: boolean): void {
		for (const introduction of INTRODUCED_IN) selected[introduction.id] = value;
		selected = { ...selected };
	}
</script>

<div class="flex">
	<div class="flex all_or_none">
		<button class="outline" onclick={() => set_all(true)}> All </button>
		<p>/</p>
		<button class="outline secondary" onclick={() => set_all(false)}> None </button>
	</div>
</div>
<article>
	{#each groups as group (group.edition)}
		<fieldset>
			<legend>{group.label}</legend>
			<div class="custom-grid">
				{#each group.introductions as introduction (introduction.id)}
					<label>
						<input
							type="checkbox"
							name="introduced_in"
							value={introduction.id}
							bind:checked={selected[introduction.id]}
						/>
						{introduction.patch}
					</label>
				{/each}
			</div>
		</fieldset>
	{/each}
</article>

<style>
	.custom-grid {
		grid-template-columns: repeat(3, 1fr);
	}
</style>
