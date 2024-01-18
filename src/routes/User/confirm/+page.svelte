<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';

	export let data;
</script>

<section class="flex justify-center flex-col">
	{#if data.confirmed}
		<p class="text-center p-1 mt-2">Usuário confirmado</p>
		<Button on:click={() => goto('/login')}>Entrar</Button>
	{:else}
		<p class="text-center p-1 mt-2">
			Usuário não confirmado, entre em contato ou tente se cadastrar novamente
		</p>
	{/if}
</section>
