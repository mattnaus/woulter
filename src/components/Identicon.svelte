<script>
  import {onMount} from 'svelte';
  import {Svavatar} from 'svavatar'

  export let address;
  export let width = 20;
  export let height = 20;

</script>

<img width="{width}" height="{height}" src="https://identicon-api.herokuapp.com/{address}/{width}?format=svg">
