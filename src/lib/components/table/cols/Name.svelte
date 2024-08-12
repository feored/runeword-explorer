<script lang="ts">
	interface RWNameProps {
		name: string;
		d2r_only: boolean;
		d2r_ladder: boolean;
		d2lod_ladder: boolean;
	}
	let { name, d2r_only, d2r_ladder, d2lod_ladder }: RWNameProps = $props();

	const tooltips = {
		d2r_only:
			'Runeword only available in Diablo II: Resurrected.\nCannot be made in Diablo II: Lord of Destruction.',
		d2r_ladder:
			'Runeword restricted to ladder in Diablo II: Resurrected.\nCan be made in single-player mode.',
		d2lod_ladder:
			'Runeword restricted to ladder in Diablo II:  Lord of Destruction.\nCan be made in any mode in Diablo II: Resurrected.'
	};
</script>

<div>
	<p class="name">{name}</p>
	{#if [d2r_only, d2r_ladder, d2lod_ladder].filter(Boolean).length > 0}
		<div class="warnings">
			{#if d2r_only}
				<small data-tooltip={tooltips.d2r_only} data-placement="bottom" class="warning d2r_only"
					>D2R</small
				>
			{/if}
			{#if d2r_ladder}
				<small data-tooltip={tooltips.d2r_ladder} data-placement="bottom" class="warning d2r_ladder"
					>Ladder</small
				>
			{/if}
			{#if d2lod_ladder}
				<small
					data-tooltip={tooltips.d2lod_ladder}
					data-placement="bottom"
					class="warning d2lod_ladder">D2LoD Ladder</small
				>
			{/if}
		</div>
	{/if}
</div>

<style>
	.name {
		font-size: larger;
		color: var(--color-unique);
	}

	.warnings {
		margin-top: var(--pico-spacing);
		display: flex;
		gap: var(--pico-spacing);
		justify-content: center;
	}

	.warnings [data-tooltip] {
		border-bottom: none;
	}
</style>
