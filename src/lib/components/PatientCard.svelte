<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';
	import { A, Avatar, Badge, Button, Card, Indicator } from 'flowbite-svelte';

	import PhoneButton from './PhoneButton.svelte';
	import WhatsappButton from './WhatsappButton.svelte';
	import { goto } from '$app/navigation';
	export let patient: Patient;
</script>

<Card class="my-2 gap-2 flex flex-col relative mx-2 w-full">
	<div class="flex justify-between">
		<div>
			<h3 class="font-bold">{patient.name}</h3>
			<A href={`mailto:${patient.email}`} class="font-medium">{patient.email}</A>
		</div>
		<div class="flex justify-center flex-col gap-2">
			<Avatar src={patient.avatar} rounded class="m-auto" />
			<Badge color={patient.isActive ? 'green' : 'red'} rounded class="px-2.5 py-0.5 ">
				<Indicator
					color={patient.isActive ? 'green' : 'orange'}
					size="xs"
					class="mr-1"
				/>{patient.isActive ? 'Ativo' : 'Desativado'}
			</Badge>
		</div>
	</div>
	<div class="flex justify-between">
		<div class="flex gap-3">
			{#if patient.phones?.length == 0}
				<p>{'Sem informações de telefone ou whatsapp'}</p>
			{:else}
				{#if patient.phones.find((p) => p.isChat)}
					<WhatsappButton
						phone={patient.phones.find((p) => p.isChat)?.value.toString() || ''}
						message={'Olá ' + patient.name + ', '}
					/>
				{/if}
				<PhoneButton phone={patient.phones.find((p) => !p.isChat)?.value || ''} />
			{/if}
		</div>
	</div>
	<Button on:click={() => goto(`/patient/${patient.id}`)}>Editar</Button>
	<Button on:click={() => goto(`/patient/${patient.id}/sessions`)}>Sessões</Button>
</Card>
