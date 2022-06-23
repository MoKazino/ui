<script lang="ts" context="module">
	import { routeGuard } from "$lib/routeGuard";
    import type { LoadEvent, LoadOutput } from "@sveltejs/kit";
 

	export async function load({ url }: LoadEvent): Promise<LoadOutput> {
        return await routeGuard({ url });
    }
</script>

<script lang="ts">
	//TODO: error pages
	import NavBar from "$lib/NavBar.svelte";

	import "../app.scss";
	import "@fontsource/material-icons";
	import ChatBubble from "$lib/ChatBubble.svelte";

	import { loggedIn, updateProfile } from "$lib/stores";
	import Alert from "$lib/Alert.svelte";
	import { onMount } from "svelte";
	import ServerStatsBar from "$lib/ServerStatsBar.svelte";
	onMount(() => {
		loggedIn.set(!!localStorage.getItem("loggedIn"));
		updateProfile();
	});
</script>

<Alert />
{#if $loggedIn}
	<ServerStatsBar />
	<ChatBubble />
{/if}
<NavBar />

<slot />
