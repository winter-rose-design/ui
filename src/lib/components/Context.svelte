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

				<symbol id="ui-icon-chevron-up" viewBox="0 0 24 24">
					<polyline points="18 15 12 9 6 15" />
				</symbol>
				<symbol id="ui-icon-chevron-down" viewBox="0 0 24 24">
					<polyline points="6 9 12 15 18 9" />
				</symbol>
				<symbol id="ui-icon-chevron-left" viewBox="0 0 24 24">
					<polyline points="15 18 9 12 15 6" />
				</symbol>
				<symbol id="ui-icon-chevron-right" viewBox="0 0 24 24">
					<polyline points="9 18 15 12 9 6" />
				</symbol>

				<symbol id="ui-icon-check" viewBox="0 0 24 24">
					<polyline points="20 6 9 17 4 12" />
				</symbol>
				<symbol id="ui-icon-x" viewBox="0 0 24 24">
					<line x1="18" x2="6" y1="6" y2="18" />
					<line x1="6" x2="18" y1="6" y2="18" />
				</symbol>
				<symbol id="ui-icon-alert" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" />
					<line x1="12" x2="12.01" y1="16" y2="16" />
				</symbol>
				<symbol id="ui-icon-lightbulb" viewBox="0 0 24 24">
					<path
						d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
					/>
					<path d="M9 18h6" />
					<path d="M10 22h4" />
				</symbol>

				<symbol id="ui-icon-download" viewBox="0 0 24 24">
					<line x1="12" x2="12" y1="17" y2="3" />
					<polyline points="6 11 12 17 18 11" />
					<path d="M19 21H5" />
				</symbol>

				<symbol id="ui-icon-menu" viewBox="0 0 24 24">
					<line x1="4" x2="20" y1="12" y2="12" />
					<line x1="4" x2="20" y1="6" y2="6" />
					<line x1="4" x2="20" y1="18" y2="18" />
				</symbol>
			</defs>
		</svg>
	</slot>

	<slot />
</div>
