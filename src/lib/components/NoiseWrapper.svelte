<script lang="ts">
	export let noise = false;
	export let style = '';
</script>

<div {style} class:noise>
	<slot />
</div>

<style>
	div {
		position: relative;
		border: 1px solid black;
		box-sizing: border-box;
		border-radius: 20px;
		overflow: hidden;

		background-image: linear-gradient(-20deg, #16161e 3.85%, #252530 96.92%);
		background-blend-mode: screen;

		box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.25), 4px 4px 8px rgba(0, 0, 0, 0.2),
			inset 2px 2px 9px rgba(255, 255, 255, 0.05), inset -2px -2px 9px rgba(0, 0, 0, 0.2);

		/* Outline */
		outline: 1px solid var(--outline);
		border: none;
	}
	div.noise::after {
		top: 0;
		left: 0;
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: url(/noise.png);
		background-size: 50%;
		pointer-events: none;
		opacity: 0.15;
	}
</style>
