<script>
	// @ts-nocheck

	import InputMask from './InputMask.svelte';

	let maskString = 'DD/MM/YYYY HH:mm';
	let mask = '00/00/0000 00:00';

	export let value;

	const handleChange = ({ detail }) => {
		const valueMasked = detail.inputState.maskedValue;
		if (parseInt(valueMasked[6], 10) > 2) {
			maskString = 'DD/MM/YY HH:mm';
			mask = '00/00/00 00:00';
		} else {
			maskString = 'DD/MM/YYYY HH:mm';
			mask = '00/00/0000 00:00';
		}
		value = detail.inputState.unmanskedValue;
	};
</script>

<InputMask
	{...$$props}
	{maskString}
	{mask}
	onChange={handleChange}
	size={35}
	alwaysShowMask={false}
	type="text"
	placeholder="exemplo: 12/12/2023 12:50"
	{value}
/>
