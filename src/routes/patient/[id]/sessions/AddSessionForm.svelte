<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputDocument from '$lib/components/InputDocument.svelte';
	import InputPhone from '$lib/components/InputPhone.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';
	import { patient } from '$lib/stores/patient';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label } from 'flowbite-svelte';

	let error: string | null = null;
	let loading = false;
	export let runAfterSubmit: () => void = () => {};

	let successMessage: string | null = null;

	async function handler() {
		loading = true;
		successMessage = null;
		error = null;
		clearFormError();
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				loading = false;
				processFormError(result);
				return;
			}
			loading = false;
			successMessage = 'Sucesso ao adicionar sessão!';
			professional.set(result.data);
			setTimeout(() => {
				successMessage = null;
				error = null;
				runAfterSubmit();
			}, 2000);
			await applyAction(result);
		};
	}
</script>

<form use:enhance={handler} method="POST" action="?/addSession">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={$patient?.id} name="patientId" id="patientId" />
		<div>
			<Label for="startDate" class="mb-2">Data</Label>
			<Input type="date" id="startDate" placeholder="01/01/2000" required name="startDate" />
		</div>
		<div>
			<Label for="timeInMinutes" class="mb-2">Tempo em minutos</Label>
			<InputDocument id="timeInMinutes" required name="timeInMinutes" />
		</div>
		<div>
			<Label for="amount" class="mb-2">Valor</Label>
			<InputPhone type="tel" id="amount" name="amount" />
		</div>
	</div>
	<Button type="submit">
		{#if loading}
			<Spinner class="my-1 mx-3" size="3" color="white" />
		{:else}
			Adicionar
		{/if}
	</Button>
	<ErrorMessage show={!!error} message={error} />
	<SuccessMessage show={!!successMessage} message={successMessage} />
</form>
