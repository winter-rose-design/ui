<script>
	import { Alerts, Context, Icon } from '$lib/components';
</script>

<Context>
	<Alerts />

	<div class="container">
		<main>
			<h1>UI</h1>

			<h2>Icon</h2>
			<Icon name="arrow" />
			
			<h2>Alerts</h2>
		</main>
	</div>
</Context>

<style>
	main {
		max-width: 50rem;
		margin-inline: auto;
	}
</style>
