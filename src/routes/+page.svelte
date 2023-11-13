<script lang="ts">
	import PatientCard from '$lib/components/PatientCard.svelte';
	import { professional } from '$lib/stores/professional';
	import { Button, CloseButton, Drawer, Search, TabItem, Tabs } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddPatientForm from './AddPatientForm.svelte';

	let hideAddPatient = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let searchValue = '';

	const submitted = () => {
		alert(`You are searching: ${searchValue}`);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<section>
	<Tabs class="flex justify-center flex-nowrap">
		<TabItem open title="Pacientes">
			<div class="w-100 flex justify-center flex-col gap-2">
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
		<TabItem title="Sessões">Em breve</TabItem>
	</Tabs>
</section>

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
