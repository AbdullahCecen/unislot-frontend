<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-blue-800 p-4 text-white shadow-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold tracking-wider">UniSlot</h1>
        <span class="text-blue-200 text-sm">Akıllı Sınav Yönetim Sistemi</span>
      </div>
    </nav>

    <main class="p-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
