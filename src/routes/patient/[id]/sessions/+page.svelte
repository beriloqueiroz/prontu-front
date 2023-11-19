<script lang="ts">
	import { patient } from '$lib/stores/patient.js';
	import { Button, CloseButton, Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddSessionForm from './AddSessionForm.svelte';
	import CardSession from '$lib/components/CardSession.svelte';

	export let data;

	patient.updateSessions(data.sessions);

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let hideAddSession = true;
</script>

<section class="flex flex-col justify-center">
	<h3 class="my-2 text-center">Sessões</h3>
	<Button on:click={() => (hideAddSession = false)}>Adicionar Sessão!</Button>
	{#if $patient.sessions == null || $patient.sessions?.length === 0}
		<p class="text-center p-1 mt-2">Nenhuma sessão!</p>
	{:else}
		{#each $patient.sessions as session}
			<CardSession {session} />
		{/each}
	{/if}
</section>

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
