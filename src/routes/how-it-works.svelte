<script lang="ts">
	import { onMount } from "svelte";
	import TextInput from "$lib/TextInput.svelte";
	import { createAlert, profile, updateProfile } from "../stores";

	let clientSeed = $profile.user.clientseed;

	async function saveClientSeed() {
		const response = await fetch("/api/v1/profile_update", {
			method: "POST",
			body: new URLSearchParams({
				clientseed: clientSeed
			})
		});
		updateProfile();

		if (!response.ok) {
			createAlert({
				expireAfter: 8000,
				header: "Saving client_seed failed",
				message: await response.text()
			});
		}
	}

	// nonce should be always up-to-date
	onMount(updateProfile);
</script>

<main id="content">
	<div id="main-container">
		<section id="how-it-works">
			<h1>Mokazino Dice is probably fair.</h1>
			<hr />

			Numbers are generated using 4 strings (including one decimal representation of an integer):
			<br />
			<br />
			<ul>
				<li>
					<span>
						<code>client_seed</code> - This one is controlled by you, you can change it in the settings
					</span>
				</li>
				<li>
					<span>
						<code>server_seed</code> - This is the seed that server generates for you, it is kept secret
						until you decide to reveal it. Its length is generated randomly.
					</span>
				</li>
				<li>
					<span>
						<code>nonce</code> - This is a number that goes up from zero, untill you revoke the server
						key.
					</span>
				</li>
			</ul>
			<br />
			<p>
				Then they're combined into a string:<code>{"${client_seed}:{server_seed}:${nonce}"}</code>.
				This string then gets hashed using <code>sha512</code>. After that first 8 characters are
				picked, parsed to int and then modulo of this number is returned.<br />
			</p>
			<br />
			<p>
				Still not sure how it works? <a
					href="https://github.com/MoKazino/MoKazino/blob/master/web/provably_fair.go"
					rel="external"
					target="_blank">Check the code.</a
				>
			</p>
		</section>

		<hr />

		<form id="change-clientseed" on:submit|preventDefault>
			<TextInput
				disabled={true}
				value={`${$profile.user.nonce}`}
				materialIcon={"pin"}
				label={"nonce"}
			/>
			<TextInput
				bind:value={clientSeed}
				materialIcon={"settings"}
				label={"client_seed"}
				maxLength={32}
			/>
			<input
				type="submit"
				class="accent"
				value="Save new client_seed"
				disabled={clientSeed === $profile.user.clientseed}
				on:click={saveClientSeed}
			/>
		</form>

		<hr />
		<section id="getting-scammed">
			<p>
				Want to make sure that I've never ever cheated on you?
				<br />
				Come and
				<a href="/api/v1/reset_seed">grab the bet history</a>.
				<br />
				<strong
					>Keep in mind that visiting this link will revoke your<code>server_key</code>, and reset
					<code>nonce</code> to 0.</strong
				>
			</p>
		</section>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		> #main-container {
			flex-direction: column;
			align-items: center;

			> #how-it-works {
				all: inherit;
			}

			> #change-clientseed {
				all: inherit;
				width: 75%;

				> input[type="submit"] {
					font-size: 1rem;
					margin-top: 0.5rem;
				}
			}

			> #getting-scammed {
				width: 100%;
				code {
					margin-inline: 0.15rem;
					padding: 0 0.2rem;
				}
			}
		}
	}
</style>
