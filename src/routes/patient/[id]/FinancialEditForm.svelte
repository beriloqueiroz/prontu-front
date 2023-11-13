<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';

	export let patient: Patient;
	import { Input, Label, Button, Select } from 'flowbite-svelte';
	import { applyAction, enhance } from '$app/forms';
	import InputMask from '$lib/components/InputMask.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { professional } from '$lib/stores/professional';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { goto } from '$app/navigation';
	import {
		allSessionTypes,
		getSessionTypeKey
	} from '$lib/interface/professional/enums/sessionType';
	import {
		allPaymentTypes,
		getPaymentTypeKey
	} from '$lib/interface/professional/enums/paymentType';

	let error: string | null = null;
	let loading = false;
	let sessionType_selected = patient.financialInfo?.sessionType;
	let sessionTypes = allSessionTypes.map((st) => ({
		value: st,
		name: getSessionTypeKey(st)
	}));
	let paymentType_selected = patient.financialInfo?.paymentType;
	let paymentTypes = allPaymentTypes.map((st) => ({
		value: st,
		name: getPaymentTypeKey(st)
	}));
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

<form use:enhance={handleEdit} method="POST" action="?/editFinancial">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<input type="hidden" value={$professional?.id} name="professionalId" id="professionalId" />
		<input type="hidden" value={patient.id} name="id" id="id" />
		<div>
			<Label for="defaultSessionPrice" class="mb-2">Valor padrão da sessão</Label>
			<InputMask
				type="text"
				id="defaultSessionPrice"
				required
				mask="R$ 000,00"
				maskChar="_"
				placeholder="R$ 150,00"
				name="defaultSessionPrice"
				value={'R$ ' + patient.financialInfo?.defaultSessionPrice + ',00'}
			/>
		</div>
		<div>
			<Label for="estimatedSessionsByWeek" class="mb-2">Quantidade de sessões por semana</Label>
			<Input
				type="number"
				id="estimatedSessionsByWeek"
				name="estimatedSessionsByWeek"
				value={patient.financialInfo?.estimatedSessionsByWeek}
			/>
		</div>
		<div>
			<Label for="estimatedTimeSessionInMinutes" class="mb-2"
				>Tempo estimado da sessão em minutos</Label
			>
			<Input
				type="number"
				id="estimatedTimeSessionInMinutes"
				name="estimatedTimeSessionInMinutes"
				value={patient.financialInfo?.estimatedTimeSessionInMinutes}
			/>
		</div>
		<div>
			<Label>
				Tipo de sessão:
				<Select items={sessionTypes} bind:value={sessionType_selected} />
				<input type="hidden" value={sessionType_selected} name="sessionType" id="sessionType" />
			</Label>
		</div>
		<div>
			<Label>
				Tipo de pagamento:
				<Select items={paymentTypes} bind:value={paymentType_selected} />
				<input type="hidden" value={paymentType_selected} name="paymentType" id="paymentType" />
			</Label>
		</div>
		<div>
			<Label for="paymentPeriodInDays" class="mb-2">Período de pagamento em dias</Label>
			<Input
				type="number"
				id="paymentPeriodInDays"
				name="paymentPeriodInDays"
				value={patient.financialInfo?.paymentPeriodInDays || 1}
			/>
		</div>
		<div>
			<Label for="sessionQuantityPerPayment" class="mb-2">Quantidade de sessões por pagamento</Label
			>
			<Input
				type="number"
				id="sessionQuantityPerPayment"
				name="sessionQuantityPerPayment"
				value={patient.financialInfo?.sessionQuantityPerPayment || 1}
			/>
		</div>
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
