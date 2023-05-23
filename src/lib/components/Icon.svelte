<script>
	export let name;
</script>

<svg>
	<use xlink:href="#ui-icon-{name}" class="ui icon" />
</svg>

<style>
	.ui.icon {
		width: 1.5em;
		height: 1.5em;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
