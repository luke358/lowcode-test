<script setup>
import { provide, ref } from "vue"
import data from "./data.json"
import Editor from './packages/editor'
import { registerConfig as config } from './utils/editor-config'

provide('config', config)
const state = ref(data)
</script>

<template>
  <div class="app">
    <Editor v-model="state"/>
  </div>
</template>

<style scoped lang="scss">
.app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>
