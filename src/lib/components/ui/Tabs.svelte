<nav role="tab-control">
	<ul>
	  <li><label for="tab1">Tab 1</label></li>
	  <li><label for="tab2">Tab 2</label></li>
	  <li><label for="tab3">Tab 3</label></li>
	</ul>
  </nav>
  <div role="tabs">
	<section>
	  <input hidden="hidden" type="radio" name="tabs" id="tab1" checked="checked" />
	  <figure>
		<blockquote>
		  "When you're new to something, you bring an ignorance that can
		  be highly innovative."
		  <footer>
			<cite>– Rick Rubin</cite>
		  </footer>
		</blockquote>
	  </figure>

	  <input hidden="hidden" type="radio" name="tabs" id="tab2" />

	  <figure>
		<blockquote>
		  "Nothing beats a simple worldview. When we know who is the bad
		  guy, the day has structure."
		  <footer>
			<cite>– Volker Pispers</cite>
		  </footer>
		</blockquote>
	  </figure>

	  <input hidden="hidden" type="radio" name="tabs" id="tab3" />

	  <figure>
		<blockquote>
		  "Ignorance is not bliss. Ignorance is poverty. Ignorance is devastation.
		  Ignorance is tragedy. And ignorance is illness. It all stems from ignorance."
		  <footer>
			<cite>– Jim Rohn</cite>
		  </footer>
		</blockquote>
	  </figure>
	</section>
  </div>

<style>
	[role="tabs"] {
  display: flex;
}

[role="tabs"] section {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

[role="tabs"] figure {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  display: none;
}

[role="tabs"] [type="radio"]:checked + figure {
  display: block;
}

nav[role="tab-control"] label.active {
  color: var(--primary);
  cursor: pointer;
}

</style>