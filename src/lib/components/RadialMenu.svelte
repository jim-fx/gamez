<script lang="ts">
	import { rotateVec2, addVec, radiansToDegrees, vecLength } from '$lib/math';
	import Icon from './Icon.svelte';

	type Option = {
		value: string;
		content?: string;
		icon?: string;
	};

	export let items: Option[] = [];
	export let innerRadius = 30;
	export let outerRadius = 100;
	let visible = false;
	const padding = 30;

	$: singleRadius = 360 / items.length;

	$: _items = items.map((_, i) => {
		const angle = singleRadius * i;

		const offsetVec = [outerRadius + padding / 2, outerRadius + padding / 2];

		const vi1 = addVec(rotateVec2([0, -innerRadius], angle + singleRadius / 2), offsetVec);
		const vi2 = addVec(rotateVec2([0, -innerRadius], angle - singleRadius / 2), offsetVec);

		const vo1 = addVec(rotateVec2([0, -outerRadius], angle + singleRadius / 2), offsetVec);
		const vo2 = addVec(rotateVec2([0, -outerRadius], angle - singleRadius / 2), offsetVec);

		const v = addVec(rotateVec2([0, -innerRadius / 2 - outerRadius / 2], angle), offsetVec);

		return {
			..._,
			x: v[0],
			y: v[1],
			path: `M ${vi1[0]} ${vi1[1]} A ${innerRadius} ${innerRadius} 0 0 0 ${vi2[0]} ${vi2[1]} L ${
				vo2[0]
			} ${vo2[1]} A ${-outerRadius} ${-outerRadius} 0 0 1 ${vo1[0]} ${vo1[1]} Z`
		};
	});

	let mouseDown = [0, 0];
	let mouse = [0, 0];
	$: mouseVec = [mouse[0] - mouseDown[0], mouse[1] - mouseDown[1]];

	$: length = vecLength(mouseVec);

	function calculateAngle(vec: number[]) {
		const angle = radiansToDegrees(Math.atan2(vec[0], vec[1]));
		return 180 - angle;
	}

	$: angle = calculateAngle(mouseVec);

	function calculateIndex(angle: number) {
		if (angle > 360 - singleRadius / 2) {
			return 0;
		}
		return Math.round(angle / singleRadius);
	}

	$: index = length < innerRadius || !visible || !items.length ? -1 : calculateIndex(angle);

	$: center = [
		Math.min(
			Math.max(mouseDown[0] - outerRadius - padding / 2, 0),
			globalThis.innerWidth - outerRadius * 2 - padding
		),
		Math.min(
			Math.max(mouseDown[1] - outerRadius - padding / 2, 0),
			globalThis.innerHeight - outerRadius * 2 - padding
		)
	];

	function handleMouseDown(e: MouseEvent) {
		visible = true;
		mouseDown = [e.clientX, e.clientY];
		mouse = [e.clientX, e.clientY];
	}
	function handleMouseUp() {
		visible = false;
	}
	function handleMouseMove(e: MouseEvent) {
		if (!visible) return;
		mouse = [e.clientX, e.clientY];
	}
	function handleMouseLeave() {
		visible = false;
	}
</script>

<svelte:window
	on:mouseup={handleMouseUp}
	on:mousedown={handleMouseDown}
	on:mouseleave={handleMouseLeave}
	on:mousemove={handleMouseMove}
/>

<div class="wrapper" style="--mx: {center[0]}px; --my: {center[1]}px;" class:visible>
	<div style:position="relative">
		{#each _items as item, i}
			<div class="item-wrapper" class:active={i === index}>
				<div class:item style="left:{item.x}px; top:{item.y}px;">
					{#if item.icon}
						<Icon name={item.icon} />
					{:else}
						{item.content}
					{/if}
				</div>
			</div>
		{/each}

		<svg
			width={outerRadius * 2 + padding}
			height={outerRadius * 2 + padding}
			style="--width: {outerRadius + padding / 2}px;"
		>
			<defs>
				<radialGradient id="myGradient">
					<stop offset="10%" stop-color="#16161E" />
					<stop offset="95%" stop-color="#252530" />
				</radialGradient>>
			</defs>
			{#each _items as item, i}
				<path d={item.path} class:active={index === i} />
			{/each}
		</svg>
	</div>
</div>

<style>
	.wrapper {
		position: fixed;
		top: var(--my);
		left: var(--mx);
	}

	.item {
		position: absolute;
		opacity: 0;
		z-index: 2;
		pointer-events: none;
		user-select: none;
		transform: translateX(-50%) translateY(-50%);
		transition: transform 0.2s ease, opacity 0.2s ease;
		color: var(--text-light);
	}

	.visible .item {
		opacity: 0.7;
	}

	.active .item {
		opacity: 1;
	}

	.item-wrapper {
		position: absolute;
		pointer-events: none;
		user-select: none;
		transition: transform 0.2s ease;
		height: 100%;
		width: 100%;
		transform: scale(0.8);
		z-index: 2;
	}

	.visible .item-wrapper {
		transform: scale(1);
	}

	.active.item-wrapper {
		transform: scale(1.1);
	}

	svg {
		transform-origin: var(--width) var(--width);
		overflow: scroll;
		transform: scale3d(0.8, 0.8, 1);
		opacity: 0;
		transition: transform 0.2s ease, filter 0.3s ease, opacity 0.2s ease;
		filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
	}

	.visible svg {
		opacity: 1;
		transform: scale3d(1, 1, 1);
		filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
	}

	svg:hover {
		filter: drop-shadow(0px 0px 26px rgba(0, 0, 0, 0.8));
	}

	path {
		stroke: var(--outline);
		stroke-width: 1;
		transition: transform 0.2s ease, filter 0.3s ease, stroke 0.3s ease;
		transform-origin: var(--width) var(--width);
		fill: url(#myGradient);
		filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
		cursor: pointer;
		opacity: 0.6;
	}

	path.active {
		stroke-width: 1.5;
		opacity: 1;
		stroke: var(--outline-strong);
		transform: scale3d(1.1, 1.1, 1.1);
		z-index: 99;
		filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
	}
</style>
