<script>
	// @ts-nocheck

	import InputMask from './InputMask.svelte';

	export let value;

	let mask = value ? maskByValue(value) : 'R$ 000';
	const handleChange = ({ detail }) => {
		const sizeNumber = detail.inputState.unmaskedValue.length;
		if (sizeNumber >= 1) {
			mask = `R$ ${Array(sizeNumber + 3).join('0')}`;
		}
		value = detail.inputState.unmaskedValue;
	};

	function maskByValue(value) {
		return `R$ ${Array(value.toString().split('.')[0].length - 1).join('0')}`;
	}
</script>

<InputMask
	{...$$props}
	{mask}
	maskChar=" "
	alwaysShowMask
	onChange={handleChange}
	type="text"
	{value}
/>
