<script lang="ts">
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional } from '$lib/interface/professional/professional';
	import { user } from '$lib/stores/user';
	async function captureProfessional(id: string | undefined): Promise<Professional | undefined> {
		if (!id) return undefined;
		const response = await fetch(
			`${location.protocol}//${location.host}/internal/professional?id=${id}`
		);
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
			<ErrorMessage message={error} show={error} />
		</div>
	{/await}
</section>
