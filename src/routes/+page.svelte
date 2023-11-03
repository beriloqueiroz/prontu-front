<script lang="ts">
	import type { Professional } from '$lib/interface/professional';
	import { user } from '$lib/stores/user';
	import Spinner from '../components/Spinner.svelte';
	async function captureProfessional(id: string | undefined): Promise<Professional | undefined> {
		if (!id) return;
		console.log('🚀 ~ file: +page.svelte:7 ~ captureProfessional ~ id:', id);
		const response = await fetch(`/api/professional?id=${id}`);
		return response.json();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<section>
	{#await captureProfessional($user?.username)}
		<Spinner />
	{:then professional}
		<div>
			{professional?.email}
		</div>
	{:catch error}
		<div>
			{error}
		</div>
	{/await}
</section>
