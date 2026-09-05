<script setup>
const fullUrl = `${window.location.origin}/`
</script>

<template>
  <iframe :src="fullUrl" class="preview-iframe" title="Preview Katalog Publik" />
</template>

<style scoped>
.preview-iframe {
  display: block;
  width: 100%;
  height: calc(100vh - 64px);
  border: none;
}
</style>
