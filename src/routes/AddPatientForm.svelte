<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { applyAction, enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { professional } from '$lib/stores/professional';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import InputPhone from '$lib/components/InputPhone.svelte';
	import InputDocument from '$lib/components/InputDocument.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';

	let error: string | null = null;
	let loading = false;
	export let runAfterSubmit: () => void = () => {};

	let successMessage: string | null = null;

	async function handleRegister() {
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
			successMessage = 'Sucesso ao adicionar paciente!';
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

<form use:enhance={handleRegister} method="POST" action="?/addPatient">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<div>
			<Label for="name" class="mb-2">Nome completo</Label>
			<Input type="text" id="name" placeholder="John Doe" required name="name" />
		</div>
		<div>
			<Label for="document" class="mb-2">Cpf</Label>
			<InputDocument id="document" required name="document" />
		</div>
		<div>
			<Label for="phone" class="mb-2">Telefone</Label>
			<InputPhone type="tel" id="phone" name="phone" />
		</div>
		<div>
			<Label for="chatPhone" class="mb-2">Whatsapp</Label>
			<InputPhone id="chatPhone" name="chatPhone" />
		</div>
	</div>
	<div class="mb-6">
		<Label for="email" class="mb-2">Email</Label>
		<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
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
