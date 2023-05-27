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
			body,
			style = '',
			timeout = opts.timeout,
			show_close_button = opts.show_close_button
		}) {
			update((alerts) => [
				...alerts.slice(-1 * (this.max - 1)),
				{ type, body, style, timeout, show_close_button }
			]);
		}

		function info(body, timeout) {
			show({ type: 'info', body, timeout });
		}

		function success(body, timeout) {
			show({ type: 'success', body, timeout });
		}

		function failure(body, timeout) {
			show({ type: 'failure', body, timeout });
		}

		function warning(body, timeout) {
			show({ type: 'warning', body, timeout });
		}

		function promise() {}

		function close(alert) {
			update((alerts) => alerts.filter((a) => a !== alert));
		}

		function close_all() {
			update(() => []);
		}

		return {
			subscribe,

			info,
			success,
			failure,
			warning,
			promise,
			close,
			close_all
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

		timer = create_timer(() => alerts.close(alert), alert.timeout);

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
	export let show_close_button = false;
	export let timeout = 5000;

	const alerts_store = create_alerts_store({ max, show_close_button, timeout });

	setContext('sunflower:alerts', alerts_store);
</script>

<div class="alert-container --{position}">
	{#each $alerts_store as item (item)}
		<div
			role="alert"
			class="alert --{item.type}"
			style={item.style}
			use:alert={item}
			in:fly={{ y: 15 * (position === 'start' ? -1 : 1), duration: 200 }}
			out:scale={{ duration: 200, start: 0.95 }}
			animate:flip={{ duration: 200 }}
		>
			<Icon name={item.type} />

			<div class="alert__body">{@html item.body}</div>

			{#if item.show_close_button}
				{@const id = crypto.randomUUID()}

				<button
					type="button"
					aria-labelledby={id}
					class="alert__close-btn"
					on:click={() => alerts_store.close(item)}
				>
					<Icon name="x" />
					<span {id} hidden>Close</span>
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	:global(.js) .alert-container {
		position: fixed;
		display: flex;
		padding: 0 1em;
		margin: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
	}

	:global(.js) .alert-container.--start {
		inset-block-start: 0;
		flex-direction: column-reverse;
	}

	:global(.js) .alert-container.--end {
		inset-block-end: 0;
		flex-direction: column;
	}

	.alert {
		--alert-color: var(--alert-color, white);
		--alert-background: ;

		--alert-info-background: var(--alert-info-background, hsl(196, 52%, 48%));
		--alert-success-background: var(--alert-success-background, hsl(171, 71%, 40%));
		--alert-failure-background: var(--alert-failure-background, hsl(18, 100%, 60%));
		--alert-warning-backrgound: var(--alert-warning-background, hsl(333, 81%, 40%));

		color: var(--alert-color);
		font-weight: 500;

		padding: 0.75rem;
		border-radius: 0.25rem;
		margin-block: 0.25rem;
		margin-inline: auto;
		display: flex;
		align-items: center;
		pointer-events: auto;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		transition: scale 100ms;
	}

	.alert:hover {
		scale: 1.02;
	}

	.alert.--info {
		background-color: var(--alert-info-background);
	}

	.alert.--success {
		background-color: var(--alert-success-background);
	}

	.alert.--warning {
		background-color: var(--alert-warning-background);
	}

	.alert.--failure {
		background-color: var(--alert-failure-background);
	}

	.alert .alert__body {
		margin-inline: 0.75rem;
	}

	.alert__close-btn {
		display: none;
		padding: 0.25rem;
		border: none;
		appearance: none;
		background: none;
		opacity: 0.8;

		transition: opacity, 100ms;
	}

	:global(.js) .alert__close-btn {
		display: inline-block;
	}

	.alert__close-btn:hover {
		opacity: 1;
		background-color: hsla(0, 0%, 0%, 0.1);
	}

	.alert__close-btn:active {
		background-color: hsla(0, 0%, 0%, 0.2);
	}
</style>
