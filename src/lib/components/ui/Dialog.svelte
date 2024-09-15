<script lang="ts">
	import { Dialog, Separator } from 'bits-ui';
	import type { Snippet } from 'svelte';

	import { X } from 'lucide-svelte';

	let {
		label,
		title,
		children,
		onOpen,
		onClose,
		isOpen = $bindable()
	}: {
		label: string;
		title: string;
		children: Snippet;
		onOpen?: () => void;
		onClose?: () => void;
		isOpen: boolean;
	} = $props();

	function handleOpen() {
		isOpen = true;
		if (onOpen) onOpen();
	}
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger onclick={handleOpen} class="btn">
		{label}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%]  rounded-xl  border bg-white p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				{title}
			</Dialog.Title>
			{@render children()}

			<Dialog.Close
				class="active:scale-98 absolute right-5 top-5 rounded-md  text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<div>
					<X class="size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>

			<Separator.Root class="-mx-5 mb-6 mt-5 block h-px bg-muted" />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
