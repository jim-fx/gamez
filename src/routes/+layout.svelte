<script>
	import '@fontsource/nunito';
</script>

<slot />

<style global>
	:global(body[data-theme='dark']) {
		--gradient: linear-gradient(135.06deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818144;
		--text-light: #7c8092;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		--gradient: linear-gradient(135.06deg, #16161e 0%, #252530 96.92%);
		--outline-strong: #81818188;
		--outline: #81818144;
		--text-light: #7c8092;
		--shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25),
			0px 4px 4px rgba(0, 0, 0, 0.25);
	}

	:global(body) {
		background: var(--gradient);
		background-size: contain;
	}

	:global(html) {
		height: 100%;
		font-family: 'Nunito', sans-serif;
	}
</style>
