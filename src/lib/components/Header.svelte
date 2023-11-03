<script lang="ts">
	import { user } from '$lib/stores/user';
	import { redirect } from '@sveltejs/kit';
	import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
	async function logout(): Promise<void> {
		await fetch(`/internal/user/logout`, {
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
			<NavLi on:click={logout}>Sair</NavLi>
		{:else}
			<NavLi href="/login">Entrar</NavLi>
			<NavLi href="/register">Cadastrar-se</NavLi>
		{/if}
	</NavUl>
</Navbar>
