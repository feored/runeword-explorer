<script lang="ts">
	import { onMount } from "svelte";

	const ANIMATION_DURATION = 400;

	let dialog: HTMLDialogElement;
	let article: HTMLElement;
	let html: HTMLElement;

	onMount(() => {
		html = document.documentElement;
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeydown);
	});


	export function open(){
		console.log("Opening modal");
		html.classList.add("modal-is-open", "modal-is-opening");
		dialog.showModal();
		console.log("Show aclled");
		setTimeout(() => html.classList.remove("modal-is-opening"), ANIMATION_DURATION);
	}

	export function close(){
		html.classList.add("modal-is-closing");
		setTimeout(() => {
			html.classList.remove("modal-is-open");
			dialog.close();
		}, ANIMATION_DURATION);
	}

	function handleClick(event: MouseEvent){
		if (dialog && dialog.open && !article.contains(event.target)){
			close();
		}
	}

	function handleKeydown(event: KeyboardEvent){
		if (dialog && dialog.open && event.key === "Escape"){
			close();
		}
	}
</script>

<dialog bind:this={dialog}>
	<article bind:this={article}>
		<slot name="header" />
		<hr />
		<slot />
		<hr />
		<footer>
			<slot name="footer" />
		</footer>
	</article>
</dialog>
