<svelte:options accessors/>
<script>
  import { fly, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Button from './Button.svelte';
  import { displayNewCircleForm } from '../stores/state.js';
  import Form from "./Form.svelte";
  import factory from "../utils/factory.js";
  import web3 from "../utils/web3.js";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let notification, newCircleForm, newCircleButton;

  const createCircle = async () => {
    let error = false;
    const accounts = await web3.eth.getAccounts();

    newCircleButton.loading = true;

    newCircleForm.inputCycleAmount.state = "default";
    newCircleForm.inputParticipants.state = "default";

    if (newCircleForm.inputCycleAmount.value === 0 || newCircleForm.inputCycleAmount.value === undefined) {
      newCircleForm.inputCycleAmount.state = "error";
      error = true;
    }

    if (newCircleForm.inputParticipants.value === 0 || newCircleForm.inputParticipants.value === undefined) {
      newCircleForm.inputParticipants.state = "error";
      error = true;
    }

    if (newCircleForm.inputDescription.value === '' || newCircleForm.inputDescription.value === undefined) {
      newCircleForm.inputDescription.state = "error";
      error = true;
    }

    if (error) {
      newCircleForm.notification.heading = "Form error";
      newCircleForm.notification.content = "Please provide the correct data";
      newCircleForm.notification.show = "error";
      newCircleButton.loading = false;
      return false;
    }

    try {
      await factory.methods.createRosca(web3.utils.toWei(String(newCircleForm.inputCycleAmount.value), "ether"), newCircleForm.inputParticipants.value, newCircleForm.inputDescription.value).send({
        from: accounts[0]
      });
      dispatch('circlesUpdated');
      visible = false;
    } catch (err) {
      newCircleForm.notification.heading = "Form error";
      newCircleForm.notification.content = err.message;
      newCircleForm.notification.show = "error";
    }

    newCircleButton.loading = false;
  };

  export let visible;

  displayNewCircleForm.subscribe(value => {
    visible = (value) ? true: false;
	});
</script>

{#if visible}
<section class="fixed inset-0 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
  <div class="absolute inset-0 overflow-hidden">

    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" transition:fade></div>

    <div class="absolute inset-y-0 right-0 pl-10 max-w-full flex">

      <div class="w-screen max-w-md" transition:fade>
        <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll divide-y divide-gray-200">
          <div class="relative flex-1">

						<div class="py-6 px-4 bg-indigo-700 sm:px-6">
							<div class="flex items-center justify-between">
								<h2 class="text-lg font-medium text-white">
									Start a new Circle
								</h2>
								<div class="ml-3 h-7 flex items-center">
									<button class="bg-indigo-700 rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" on:click={()=>{displayNewCircleForm.set(false)}}>
										<span class="sr-only">Close panel</span>
										<!-- Heroicon name: outline/x -->
										<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
							</div>
							<div class="mt-1">
								<p class="text-sm text-indigo-300">
									Lorem, ipsum dolor sit amet consectetur adipisicing elit aliquam ad hic recusandae soluta.
								</p>
							</div>
						</div>

            <Form bind:this={newCircleForm} />

          </div>
					<div class="flex-shrink-0 px-4 py-4 flex justify-end">
            <Button label="Cancel" style="plain" on:click={() => {displayNewCircleForm.set(false)}} classes="mr-4" />
            <Button label="Start Circle" on:click={createCircle} bind:this={newCircleButton} />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/if}
