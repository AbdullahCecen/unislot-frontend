<template>
  <div v-if="activeTab === 'bolumler'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Bölüm Yönetimi
    </h2>

    <div class="flex gap-2 mb-6">
      <input
        :value="yeniBolumAdi"
        @input="$emit('update:yeniBolumAdi', $event.target.value)"
        placeholder="Yeni Bölüm Adı"
        class="flex-1 border p-2 rounded"
      />

      <button
        @click="$emit('bolum-kaydet')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-bold"
      >
        Ekle
      </button>
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ bolumler.length }} bölüm kaydı
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Sayfada göster:</span>
        <select
          v-model="kayitSayisi"
          @change="kayitSayisiDegisti"
          class="border rounded px-2 py-1 text-sm"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
      </div>
    </div>

    <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      <thead class="bg-gray-100 text-left">
      <tr>
        <th class="py-3 px-4 border-b">ID</th>
        <th class="py-3 px-4 border-b">Bölüm Adı</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="bolum in sayfaliBolumler"
        :key="bolum.bolumID"
        class="hover:bg-gray-50"
      >
        <td class="py-3 px-4 border-b">{{ bolum.bolumID }}</td>
        <td class="py-3 px-4 border-b font-medium">{{ bolum.bolumAd }}</td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="$emit('bolum-sil', bolum.bolumID)"
            class="text-red-600 font-bold"
          >
            Sil
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="toplamSayfa > 1" class="flex justify-center items-center gap-2 mt-4">
      <button
        @click="sayfaDegistir(aktifSayfa - 1)"
        :disabled="aktifSayfa === 1"
        class="px-3 py-1 border rounded disabled:opacity-40"
      >
        Önceki
      </button>

      <button
        v-for="sayfa in toplamSayfa"
        :key="sayfa"
        @click="sayfaDegistir(sayfa)"
        :class="[
          'px-3 py-1 border rounded',
          aktifSayfa === sayfa ? 'bg-blue-600 text-white' : 'bg-white'
        ]"
      >
        {{ sayfa }}
      </button>

      <button
        @click="sayfaDegistir(aktifSayfa + 1)"
        :disabled="aktifSayfa === toplamSayfa"
        class="px-3 py-1 border rounded disabled:opacity-40"
      >
        Sonraki
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  bolumler: {
    type: Array,
    required: true
  },
  yeniBolumAdi: {
    type: String,
    required: true
  }
})

defineEmits([
  'update:yeniBolumAdi',
  'bolum-kaydet',
  'bolum-sil'
])

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const sayfaliBolumler = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return props.bolumler.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(props.bolumler.length / kayitSayisi.value)
})

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}
</script>
