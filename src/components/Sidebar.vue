<template>
  <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
    <div class="p-6 text-3xl font-extrabold border-b border-gray-800 text-center tracking-wider text-blue-400">
      UniSlot
    </div>

    <nav class="flex-1 p-4 space-y-3 mt-4">
      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'dersler')"
        :class="menuClass('dersler')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Sınav Yönetimi
      </button>

      <button
        @click="$emit('change-tab', 'rapor')"
        :class="menuClass('rapor')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        📊 Sınav Raporu
      </button>

      <button
        v-if="activeRole === 'viewer'"
        @click="$emit('change-tab', 'gorevlerim')"
        :class="menuClass('gorevlerim')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        👤 Görevlerim
      </button>

      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'bolumler')"
        :class="menuClass('bolumler')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Bölüm Yönetimi
      </button>

      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'derslikler')"
        :class="menuClass('derslikler')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Derslik Yönetimi
      </button>
      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'oturumlar')"
        :class="menuClass('oturumlar')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Oturum Yönetimi
      </button>

      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'personeller')"
        :class="menuClass('personeller')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Personel Yönetimi
      </button>

      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'mazeretler')"
        :class="menuClass('mazeretler')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Mazeret Yönetimi
      </button>

      <button
        v-if="activeRole === 'admin'"
        @click="$emit('change-tab', 'yeniDers')"
        :class="menuClass('yeniDers')"
        class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3"
      >
        Yeni Ders Ekle
      </button>
    </nav>

    <div class="p-4 border-t border-gray-800 text-center">
      <button
        v-if="activeRole === 'admin'"
        @click="$emit('backup')"
        class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow transition-colors duration-200"
      >
        Sistemi Yedekle
      </button>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  activeRole: {
    type: String,
    required: true
  }
})

defineEmits(['change-tab', 'backup'])

const menuClass = (tab) => {
  return props.activeTab === tab
    ? 'bg-blue-600 shadow-lg'
    : 'hover:bg-gray-800 text-gray-300'
}
</script>
