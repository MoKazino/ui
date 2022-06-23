<script lang="ts">
	import TextInput from "./TextInput.svelte";
	import { slide } from "svelte/transition";
	import { chatMessages, createAlert } from "./stores";
	import { writable, type Unsubscriber } from "svelte/store";

	let messageInput: HTMLInputElement;
	let newMessageCount = writable(0);

	let showChat = false;
	let unsubscribe: Unsubscriber;
	function toggleChat() {
		showChat = !showChat;
		if (showChat)
			unsubscribe = newMessageCount.subscribe((value) => {
				if (value > 0) $newMessageCount = 0;
			});
		else unsubscribe();
	}

	async function* receivedMessages(): AsyncGenerator<string> {
		const response = await fetch("https://mokazino.net/api/v1/chat/read").catch(() => {});
		if (response) yield await response.text();
		yield* receivedMessages();
	}

	async function receiveMessages() {
		for await (const message of receivedMessages()) {
			chatMessages.set($chatMessages.concat(message));
			++$newMessageCount;
		}
	}

	async function sendMessage(): Promise<void>;
	async function sendMessage(event: KeyboardEvent): Promise<void>;
	async function sendMessage(event?: KeyboardEvent) {
		if (event instanceof KeyboardEvent && event?.key !== "Enter") return;

		const response = await fetch("https://mokazino.net/api/v1/chat/send", {
			method: "POST",
			body: new URLSearchParams({
				text: messageInput.value
			})
		});

		if (!response.ok) {
			createAlert({
				expireAfter: 8000,
				header: "Failed to send chat message",
				message: await response.text()
			});
		}

		messageInput.value = "";
	}

	receiveMessages();
</script>

{#if showChat}
	<div id="chat" transition:slide>
		<div class="messages">
			<div class="message">
				root: Welcome to the chat! This chat room is bridged with out telegram chat group
				<a href="https://t.me/MoKazinoChat" rel="external" target="_blank">@MoKazinoChat</a>. Feel
				free to hop there to make sure that you won't miss any important info, such as replies to
				your message.
			</div>
			<div class="message">To be able to send messages you need to wager any amount of monero.</div>

			{#each $chatMessages as message}
				<div class="message">
					{message}
				</div>
			{/each}
		</div>
		<div id="message-input" on:keypress={sendMessage}>
			<TextInput bind:input={messageInput} placeholder={"Your message"} />
			<button on:click={sendMessage} id="send-message" class="material-icons accent">send</button>
		</div>
	</div>
{/if}

<button
	on:click={() => ($newMessageCount = 0)}
	message-count={$newMessageCount}
	id="chat-bubble"
	on:click={toggleChat}
>
	<span class="material-icons">{showChat ? "close" : "chat"}</span>
</button>

<style lang="scss">
	#chat {
		height: 25rem;
		width: 20rem;
		position: fixed;
		left: 3.5rem;
		bottom: 0.5rem;
		z-index: 2;
		background-color: var(--lighter-window-color);
		border: 1px solid var(--accent-color);
		padding: 0.5rem;
		border-radius: 1rem;

		> .messages {
			border-radius: 1rem;
			height: calc(100% - 2.5rem);
			overflow-y: auto;

			> .message {
				color: var(--text-color);
				background-color: var(--darker-window-color);
				padding: 0.5rem;
				border-radius: 0.5rem;
				margin-bottom: 0.25rem;
			}
		}

		> #message-input {
			position: relative;

			> #send-message {
				position: absolute;
				font-size: 1rem;
				padding: 0.3rem;
				right: 0.3rem;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}

	#chat-bubble {
		border-radius: 1rem;
		position: fixed;
		left: 0.5rem;
		bottom: 0.5rem;
		z-index: 1;
		border: 1px solid var(--accent-color);

		&[message-count="0"] {
			&::before {
				opacity: 0;
			}
		}

		&::before {
			content: attr(message-count);
			user-select: none;
			pointer-events: none;
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			font-size: 0.8rem;
			top: -0.25rem;
			left: -0.25rem;
			padding: 0.1rem 0.25rem;
			background-color: var(--accent-color);
			border-radius: 100%;
			z-index: 2;
			transition: opacity 0.15s ease-out;
		}

		> span {
			margin: 0;
			padding: 0.25rem;
			font-size: 1.2rem;

			&:hover {
				animation: wiggle 250ms ease-in-out;
			}

			@keyframes wiggle {
				0% {
					transform: rotate(-15deg);
				}

				30% {
					transform: rotate(30deg);
				}

				60% {
					transform: rotate(0deg);
				}

				80% {
					transform: rotate(-15deg);
				}

				100% {
					transform: rotate(0deg);
				}
			}
		}
	}
</style>
