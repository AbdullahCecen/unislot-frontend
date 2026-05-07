<template>
  <header class="h-20 bg-blue-700 text-white flex items-center justify-between px-10 shadow-md">
    <div>
      <h1 class="text-2xl font-extrabold tracking-wide">UniSlot</h1>
      <p class="text-sm text-blue-100">Akıllı Sınav Yönetim Sistemi</p>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-blue-800 px-4 py-2 rounded-lg text-sm font-semibold">
        Aktif Rol:
        <span class="font-bold">
          {{ activeRole === 'admin' ? 'Yönetici' : 'Normal Kullanıcı' }}
        </span>
      </div>

      <button
        @click="$emit('logout')"
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded shadow transition"
      >
        Çıkış Yap
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  activeRole: {
    type: String,
    required: true
  }
})

defineEmits(['logout'])
</script>
