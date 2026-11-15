<script lang="ts">
	import { settings } from '#lib/options.svelte.ts';
	import { EDITIONS, MODES, patch_ids, type Edition } from '#lib/data/rulesets.ts';

	function change_edition(event: Event) {
		const edition = (event.currentTarget as HTMLSelectElement).value as Edition;
		settings.profile = {
			...settings.profile,
			edition,
			patch: patch_ids(edition).at(-1)!
		};
	}
</script>

<article>
	<label for="game-edition">Edition</label>
	<select id="game-edition" value={settings.profile.edition} onchange={change_edition}>
		{#each Object.entries(EDITIONS) as [id, label] (id)}
			<option value={id}>{label}</option>
		{/each}
	</select>
	<div class="game-options">
		<label for="game-patch">Patch</label>
		<label for="game-mode">Mode</label>
		<select id="game-patch" bind:value={settings.profile.patch}>
			{#each patch_ids(settings.profile.edition) as patch (patch)}
				<option value={patch}>{patch}</option>
			{/each}
		</select>
		<select id="game-mode" bind:value={settings.profile.mode}>
			{#each Object.entries(MODES) as [id, label] (id)}
				<option value={id}>{label}</option>
			{/each}
		</select>
	</div>
</article>

<style>
	.game-options {
		display: grid;
		grid-template-columns: minmax(4.5rem, 1fr) minmax(0, 2fr);
		gap: 0.35rem 0.5rem;
		align-items: center;
	}

	.game-options label,
	.game-options select {
		margin: 0;
	}

	.game-options select {
		min-width: 0;
		padding-inline: 0.5rem 1.5rem;
		background-position: center right 0.4rem;
	}
</style>
