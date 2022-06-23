<script>
	import { loggedIn } from "$lib/stores";
</script>

<main id="content">
	<div id="main-container">
		<img src="/images/logo.svg" alt="Logo of Mokazino" width="256" height="256" />

		<p>
			You're about to enter the simplest, most private, provably fair and community-funded casino!
		</p>

		{#if !$loggedIn}
			<div id="join-mokazino">
				<a href="/login?register=true" class="button-like accent">Sign up</a>
				<a href="/login" class="button-like">Log in</a>
			</div>
		{/if}

		<hr />
		<div class="links">
			<a rel="external" target="_blank" href="/message.txt">
				<span class="material-icons" style:color="var(--text-color)">article</span>
				message.txt</a
			>
			<a rel="external" target="_blank" href="https://t.me/MoKazino">
				<img src="/images/brands/telegram.svg" width="24" alt="Twitter logo" />
				t.me/MoKazino</a
			>
			<a rel="external" target="_blank" href="https://twitter.com/MoKazino">
				<img src="/images/brands/twitter.svg" width="24" alt="Twitter logo" />
				twitter.com/MoKazino</a
			>
		</div>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		#main-container {
			flex-direction: column;
			align-items: center;
		}
	}

	#join-mokazino {
		margin-top: 1rem;
	}

	.links {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;

		> a {
			display: flex;
			align-items: center;
			text-decoration: none;

			margin-inline: 0.5rem;

			* {
				margin-inline: 0.5rem;
			}
		}

		padding: 0.5rem;
	}
</style>
