<script>
	// @ts-nocheck

	import InputMask from './InputMask.svelte';

	let maskString = 'DD/MM/YYYY HH:mm';
	let mask = '00/00/0000 00:00';
</script>

<InputMask
	{...$$props}
	{maskString}
	{mask}
	size={35}
	alwaysShowMask={false}
	type="text"
	placeholder="exemplo: 12/12/2023 12:50"
/>
