<script lang="ts">
	import { patient } from '$lib/stores/patient.js';
	import { Button, CloseButton, Drawer } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import AddSessionForm from './AddSessionForm.svelte';
	import CardSession from '$lib/components/CardSession.svelte';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		patient.updateSessions(data.sessions);
	});

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let hideAddSession = true;
</script>

<section class="flex flex-col justify-center">
	<h3 class="my-2 text-center">Sessões</h3>
	<div class="md:w-full flex justify-center flex-col gap-2 md:max-w-3xl md:mx-auto">
		<button
			type="button"
			class="md:w-full text-center font-medium focus-within:ring-4 focus-within:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg"
			on:click={() => (hideAddSession = false)}>Adicionar Sessão!</button
		>
	</div>
	<div class="flex flex-col md:flex-row justify-center flex-wrap items-center">
		{#if $patient.sessions == null || $patient.sessions?.length === 0}
			<p class="text-center p-1 mt-2">Nenhuma sessão!</p>
		{:else}
			{#each $patient.sessions as session}
				<CardSession {session} />
			{/each}
		{/if}
	</div>
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
