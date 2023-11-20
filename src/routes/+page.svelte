<script lang="ts">
	import { goto } from '$app/navigation';
	import CardSession from '$lib/components/CardSession.svelte';
	import PatientCard from '$lib/components/PatientCard.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, CloseButton, Drawer, Search, TabItem, Tabs } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddPatientForm from './AddPatientForm.svelte';
	import AddSessionForm from './AddSessionForm.svelte';
	import { onMount } from 'svelte';

	let isSession = false;

	onMount(() => (isSession = window.location.hash === '#session'));

	let hideAddPatient = true;
	let hideAddSession = true;

	let offset = 0;
	let limit = 50;

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let searchValue = '';
	let searchSessionValue = '';

	$: patientsFound = $professional?.patients.filter((pat) => pat.name.includes(searchValue)) || [];
	$: patientsFoundToSession =
		$professional?.patients
			.filter((pat) => pat.name.includes(searchSessionValue))
			.map((p) => p.id) || [];

	async function getSessions(): Promise<Session[]> {
		const id = $professional?.id;
		if (!id) {
			goto('/login');
		}
		const response = await fetch(
			`${location.protocol}//${location.host}/api/session?limit=${limit}&offset=${offset}`,
			{
				method: 'GET',
				headers: {
					professionalId: `${id}`
				}
			}
		);
		return await response.json();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<Tabs class="flex justify-center flex-nowrap">
	<TabItem open={!isSession} title="Pacientes">
		<div class="flex justify-center flex-col gap-2">
			<Button on:click={() => (hideAddPatient = false)}>Adicionar Paciente!</Button>
			{#if $professional?.patients?.length === 0}
				<p class="text-center p-1 mt-2">Nenhum usuário cadastrado!</p>
			{:else}
				<Search bind:value={searchValue} placeholder="buscar pelo nome" />
			{/if}
		</div>
		{#if $professional != null}
			{#each patientsFound as patient}
				<PatientCard {patient} />
			{/each}
		{/if}
	</TabItem>
	<TabItem open={isSession} title="Sessões">
		{#await getSessions()}
			<Spinner />
		{:then sessions}
			<div class="flex justify-center flex-col gap-2">
				<Button on:click={() => (hideAddSession = false)}>Adicionar Sessão!</Button>
				{#if sessions?.length === 0}
					<p class="text-center p-1 mt-2">Nenhuma sessão cadastrado!</p>
				{:else}
					<Search bind:value={searchSessionValue} placeholder="buscar pelo nome do paciente" />
				{/if}
			</div>
			{#if sessions != null && $professional?.patients}
				{#each sessions.filter( (s) => s.patientIds.some( (pi) => patientsFoundToSession.includes(pi) ) ) as session}
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
