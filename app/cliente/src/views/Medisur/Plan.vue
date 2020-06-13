<template>
  <iframe :src="require('@/assets/' + $route.params.link + '.html')"/>
</template>

<script>
export default {
  data: () => ({
  })
}
</script>
