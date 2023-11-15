<script>
	// @ts-ignore
	import InputMask from './InputMask.svelte';

	let mask = '+55 (00) 0000-00000';

	// @ts-ignore
	const handleChange = ({ detail }) => {
		if (detail.inputState.unmaskedValue.length >= 11) {
			mask = '+55 (00) 00000-0000';
			return;
		}
		mask = '+55 (00) 0000-00000';
	};
</script>

<InputMask {...$$props} {mask} type="tel" maskChar=" " alwaysShowMask onChange={handleChange} />
