<script>
	export let name;
	export let size = '';
	export let color = '';
	export let background = '';
</script>

<div class="icon" class:--has-background={background} style:color style:background>
	<svg aria-hidden="true">
		<use xlink:href="#ui-icon-{name}" />
	</svg>
</div>

<style>
	.icon {
		border-radius: 50%;
		display: inline-block;

		& svg {
			display: block;
			inline-size: 1.5em;
			block-size: 1.5em;
			fill: none;
			stroke: currentColor;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
    
    & --has-background {
      padding: 0.5em;
    }
	}

</style>
