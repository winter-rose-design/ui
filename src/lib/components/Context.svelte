<script>
	import '$lib/styles.css';

	/** @param {HTMLElement} node */
	function js(node) {
		node.classList.replace('no-js', 'js');
	}
</script>

<div class="ui no-js" use:js>
	<slot name="icons">
		<svg style="display:none;">
			<!-- Icons from https://lucide.dev/ -->
			<defs>
				<symbol id="ui-icon-arrow-up" viewBox="0 0 24 24">
					<line x1="12" x2="12" y1="19" y2="5" />
					<polyline points="5 12 12 5 19 12" />
				</symbol>
				<symbol id="ui-icon-arrow-down" viewBox="0 0 24 24">
					<line x1="12" x2="12" y1="5" y2="19" />
					<polyline points="19 12 12 19 5 12" />
				</symbol>
				<symbol id="ui-icon-arrow-left" viewBox="0 0 24 24">
					<line x1="19" x2="5" y1="12" y2="12" />
					<polyline points="12 19 5 12 12 5" />
				</symbol>
				<symbol id="ui-icon-arrow-right" viewBox="0 0 24 24">
					<line x1="5" x2="19" y1="12" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</symbol>
			</defs>
		</svg>
	</slot>

	<slot />
</div>
