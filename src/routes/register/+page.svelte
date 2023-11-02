<script lang="ts">
	import { Input, Label, Button, Checkbox, A, Select } from 'flowbite-svelte';
	import InputMask from '../../components/InputMask.svelte';
	import { applyAction, enhance } from '$app/forms';

	let institution_selected: string;

	let institutions = [
		{ value: 'crpce', name: 'CRP-CE' },
		{ value: 'crpsp', name: 'CRP-SP' },
		{ value: 'crm', name: 'CRM' },
		{ value: 'oab', name: 'OAB' }
	];

	async function handleRegister() {
		return async ({ result }: any) => {
			try {
				await applyAction(result);
			} catch (error) {
				console.log(error);
			}
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
		<Label for="email" class="mb-2">Email address</Label>
		<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
	</div>
	<div class="mb-6">
		<Label for="password" class="mb-2">Password</Label>
		<Input type="password" id="password" placeholder="•••••••••" required name="password" />
	</div>
	<div class="mb-6">
		<Label for="confirm_password" class="mb-2">Confirm password</Label>
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
	<Button type="submit">Cadastrar-se</Button>
</form>
