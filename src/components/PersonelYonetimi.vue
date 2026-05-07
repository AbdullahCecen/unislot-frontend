<template>
  <div v-if="activeTab === 'personeller'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Personel Yönetimi
    </h2>

    <div class="flex gap-2 mb-6">
      <input v-model="localPersonel.ad" placeholder="Ad" class="border p-2 rounded w-1/5" />
      <input v-model="localPersonel.soyad" placeholder="Soyad" class="border p-2 rounded w-1/5" />

      <select v-model="localPersonel.unvan" class="border p-2 rounded w-1/5 bg-white">
        <option value="" disabled>Ünvan</option>
        <option value="Prof. Dr.">Prof. Dr.</option>
        <option value="Doç. Dr.">Doç. Dr.</option>
        <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
        <option value="Öğr. Gör.">Öğr. Gör.</option>
        <option value="Arş. Gör.">Arş. Gör.</option>
      </select>

      <select v-model="localPersonel.bolumID" class="border p-2 rounded w-1/5 bg-white">
        <option :value="null" disabled>Bölüm</option>
        <option v-for="bolum in bolumler" :key="bolum.bolumID" :value="bolum.bolumID">
          {{ bolum.bolumAd }}
        </option>
      </select>

      <button
        @click="$emit('personel-kaydet')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-bold"
      >
        Ekle
      </button>
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ personeller.length }} personel kaydı
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
        <th class="py-3 px-4 border-b">Ünvan</th>
        <th class="py-3 px-4 border-b">Ad Soyad</th>
        <th class="py-3 px-4 border-b">Bölüm</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="personel in sayfaliPersoneller"
        :key="personel.personelID"
        class="hover:bg-gray-50"
      >
        <td class="py-3 px-4 border-b">{{ personel.unvan }}</td>
        <td class="py-3 px-4 border-b font-medium">
          {{ personel.ad }} {{ personel.soyad }}
        </td>
        <td class="py-3 px-4 border-b">
          {{ bolumAdiGetir(personel.bolumID) }}
        </td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="$emit('personel-sil', personel.personelID)"
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
  personeller: {
    type: Array,
    required: true
  },
  bolumler: {
    type: Array,
    required: true
  }
})

const localPersonel = defineModel('yeniPersonel', {
  type: Object,
  required: true
})

defineEmits(['personel-kaydet', 'personel-sil'])

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const sayfaliPersoneller = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return props.personeller.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(props.personeller.length / kayitSayisi.value)
})

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}

const bolumAdiGetir = (bolumID) => {
  const bolum = props.bolumler.find(b => b.bolumID === bolumID)
  return bolum ? bolum.bolumAd : `Bölüm: ${bolumID}`
}
</script>
