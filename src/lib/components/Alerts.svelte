<script context="module">
	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { setContext, getContext } from 'svelte';
	import { writable } from 'svelte/store';

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
			{#if item.type === 'success'}
				<svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
					<polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			{:else if item.type === 'failure'}
				<svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
					<circle cx="12" cy="12" r="10" />
					<line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
				</svg>
			{:else if item.type === 'info'}
				<svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
					<line x1="9" y1="18" x2="15" y2="18" />
					<line x1="10" y1="22" x2="14" y2="22" />
					<path
						d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"
					/>
				</svg>
			{/if}

			<div class="message">{@html item.message}</div>

			{#if item.show_dismiss_button}
				<button
					type="button"
					aria-label="Dismiss"
					class="dismiss-btn"
					on:click={() => alerts_store.dismiss(item)}
				>
					<svg aria-hidden="true" viewBox="0 0 24 24" class="icon">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	* {
		box-sizing: border-box;
	}

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

	.icon {
		inline-size: 1em;
		block-size: 1em;
		font-size: 1.5rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 0.125rem;
		stroke-linecap: round;
		stroke-linejoin: round;
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
