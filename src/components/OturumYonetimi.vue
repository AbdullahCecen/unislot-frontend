<template>
  <div v-if="activeTab === 'oturumlar'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Oturum Yönetimi
    </h2>

    <div
      v-if="message"
      :class="[
        'mb-4 px-4 py-3 rounded-lg font-semibold',
        messageType === 'success'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      ]"
    >
      {{ message }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <input
        v-model="yeniOturum.tanim"
        placeholder="Oturum Adı"
        class="border p-3 rounded"
      />

      <input
        v-model="yeniOturum.baslangicSaat"
        type="time"
        class="border p-3 rounded"
      />

      <input
        v-model="yeniOturum.bitisSaat"
        type="time"
        class="border p-3 rounded"
      />

      <button
        @click="oturumKaydet"
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded px-4"
      >
        {{ loading ? 'Kaydediliyor...' : 'Ekle' }}
      </button>
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ oturumlar.length }} oturum kaydı
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
        <th class="py-3 px-4 border-b">Oturum Adı</th>
        <th class="py-3 px-4 border-b">Başlangıç</th>
        <th class="py-3 px-4 border-b">Bitiş</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="oturum in sayfaliOturumlar"
        :key="oturum.oturumId"
        class="hover:bg-gray-50"
      >
        <td class="py-3 px-4 border-b font-medium">{{ oturum.tanim }}</td>
        <td class="py-3 px-4 border-b">{{ oturum.baslangicSaat?.slice(0, 5) }}</td>
        <td class="py-3 px-4 border-b">{{ oturum.bitisSaat?.slice(0, 5) }}</td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="oturumSil(oturum.oturumId)"
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
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const oturumlar = ref([])
const loading = ref(false)
const message = ref('')
const messageType = ref('success')

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const yeniOturum = ref({
  tanim: '',
  baslangicSaat: '',
  bitisSaat: ''
})

const sayfaliOturumlar = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return oturumlar.value.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(oturumlar.value.length / kayitSayisi.value)
})

const setMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}

const fetchOturumlar = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/oturumlar')
    oturumlar.value = response.data
  } catch (error) {
    setMessage('Oturumlar yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const oturumKaydet = async () => {
  if (!yeniOturum.value.tanim || !yeniOturum.value.baslangicSaat || !yeniOturum.value.bitisSaat) {
    setMessage('Oturum adı, başlangıç saati ve bitiş saati zorunludur.', 'error')
    return
  }

  if (yeniOturum.value.baslangicSaat >= yeniOturum.value.bitisSaat) {
    setMessage('Başlangıç saati bitiş saatinden önce olmalıdır.', 'error')
    return
  }

  loading.value = true

  try {
    await axios.post('http://localhost:8080/api/oturumlar', {
      tanim: yeniOturum.value.tanim,
      baslangicSaat: yeniOturum.value.baslangicSaat,
      bitisSaat: yeniOturum.value.bitisSaat
    })

    yeniOturum.value = {
      tanim: '',
      baslangicSaat: '',
      bitisSaat: ''
    }

    setMessage('Oturum başarıyla eklendi.', 'success')
    await fetchOturumlar()
  } catch (error) {
    setMessage('Oturum eklenirken hata oluştu.', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const oturumSil = async (id) => {
  if (!confirm('Bu oturum silinsin mi?')) return

  try {
    await axios.delete(`http://localhost:8080/api/oturumlar/${id}`)
    setMessage('Oturum başarıyla silindi.', 'success')
    await fetchOturumlar()
  } catch (error) {
    setMessage(error.response?.data || 'Oturum silinemedi.', 'error')
    console.error(error)
  }
}

onMounted(() => {
  fetchOturumlar()
})
</script>
