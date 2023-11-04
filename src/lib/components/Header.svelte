<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import { redirect } from '@sveltejs/kit';
	import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	async function logout(): Promise<void> {
		await fetch(`/api/user/logout`, {
			method: 'DELETE'
		});
		user.set(null);
		redirect(302, '/');
	}
</script>

<Navbar>
	<NavBrand href="/" />
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
