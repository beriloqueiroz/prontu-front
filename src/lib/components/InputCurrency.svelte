<script>
	// @ts-nocheck

	import InputMask from './InputMask.svelte';

	export let value;

	let mask = 'R$ 0000';
	const handleChange = ({ detail }) => {
		if (detail.inputState.unmaskedValue.length > 3) {
			mask = `R$ ${Array(detail.inputState.unmaskedValue.length + 1).join('0')}`;
			return;
		}
		mask = 'R$ 0000';
	};
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
