<script lang="ts">
	export let show = false;
	export let message: string | null = '';
</script>

{#if show}
	<div class="bg-red-100 border border-red-400 text-red-700 p-1 my-2 rounded" role="alert">
		<small>{message}</small>
	</div>
{/if}
