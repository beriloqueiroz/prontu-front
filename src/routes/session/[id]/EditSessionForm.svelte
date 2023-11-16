<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputDocument from '$lib/components/InputDocument.svelte';
	import InputPhone from '$lib/components/InputPhone.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';
	import type { Cid, Form, Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label, Select, Textarea } from 'flowbite-svelte';

	export let session: Session;
	export let runAfterSubmit: () => void = () => {};
	export let possiblesCids: { value: Cid; name: string }[];

	let error: string | null = null;
	let loading = false;
	let notes = session.notes || '';
	let forms: Form[] = session.forms || [];
	let cids: Cid[] = session.cids || [];

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

<form use:enhance={handler} method="POST" action="?/editSession">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={session?.patientIds} name="patientIds" id="patientIds" />
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
		<div>
			<Label for="endDate" class="mb-2">Data de fim</Label>
			<Input type="date" id="endDate" placeholder="01/01/2000" required name="endDate" />
		</div>
		<div>
			<Label for="notes" class="mb-2">Notas</Label>
			<Textarea type="text" id="notes" name="notes" bind:value={notes} rows="4" />
			<input type="hidden" value={notes} name="notes" id="notes" />
		</div>
		<div>
			<Label for="forms" class="mb-2">Formulários</Label>
			{#each forms as form, i}
				<div class="flex">
					<div>
						<Label for={`formsName_${i}`} class="mb-2">Nome</Label>
						<Input type="text" id={`formsName_${i}`} name={`formsName_${i}`} value={form.name} />
					</div>
					<div>
						<Label for={`formsLink_${i}`} class="mb-2">Fonte/link</Label>
						<Input type="text" id={`formsLink_${i}`} name={`formsLink_${i}`} value={form.link} />
					</div>
				</div>
			{/each}
			<Button on:click={() => forms.push({ name: '', link: '' })}>Incluir</Button>
			<input type="hidden" value={forms} name="forms" id="forms" />
		</div>

		<div>
			<Label for="cids" class="mb-2">CIDs</Label>
			{#each cids as cid, i}
				<div class="flex">
					<div>
						<Select
							class="mt-2"
							items={possiblesCids}
							value={possiblesCids.find((pc) => pc.value.code === cid.code)}
							on:change={() => {
								cids = [
									...cids.splice(i, 1),
									possiblesCids.find((pc) => pc.value.code === cid.code)?.value || cid
								];
							}}
						/>
					</div>
					<div>
						<Label for={`cidsObs_${i}`} class="mb-2">Fonte/link</Label>
						<Input type="text" id={`cidsObs_${i}`} name={`cidsObs_${i}`} value={cid.observation} />
					</div>
				</div>
			{/each}
			<Button on:click={() => cids.push({ code: '', name: '', observation: '' })}>Incluir</Button>
			<input type="hidden" value={cids} name="cids" id="cids" />
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
