<script lang="ts">
	let { name, notes = [] }: { name: string; notes?: string[] } = $props();
</script>

<div>
	<p class="name">{name}</p>
	{#each notes as note (note)}
		<p>{note}</p>
	{/each}
</div>

<style>
	.name {
		font-weight: 500;
		color: var(--color-unique);
	}
</style>
