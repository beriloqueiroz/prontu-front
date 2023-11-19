<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import Trash from '$lib/components/Trash.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';
	import type { Patient } from '$lib/interface/professional/patient';
	import type { Cid, Form, Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';

	export let session: Session;
	export let runAfterSubmit: () => void = () => {};
	export let possiblesCids: Cid[];

	let error: string | null = null;
	let loading = false;
	let notes = session.notes || '';
	let forms: Form[] = session.forms || [];
	let cids: Cid[] = session.cids || [];
	let emptyCid: Cid = { code: '', name: '', observation: '' };
	let emptyForm: Form = { link: '', name: '' };
	let patients =
		session.patientIds.map((sp) => $professional?.patients.find((p) => p.id === sp)) || [];

	$: patientIds = patients.map((p) => p?.id);

	let possiblePatients: Patient[] = [];

	let refreshChangePatientKey = {};

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

	function simplePatient(patient: Patient | undefined) {
		if (!patient) {
			return ``;
		}
		return `${patient?.id.substring(0, 4)} - ${patient?.name}`;
	}

	function changeCidCode(e: Event, i: number) {
		const input = e.currentTarget as HTMLInputElement;
		cids[i] = possiblesCids.find((pc) => pc.code === input?.value) || {
			code: input.value,
			name: ''
		};
		cids = cids;
	}

	function getPossiblesPatients(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		if (input.value.length <= 3) {
			possiblePatients = [];
			return;
		}
		possiblePatients =
			$professional?.patients.filter((p) =>
				p.name.toLowerCase().includes(input?.value.toLowerCase())
			) || [];
	}

	function changePatient(patient: Patient, i: number) {
		patients[i] = patient;
		patients = patients;
		possiblePatients = [];
	}

	function blurChangePatient(e: FocusEvent) {
		const input = e.relatedTarget as HTMLInputElement;
		if (input?.id !== 'change_patient') {
			possiblePatients = [];
			refreshChangePatientKey = {};
		}
	}
</script>

<form use:enhance={handler} method="POST" action="?/editSession">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={patientIds} name="patientIds" id="patientIds" />
		<div class="flex flex-col gap-1">
			<div class="flex flex-col">
				<Label for="startDate" class="mb-2">Pacientes</Label>
				<Input
					type="text"
					id="mainPatient"
					required
					name="mainPatient"
					readonly
					value={simplePatient(patients[0])}
				/>
			</div>
			{#each patients as patient, i}
				{#if i > 0}
					<div class="flex gap-1">
						<div class="relative w-11/12">
							{#key refreshChangePatientKey}
								<Input
									type="text"
									id={`patient_${i}`}
									name={`patient_${i}`}
									value={simplePatient(patient)}
									on:keyup={getPossiblesPatients}
									on:blur={blurChangePatient}
								/>
							{/key}
							{#if possiblePatients?.length}
								<ul class="absolute bottom-100 left-0 bg-white p-2">
									{#each possiblePatients as possiblePatient}
										<li class="p-1 m-1">
											<button
												type="button"
												id="change_patient"
												on:click={() => changePatient(possiblePatient, i)}
											>
												{simplePatient(possiblePatient)}
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<button
							class="m-auto flex flex-col justify-center"
							type="button"
							on:click={() => (patients = [...patients.filter((_, j) => i !== j)])}
						>
							<Trash />
						</button>
					</div>
				{/if}
			{/each}
			<Button on:click={() => (patients = [...patients, undefined])}>Incluir</Button>
		</div>
		<div>
			<Label for="startDate" class="mb-2">Data</Label>
			<Input
				type="date"
				id="startDate"
				placeholder="01/01/2000"
				required
				name="startDate"
				value={session.startDate}
			/>
		</div>
		<div>
			<Label for="timeInMinutes" class="mb-2">Tempo em minutos</Label>
			<Input
				id="timeInMinutes"
				required
				name="timeInMinutes"
				value={session.timeInMinutes}
				type="number"
			/>
		</div>
		<div>
			<Label for="amount" class="mb-2">Valor</Label>
			<InputCurrency id="amount" name="amount" value={session.amount} />
		</div>
		<div>
			<Label for="endDate" class="mb-2">Data de fim</Label>
			<Input
				type="date"
				id="endDate"
				placeholder="01/01/2000"
				required
				name="endDate"
				value={session.endDate}
			/>
		</div>
		<div>
			<Label for="notes" class="mb-2">Notas</Label>
			<Textarea type="text" id="notes" name="notes" bind:value={notes} rows="4" />
			<input type="hidden" value={notes} name="notes" id="notes" />
		</div>
		<div>
			<Label for="forms" class="mb-2 text-lg">Formulários</Label>
			<div class="flex flex-col gap-1">
				<div class="flex gap-1">
					<p class="w-1/3">Nome</p>
					<p class="w-3/4">Fonte/link</p>
					<p />
				</div>
				{#each forms as form, i}
					<div class="flex gap-1">
						<Input
							class="w-1/3"
							type="text"
							id={`formsName_${i}`}
							name={`formsName_${i}`}
							value={form.name}
						/>
						<Input
							class="w-3/4"
							type="text"
							id={`formsLink_${i}`}
							name={`formsLink_${i}`}
							value={form.link}
						/>
						<button
							class="m-auto flex flex-col justify-center"
							type="button"
							on:click={() => (forms = [...forms.filter((_, j) => i !== j)])}
						>
							<Trash />
						</button>
					</div>
				{/each}
			</div>
			<Button class="my-1 w-full" on:click={() => (forms = [...forms, emptyForm])}>Incluir</Button>
			<input type="hidden" value={forms} name="forms" id="forms" />
		</div>

		<div>
			<Label for="cids" class="mb-2">CIDs</Label>
			{#each cids as _, i}
				<div class="flex gap-1 my-1">
					<Input
						type="text"
						id={`cidsCode_${i}`}
						name={`cidsCode_${i}`}
						value={cids[i].code}
						on:keyup={(e) => changeCidCode(e, i)}
						class="w-20"
					/>
					<Input
						type="text"
						id={`cidsName_${i}`}
						name={`cidsName_${i}`}
						value={cids[i].name}
						readonly
					/>
					<button type="button" on:click={() => (cids = [...cids.filter((_, j) => i !== j)])}>
						<Trash />
					</button>
				</div>
			{/each}
			<Button class="my-1 w-full" on:click={() => (cids = [...cids, emptyCid])}>Incluir</Button>
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
