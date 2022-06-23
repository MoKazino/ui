<script lang="ts">
import { onMount } from "svelte";
	import { loggedIn } from "$lib/stores";
	import CurrencySwitcher from "./CurrencySwitcher.svelte";
	import ThemeSwitcher from "./ThemeSwitcher.svelte";
	import { slide } from "svelte/transition";
	import { sineInOut } from "svelte/easing";
	
	let innerWidth: number;
	let logoText = "Mokazino";
	let showMobileMenu = false;

	function updateLogoText() {
		logoText = window.innerWidth < 1200 ? "" : "MoKazino";
	}

	onMount(updateLogoText);
</script>

<svelte:window bind:innerWidth on:resize={updateLogoText} />

<nav id="navigation-menu">
	<a href="/" class="logo">
		<img src="/images/logo-textless.svg" alt="Mokazino logo" />
		<p>{logoText}</p>
	</a>

	<span class="vertical-rule" />

	<ul id="navigation-items">
		{#if $loggedIn}
			<li>
				<a href="./game" class="button-like accent">Play</a>
			</li>
			<li>
				<a href="./deposit" class="button-like">Deposit</a>
			</li>
			<li>
				<a href="./withdraw" class="button-like">Withdraw</a>
			</li>
			{#if innerWidth >= 960}
				<li>
					<a href="./how-it-works" class="button-like">How it works</a>
				</li>

				<li>
					<a href="./invest" class="button-like">Become an investor</a>
				</li>
				<li>
					<a href="./invite-friends" class="button-like">Invite friends</a>
				</li>
			{:else}
				<li class="right-item">
					<button on:click={() => (showMobileMenu = true)} class="material-icons">menu</button>
				</li>
				{#if showMobileMenu}
					<div
						transition:slide={{
							duration: 350,
							easing: sineInOut
						}}
						id="mobile-nav-menu"
						on:click={() => (showMobileMenu = false)}
					>
						<li>
							<a href="./how-it-works" class="button-like">How it works</a>
						</li>

						<li>
							<a href="./invest" class="button-like">Become an investor</a>
						</li>
						<li>
							<a href="./invite-friends" class="button-like">Invite friends</a>
						</li>
					</div>
				{/if}
			{/if}

			<li class="right-item">
				<CurrencySwitcher />
			</li>
		{/if}

		<li class="right-item">
			<ThemeSwitcher />
		</li>
	</ul>
</nav>

<style lang="scss">
	#navigation-menu {
		top: 0;

		border-bottom: 1px solid var(--accent-color);
		background-color: var(--window-color);
		display: flex;
		align-items: center;
		flex-direction: row;
		padding-inline: 0.25rem;

		width: 100%;
		height: 4rem;

		> .logo {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-right: 0.5rem;
			user-select: none;
			cursor: pointer;
			color: var(--text-color);
			text-decoration: none;

			> img {
				height: 4rem;
			}

			> p {
				font-size: 2rem;
				font-family: "Berlin Sans Regular";
			}
		}

		> * {
			max-height: 4rem;
			width: max-content;
		}

		.vertical-rule {
			height: 70%;
		}

		> #navigation-items {
			width: 100%;
			height: 3rem;
			display: flex;
			flex-direction: row;
			align-items: center;

			overflow-x: auto;

			> #mobile-nav-menu {
				margin: 0;
				padding: 0;
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 1;

				&::after {
					content: "";
					position: inherit;
					top: inherit;
					left: inherit;
					width: inherit;
					height: inherit;
					background-color: var(--even-darker-window-color);
					opacity: 0.9;
					z-index: -1;
				}

				display: flex;
				flex-direction: column;
				justify-items: stretch;
				align-items: center;

				> li {
					margin: 0.5rem;
					width: 75%;
					list-style: none;
					display: flex;

					> a {
						text-align: center;
						font-size: 1.3rem;
						width: 100%;
					}
				}
			}

			> * {
				width: max-content;
				white-space: nowrap;
				margin-inline: 0.3rem;

				&:first-child {
					margin-left: 0.5rem;
					margin-right: 0.3rem;
				}
			}

			> li {
				list-style-type: none;
				height: 100%;
				display: flex;
			}

			/* Might seem messy, get first item that has .right-item */
			> .right-item:not(.right-item ~ .right-item) {
				margin-left: auto;
			}
		}
	}
</style>
