<script lang="ts">
	import InputMask from './InputMask.svelte';

	let mask = '000.000.000-00';
</script>

<InputMask {...$$props} type="text" required {mask} />
