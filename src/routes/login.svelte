<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	import { createAlert, loggedIn, updateProfile } from "../stores";

	let registerMode = false;
	onMount(() => {
		const url = new URL(location.href);
		if (url.searchParams.get("register") === "true") registerMode = true;
	});

	let username = "";
	let password = "";

	$: validUsername = /^[A-Za-z0-9]+$/.test(username);
	$: validPassword = /^[A-Za-z0-9]+$/.test(password);
	$: submitable = !(validPassword && validUsername);

	$: params = new URLSearchParams({
		username,
		password
	}).toString();

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		console.log(params);
		const response = await fetch(
			`/api/v1/${registerMode ? "register" : "login"}/json`,
			{
				headers: {
					"content-type": "application/x-www-form-urlencoded"
				},
				method: "POST",
				credentials: "include",
				body: params
			}
		);

		let json;
		try {
			json = await response.json();
		} catch {}
		if (!json?.ok) {
			createAlert({
				expireAfter: 7500,
				header: registerMode ? "Registration failed" : "Logging in failed",
				message: json?.message ?? (await response.text())
			});

			return false;
		}

		goto("./?login");
		return true;
	}
</script>

<main id="content">
	<div id="main-container">
		<img src="./images/logo.svg" alt="Logo of Mokazino" width="256" height="256" />

		<form on:submit={submit}>
			<input
				type="text"
				bind:value={username}
				name="username"
				id="username"
				placeholder="Your username"
			/>
			{#if username && !validUsername}
				<label for="username" class="error">Username can only contain alphanumeric characters</label
				>
			{/if}
			<input
				type="password"
				bind:value={password}
				name="password"
				id="password"
				placeholder="Your password"
			/>
			{#if password && !validPassword}
				<label for="password" class="error">Password can only contain alphanumeric characters</label
				>
			{/if}
			<input
				class="accent"
				disabled={submitable}
				type="submit"
				value={registerMode ? "Register" : "Login"}
			/>

			<footer>
				{#if registerMode}
					You have an account? <button on:click={() => (registerMode = !registerMode)}
						>Login instead</button
					>
				{:else}
					Don't have an account? <button on:click={() => (registerMode = !registerMode)}
						>Register instead</button
					>
				{/if}
			</footer>
		</form>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 25rem;
		padding: 0;

		#main-container {
			flex-direction: column;
			align-items: center;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		width: 100%;
		height: 100%;

		input {
			width: 50%;
			margin: 0.25rem 0;
		}

		footer {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-radius: 0 0 0.5rem 0.5rem;
			padding: 0.5rem;
			width: 100%;
			height: 100%;
			margin-top: 2rem;
			background-color: var(--accent-background);
		}
	}
</style>
