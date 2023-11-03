<script lang="ts">
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional } from '$lib/interface/professional/professional';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { professional } from '$lib/stores/professional';
	$: professionalId = $user?.username;
	async function captureProfessional(id: string | undefined): Promise<Professional | null> {
		if (!id) {
			goto('/login');
		}
		const response = await fetch(
			`${location.protocol}//${location.host}/internal/professional?id=${id}`
		);
		const professionalResponse = await response.json();
		professional.set(professionalResponse);
		return professionalResponse;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<section>
	{#await captureProfessional(professionalId)}
		<Spinner />
	{:then}
		<div>
			{$professional?.email}
		</div>
	{:catch error}
		<div>
			<ErrorMessage message={error} show={error} />
		</div>
	{/await}
</section>
