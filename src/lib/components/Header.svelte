<script lang="ts">
	import { goto } from '$app/navigation';
	import { general } from '$lib/stores/general';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';
	import { NavBrand, NavHamburger, NavLi, NavUl } from 'flowbite-svelte';
	async function logout(): Promise<void> {
		await fetch(`/api/user/logout`, {
			method: 'DELETE'
		});
		user.set(null);
		professional.set(null);
		goto('/login');
	}
</script>

<nav
	{...$$props}
	class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700 divide-gray-100 dark:divide-gray-700 sm:px-4 w-full p-2"
>
	<div class="mx-auto flex flex-wrap justify-between items-center container">
		<NavBrand href="/">{$professional?.name || ''}</NavBrand>
		<NavHamburger onClick={general.toggleMenu} />
		<NavUl hidden={!$general?.showMenu}>
			{#if $user}
				<NavLi href="/">Inicio</NavLi>
				<NavLi class="cursor-pointer" on:click={() => goto('/professional')}
					>Minhas informações</NavLi
				>
				<NavLi class="cursor-pointer" on:click={logout}>Sair</NavLi>
			{:else}
				<NavLi class="cursor-pointer" href="/login">Entrar</NavLi>
				<NavLi class="cursor-pointer" href="/register">Cadastrar-se</NavLi>
			{/if}
		</NavUl>
	</div>
</nav>
