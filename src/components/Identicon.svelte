<script>
  import {onMount} from 'svelte';
  import {Svavatar} from 'svavatar'

  export let address;
  export let width = 20;
  export let height = 20;

</script>

<Svavatar type="gridy" mood="happy" seed={address} width={width} height={height} />
