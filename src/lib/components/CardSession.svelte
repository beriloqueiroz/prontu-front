<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDateToBR } from '$lib/helpers';
	import type { Session } from '$lib/interface/session/session';
	import { patient } from '$lib/stores/patient';
	import { professional } from '$lib/stores/professional';
	import { Button, Card } from 'flowbite-svelte';
	import Trash from './Trash.svelte';

	export let session: Session;

	async function deleteSession(id: string | undefined): Promise<void> {
		const professionalId = $professional?.id;
		if (!professionalId) {
			goto('/login');
		}
		const response = await fetch(`${location.protocol}//${location.host}/api/session/${id}`, {
			method: 'DELETE',
			headers: {
				professionalId: `${professionalId}`
			}
		});
		const resp = await response.json();
		if (response.ok) {
			professional.removeSession(id);
			patient.removeSession(id);
		}
		return resp;
	}
</script>

<Card class="my-2 gap-2 flex flex-col relative mx-1 w-full min-w-[300px]">
	{#each session.Patients as patientId}
		<div>
			<p>{$professional?.patients?.find((p) => p.id === patientId?.PatientId)?.name}</p>
		</div>
	{/each}
	<div class="flex">
		<h3>Data:</h3>
		<p>{formatDateToBR(session.StartDate)}</p>
	</div>
	<div class="flex">
		<h3>Tempo:</h3>
		<p>{session.TimeInMinutes}</p>
	</div>
	<div class="flex justify-between">
		<Button type="button" on:click={() => goto(`/session/${session.Id}`)}>Acessar</Button>
		<Button color="light" type="button" on:click={() => deleteSession(session.Id)}>Excluir</Button>
	</div>
</Card>
