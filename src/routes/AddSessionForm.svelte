<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import DateInput from '$lib/components/DateInput.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputCurrency from '$lib/components/InputCurrency.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import Trash from '$lib/components/Trash.svelte';
	import { formatDate } from '$lib/helpers';
	import { clearFormError, processFormError, simplePatient } from '$lib/helpers/forms';
	import type { Patient } from '$lib/interface/professional/patient';
	import { professional } from '$lib/stores/professional';
	import { Button, Input, Label } from 'flowbite-svelte';

	let error: string | null = null;
	let loading = false;
	export let runAfterSubmit: () => void = () => {};

	let successMessage: string | null = null;
	let now = new Date();
	now.setTime(now.getTime() + 2 * 60 * 60 * 1000);

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

	let patients: (Patient | undefined)[] = [undefined];
	let refreshChangePatientKey = {};
	let possiblePatients: Patient[] = [];

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

<form use:enhance={handler} method="POST" action="?/addSessionByProfessional">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={patients.map((p) => p?.id)} name="patientIds" id="patientIds" />
		<div>
			{#each patients as patient, i}
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
					{#if patients.length >= 2}
						<button
							class="m-auto flex flex-col justify-center"
							type="button"
							on:click={() => (patients = [...patients.filter((_, j) => i !== j)])}
						>
							<Trash />
						</button>
					{/if}
				</div>
			{/each}
			<Button on:click={() => (patients = [...patients, undefined])}>Adicionar paciente</Button>
		</div>
		<div>
			<Label for="startDate" class="mb-2">Data</Label>
			<DateInput id="startDate" required name="startDate" value={formatDate(now)} />
		</div>
		<div>
			<Label for="timeInMinutes" class="mb-2">Tempo em minutos</Label>
			<Input
				type="number"
				id="timeInMinutes"
				required
				name="timeInMinutes"
				value={patients[0]?.financialInfo?.estimatedTimeSessionInMinutes || 50}
			/>
		</div>
		<div>
			<Label for="amount" class="mb-2">Valor</Label>
			<InputCurrency
				id="amount"
				name="amount"
				required
				value={patients[0]?.financialInfo?.defaultSessionPrice || '300'}
			/>
		</div>
		<div>
			<Label for="location" class="mb-2">Localização</Label>
			<Input id="location" name="location" value="remoto" />
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
