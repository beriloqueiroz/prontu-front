<script lang="ts">
	import { Alert } from 'flowbite-svelte';

	export let show = false;
	export let message: string | null = '';
</script>

{#if show}
	<Alert color="red">
		<small>{message}</small>
	</Alert>
{/if}
