<script context="module">
	/**
	 * @typedef {object} AlertObject
	 * @property {'info' | 'danger' | 'success' | 'warning'} type - the type of alert you want to show
	 * @property {string} body - the message to display
	 * @property {boolean} [is_closeable=true] - whether users can close this alert via a button
	 * @property {string} [style=''] - CSS inline styles
	 * @property {number} [timeout=5000] - a duration in milliseconds after which this alert should be automatically closed
	 * @property {string} [title] - a title displayed above the body
	 */

	import { flip } from 'svelte/animate';
	import { fly, scale } from 'svelte/transition';
	import { setContext, getContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { Icon } from '$lib/components';

	const context_key = new Symbol();

	function get_context() {
		return getContext(context_key);
	}

	function set_context(value) {
		setContext(context_key, value);
	}

	function create_timeout(cb, delay) {
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

	/**
	 * @param {HTMLElement} node
	 * @param {AlertObject} alert
	 */
	function alert(node, alert) {
		if (!alert.timeout) return;

		const timeout = create_timeout(() => alerts.close(alert), alert.timeout);

		node.addEventListener('mouseenter', timeout.pause);
		node.addEventListener('mouseleave', timeout.resume);

		return {
			destroy() {
				timeout.clear();
			}
		};
	}

	/**
	 * @param params
	 */
	function create_alerts_store(params) {
		const { subscribe, set, update } = writable([]);

		return {
			subscribe: subscribe,

			/** @param {AlertObject} */
			show({
				type,
				body,
				style = '',
				title = '',
				timeout = params.timeout,
				is_closeable = params.is_closeable
			}) {
				update((alerts) => [
					...alerts.slice(-1 * (this.max - 1)),
					{ type, title, body, style, timeout, is_closeable }
				]);
			},
			
			/** @param {AlertObject} alert */
			close(alert) {
				update((alerts) => alerts.filter((a) => a !== alert));
			},

			close_all() {
				set([]);
			}
		};
	}

	export { get_context as get_store };
</script>

<script>
	export let max = 3;
	export let position = 'start';
	export let is_closeable = true;
	export let timeout = 5000;

	export const alerts_store = create_alerts_store({ max, is_closeable, timeout });

	set_context(alerts_store);
</script>

<div class="alerts-stack --{position}">
	{#each $alerts_store as alert_obj (alert_obj)}
		<div
			role="alert"
			class="alert --{alert_obj.type}"
			style={alert_obj.style}
			use:alert={alert_obj}
			in:fly={{ y: 15 * (position === 'start' ? -1 : 1), duration: 200 }}
			out:scale={{ duration: 200, start: 0.95 }}
			animate:flip={{ duration: 200 }}
		>
			<Icon name={alert_obj.type} />

			<div class="alert__content">
				{#if alert_obj.body}
					<div class="alert__title">{@html alert_obj.title}</div>
				{/if}

				{#if alert_obj.body}
					<div class="alert__body">{@html alert_obj.body}</div>
				{/if}
			</div>

			{#if alert_obj.is_closeable}
				{@const id = crypto.randomUUID()}

				<button
					type="button"
					aria-labelledby={id}
					class="alert__close-btn button --icon"
					on:click={() => alerts_store.close(alert_obj)}
				>
					<Icon name="x" />
					<span {id} hidden>Close</span>
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.alerts-stack {
		--wr-alerts-stack-padding-inline: 1rem;
		--wr-alerts-stack-padding-inline: 1rem;

		display: flex;
		flex-direction: column;
	}

	:global(.js) .alerts-stack {
		position: fixed;
		padding: 0 1em;
		margin: 0;
		inset-inline-start: 0;
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
		--wr-alert-color: var(--wr-alert-color, white);
		--wr-alert-background: ;

		--wr-alert-info-background: var(--wr-alert-info-background, hsl(196, 52%, 48%));
		--wr-alert-success-background: var(--wr-alert-success-background, hsl(171, 71%, 40%));
		--wr-alert-danger-background: var(--wr-alert-danger-background, hsl(18, 100%, 60%));
		--wr-alert-warning-backrgound: var(--wr-alert-warning-background, hsl(333, 81%, 40%));

		color: var(--wr-alert-color);
		font-weight: 500;

		padding: 0.75rem;
		border-radius: 0.25rem;
		margin-block: 0.25rem;
		margin-inline: auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		pointer-events: auto;
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

		transition: scale 100ms;

		&.--info {
			background-color: var(--wr-alert-info-background);
		}

		&.--success {
			background-color: var(--wr-alert-success-background);
		}

		&.--warning {
			background-color: var(--wr-alert-warning-background);
		}

		&.--danger {
			background-color: var(--wr-alert-danger-background);
		}
	}

	.alert__content {
	}

	.alert__title {
		font-weight: bold;
	}

	.alert__body {
	}

	.alert__close-btn {
		display: none;
		opacity: 0.8;

		transition: opacity, 100ms;

		&:hover {
			opacity: 1;
			background-color: hsla(0, 0%, 0%, 0.1);
		}

		&:active {
			background-color: hsla(0, 0%, 0%, 0.2);
		}
	}

	:global(.js) .alert__close-btn {
		display: inline-block;
	}
</style>
