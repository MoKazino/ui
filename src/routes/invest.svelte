<script lang="ts">
	import NumberInput from "$lib/NumberInput.svelte";

	import { createAlert, profile } from "$lib/stores";

	async function invest() {
		const response = await fetch("/api/v1/invest", {
			method: "POST",
			body: new URLSearchParams({
				amount: (amount * 1e12).toFixed(0)
			})
		});

		createAlert({
			expireAfter: 8000,
			header: "Investment",
			message: await response.text()
		});
	}

	async function closeInvestment() {
		const response = await fetch("/api/v1/closeinvest");

		createAlert({
			expireAfter: 8000,
			header: "Closing investment",
			message: await response.text()
		});
	}

	let amount: number;

	$: balance = $profile.user[$profile.user.currency === "XMR" ? "balance" : "bitcoinbalance"];
	$: currentInvestment =
		$profile.user[$profile.user.currency === "XMR" ? "investbalance" : "investbalancebitcoin"];
</script>

<main id="content">
	<div id="main-container">
		<section id="introduction">
			<h1>Yes! You can become an investor!</h1>
			<hr />
			<p>
				This will allow you to have a part in the site profits (and losses). Just like it would be
				your own casino!
			</p>
		</section>

		<br />

		<section id="how-it-works">
			<h3>How does it work?</h3>
			<ul>
				<li>
					<span>
						To get started you need to have at least 0.001 XMR/0.00001 BTC in your balance.</span
					>
				</li>
				<li>
					<span>After investing you will see a change in the in your investment every minute.</span>
				</li>
				<li>
					<span>You can close your investment any time you want.</span>
				</li>
			</ul>
		</section>

		<br />

		<section id="fees">
			<h3>Fees</h3>
			<ul>
				<li>
					<span>There is a 1 % profit fee took on every bet.</span>
				</li>
			</ul>
		</section>

		<hr />

		<section id="investment">
			<div id="current-investment">
				<strong
					>You've currently invested {currentInvestment}
					{$profile.user.currency}</strong
				>
				{#if currentInvestment > 0}
					<button on:click={closeInvestment}>Close investment</button>
				{/if}
			</div>

			<form id="invest-form" on:submit|preventDefault>
				<NumberInput
					materialIcon={"paid"}
					bind:value={amount}
					min={0}
					max={balance}
					step={1e-12}
					placeholder={`${$profile.user.currency} Amount`}
				/>
				<input type="submit" class="accent" value="Invest" on:click={invest} />
			</form>
		</section>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		#main-container {
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: center;

			h1 {
				text-align: center;
			}

			#investment {
				margin: 0.5rem 0;
				width: 75%;
				margin-inline: auto;

				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				#current-investment {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					* {
						margin-inline: 0.25rem;
					}
				}

				#invest-form {
					margin-top: 0.5rem;
					display: flex;
					flex-direction: column;
					width: 100%;

					input[type="submit"] {
						font-size: 1rem;
						margin-top: 0.5rem;
					}
				}
			}
		}
	}
</style>
