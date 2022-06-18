<script lang="ts">
	import { browser } from "$app/env";

	export let value: number | undefined = undefined;
	export let min: number = 0;
	export let max: number = 100;

	interface NumberStep {
		up: number;
		down: number;
	}
	export let step: number | NumberStep = 1;
	export let placeholder: string | null = null;
	export let materialIcon: string | null = null;
	export let disabled: boolean | null = null;
	export let label: string | null = null;
	export let unit: string | null = null;

	$: stepDown = typeof step === "object" ? step.down : step;
	$: stepUp = typeof step === "object" ? step.up : step;

	function increaseAmount() {
		value ??= 0;
		if (value + stepUp <= max) value += stepUp;
		else value = max;
	}

	function decreaseAmount() {
		value ??= 0;
		if (value - stepDown >= min) value -= stepDown;
		else value = min;
	}
</script>

<div class="input">
	{#if label || materialIcon}
		<span class="label">
			{#if materialIcon}
				<span class="material-icons">{materialIcon}</span>
			{/if}
			{#if label}
				<span style="width: 5rem;">{label}</span>
			{/if}
		</span>
	{/if}

	<input bind:value type="text" inputmode="numeric" {min} {max} {placeholder} {disabled} />

	{#if unit && browser && window?.innerWidth > 960}
		<span style:--offset={disabled ? "0.2rem" : "6.5rem"} class="unit">{unit}</span>
	{/if}

	{#if !disabled}
		<div class="controls">
			<button class="material-icons accent" on:click={increaseAmount}>expand_less</button>
			<button class="material-icons accent" on:click={decreaseAmount}>expand_more</button>
		</div>

		<button class="min-balance accent" on:click={() => (value = min)}> MIN </button>
		<button class="max-balance accent" on:click={() => (value = max)}> MAX </button>
	{/if}
</div>

<style lang="scss">
	.input {
		width: 100%;

		position: relative;
		display: flex;
		align-items: center;

		> .label {
			color: var(--text-color);
			background-color: var(--darker-window-color);
			padding: 0.5rem;
			border-radius: 0.5rem;
			margin-right: 0.25rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			> :first-child:not(:last-child) {
				margin-right: 0.25rem;
			}
		}

		> .unit {
			position: absolute;
			right: var(--offset);
			color: var(--accent-color);
			background-color: var(--accent-background);
			padding: 0.25rem;
			border-radius: 0.5rem;
		}

		> .controls {
			position: absolute;
			right: 0.4rem;
			display: flex;
			flex-direction: column;

			> button {
				padding: 0;
				font-size: 0.8rem;
				&:nth-child(even) {
					border-radius: 0 0 0.25rem 0.25rem;
				}

				&:nth-child(odd) {
					border-radius: 0.25rem 0.25rem 0 0;
				}
			}
		}

		> .max-balance,
		> .min-balance {
			position: absolute;
			padding: 0.4rem;
		}

		> .max-balance {
			right: 1.5rem;
		}
		.min-balance {
			right: 4rem;
		}

		> input {
			width: 100%;
			font-size: 1rem;
			margin: 0.25rem 0;
		}
	}
</style>
