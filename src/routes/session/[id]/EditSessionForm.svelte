<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import DateInput from '$lib/components/DateInput.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import Trash from '$lib/components/Trash.svelte';
	import { formatDateToBR } from '$lib/helpers';
	import { clearFormError, processFormError, simplePatient } from '$lib/helpers/forms';
	import type { Patient } from '$lib/interface/professional/patient';
	import type { Cid, Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label, Textarea } from 'flowbite-svelte';

	export let session: Session;
	export let runAfterSubmit: () => void = () => {};
	export let possiblesCids: Cid[];

	let error: string | null = null;
	let loading = false;
	let notes = session.Notes || '';
	let cids: Cid[] = session.CidsSvelte || [];
	let emptyCid: Cid = { code: '', name: '', observation: '' };
	let patients =
		session?.Patients?.map((sp) => $professional?.patients.find((p) => p.id === sp.PatientId)) ||
		[];

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
			setTimeout(() => {
				successMessage = null;
				error = null;
				runAfterSubmit();
			}, 2000);
			await applyAction(result);
		};
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
		<input type="hidden" value={session.Id} name="id" id="id" />
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
			<DateInput
				id="startDate"
				required
				name="startDate"
				value={formatDateToBR(session.StartDate)}
			/>
		</div>
		<div>
			<Label for="timeInMinutes" class="mb-2">Tempo em minutos</Label>
			<Input
				id="timeInMinutes"
				required
				name="timeInMinutes"
				value={session.TimeInMinutes}
				type="number"
			/>
		</div>
		<div>
			<Label for="amount" class="mb-2">Valor</Label>
			<InputCurrency id="amount" name="amount" value={'R$ ' + session.Amount} />
		</div>
		<div>
			<Label for="endDate" class="mb-2">Data de fim</Label>
			<DateInput id="endDate" name="endDate" value={formatDateToBR(session.EndDate)} />
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
			<input type="hidden" value={JSON.stringify(cids)} name="cids" id="cids" />
		</div>
		<div>
			<Label for="location" class="mb-2">Localização</Label>
			<Input id="location" name="location" value="remoto" />
		</div>

		<div>
			<Label for="notes" class="mb-2">Notas</Label>
			<Textarea type="text" id="notes" name="notes" bind:value={notes} rows="7" />
			<input type="hidden" value={notes} name="notes" id="notes" />
		</div>
	</div>
	<Button type="submit">
		{#if loading}
			<Spinner class="my-1 mx-3" size="3" color="white" />
		{:else}
			Salvar
		{/if}
	</Button>
	<ErrorMessage show={!!error} message={error} />
	<SuccessMessage show={!!successMessage} message={successMessage} />
</form>
