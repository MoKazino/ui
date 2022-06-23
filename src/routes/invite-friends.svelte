<script>
	import { browser } from "$app/env";

	import { loggedIn, profile } from "$lib/stores";
</script>

<main id="content">
	<div id="main-container">
		<h1>Invite friends</h1>

		<img src="/images/logo.svg" alt="Logo of Mokazino" width="256" height="256" />

		<p>
			You can invite friends to earn 50% of the house edge on every bet!
			<br />
			No matter if they win or lose - you earn. Here is your personal, unique link.
			<br />
			When somebody uses it to register, you will earn monero!
			<br />
			<code>{browser && location.origin + `/?ref=${$profile.user.id}`}</code>
		</p>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		#main-container {
			flex-direction: column;
			align-items: center;
			justify-content: center;

			> p {
				text-align: center;

				> code {
					width: max-content;
					display: inline-block;
					margin-top: 0.5rem;
				}
			}
		}
	}
</style>
