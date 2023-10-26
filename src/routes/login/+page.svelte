<script>
	import Input from '../../components/Input.svelte';
</script>

<svelte:head>
	<title>entrar</title>
	<meta name="description" content="Entrar" />
</svelte:head>

<form action="/api/login" method="post">
	<div class="">
		<Input id="login" label="E-mail" name="email" placeholder="fulano@gmail.com" />
		<div class="">
			<label for="password" class="">Senha</label>
			<input id="password" name="password" type="password" class="" placeholder="Password" />
		</div>
		<div class="">
			<button class="">Entrar</button>
		</div>
	</div>
</form>
