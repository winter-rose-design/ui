<script>
	import '../styles.css';

	/** @param {HTMLElement} node */
	function js(node) {
		node.classList.replace('no-js', 'js');
	}
</script>

<div class="sui no-js" use:js>
	<slot name="icons">
		
	</slot>

	<slot />
</div>
