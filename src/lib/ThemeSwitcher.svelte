<script lang="ts">
	import { onMount } from "svelte";

	let currentTheme = "dark";
	let root: HTMLElement;

	onMount(() => {
		currentTheme = localStorage.getItem("theme") ?? currentTheme;
		root = document.querySelector(":root") as HTMLElement;

		updateTheme();
	});

	function updateTheme() {
		for (const style of [
			"text-color",
			"background-color",
			"window-color",
			"darker-window-color",
			"even-darker-window-color",
			"lighter-window-color",
			"accent-background",
			"inversed-text-color",
			"success-color"
		]) {
			root.style.setProperty(`--${style}`, `var(--${currentTheme}-${style})`);
		}
	}

	function switchTheme() {
		currentTheme = currentTheme === "dark" ? "light" : "dark";
		updateTheme();
		localStorage.setItem("theme", currentTheme);
	}
</script>

<button id="theme-switcher" on:click={switchTheme} class="material-icons">
	{`${currentTheme}_mode`}
</button>

<style lang="scss">
	#theme-switcher {
		color: var(--accent-color);
	}
</style>
