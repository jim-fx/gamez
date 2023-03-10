<script>
	import Tab from '$lib/components/tab';
	import { settings } from '$lib/stores';
</script>

<div class="outer-wrapper">
	<div class="wrapper">
		<div class="header">
			<h1>Settings</h1>
		</div>

		<div class="content">
			<p>theme</p>
			<Tab
				showActiveState
				bind:value={$settings.theme}
				style="width: 100%; border: none; background: none; border-radius: 0px;"
				contentStyle="flex: 1;"
			>
				<Tab.Content value="dark">dark</Tab.Content>
				<Tab.Content value="auto">auto</Tab.Content>
				<Tab.Content value="light">light</Tab.Content>
			</Tab>
		</div>
	</div>
</div>

<style>
	.outer-wrapper {
		position: relative;
		height: 100vh;
		width: 100vw;
		display: grid;
		place-items: center;
	}

	.wrapper {
		border-radius: 20px;
		overflow: hidden;
		width: fit-content;

		background-image: linear-gradient(-20deg, #16161e 3.85%, #252530 96.92%);
		background-blend-mode: screen;

		box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.25), 4px 4px 8px rgba(0, 0, 0, 0.2),
			inset 2px 2px 9px rgba(255, 255, 255, 0.05), inset -2px -2px 9px rgba(0, 0, 0, 0.2);

		/* Outline */
		outline: 1px solid var(--outline);
	}

	.content {
		display: grid;
		grid-template-columns: max-content 1fr;
		grid-template-rows: repeat(auto-fill, minmax(0px, max-content));
		height: fit-content;
		border-bottom: 1px solid var(--outline);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px 10px;
		border-bottom: 1px solid var(--outline);
		color: var(--text);
	}

	h1 {
		font-size: 1.2rem;
		font-weight: 100;
	}

	p {
		padding: 1em;
		margin: 0;
		opacity: 0.4;
		color: var(--text);
		border-right: 1px solid var(--outline);
	}
</style>
