<template>
  <div class="home">
    <img alt="Sanatorio del Sur" src="../assets/logo-sanatorio-del-sur.jpg"
      width="500px" max-width="500px">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
