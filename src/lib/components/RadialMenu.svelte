<script lang="ts">
	import { isFirefox } from '$lib/detect';
	import { nanoid } from 'nanoid';
	import { rotateVec2, addVec, radiansToDegrees, vecLength } from '$lib/math';
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';

	type Option = {
		value: unknown;
		content?: string;
		icon?: string;
		center?: boolean;
	};

	export let items: Option[] = [];
	export let innerRadius = 30;
	export let outerRadius = 100;
	export let rotation = 0;
	export let context: boolean | null = null;
	export let target: HTMLElement | ((e: HTMLElement) => boolean) | null = null;
	let visible = false;
	const padding = 30;

	const menuId = nanoid();

	const dispatch = createEventDispatcher();

	let centerItem: Option | null = null;
	$: __items = items.filter((v) => {
		if (v.center) {
			centerItem = v;
			return false;
		}
		return true;
	});

	$: singleRadius = 360 / __items.length;
	$: _items = __items.map((_, i) => {
		const angle = singleRadius * i + rotation;

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
		return 180 - angle - rotation;
	}

	$: angle = calculateAngle(mouseVec);

	function calculateIndex(angle: number) {
		if (angle > 360 - singleRadius / 2) {
			return 0;
		}
		return Math.round(angle / singleRadius);
	}

	$: index = length < innerRadius || !visible || !__items.length ? -1 : calculateIndex(angle);

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

	function checkIfValidTarget(e: HTMLElement) {
		if (!target) return true;

		if (typeof target === 'function') return target(e);

		return target === e;
	}

	async function handleMouseDown(e: MouseEvent) {
		if ((context === true && e.button !== 2) || (context !== true && e.button === 2)) return;
		if (!checkIfValidTarget(e.target as HTMLElement)) return;
		visible = true;
		mouseDown = [e.clientX, e.clientY];
		mouse = [e.clientX, e.clientY];
		e.preventDefault();
		e.stopPropagation();
	}
	function handleMouseUp(e: MouseEvent) {
		visible = false;
		if (length < innerRadius && centerItem) {
			dispatch('select', centerItem.value);
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		if (index !== -1) dispatch('select', __items[index].value);
	}
	function handleMouseMove(e: MouseEvent) {
		if (!visible) return;
		mouse = [e.clientX, e.clientY];
	}
	function handleMouseLeave() {
		visible = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') visible = false;
		if (e.key === 'Enter' && index !== -1) {
			dispatch('select', __items[index].value);
		}
	}
</script>

<svelte:window
	on:keydown={handleKeyDown}
	on:mouseup={handleMouseUp}
	on:mousedown={handleMouseDown}
	on:contextmenu={handleMouseDown}
	on:mouseleave={handleMouseLeave}
	on:mousemove={handleMouseMove}
/>

<div
	class="wrapper"
	style="--mx: {center[0]}px; --my: {center[1]}px; --inner-radius: {innerRadius * 2}px"
	class:visible
>
	<div style:position="relative">
		{#if centerItem}
			<div class="center-item">
				{#if centerItem.icon}
					<Icon name={centerItem.icon} />
				{:else}
					{centerItem.content}
				{/if}
			</div>
		{/if}

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
			viewBox="0 0 {outerRadius * 2 + padding} {outerRadius * 2 + padding}"
			style="--width: {outerRadius + padding / 2}px;"
		>
			<defs>
				{#each _items as item, i}
					<clipPath id="segment-{menuId}-{i}">
						<path fill="currentColor" d={item.path} />
					</clipPath>
				{/each}

				<filter id="small-shadow" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-1" dy="2" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.244097 0 0 0 0 0.244097 0 0 0 0 0.316667 0 0 0 0.43 0"
					/>
					<feBlend mode="normal" in2="shape" result="effect1_innerShadow_19_20" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-5" dy="-5" />
					<feGaussianBlur stdDeviation="3.5" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend
						mode="normal"
						in2="effect1_innerShadow_19_20"
						result="effect2_innerShadow_19_20"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="5" dy="5" />
					<feGaussianBlur stdDeviation="10" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend
						mode="normal"
						in2="effect2_innerShadow_19_20"
						result="effect3_innerShadow_19_20"
					/>
				</filter>

				<filter id="big-shadow" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_19_20" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_19_20" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="6" dy="-6" />
					<feGaussianBlur stdDeviation="11" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.39 0" />
					<feBlend mode="normal" in2="shape" result="effect2_innerShadow_19_20" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-4" dy="4" />
					<feGaussianBlur stdDeviation="5" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0" />
					<feBlend
						mode="normal"
						in2="effect2_innerShadow_19_20"
						result="effect3_innerShadow_19_20"
					/>
				</filter>
				<radialGradient id="gradient">
					<stop offset="10%" stop-color="#16161E" />
					<stop offset="95%" stop-color="#252530" />
				</radialGradient>
				<filter id="noise" x="0" y="0">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.7"
						numOctaves="10"
						stitchTiles="stitch"
					/>
				</filter>
			</defs>
			<g filter="url(#big-shadow)">
				{#each _items as item, i}
					<g class="segment" class:active={index === i} filter="url(#small-shadow)">
						<path d={item.path} fill="#252530" clip-path="url(#segment-{menuId}-{i})" />
						<path
							d={item.path}
							filter="url(#noise)"
							clip-path="url(#segment-{menuId}-{i})"
							opacity="0.1"
						/>
					</g>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.wrapper {
		position: fixed;
		top: var(--my);
		left: var(--mx);
		pointer-events: none;
		visibility: hidden;
		z-index: 999;
	}

	.wrapper.visible {
		pointer-events: all;
		visibility: visible;
	}

	.item {
		position: absolute;
		z-index: 2;
		pointer-events: none;
		user-select: none;
		transform: translateX(-50%) translateY(-50%);
		transition: transform 0.2s ease, opacity 0.2s ease;
		color: var(--text-light);
	}

	.item-wrapper {
		position: absolute;
		pointer-events: none;
		user-select: none;
		transition: transform 0.2s ease;
		height: 100%;
		width: 100%;
		z-index: 2;
	}

	svg {
		transform-origin: var(--width) var(--width);
		overflow: scroll;
		opacity: 0;
		transition: transform 0.2s ease, filter 0.3s ease, opacity 0.2s ease;
		filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
	}

	.visible svg {
		opacity: 1;
		filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.2));
	}

	svg:hover {
		/* filter: drop-shadow(0px 0px 26px rgba(0, 0, 0, 0.8)); */
	}

	path {
		stroke: var(--outline);
		stroke-width: 1;
		transition: transform 0.1s ease, filter 0.1s ease, stroke 0.1s ease;
		cursor: pointer;
		/* filter: url(#n); */
	}

	.segment {
		transition: filter 0.1s ease;
	}

	.segment.active > path {
		stroke-width: 1.5;
		stroke: var(--outline-strong);
		z-index: 99;
	}

	.center-item {
		position: absolute;
		left: 50%;
		top: calc(50% - 4px);
		transform: translate(-50%, -50%);
		border-radius: 100%;
		display: grid;
		place-items: center;
		width: calc(var(--inner-radius) + 4px);
		height: calc(var(--inner-radius) + 4px);
		background: var(--gradient);
		color: var(--outline-strong);
		cursor: pointer;
		z-index: 99;
		box-shadow: inset 12px -5px 20px rgba(0, 0, 0, 0.25), inset 1px 1px 7px rgba(0, 0, 0, 0.25),
			inset -1px 2px 4px rgba(62, 62, 81, 0.43);
		filter: drop-shadow(0px 0px 25px rgba(0, 0, 0, 0.2));
		transition: filter 0.3s ease;
	}
	.center-item:hover {
		filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.8));
	}
</style>
