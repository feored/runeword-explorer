<script lang="ts">
	import { VERSIONS } from '$lib/rw';
	import { filter_options } from '$lib/runewords.svelte.ts';

	let filter_versions = $state({ ...filter_options.versions });
	$effect(() => {
		filter_options.versions = { ...filter_versions };
	});
</script>

<article id="filter_versions">
	<fieldset class="custom-grid">
		{#each VERSIONS as version}
			<label>
				<input
					type="checkbox"
					name="version"
					value={version}
					bind:checked={filter_versions[version]}
				/>
				{version}
			</label>
		{/each}
	</fieldset>
</article>
