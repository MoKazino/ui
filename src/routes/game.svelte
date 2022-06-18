<script lang="ts">
	import { slideRight } from "$lib/transitions";
	import NumberInput from "$lib/NumberInput.svelte";
	import { profile, createAlert } from "../stores";

	interface Bet {
		win: boolean | null;
		betlo: boolean;
		profit: number;
		roll: number;
		chance: number;
		nonce: number;
	}

	let betLog: Bet[] = [];

	let lastBet: Bet = {
		win: null,
		betlo: false,
		profit: 0,
		roll: 0,
		chance: 0,
		nonce: 0
	};

	async function bet(betlo: boolean): Promise<void> {
		const response = await fetch("/api/v1/bet", {
			method: "POST",
			body: new URLSearchParams({
				amount: (amount * 1e12).toFixed(0),
				chance: (chance * 100).toFixed(0),
				betlo: `${betlo}`
			})
		});

		if (!response.ok) {
			createAlert({
				expireAfter: 8000,
				header: "Failed betting",
				message: await response.text()
			});
			return;
		}

		const { win, profit, roll, nonce } = await response.json();
		lastBet = {
			win: win,
			betlo,
			profit: Number((profit / 1e12).toFixed(8)),
			roll: Number((roll / 100).toFixed(2)),
			chance,
			nonce
		};

		betLog.push(lastBet);
		// svelte reactivity
		betLog = betLog;
	}

	$: balance = $profile.user[$profile.user.currency === "XMR" ? "balance" : "bitcoinbalance"];
	// Instant refresh so "amount" calculation below works
	balance = $profile.user[$profile.user.currency === "XMR" ? "balance" : "bitcoinbalance"];

	$: multiplier = (1 / (chance / 100)) * 0.99;
	$: winProfit = Number((amount * multiplier - amount).toFixed(8));
	let amount = Math.max(Math.min(0.0001, balance), 0);
	let chance = 49.5;

	let showLogs = false;
</script>

<main id="content">
	<div id="main-container">
		<section id="game">
			{#if lastBet.win !== null}
				<div class:bet-win={lastBet.win} class:bet-loose={!lastBet.win}>
					{#if lastBet.win}
						<h3>
							🥳 You've won
							<code>{lastBet.profit}</code>
							{$profile.user.currency} 🎉
						</h3>
					{:else}
						<h3>
							😟 You've lost
							<code>{lastBet.profit}</code>
							{$profile.user.currency}
						</h3>
					{/if}
					<hr />
					<p>
						Your roll
						<span style:text-decoration={lastBet.win ? "none" : "line-through"}>
							{lastBet.roll}
							{lastBet.betlo ? "<" : ">"}
							{lastBet.betlo ? chance : 100 - chance}
						</span> Target
					</p>
				</div>
			{:else}
				<div class="bet-info">
					<h2>
						<span class="material-icons">casino</span>
						Mokazino Bet
					</h2>
					<hr />
					<h3>
						To win, bet whether a number from <code>1-100</code> range will be higher or lower than
						the
						<code>chance</code>.
					</h3>
				</div>
			{/if}

			<img src="./images/logo.svg" alt="Logo of Mokazino" width="256" height="256" />

			<NumberInput
				min={0}
				max={Infinity}
				disabled={true}
				materialIcon={"account_balance_wallet"}
				label={"Balance"}
				bind:value={balance}
				unit={$profile.user.currency}
			/>

			<NumberInput
				min={0}
				max={balance}
				step={{
					up: (amount || 0.0001) * 2 - amount,
					down: (amount || 0.0001) / 2
				}}
				materialIcon={"payments"}
				label={"Amount"}
				bind:value={amount}
				unit={$profile.user.currency}
			/>

			<NumberInput
				min={5}
				max={95}
				materialIcon={"casino"}
				label={"Chance"}
				bind:value={chance}
				unit={"%"}
			/>

			<NumberInput
				min={0}
				max={Infinity}
				disabled={true}
				materialIcon={"emoji_events"}
				label={`Win profit (1:${Number(multiplier.toFixed(2))})`}
				bind:value={winProfit}
				unit={$profile.user.currency}
			/>

			<div id="place-bet">
				<button id="bet-high" on:click={() => bet(false)}>Bet High</button>
				<button id="bet-low" on:click={() => bet(true)}>Bet Low</button>
				<button id="bet-logs" on:click={() => (showLogs = true)} class="material-icons"
					>history</button
				>
			</div>
		</section>
		{#if showLogs}
			<div id="logs-modal" on:click={() => (showLogs = false)} />
			<section id="logs" transition:slideRight>
				<table id="logs-table">
					<tr>
						<th>#</th>
						<th>Profit</th>
						<th>Chance</th>
						<th>Roll</th>
						<th>Betlo</th>
					</tr>
					{#each betLog as bet}
						<tr class:won-bet={bet.win} class:lost-bet={!bet.win}>
							<th>{bet.nonce}</th>
							<th>{bet.profit}</th>
							<th>{bet.chance}</th>
							<th>{bet.roll}</th>
							<th>{bet.betlo ? "Low" : "High"}</th>
						</tr>
					{/each}
				</table>
			</section>
		{/if}
	</div>
</main>

<style lang="scss">
	#content {
		width: 100%;
		max-width: 50rem;

		> #main-container {
			position: relative;
			flex-direction: row;
			align-items: flex-start;

			> #game {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: max-content;

				> .bet-win,
				.bet-loose,
				.bet-info {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					background-color: var(--darker-window-color);
					padding: 0.5rem;
					border-radius: 0.5rem;

					code {
						background-color: var(--accent-background);
						padding: 0 0.25rem;
					}

					> hr {
						margin: 0.2rem 0;
					}

					transition: all 0.25s ease-in;
				}

				> .bet-info {
					> h2 {
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;

						> .material-icons {
							font-size: 1.5rem;
						}
					}
				}

				> .bet-win {
					color: var(--success-color);
				}

				> .bet-loose {
					color: var(--failure-color);
				}

				> #place-bet {
					width: 100%;
					position: relative;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					> #bet-high {
						--color: #bf5058;
						--lighter-color: #ff4048;
						--light-color: #ff6068;
						--dark-color: #5f1018;

						font-size: 1.25rem;
						color: var(--dark-color);
						border: 2px solid var(--dark-color);
						border-right: 1px solid var(--dark-color);
						background-color: var(--color);
						border-radius: 0.5rem 0 0 0.5rem;

						&:hover {
							background-color: var(--light-color);
						}

						&:active {
							background-color: var(--lighter-color);
						}
					}

					> #bet-low {
						font-size: 1.25rem;

						--color: #50bf58;
						--lighter-color: #10ff18;
						--light-color: #60ff68;
						--dark-color: #105f18;

						color: var(--dark-color);
						border: 2px solid var(--dark-color);
						border-left: 1px solid var(--dark-color);
						background-color: var(--color);
						border-radius: 0 0.5rem 0.5rem 0;

						&:hover {
							background-color: var(--light-color);
						}

						&:active {
							background-color: var(--lighter-color);
						}
					}

					> #bet-logs {
						border: 2px solid var(--even-darker-window-color);
						position: absolute;
						right: 0.25rem;
					}
				}
			}

			> #logs-modal {
				position: absolute;
				top: -0.5rem;
				left: -0.5rem;
				border-radius: 0.5rem;
				width: calc(100% + 1rem);
				height: calc(100% + 1rem);
				background-color: var(--even-darker-window-color);
				opacity: 0.5;
				z-index: 1;
			}

			> #logs {
				z-index: 2;
				position: absolute;
				right: 0;
				height: 100%;
				width: max-content;
				overflow-y: auto;
				overflow-x: hidden;

				background-color: var(--window-color);

				#logs-table {
					border-collapse: collapse;

					th {
						padding: 0.5rem;
					}

					tr {
						&.lost-bet {
							background-color: var(--failure-color);
						}

						&.won-bet {
							background-color: var(--success-color);
						}
					}

					tr:first-child {
						&:nth(first) {
							border-radius: 0.5rem 0 0 0;
						}

						&:nth(last) {
							border-radius: 0 0.5rem 0 0;
						}

						background-color: var(--darker-window-color);
					}

					width: 100%;
				}
			}
		}
	}
</style>
