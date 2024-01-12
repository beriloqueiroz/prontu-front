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

	let sessions: Session[] = [];

	$: sessions = $professional?.sessions || [];

	onMount(async () => {
		isSession = window.location.hash === '#session';
	});

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
		const resp = await response.json();
		professional.populateSessions(resp);
		return resp;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<Tabs class="flex justify-center flex-nowrap">
	<TabItem open={!isSession} title="Pacientes">
		<div class="flex justify-center flex-col gap-2 md:max-w-3xl md:mx-auto">
			<Button on:click={() => (hideAddPatient = false)}>Adicionar Paciente!</Button>
			{#if $professional?.patients?.length === 0}
				<p class="text-center p-1 mt-2">Nenhum usuário cadastrado!</p>
			{:else}
				<Search bind:value={searchValue} placeholder="buscar pelo nome" />
			{/if}
		</div>
		<div class="flex flex-col md:flex-row justify-center items-center">
			{#if $professional != null}
				{#each patientsFound as patient}
					<PatientCard {patient} />
				{/each}
			{/if}
		</div>
	</TabItem>
	<TabItem open={isSession} title="Sessões">
		{#await getSessions()}
			<Spinner />
		{:then _}
			<div class="flex justify-center flex-col gap-2 md:max-w-3xl md:mx-auto">
				<Button on:click={() => (hideAddSession = false)}>Adicionar Sessão!</Button>
				{#if sessions?.length === 0}
					<p class="text-center p-1 mt-2">Nenhuma sessão cadastrado!</p>
				{:else}
					<Search bind:value={searchSessionValue} placeholder="buscar pelo nome do paciente" />
				{/if}
			</div>
			<div class="flex flex-col md:flex-row justify-center flex-wrap items-center">
				{#if sessions != null && $professional?.patients}
					{#each sessions.filter( (s) => s.Patients.some( (pi) => patientsFoundToSession.includes(pi.PatientId) ) ) as session}
						<CardSession {session} />
					{/each}
				{/if}
			</div>
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
