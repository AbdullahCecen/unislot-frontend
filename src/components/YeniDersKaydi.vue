<template>
  <div v-if="activeTab === 'yeniDers'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Yeni Ders Kaydı
    </h2>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <input v-model="localDers.dersKodu" placeholder="Ders Kodu" class="border p-3 rounded" />
      <input v-model="localDers.ad" placeholder="Ders Adı" class="border p-3 rounded" />

      <select v-model="localDers.dersTuru" class="border p-3 rounded bg-white">
        <option disabled value="">Ders Türü Seçin</option>
        <option value="zorunlu">Zorunlu</option>
        <option value="seçmeli">Seçmeli</option>
      </select>

      <input
        v-model="localDers.ogrenciSayisi"
        type="number"
        min="0"
        placeholder="Öğrenci Sayısı"
        class="border p-3 rounded"
      />

      <select v-model="localDers.yariyil" class="border p-3 rounded bg-white">
        <option disabled :value="null">Yarıyıl Seçin</option>
        <option v-for="n in 8" :key="n" :value="n">{{ n }}. Yarıyıl</option>
      </select>

      <select v-model="localDers.bolumId" class="border p-3 rounded bg-white">
        <option disabled :value="null">Bölüm Seçin</option>
        <option v-for="bolum in bolumler" :key="bolum.bolumID" :value="bolum.bolumID">
          {{ bolum.bolumAd }}
        </option>
      </select>
    </div>

    <div class="mb-8 flex justify-end">
      <button
        @click="$emit('ders-kaydet')"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold"
      >
        Kaydet
      </button>
    </div>

    <h3 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
      Kayıtlı Dersler
    </h3>
    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ dersler.length }} ders kaydı
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
        <th class="py-3 px-4 border-b">Ders Kodu</th>
        <th class="py-3 px-4 border-b">Ders Adı</th>
        <th class="py-3 px-4 border-b">Tür</th>
        <th class="py-3 px-4 border-b">Öğrenci Sayısı</th>
        <th class="py-3 px-4 border-b">Yarıyıl</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="ders in sayfaliDersler" :key="ders.dersId" class="hover:bg-gray-50">
        <td class="py-3 px-4 border-b font-medium">{{ ders.dersKodu }}</td>
        <td class="py-3 px-4 border-b">{{ ders.ad }}</td>
        <td class="py-3 px-4 border-b">{{ ders.dersTuru }}</td>
        <td class="py-3 px-4 border-b">{{ ders.ogrenciSayisi }}</td>
        <td class="py-3 px-4 border-b">{{ ders.yariyil }}. Yarıyıl</td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="$emit('ders-sil', ders.dersId)"
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
  dersler: {
    type: Array,
    required: true
  }
})

const localDers = defineModel('yeniDers', {
  type: Object,
  required: true
})

defineEmits(['ders-kaydet', 'ders-sil'])

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const sayfaliDersler = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return props.dersler.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(props.dersler.length / kayitSayisi.value)
})

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}
</script>
