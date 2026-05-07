<template>
  <div v-if="activeTab === 'derslikler'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Derslik Yönetimi
    </h2>

    <div class="flex gap-2 mb-6">
      <input
        v-model="localDerslik.ad"
        placeholder="Derslik Adı"
        class="border p-2 rounded w-2/5"
      />

      <select
        v-model="localDerslik.tip"
        class="border p-2 rounded w-1/5 bg-white"
      >
        <option value="" disabled>Tip</option>
        <option value="Amfi">Amfi</option>
        <option value="Sınıf">Sınıf</option>
        <option value="Lab">Lab</option>
      </select>

      <input
        v-model="localDerslik.kapasite"
        type="number"
        min="1"
        placeholder="Kapasite"
        class="border p-2 rounded w-1/5"
      />

      <button
        @click="$emit('derslik-kaydet')"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded font-bold"
      >
        Ekle
      </button>
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ derslikler.length }} derslik kaydı
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
        <th class="py-3 px-4 border-b">Derslik Adı</th>
        <th class="py-3 px-4 border-b">Tip</th>
        <th class="py-3 px-4 border-b">Kapasite</th>
        <th class="py-3 px-4 border-b">Durum</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="derslik in sayfaliDerslikler"
        :key="derslik.derslikID"
        class="hover:bg-gray-50"
      >
        <td class="py-3 px-4 border-b font-medium">{{ derslik.ad }}</td>
        <td class="py-3 px-4 border-b">{{ derslik.tip }}</td>
        <td class="py-3 px-4 border-b">{{ derslik.kapasite }} Kişi</td>
        <td class="py-3 px-4 border-b">
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-bold',
              derslik.aktif === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]"
          >
            {{ derslik.aktif === 1 ? 'Aktif' : 'Pasif' }}
          </span>
        </td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="$emit('derslik-sil', derslik.derslikID)"
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
  derslikler: {
    type: Array,
    required: true
  }
})

const localDerslik = defineModel('yeniDerslik', {
  type: Object,
  required: true
})

defineEmits(['derslik-kaydet', 'derslik-sil'])

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const sayfaliDerslikler = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return props.derslikler.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(props.derslikler.length / kayitSayisi.value)
})

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}
</script>
