<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import PatientCard from '$lib/components/PatientCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional } from '$lib/interface/professional/professional';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';

	import { Button, TabItem, Tabs } from 'flowbite-svelte';

	$: professionalId = $user?.username;

	async function captureProfessional(id: string | undefined): Promise<Professional | null> {
		if (!id) {
			goto('/login');
		}
		const response = await fetch(
			`${location.protocol}//${location.host}/api/professional?id=${id}`
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
		<Tabs class="flex justify-center flex-nowrap">
			<TabItem open title="Pacientes">
				<div class="w-100 flex justify-center flex-col">
					<Button>Adicionar Paciente!</Button>
					{#if $professional?.patients?.length === 0}
						<p class="text-center p-1 mt-2">Nenhum usuário cadastrado!</p>
					{/if}
				</div>
				{#if $professional != null}
					{#each $professional.patients as patient}
						<PatientCard {patient} />
					{/each}
				{/if}
			</TabItem>
			<TabItem title="Sessões">Em breve</TabItem>
		</Tabs>
	{:catch error}
		<div>
			<ErrorMessage message={error} show={error} />
		</div>
	{/await}
</section>
