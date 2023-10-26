<script>
	import Header from './Header.svelte';
	import '../main.css';
</script>

<div class="app p-0 flex flex-col h-screen justify-between">
	<Header />

	<main class="text-center mb-auto w-100 mt-3">
		<slot />
	</main>

	<footer class="w-100 bg-black text-white flex justify-center p-2 w-100">
		<p>Paciente paciente</p>
	</footer>
</div>
