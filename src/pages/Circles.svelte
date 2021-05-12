<script>
  import factory from "../utils/factory.js";
  import Rosca from "../utils/rosca.js";
  import { Router, Route, Link } from "svelte-routing";
  import Button from '../components/Button.svelte';
  import Slideover from '../components/Slideover.svelte';
  import Notification from "../components/Notification.svelte";
  import web3 from "../utils/web3.js";
  import Circle from "./Circle.svelte";

  let roscaAddresses = [],
    newCircleSlide,
    promise;

  //onMount( async () => {loadCircles()});

  async function loadCircles() {

    let circles = [];
    roscaAddresses = await factory.methods.getDeployedRoscas().call();

    for (let i = 0; i < roscaAddresses.length; i++) {
      let rosca = Rosca(roscaAddresses[i]);
			let roscaDetails = await rosca.methods.getSummary().call();

      let date = new Date(Number(roscaDetails.timestamp)*1000);
      let niceDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();

			circles.push({...roscaDetails, start: niceDate, address: roscaAddresses[i]});
      circles = circles;
    }
    console.log(circles);
    return circles;
  }

  function load () {
    console.log('reload :)');
    promise = loadCircles();
  }

  promise = loadCircles();

</script>

<Router>

  <Route path="/">

    <!-- Circle filters -->
    <div class="mb-10">
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">Select a tab</label>
        <select id="tabs" name="tabs" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>All</option>

          <option>Pending</option>

          <option selected>Running</option>

          <option>Closed</option>

          <option>Cancelled</option>
        </select>
      </div>
      <div class="hidden sm:block">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200" -->

            <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              All Circles

              <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
              <span class="bg-gray-100 text-gray-900 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">52</span>
            </a>

            <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Pending

              <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
              <span class="bg-gray-100 text-gray-900 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">6</span>
            </a>

            <a href="#" class="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Running

              <!-- Current: "bg-indigo-100 text-indigo-600", Default: "bg-gray-100 text-gray-900" -->
              <span class="bg-indigo-100 text-indigo-600 hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block">4</span>
            </a>

            <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Closed
            </a>

            <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              Cancelled
            </a>
          </nav>
        </div>
      </div>
    </div>
    <!-- end Circle filters -->

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">

        {#await promise}
        <li class="px-4 py-4 sm:px-6">
          <Notification content="Loading circles, please stand by..." show="neutral" />
        </li>
        {:then circles}
        {#each circles as circle}
        <li>
          <Link to={circle.address} class="block hover:bg-gray-50">
            <div class="flex items-center px-4 py-4 sm:px-6">
              <div class="mr-4">
                <svg class="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1">
                  <div>
                    <p class="text-gray-500">
                      <b>{web3.utils.fromWei(circle.fundsRequiredForCycle)} ETH</b> per cycle. <b>{circle.activeParticipants}</b> out of <b>{circle.nrOfParticipants}</b> participants. <b>{web3.utils.fromWei(circle.cycleContribution, "ether")} ETH</b> per participant per cycle.
                    </p>
                  </div>
              </div>
              <div>
                <!-- Heroicon name: solid/chevron-right -->
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </Link>
        </li>
        {/each}
        {/await}
      </ul>

      <!-- This example requires Tailwind CSS v2.0+ -->
      <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
        <div class="hidden sm:block">
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">1</span>
            to
            <span class="font-medium">10</span>
            of
            <span class="font-medium">20</span>
            results
          </p>
        </div>
        <div class="flex-1 flex justify-between sm:justify-end">
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </a>
          <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" on:click={load}>
            Next
          </a>
        </div>
      </nav>
    </div>
  </Route>

  <Route path="/:id" let:params>
    <Circle id={params.id} />
  </Route>

</Router>

<Slideover bind:this={newCircleSlide} on:circlesUpdated={load} />
