<script lang="ts">
	import { currency, changeCurrency } from "../stores";

	let loaded = true;
	let errored = false;

	async function changeCurrentCurrency() {
		loaded = false;
		const response = await changeCurrency();
		loaded = true;
		if (response) {
			errored = false;
		} else {
			errored = true;
		}
	}
</script>

<button disabled={!loaded} on:click={changeCurrentCurrency} id="currency-switcher">
	{#if loaded}
		{#if errored}
			<span
				class="sync-failure material-icons"
				title="Failed changing currency, look into console for more details."
			>
				sync_problem
			</span>
		{:else}
			<img src={`/images/${$currency}.svg`} alt={`${$currency} logo`} class="currency-logo" />
		{/if}
	{:else}
		<span class="material-icons sync">sync</span>
	{/if}
</button>

<style lang="scss">
	#currency-switcher {
		> .currency-logo {
			height: 100%;
		}
	}
</style>
