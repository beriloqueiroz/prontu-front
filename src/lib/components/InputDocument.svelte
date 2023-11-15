<script>
	// @ts-ignore
	import MaskInput from 'svelte-input-mask';

	let mask = '000.000.000-00';
</script>

<MaskInput
	{...$$props}
	class="block w-full disabled:cursor-not-allowed disabled:opacity-50 p-2.5 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 text-sm rounded-lg"
	type="text"
	required
	{mask}
/>
