<script lang="ts">
	import { profile } from "../stores";
	import { writable } from "svelte/store";

	const stats = writable({
		maxprofit: 0,
		userbalance: 0,
		serverbalance: 0
	} as {
		maxprofit: number | string;
		userbalance: number | string;
		serverbalance: number | string;
	});

	stats.subscribe((value) => {
		const { maxprofit, userbalance, serverbalance } = value;
		if (`${maxprofit}`.length <= 9) return;
		stats.set({
			maxprofit: `${maxprofit}`.slice(0, 9),
			userbalance: `${userbalance}`.slice(0, 9),
			serverbalance: `${serverbalance}`.slice(0, 9)
		});
	});

	async function refreshStats() {
		const response = await fetch("https://mokazino.net/api/v1/serverstats");
		const json = await response.json();
		stats.set(json);
	}

	profile.subscribe(() => refreshStats());
</script>

<div id="server-stats">
	<span>Max profit: {$stats.maxprofit}</span>
	<span>Reserved balance: {$stats.userbalance}</span>
	<span>Server balance: {$stats.serverbalance}</span>
</div>

<style lang="scss">
	#server-stats {
		font-size: 1rem;
		display: flex;
		text-overflow: ellipsis;
		flex-direction: row;
		justify-content: space-evenly;
		padding: 0.1rem;
		animation: running-text linear infinite 5s;
		background-color: var(--darker-window-color);
		border-bottom: 2px solid var(--accent-color);

		span:not(:first-child) {
			margin-inline: 1rem;
		}
	}
</style>
