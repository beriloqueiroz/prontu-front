<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';

	export let patient: Patient;
	import { Input, Label, Button, Toggle } from 'flowbite-svelte';
	import { applyAction, enhance } from '$app/forms';
	import InputMask from '$lib/components/InputMask.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { professional } from '$lib/stores/professional';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { goto } from '$app/navigation';

	let error: string | null = null;
	let loading = false;
	let isActive = patient.isActive;

	let successMessage: string | null = null;

	async function handleEdit() {
		loading = true;
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				loading = false;
				return;
			}
			loading = false;
			successMessage = 'Sucesso ao editar paciente!';
			patient = result.data;
			professional.changePatient(patient);
			await applyAction(result);
		};
	}
</script>

<form use:enhance={handleEdit} method="POST" action="?/editGeneral">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<Toggle class="mb-2" bind:checked={isActive}>{isActive ? 'Ativado' : 'Desativado'}</Toggle>
		<input type="hidden" value={isActive} name="isActive" id="isActive" />
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={patient.id} name="id" id="id" />
		<div>
			<Label for="name" class="mb-2">Nome completo</Label>
			<Input
				type="text"
				id="name"
				placeholder="John Doe"
				required
				name="name"
				value={patient.name}
			/>
		</div>
		<div>
			<Label for="document" class="mb-2">Cpf</Label>
			<InputMask
				type="text"
				id="document"
				required
				mask="000.000.000-00"
				maskChar="_"
				name="document"
				value={patient.document}
			/>
		</div>
		<div>
			<Label for="phone" class="mb-2">Telefone</Label>
			<InputMask
				type="tel"
				id="phone"
				mask="+55 (00) 0 0000-0000"
				size={16}
				name="phone"
				value={patient.phones.find((ph) => !ph.isChat)?.value}
			/>
		</div>
		<div>
			<Label for="chatPhone" class="mb-2">Whatsapp</Label>
			<InputMask
				type="tel"
				id="chatPhone"
				mask="+55 (00) 0 0000-0000"
				size={16}
				name="chatPhone"
				value={patient.phones.find((ph) => ph.isChat)?.value}
			/>
		</div>
	</div>
	<div class="mb-6">
		<Label for="email" class="mb-2">Email</Label>
		<Input
			type="email"
			id="email"
			placeholder="john.doe@company.com"
			required
			name="email"
			value={patient.email}
		/>
	</div>
	<Button type="submit">
		{#if loading}
			<Spinner class="my-1 mx-3" size="3" color="white" />
		{:else}
			Salvar
		{/if}
	</Button>
	<Button type="button" on:click={() => goto('/')}>Cancelar</Button>
	<ErrorMessage show={!!error} message={error} />
	<SuccessMessage show={!!successMessage} message={successMessage} />
</form>
