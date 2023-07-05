<script>
	export let name;
	export let style = '';
</script>

<div class="icon" {style}>
	<svg aria-hidden="true">
		<use xlink:href="#wr-icon-{name}" />
	</svg>
</div>

<style>
	.icon {
		--wr-icon-size: var();
		--wr-icon-color: var();
		--wr-icon-background: var();
		--wr-icon-radius: var();
		--wr-icon-padding: var();

		display: inline-block;
		border-radius: var(--wr-icon-radius);

		& svg {
			display: block;
			inline-size: var(--has-background);
			block-size: var(--has-background);
			padding: var(--wr-icon-padding);
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
	}
</style>
