<script>
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer {...$$props}>
	<FooterCopyright href="/" by="berilo.queiroz" year={2023} />
	<FooterLinkGroup
		ulClass="flex justify-center items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 text-center p-1"
	>
		<FooterLink href="/policy">Política de privacidade</FooterLink>
	</FooterLinkGroup>
</Footer>
