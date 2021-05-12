<svelte:options accessors/>
<script>
  import { Link } from "svelte-routing";
  import Spinner from "./Spinner.svelte";

  const styles = {
    'primary': 'inline-flex items-center border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    'secondary': 'inline-flex items-center border border-transparent rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    'secondary': 'inline-flex items-center border border-transparent font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    'plain': 'inline-flex items-center bg-white border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
  };

  const sizes = {
    'default': 'px-4 py-2 text-sm',
    'lg': 'px-6 py-3 text-sm',
    'xl': 'px-6 py-3 text-base'
  }

  const icons = {
    'plus': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>`,
    'group': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>`,
    'backspace': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2"><path fill-rule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 2.414a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z" clip-rule="evenodd" /></svg>`
  };

  export let label = "A button";
  export let icon = "none";
  export let type = "button";
  export let loading = false;
  export let target = false;
  export let style = "primary";
  export let classes = '';
  export let disabled = false;
  export let size = "default";
</script>

{#if type === 'ilink'}
<Link to={target} class="{styles[style]} {sizes[size]} {classes}">
  {#if icon !== 'none'}
    {@html icons[icon]}
  {/if}
  {label}
  {#if loading}
    <Spinner classes="ml-2"/>
  {/if}
</Link>
{:else if type === 'link'}
<a href={target} class="{styles[style]} {sizes[size]} {classes}">
  {#if icon !== 'none'}
    {@html icons[icon]}
  {/if}
  {label}
  {#if loading}
    <Spinner classes="ml-2"/>
  {/if}
</a>
{:else}
<button class="{styles[style]} {sizes[size]} {classes}" on:click|preventDefault disabled={disabled}>
  {#if icon !== 'none'}
    {@html icons[icon]}
  {/if}
  {label}
  {#if loading}
    <Spinner classes="ml-2"/>
  {/if}
</button>
{/if}
