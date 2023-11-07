<script lang="ts">
	export let expanded = false;
</script>

<button {...$$props}>
	{#if expanded}
		<svg
			class="w-6 h-6 text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 14 8"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
			/>
		</svg>
	{:else}
		<svg
			class="w-6 h-6 text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 14 8"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"
			/>
		</svg>
	{/if}
</button>
