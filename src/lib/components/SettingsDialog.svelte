<script lang="ts">
	import { default_settings, settings } from '#lib/options.svelte.ts';
	import { X } from '@lucide/svelte';

	let dialog: HTMLDialogElement;

	export function open() {
		dialog.showModal();
	}
</script>

<dialog bind:this={dialog}>
	<article>
		<header class="dialog-header">
			<h3>Settings</h3>
			<button class="close" aria-label="Close" onclick={() => dialog.close()}><X /></button>
		</header>
		<section>
			<header>
				<b>Max Cubing Steps</b>
				<p><small>Maximum number of cubing steps to show before collapsing.</small></p>
			</header>
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button onclick={() => (settings.max_steps = default_settings.max_steps)}>Reset</button>
			</div>
		</section>
		<section>
			<header>
				<b>Expand Bases</b>
				<p>
					<small>
						Show the full list of bases instead of the category name (Weapons, Helms, etc) and a
						tooltip.</small
					>
				</p>
			</header>
			<label for="expand_bases">
				<input type="checkbox" role="switch" bind:checked={settings.expand_bases} />Expand Base
				Categories
			</label>
		</section>
		<section>
			<header>
				<b>Missing Runes Calculation</b>
				<p>
					<small>
						Calculate missing runes based on the least rune value required while taking into account
						cubing.<br /> Example: If you're missing an Um, but you have a Pul, suggest a Pul (to
						cube the two Puls into the Um.)<br /> Turn off to have the normal missing rune calc (e.g if
						you're missing an Um, show Um).
					</small>
				</p>
			</header>
			<label for="missing_runes_cube_mode">
				<input
					type="checkbox"
					role="switch"
					bind:checked={settings.missing_runes_cube_mode}
				/>Extended Missing Runes Calculation
			</label>
		</section>
	</article>
</dialog>

<style>
	dialog article {
		max-height: calc(100vh - 2rem);
		overflow: auto;
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.dialog-header h3,
	.close {
		margin: 0;
	}

	.close {
		width: auto;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
	}

	section + section {
		margin-top: var(--pico-spacing);
	}
</style>
