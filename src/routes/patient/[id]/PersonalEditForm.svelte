<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputMask from '$lib/components/InputMask.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';
	import { patient } from '$lib/stores/patient';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';

	let error: string | null = null;
	let loading = false;
	let successMessage: string | null = null;
	let otherInfo = $patient.personalForm?.othersInfos || '';

	async function handleEdit() {
		loading = true;
		error = null;
		successMessage = null;
		clearFormError();
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				processFormError(result);
				loading = false;
				return;
			}
			loading = false;
			successMessage = 'Sucesso ao editar paciente!';
			patient.set(result.data);
			professional.changePatient($patient);
			await applyAction(result);
		};
	}
</script>

<form use:enhance={handleEdit} method="POST" action="?/editPersonal">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={$patient.id} name="id" id="id" />
		<div>
			<Label for="zipCode" class="mb-2">CEP</Label>
			<InputMask
				type="text"
				id="zipCode"
				required
				mask="00000-000"
				maskChar="_"
				placeholder="60000-000"
				name="zipCode"
				value={$patient.personalForm?.zipCode || ''}
			/>
		</div>
		<div>
			<Label for="street" class="mb-2">Logradouro</Label>
			<Input type="text" id="street" name="street" value={$patient.personalForm?.street} />
		</div>
		<div>
			<Label for="number" class="mb-2">Número</Label>
			<Input type="text" id="number" name="number" value={$patient.personalForm?.number} />
		</div>
		<div>
			<Label for="neighborhood" class="mb-2">Bairro</Label>
			<Input
				type="text"
				id="neighborhood"
				name="neighborhood"
				value={$patient.personalForm?.neighborhood || ''}
			/>
		</div>
		<div>
			<Label for="observations" class="mb-2">Complemento</Label>
			<Input
				type="text"
				id="observations"
				name="observations"
				value={$patient.personalForm?.observations}
			/>
		</div>
		<div>
			<Label for="city" class="mb-2">Cidade</Label>
			<Input type="text" id="city" name="city" value={$patient.personalForm?.city || ''} />
		</div>
		<div>
			<Label for="region" class="mb-2">Estado</Label>
			<Input type="text" id="region" name="region" value={$patient.personalForm?.region || ''} />
		</div>
		<div>
			<Label for="country" class="mb-2">País</Label>
			<Input
				type="text"
				id="country"
				name="country"
				value={$patient.personalForm?.country || 'Brasil'}
			/>
		</div>
		<div>
			<Label for="contact" class="mb-2">Contatos</Label>
			<Input type="text" id="contact" name="contact" value={$patient.personalForm?.contact || ''} />
		</div>
		<div>
			<Label for="phones" class="mb-2">Telefones</Label>
			<Input type="text" id="phones" name="phones" value={$patient.personalForm?.phones || ''} />
		</div>
		<div>
			<Label for="othersInfos" class="mb-2">Outras Informações</Label>
			<Textarea type="text" id="othersInfos" name="othersInfos" bind:value={otherInfo} rows="4" />
			<input type="hidden" value={otherInfo} name="othersInfos" id="othersInfos" />
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
	</div>
</form>
