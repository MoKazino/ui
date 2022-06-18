<script lang="ts">
	import { profile, currency, createAlert } from "../stores";
	import { scale, slide } from "svelte/transition";
	import { onDestroy } from "svelte";

	function copyToClipboard(value: string) {
		navigator.clipboard.writeText(value);
	}

	function formatTime(milliseconds: number): string {
		const minutes = ~~(milliseconds / 1000 / 60);
		const seconds = ~~((milliseconds / 1000) % 60);
		let output = "";
		if (minutes) output += `${minutes} minutes`;
		if (seconds) {
			if (minutes) output += " ";
			output += `${seconds} seconds`;
		}
		return output;
	}

	$: address = $profile.user
		? $profile.user[$currency === "xmr" ? "moneroaddress" : "bitcoinaddress"]
		: (() => {
				createAlert({
					header: "Invalid user profile",
					message: `Couldn't detect ${address} address because user profile is invalid`,
					expireAfter: 5000
				});
				return "Invalid user profile";
		  })();

	let majesticBank = {
		fromCurrency: "",
		currency: "",
		address: "-",
		exchangeId: "-",
		qrCodeUrl:
			"/api/v1/depositqr/custom?qr=bitcoin3NhxHipGasDoE714c1wA1e2b5VFCDLnh1i",
		expireTime: Date.now() + 65000,
		remainingTime: 0
	};

	let timeUpdateInterval: NodeJS.Timer;
	onDestroy(() => {
		clearInterval(timeUpdateInterval);
	});

	$: majesticBankFormattedTime = formatTime(majesticBank.remainingTime);
	let showMajesticBankModal = false;
	let loadingMajesticBank = false;

	async function depositViaMajesticBank(currency: "xmr" | "btc" | "ltc") {
		showMajesticBankModal = true;
		if (currency === majesticBank.fromCurrency && majesticBank.expireTime - Date.now() > 0) return;

		loadingMajesticBank = true;

		const response = await fetch(
			`/api/v1/external/majesticbank/exchange?receive_curency=${currency}`
		).catch(async (error) => {
			createAlert({
				expireAfter: 8000,
				header: "Failed opening majestic bank",
				message: error
			});
		});

		if (!response) return;

		const json = await response.json();

		loadingMajesticBank = false;

		const to_currency = json.from_currency === "LTC" ? "litecoin" : "bitcoin";

		Object.assign(majesticBank, {
			fromCurrency: currency,
			currency: json.from_currency,
			exchangeId: json.trx,
			address: json.address,
			qrCodeUrl: `/api/v1/depositqr/custom?qr=${to_currency}${json.address}`,
			expireTime: Date.now() + json.expiration * 1000 * 60
		});

		timeUpdateInterval = setInterval(
			() => (majesticBank.remainingTime = majesticBank.expireTime - Date.now()),
			500
		);
	}
</script>

{#if showMajesticBankModal}
	<div id="majestic-bank-modal" on:click|self={() => (showMajesticBankModal = false)}>
		{#if loadingMajesticBank}
			<section id="modal-content" in:slide>
				<h1>Loading</h1>
				<p>Please be patient, it could take a little</p>
				<span class="material-icons sync">sync</span>
			</section>
		{:else}
			<section id="modal-content" transition:slide>
				<h1>
					Deposit {majesticBank.currency} using
					<a href="https://majesticbank.sc" rel="external" target="_blank">MajesticBank</a>
				</h1>
				<hr />
				<h3>
					Please send any amount of {majesticBank.currency} to the address visible below.
					<br /> You have {majesticBankFormattedTime}
					minutes for the transaction to appear on the blockchain.
				</h3>

				<img
					class="qr-code"
					src={majesticBank.qrCodeUrl}
					alt={`MajesticBank ${majesticBank.address} Deposit QR Code`}
				/>
				<span class="address">
					<code>{majesticBank.address}</code>
					<button
						on:click={() => copyToClipboard(majesticBank.address)}
						class="material-icons accent copy-content">content_copy</button
					>
				</span>
				<hr />
				<p>
					Your Exchange ID is <code>{majesticBank.exchangeId}</code>. To track status of your
					transaction go
					<a href="https://majesticbank.is/track" rel="external" target="_blank">here</a>
				</p>
			</section>
		{/if}
	</div>
{/if}

<main id="content">
	<div id="main-container">
		<h1>Deposit your {$currency.toUpperCase()}</h1>
		<hr />

		<section id="deposit-options">
			<div id="direct-transfer">
				<img
					src={`/api/v1/depositqr?nonce=${
						$profile?.user?.["currency"] + Date.now()
					}`}
					height="256"
					width="256"
					alt="Deposit QR Code"
					class="qr-code"
					in:scale={{
						delay: 150
					}}
				/>
				{#if address}
					<span class="address">
						<code>{address}</code>
						<button
							on:click={() => copyToClipboard(address)}
							class="material-icons accent copy-content">content_copy</button
						>
					</span>
				{/if}
			</div>
			<div class="vertical-rule" />
			<div id="other-options">
				<h3>Or you can deposit via <br /> other cryptocurrencies:</h3>
				{#if $profile.user.currency !== "BTC"}
					<button on:click={() => depositViaMajesticBank("btc")}>Deposit using BTC</button>
				{/if}
				{#if $profile.user.currency !== "XMR"}
					<button on:click={() => depositViaMajesticBank("xmr")}>Deposit using XMR</button>
				{/if}
				<button on:click={() => depositViaMajesticBank("ltc")}>Deposit using LTC</button>
			</div>
		</section>
	</div>
</main>

<style lang="scss">
	#majestic-bank-modal {
		z-index: 1;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		&::after {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			content: "";
			z-index: 2;
			background-color: var(--even-darker-window-color);
			opacity: 0.5;
		}

		> #modal-content {
			display: flex;
			align-items: center;
			justify-content: center;

			background-color: var(--window-color);
			z-index: 3;
			padding: 1rem;
			max-width: 40rem;
			border-radius: 0.5rem;
			display: flex;
			flex-direction: column;

			> .sync {
				font-size: 3rem;
			}

			> .qr-code {
				margin: 1rem;
				height: 25vh;
			}
		}
	}

	#content {
		width: 100%;
		max-width: 50rem;

		> #main-container {
			flex-direction: column;
			align-items: center;

			> #deposit-options {
				position: relative;
				width: 100%;
				height: 100%;

				display: flex;
				flex-direction: row;

				> #direct-transfer {
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}

				.vertical-rule {
					margin-inline: 0.5rem !important;
				}

				> #other-options {
					width: 50%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-evenly;

					button {
						font-size: 1.5rem;
						width: 14rem;
						text-align: center;
						margin: 0.5rem;
					}
				}

				@media only screen and (max-width: 750px) {
					flex-direction: column;

					> #direct-transfer {
						width: 100%;
					}

					> #other-options {
						width: 100%;
					}
				}
			}
		}
	}

	.qr-code {
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		border: 2px solid var(--accent-color);
		image-rendering: pixelated;
	}

	.address {
		position: relative;
		display: flex;
		width: 100%;
		height: 100%;

		code {
			width: 100%;
			height: 100%;
			padding: 0.5rem;
		}

		.copy-content {
			position: absolute;
			right: 0.3rem;
			padding: 0.3rem;
			top: 50%;
			transform: translateY(-50%);
			opacity: 0.75;
			height: calc(100% - 0.5rem);

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
