<script lang="ts">
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';
	import '../main.css';

	import { user } from '$lib/stores/user';
	import type { User } from '$lib/interface/user';
	export let data: { user: User };
	$: user.set(data.user);
</script>

<div class="app p-0 flex flex-col h-screen justify-between">
	<Header />

	<main class="mb-auto w-100 mt-3 p-2">
		<slot />
	</main>

	<Footer />
</div>
