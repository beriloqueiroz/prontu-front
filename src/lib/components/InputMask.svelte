<script>
	// @ts-nocheck
	import MaskInput from 'svelte-input-mask';

	export let onChange = () => {};

	function focus(e) {
		e.detail.srcElement.setSelectionRange(0, e.detail.srcElement.value.length, 'forward');
	}
</script>

<MaskInput
	{...$$restProps}
	class="block w-full disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg"
	on:focus={focus}
	on:change={onChange}
/>
