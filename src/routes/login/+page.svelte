<script>
	import { Input, Label, Button } from 'flowbite-svelte';
</script>

<form>
	<div class="mb-6">
		<Label for="email" class="mb-2">E-mail</Label>
		<Input type="email" id="email" placeholder="john.doe@company.com" required />
	</div>
	<div class="mb-6">
		<Label for="password" class="mb-2">Senha</Label>
		<Input type="password" id="password" placeholder="•••••••••" required />
	</div>
	<Button type="submit">Entrar</Button>
</form>
