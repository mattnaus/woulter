<svelte:options accessors/>
<script>
  const defaultClasses = "block w-full rounded-md sm:text-sm";

  const states = {
    "default": "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
    "error": "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
  };

  export let state = "default";
  export let classes = "";
  export let type = "text";
  export let placeholder = "";
  export let ariaDescribeBy = "";
  export let error = true;
  export let value;
</script>
{#if type === "text"}
<input type="text" class="{defaultClasses} {states[state]} {classes}" placeholder={placeholder} aria-describedby={ariaDescribeBy} bind:value={value}>
{:else if type === "number"}
<input type="number" class="{defaultClasses} {states[state]} {classes}" placeholder={placeholder} aria-describedby={ariaDescribeBy} bind:value={value}>
{/if}
