<script lang="ts">
	import { Input, Label, Button, Checkbox, A, Select } from 'flowbite-svelte';
	import { applyAction, enhance } from '$app/forms';
	import InputMask from '$lib/components/InputMask.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';

	let institution_selected: string;

	let institutions = [
		{ value: 'crpce', name: 'CRP-CE' },
		{ value: 'crpsp', name: 'CRP-SP' },
		{ value: 'crm', name: 'CRM' }
	];

	let error: string | null = null;
	let loading = false;

	async function handleRegister() {
		loading = true;
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				loading = false;
				return;
			}
			loading = false;
			await applyAction(result);
		};
	}
</script>

<form use:enhance={handleRegister} method="POST" action="?/register">
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="name" class="mb-2">Nome completo</Label>
			<Input type="text" id="name" placeholder="John Doe" required name="name" />
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
			/>
		</div>
		<div>
			<Label for="phone" class="mb-2">Telefone</Label>
			<InputMask
				type="tel"
				id="phone"
				required
				mask="+55 (00) 0 0000-0000"
				size={16}
				name="phone"
			/>
		</div>
		<div>
			<Label>
				Orgão:
				<Select class="mt-2" items={institutions} bind:value={institution_selected} />
			</Label>

			<Label for="professionalDocument" class="mb-2">Documento Profissional</Label>
			<Input
				disabled={institution_selected == ''}
				type="text"
				id="professionalDocument"
				name="professionalDocument"
				placeholder="122552425"
				required
			/>
		</div>
	</div>
	<div class="mb-6">
		<Label for="email" class="mb-2">Email</Label>
		<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
	</div>
	<div class="mb-6">
		<Label for="password" class="mb-2">Senha</Label>
		<Input type="password" id="password" placeholder="•••••••••" required name="password" />
	</div>
	<div class="mb-6">
		<Label for="confirm_password" class="mb-2">Confirme a senha</Label>
		<Input
			type="password"
			id="confirm_password"
			placeholder="•••••••••"
			required
			name="rePassword"
		/>
	</div>
	<Checkbox class="mb-6 space-x-1" required>
		Eu aceito os <A href="/policy" class="text-primary-700 dark:text-primary-600 hover:underline"
			>termos e condições</A
		>.
	</Checkbox>
	<Button type="submit">
		{#if loading}
			<Spinner class="my-1 mx-3" size="3" color="white" />
		{:else}
			Cadastrar-se
		{/if}
	</Button>
	<ErrorMessage show={!!error} message={error} />
</form>
