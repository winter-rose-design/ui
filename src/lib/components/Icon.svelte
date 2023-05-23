<script>
	export let name;
	export let size;
	export let background;
</script>

<div class="ui icon --has-background">
	<svg aria-hidden="true">
		<use xlink:href="#ui-icon-{name}" />
	</svg>
</div>

<style>
	.ui.icon {
		border-radius: 50%;
	}

	.ui.icon svg {
		width: 1.5em;
		height: 1.5em;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.ui.icon.--has-background {
		display: inline-flex;
		padding: 0.5em;
		background-color: beige;
	}
</style>
