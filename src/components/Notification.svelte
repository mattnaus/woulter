<svelte:options accessors/>
<script>
  export let show = false;
  export let heading = false;
  export let content = "";
  export let classes = "";
</script>

{#if show === "error"}
<div class="rounded-md bg-red-50 p-4 {classes}">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/x-circle -->
      <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      {#if heading}
      <h3 class="mb-2 text-sm font-medium text-red-800">
        {heading}
      </h3>
      {/if}
      <div class="text-sm text-red-700">
        {content}
      </div>
    </div>
  </div>
</div>
{:else if show === "confirm"}
<div class="rounded-md bg-green-50 p-4 {classes}">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/information-circle -->
      <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      {#if heading}
      <h3 class="mb-2 text-sm font-medium text-green-800">
        {heading}
      </h3>
      {/if}
      <div class="text-sm text-green-700">
        {content}
      </div>
    </div>
  </div>
</div>
{:else if show === "neutral"}
<div class="rounded-md bg-blue-50 p-4 {classes}">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/information-circle -->
      <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      {#if heading}
      <h3 class="mb-2 text-sm font-medium text-blue-800">
        {heading}
      </h3>
      {/if}
      <div class="text-sm text-blue-700">
        {content}
      </div>
    </div>
  </div>
</div>
{/if}
