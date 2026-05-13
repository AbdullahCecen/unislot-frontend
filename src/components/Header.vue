<template>
  <header class="h-20 bg-white flex items-center justify-between px-10 border-b border-slate-200 shadow-sm">
    <div>
      <h1 class="text-2xl font-extrabold tracking-wide text-slate-800">UniSlot</h1>
      <p class="text-sm text-slate-500 font-medium">Akıllı Sınav Yönetim Sistemi</p>
    </div>

    <div class="flex items-center gap-4">
      <div class="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600">
        Aktif Rol:
        <span class="font-bold text-indigo-600">
          {{ activeRole === 'admin' ? 'Yönetici' : 'Normal Kullanıcı' }}
        </span>
      </div>

      <button
        @click="$emit('logout')"
        class="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold py-2 px-5 rounded-lg shadow-sm transition-colors"
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
