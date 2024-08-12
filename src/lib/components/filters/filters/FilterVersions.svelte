<script lang="ts">
	import { VERSIONS } from '$lib/data/versions';
	import { filter_options } from '$lib/options.svelte';

	let filter_versions = $state({ ...filter_options.versions });
	$effect(() => {
		filter_options.versions = { ...filter_versions };
	});

	export function setVersions(value: boolean): void {
		for (let i = 0; i < VERSIONS.length; i++) {
			filter_versions[VERSIONS[i]] = value;
		}
		filter_versions = { ...filter_versions };
	}
</script>

<div class="flex">
	<h5>Version</h5>
	<div class="flex all_or_none">
		<button class="outline" onclick={() => setVersions(true)}> All </button>
		<p>/</p>
		<button class="outline secondary" onclick={() => setVersions(false)}> None </button>
	</div>
</div>
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
