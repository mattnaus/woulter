<svelte:options accessors/>
<script>
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Notification from "./Notification.svelte";

  export let inputCycleAmount, inputParticipants, inputDescription, notification;

</script>
<form class="mt-6 px-4 sm:px-6">

  <div class="mb-8">
    <label for="price" class="block text-sm font-medium text-gray-700">Circle amount</label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">
          $
        </span>
      </div>
      <Input bind:this={inputCycleAmount} placeholder="2" ariaDescribeBy="price-currency" classes="pl-7 pr-12" type="number" />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm" id="price-currency">
          ETH
        </span>
      </div>
    </div>
    <p class="mt-2 text-sm text-gray-500" id="email-description">This is the full amount, per cycle, from all participants combined.</p>
  </div>

  <div class="mb-8">
    <label for="email" class="block text-sm font-medium text-gray-700">Number of participants</label>
    <div class="mt-1">
      <Input type="number" ariaDescribeBy="price-currency" placeholder="10" bind:this={inputParticipants} />
    </div>
    <p class="mt-2 text-sm text-gray-500" id="email-description">The total number of participans you want in this Circle (this equals the number of cycles).</p>
  </div>

  <div class="mb-8">
    <label for="email" class="block text-sm font-medium text-gray-700">Description</label>
    <div class="mt-1">
      <Textarea ariaDescribeBy="description" placeholder="New circle description" bind:this={inputDescription} rows="4" />
    </div>
    <p class="mt-2 text-sm text-gray-500" id="email-description">Provide a description of this new circle's purpose.</p>
  </div>

  <Notification bind:this={notification} />

</form>
