<script lang="ts">
	import { NavBrand, NavHamburger, NavLi, NavUl, Navbar } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<div class="rounded-full bg-white w-[30px] h-[30px] m-auto border-4 border-black">
			<div class="rounded-full border-4 w-[20px] h-[20px] border-black" />
		</div>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Inicio</NavLi>
		<NavLi href="/login">Entrar</NavLi>
		<NavLi href="/register">Cadastrar-se</NavLi>
	</NavUl>
</Navbar>
