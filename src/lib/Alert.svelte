<script lang="ts">
	import { alerts, removeAlert } from "../stores";
	import { scale } from "svelte/transition";
</script>

{#each $alerts as alert, i}
	<div
		transition:scale
		class="alert"
		on:click={() => removeAlert($alerts[i])}
		style:top={i * 6 + 0.5 + "rem"}
	>
		<h1>{alert.header}</h1>
		<p>{alert.message}</p>
	</div>
{/each}

<style lang="scss">
	.alert {
		position: fixed;
		cursor: pointer;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 1rem;
		padding: 0.75rem;
		width: max-content;
		background-color: var(--accent-background);
		border: 1px solid var(--accent-color);
	}
</style>
