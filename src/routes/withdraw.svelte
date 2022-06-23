<script lang="ts">
	import NumberInput from "$lib/NumberInput.svelte";
	import TextInput from "$lib/TextInput.svelte";

	import { profile, currency, createAlert } from "$lib/stores";

	async function withdraw() {
		const response = await fetch("/api/v1/withdraw", {
			method: "POST",
			body: new URLSearchParams({
				amount: (amount * 1e12).toFixed(0),
				address
			})
		});

		if (!response.ok) {
			createAlert({
				expireAfter: 8000,
				header: "Withdrawing failed",
				message: await response.text()
			});
		}
	}

	$: crypto = $profile.user.currency === "XMR" ? "Monero" : "Bitcoin";
	$: balance = $profile.user[$profile.user.currency === "XMR" ? "balance" : "bitcoinbalance"];

	let amount: number;
	let address: string;
</script>

<main id="content">
	<div id="main-container">
		<h1>Withdraw your {$currency.toUpperCase()}</h1>
		<hr />
		<p>
			<strong>Withdrawals</strong> are automatic and instant, however, due to limitations in the Monero
			RPC Client, we are not able to substract the fee amount from withdrawal. To solve the issue, we take
			0.00002 XMR from the amount, then we add the remaining amount to your balance. In Bitcoin, the fee
			is deducted from the withdrawal amount.
		</p>

		<form id="withdraw-form" on:submit|preventDefault>
			<NumberInput
				materialIcon={"paid"}
				bind:value={amount}
				min={0}
				max={balance}
				step={1e-12}
				placeholder={`${$profile.user.currency} Amount`}
			/>

			<TextInput
				materialIcon={"account_balance_wallet"}
				bind:value={address}
				placeholder={`${crypto} Address`}
			/>

			<input type="submit" class="accent" value="Withdraw" on:click={withdraw} />
		</form>
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		#main-container {
			flex-direction: column;
			align-items: center;

			#withdraw-form {
				margin: 0.5rem 0;
				width: 75%;

				display: flex;
				flex-direction: column;
				align-items: stretch;
				justify-content: center;

				input[type="submit"] {
					font-size: 1rem;
					margin-top: 0.5rem;
				}
			}
		}
	}
</style>
