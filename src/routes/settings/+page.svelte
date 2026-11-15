<script lang="ts">
	import { version } from '$app/env';
	import { resolve } from '$app/paths';
	import { House } from '@lucide/svelte';
	import { default_settings, settings } from '#lib/options.svelte.ts';

	const MAX_STEPS = default_settings.max_steps;
</script>

<div class="container-fluid">
	<nav>
		<ul>
			<li>
				<strong>
					Runeword Explorer v{version}
				</strong>
			</li>
		</ul>
		<ul>
			<li>
				<a href={resolve('/')}><House size="1rem" /> Home</a>
			</li>
			<li>
				<a href="https://github.com/feored/runeword-explorer/">Github</a>
			</li>
		</ul>
	</nav>
	<hr />
	<div class="container">
		<h3>Settings</h3>

		<article>
			<header>
				<b>Max Cubing Steps</b>
				<p><small>Maximum number of cubing steps to show before collapsing.</small></p>
			</header>
			<div role="group" class="auto-width">
				<input type="number" name="max_steps" min="0" step="1" bind:value={settings.max_steps} />
				<button
					onclick={() => {
						settings.max_steps = MAX_STEPS;
					}}>Reset</button
				>
			</div>
		</article>
		<article>
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
		</article>
		<article>
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
		</article>
	</div>
</div>
