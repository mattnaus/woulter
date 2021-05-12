<script>
  import PageBar from '../components/PageBar.svelte';
  import Button from '../components/Button.svelte';
  import factory from '../utils/factory';
  import web3 from '../utils/web3';
  import { navigate } from "svelte-routing";
  import Notification from '../components/Notification.svelte';

  let minContribution = 100;
  let message;
  let formButton;
  let notification;

  const createCampaign = async () => {

    formButton.loading = true;
    notification.show = false;

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minContribution).send({
        from: accounts[0]
      });
      navigate("/", { replace: true });
    } catch (err) {
      notification.message = err.message;
      notification.show = "warning";
    }
    formButton.loading = false;

  }
</script>

<PageBar pageTitle="New Campaign" />
<div>
  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Your new campaign</h3>
        <p class="mt-1 text-sm text-gray-600">
          This information will be displayed publicly so be careful what you share.
        </p>
      </div>
    </div>
    <div class="mt-5 md:mt-0 md:col-span-2">
      <form action="#" method="POST">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
          <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
            <div class="grid grid-cols-3 gap-6">
              <div class="col-span-3 sm:col-span-2">
                <label for="company_website" class="block text-sm font-medium text-gray-700">
                  Minimum contribution
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input type="number" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300" placeholder="100">
                  <span class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    wei
                  </span>
                </div>
              </div>
            </div>
            <Notification bind:this={notification} />
            {#if message}
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 w-full">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <!-- Heroicon name: solid/exclamation -->
                    <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      {message}
                      <a href="#" class="font-medium underline text-yellow-700 hover:text-yellow-600">

                      </a>
                    </p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Button bind:this={formButton} type="button" label="Create Campaign" on:click={createCampaign} loading={false} />
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
