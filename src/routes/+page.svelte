<script lang="ts">
	import CardSession from '$lib/components/CardSession.svelte';
	import PatientCard from '$lib/components/PatientCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, CloseButton, Drawer, Search, TabItem, Tabs } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddPatientForm from './AddPatientForm.svelte';
	import { goto } from '$app/navigation';
	import AddSessionForm from './AddSessionForm.svelte';

	let hideAddPatient = true;
	let hideAddSession = true;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let searchValue = '';

	const submitted = () => {
		alert(`You are searching: ${searchValue}`);
	};

	async function getSessions(): Promise<Session[]> {
		const id = $professional?.id;
		if (!id) {
			goto('/login');
		}
		const response = await fetch(`${location.protocol}//${location.host}/api/session`, {
			method: 'GET',
			headers: {
				professionalId: `${id}`
			}
		});
		return await response.json();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<Tabs class="flex justify-center flex-nowrap">
	<TabItem open title="Pacientes">
		<div class="flex justify-center flex-col gap-2">
			<Button on:click={() => (hideAddPatient = false)}>Adicionar Paciente!</Button>
			{#if $professional?.patients?.length === 0}
				<p class="text-center p-1 mt-2">Nenhum usuário cadastrado!</p>
			{:else}
				<form id="example-form" on:submit={submitted}>
					<Search bind:value={searchValue} placeholder="buscar pelo nome" />
				</form>
			{/if}
		</div>
		{#if $professional != null}
			{#each $professional.patients.filter((pat) => pat.name.includes(searchValue)) as patient}
				<PatientCard {patient} />
			{/each}
		{/if}
	</TabItem>
	<TabItem title="Sessões">
		{#await getSessions()}
			<Spinner />
		{:then sessions}
			<div class="flex justify-center flex-col gap-2">
				<Button on:click={() => (hideAddSession = false)}>Adicionar Sessão!</Button>
				{#if sessions?.length === 0}
					<p class="text-center p-1 mt-2">Nenhuma sessão cadastrado!</p>
				{:else}
					<form id="example-form" on:submit={submitted}>
						<Search bind:value={searchValue} placeholder="buscar pelo nome do paciente" />
					</form>
				{/if}
			</div>
			{#if sessions != null && $professional?.patients}
				{#each sessions.filter((s) => s.patientIds.some((id) => $professional?.patients
							.map((p) => p.id)
							.includes(id))) as session}
					<CardSession {session} />
				{/each}
			{/if}
		{/await}
	</TabItem>
</Tabs>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hideAddPatient} id="sidebar3">
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
		>
			Adicionar usuário
		</h5>
		<CloseButton on:click={() => (hideAddPatient = true)} class="mb-4 dark:text-white" />
	</div>
	<AddPatientForm runAfterSubmit={() => (hideAddPatient = true)} />
</Drawer>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hideAddSession} id="sidebar3">
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
		>
			Adicionar sessão
		</h5>
		<CloseButton on:click={() => (hideAddSession = true)} class="mb-4 dark:text-white" />
	</div>
	<AddSessionForm />
</Drawer>
