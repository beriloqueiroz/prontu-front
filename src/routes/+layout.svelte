<script lang="ts">
	import '../main.css';

	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { Professional } from '$lib/interface/professional/professional';
	import type { User } from '$lib/interface/user/user';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';
	export let data: { user: User; professional: Professional };
	$: user.set(data.user);
	$: professional.set(data.professional);
</script>

<div class="app p-0 flex flex-col h-screen justify-between md:max-w-[90%] md:mx-auto">
	<Header class="p-2" />

	<main class="mb-auto w-100 mt-3 p-2">
		<slot />
	</main>

	<Footer class="flex justify-center flex-col text-center" />
</div>
