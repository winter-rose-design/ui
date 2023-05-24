<script context="module">
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { setContext, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { Icon } from '$lib/components';

	export function get() {
		return getContext('sunflower:alerts');
	}

	function create_alerts_store(opts) {
		const { subscribe, update } = writable([]);

		function show({
			type,
			message,
			timeout = opts.timeout,
			show_dismiss_button = opts.show_dismiss_button
		}) {
			update((alerts) => [
				...alerts.slice(-1 * (this.max - 1)),
				{ type, message, timeout, show_dismiss_button }
			]);
		}

		function info(message, timeout) {
			show({ type: 'info', message, timeout });
		}

		function success(message, timeout) {
			show({ type: 'success', message, timeout });
		}

		function failure(message, timeout) {
			show({ type: 'failure', message, timeout });
		}

		function warning(message, timeout) {
			show({ type: 'warning', message, timeout });
		}

		function promise() {}

		function dismiss(alert) {
			update((alerts) => alerts.filter((a) => a !== alert));
		}

		function dismiss_all() {
			update(() => []);
		}

		return {
			subscribe,

			info,
			success,
			failure,
			warning,
			promise,
			dismiss,
			dismiss_all
		};
	}

	function create_timer(cb, delay) {
		let start;
		let timeout_id;

		function pause() {
			clearTimeout(timeout_id);
			delay -= new Date() - start;
		}

		function resume() {
			start = new Date();
			timeout_id = setTimeout(cb, delay);
		}

		function clear() {
			clearTimeout(timeout_id);
		}

		resume();

		return {
			resume,
			pause,
			clear
		};
	}

	function alert(node, alert) {
		if (!alert.timeout) return;

		function on_mouseenter(e) {
			mouse_over_elements.add(e.target);
			if (mouse_over_elements.size > 1) return;
			timer.pause();
		}

		function on_mouseleave(e) {
			mouse_over_elements.delete(e.target);
			if (mouse_over_elements.size > 0) return;
			timer.resume();
		}

		let mouse_over_elements = new Set();
		let timer;

		node.addEventListener('mouseenter', on_mouseenter);
		node.addEventListener('mouseleave', on_mouseleave);

		timer = create_timer(() => alerts.dismiss(alert), alert.timeout);

		return {
			destroy() {
				timer.clear();
				node.removeEventListener('mouseenter', on_mouseenter);
				node.removeEventListener('mouseleave', on_mouseleave);
			}
		};
	}
</script>

<script>
	export let max = 3;
	export let position = 'start';
	export let show_dismiss_button = false;
	export let timeout = 5000;

	const alerts_store = create_alerts_store({ max, show_dismiss_button, timeout });

	setContext('sunflower:alerts', alerts_store);
</script>

<div class="alerts --{position}">
	{#each $alerts_store as item (item)}
		<div
			role="alert"
			class="alert --{item.type}"
			use:alert={item}
			in:fly={{ y: 15 * (position === 'start' ? -1 : 1), duration: 200 }}
			out:scale={{ duration: 200, start: 0.95 }}
			animate:flip={{ duration: 200 }}
		>
			<Icon name={item.type} />

			<div class="message">{@html item.message}</div>

			{#if item.show_dismiss_button}
				<button
					type="button"
					aria-label="Dismiss"
					class="dismiss-btn"
					on:click={() => alerts_store.dismiss(item)}
				>
					<Icon name="x" />
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.alerts {
		display: flex;
		padding: 0 1em;
		margin: 0;
		position: fixed;
		left: 0;
		width: 100%;
		pointer-events: none;

		&.--start {
			inset-block-start: 0;
			flex-direction: column-reverse;
		}

		&.--end {
			inset-block-end: 0;
			flex-direction: column;
		}
	}

	.alert {
		--color: white;

		--info-bg-color: hsl(196, 52%, 48%);
		--success-bg-color: hsl(171, 71%, 40%);
		--failure-bg-color: hsl(18, 100%, 60%);
		--warning-bg-color: hsl(333, 81%, 40%);

		color: var(--color);
		line-height: 1.5;
		font-weight: 500;
		font-family: sans-serif;

		padding: 0.75rem;
		border-radius: 0.25rem;
		margin-block: 0.25rem;
		margin-inline: auto;
		display: flex;
		align-items: center;
		pointer-events: auto;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		transition: scale 100ms;

		&:hover {
			scale: 1.02;
		}

		&.--info {
			background-color: var(--info-bg-color);
		}

		&.--success {
			background-color: var(--info-bg-color);
		}

		&.--warning {
			background-color: var(--warning-bg-color);
		}

		&.--failure {
			background-color: var(--failure-bg-color);
		}
	}

	.message {
		margin-inline: 0.75rem;
	}

	.dismiss-btn {
		padding: 0.25rem;
		border: none;
		margin: 0;
		appearance: none;
		display: grid;
		place-items: center;
		font: inherit;
		color: inherit;
		background: none;
		cursor: pointer;
		opacity: 0.8;
		border-radius: 50%;

		transition: opacity, 100ms;

		& > .icon {
			font-size: 1rem;
			stroke-width: 0.2rem;
		}

		&:hover {
			opacity: 1;
			background-color: hsla(0, 0%, 0%, 0.1);
		}

		&:active {
			background-color: hsla(0, 0%, 0%, 0.2);
		}
	}
</style>
