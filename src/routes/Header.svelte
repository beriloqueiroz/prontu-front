<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="flex justify-center gap-2 bg-black text-white h-[4rem]">
	<div class="rounded-full bg-white w-[30px] h-[30px] m-auto">
		<div class="rounded-full border-4 w-[20px] h-[20px] border-black" />
	</div>

	<nav class="m-auto">
		<ul class="flex justify-between">
			<li class="mx-4 p-1" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li class="mx-4 p-1" aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">Sobre</a>
			</li>
			<li
				class="mx-4 p-1"
				aria-current={$page.url.pathname.startsWith('/login') ? 'page' : undefined}
			>
				<a href="/login">Entrar</a>
			</li>
		</ul>
	</nav>
</header>
