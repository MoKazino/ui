<script lang="ts">
	export let value: string | undefined = undefined;
	export let placeholder: string | null = null;
	export let materialIcon: string | null = null;
	export let label: string | null = null;
	export let disabled: boolean | null = null;
	export let maxLength: number | null = null;
	export let input: HTMLInputElement | null = null;
</script>

<div class="input">
	{#if label || materialIcon}
		<span class="label">
			{#if materialIcon}
				<span class="material-icons">{materialIcon}</span>
			{/if}
			{#if label}
				<span style="min-width: 5rem;">{label}</span>
			{/if}
		</span>
	{/if}

	<input bind:this={input} bind:value type="text" {maxLength} {placeholder} {disabled} />
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

		> input {
			width: 100%;
			font-size: 1rem;
			margin: 0.25rem 0;
		}
	}
</style>
