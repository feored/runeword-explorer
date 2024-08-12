<script lang="ts">
	import { VERSIONS } from '$lib/rw';
	import { filter_options } from '$lib/runewords.svelte.ts';

	let filter_versions = $state({ ...filter_options.versions });
	$effect(() => {
		filter_options.versions = { ...filter_versions };
	});

	export function setVersions(value) {
		for (let i = 0; i < VERSIONS.length; i++) {
			filter_versions[VERSIONS[i]] = value;
		}
		filter_versions = { ...filter_versions };
	}
	let VERSION_NAMES = {
		'1.09': 'D2 1.09',
		'1.10': 'D2 1.10',
		'1.11': 'D2 1.11',
		'2.4': 'D2R 2.4',
		'2.6': 'D2R 2.6'
	};
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
				{VERSION_NAMES[version]}
			</label>
		{/each}
	</fieldset>
</article>
