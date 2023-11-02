<script lang="ts">
	import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/" />
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Inicio</NavLi>
		<NavLi href="/login">Entrar</NavLi>
		<NavLi href="/register">Cadastrar-se</NavLi>
	</NavUl>
</Navbar>
