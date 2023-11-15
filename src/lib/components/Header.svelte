<script lang="ts">
	import { goto } from '$app/navigation';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';
	import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	async function logout(): Promise<void> {
		await fetch(`/api/user/logout`, {
			method: 'DELETE'
		});
		user.set(null);
		professional.set(null);
		goto('/login');
	}
</script>

<Navbar {...$$props}>
	<NavBrand href="/">{$professional?.name || ''}</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Inicio</NavLi>
		{#if $user}
			<NavLi on:click={() => goto('/professional')}>Minhas informações</NavLi>
			<NavLi on:click={logout}>Sair</NavLi>
		{:else}
			<NavLi href="/login">Entrar</NavLi>
			<NavLi href="/register">Cadastrar-se</NavLi>
		{/if}
	</NavUl>
</Navbar>
