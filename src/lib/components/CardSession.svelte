<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/helpers';
	import type { Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, Card } from 'flowbite-svelte';

	export let session: Session;
</script>

<Card class="my-2 gap-2 flex flex-col relative mx-auto w-full">
	{#each session.Patients as patientId}
		<div>
			<p>{$professional?.patients?.find((p) => p.id === patientId?.PatientId)?.name}</p>
		</div>
	{/each}
	<div class="flex">
		<h3>Data:</h3>
		<p>{formatDate(session.StartDate)}</p>
	</div>
	<div class="flex">
		<h3>Tempo:</h3>
		<p>{session.TimeInMinutes}</p>
	</div>
	<Button type="button" on:click={() => goto(`/session/${session.Id}`)}>Acessar</Button>
</Card>
