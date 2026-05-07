<template>
  <div v-if="activeTab === 'mazeretler'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Mazeret Yönetimi
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

    <div class="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
      <select v-model="yeniMazeret.personelID" class="border p-3 rounded bg-white">
        <option :value="null" disabled>Personel Seçin</option>
        <option
          v-for="personel in personeller"
          :key="personel.personelID"
          :value="personel.personelID"
        >
          {{ personel.unvan }} {{ personel.ad }} {{ personel.soyad }}
        </option>
      </select>

      <input
        v-model="yeniMazeret.tarih"
        type="date"
        class="border p-3 rounded"
      />

      <input
        v-model="yeniMazeret.baslangicSaat"
        type="time"
        class="border p-3 rounded"
      />

      <input
        v-model="yeniMazeret.bitisSaat"
        type="time"
        class="border p-3 rounded"
      />

      <select v-model="yeniMazeret.mazeretTuru" class="border p-3 rounded bg-white">
        <option value="" disabled>Mazeret Türü</option>
        <option value="İzinli">İzinli</option>
        <option value="Raporlu">Raporlu</option>
        <option value="Danışmanlık Saati">Danışmanlık Saati</option>
        <option value="Görevli">Görevli</option>
      </select>

      <button
        @click="mazeretKaydet"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded px-4"
      >
        Ekle
      </button>
    </div>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded text-blue-700 text-sm mb-6">
      Bu ekranda girilen kayıtlar, gözetmen atama algoritmasında personelin uygun olmadığı zamanları belirler.
    </div>

    <div class="flex justify-between items-center mb-3">
      <div class="text-sm text-gray-600">
        Toplam {{ mazeretler.length }} mazeret kaydı
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
        <th class="py-3 px-4 border-b">Personel</th>
        <th class="py-3 px-4 border-b">Tarih</th>
        <th class="py-3 px-4 border-b">Saat</th>
        <th class="py-3 px-4 border-b">Mazeret Türü</th>
        <th class="py-3 px-4 border-b text-right">İşlem</th>
      </tr>
      </thead>

      <tbody>
      <tr
        v-for="mazeret in sayfaliMazeretler"
        :key="mazeret.durumID"
        class="hover:bg-gray-50"
      >
        <td class="py-3 px-4 border-b font-medium">
          {{ personelAdiGetir(mazeret.personelID) }}
        </td>
        <td class="py-3 px-4 border-b">{{ mazeret.tarih }}</td>
        <td class="py-3 px-4 border-b">
          {{ mazeret.baslangicSaat?.slice(0, 5) }} - {{ mazeret.bitisSaat?.slice(0, 5) }}
        </td>
        <td class="py-3 px-4 border-b">{{ mazeret.mazeretTuru }}</td>
        <td class="py-3 px-4 border-b text-right">
          <button
            @click="mazeretSil(mazeret.durumID)"
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
import { computed, ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  personeller: {
    type: Array,
    required: true
  }
})

const message = ref('')
const messageType = ref('success')

const mazeretler = ref([])
const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const yeniMazeret = ref({
  personelID: null,
  tarih: '',
  baslangicSaat: '08:00',
  bitisSaat: '23:59',
  mazeretTuru: '',
  uygun: 0
})

const setMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const seciliPersonelId = computed(() => yeniMazeret.value.personelID)

const fetchMazeretler = async () => {
  if (!seciliPersonelId.value) {
    mazeretler.value = []
    return
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/mazeretler/personel/${seciliPersonelId.value}`)
    mazeretler.value = response.data
  } catch (error) {
    setMessage('Mazeretler yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const mazeretKaydet = async () => {
  if (
    !yeniMazeret.value.personelID ||
    !yeniMazeret.value.tarih ||
    !yeniMazeret.value.baslangicSaat ||
    !yeniMazeret.value.bitisSaat ||
    !yeniMazeret.value.mazeretTuru
  ) {
    setMessage('Personel, tarih, saat ve mazeret türü zorunludur.', 'error')
    return
  }

  if (yeniMazeret.value.baslangicSaat >= yeniMazeret.value.bitisSaat) {
    setMessage('Başlangıç saati bitiş saatinden önce olmalıdır.', 'error')
    return
  }

  try {
    await axios.post('http://localhost:8080/api/mazeretler', yeniMazeret.value)

    const personelID = yeniMazeret.value.personelID

    yeniMazeret.value = {
      personelID,
      tarih: '',
      baslangicSaat: '08:00',
      bitisSaat: '23:59',
      mazeretTuru: '',
      uygun: 0
    }

    setMessage('Mazeret başarıyla eklendi.', 'success')
    await fetchMazeretler()
  } catch (error) {
    setMessage(error.response?.data || 'Mazeret eklenemedi.', 'error')
    console.error(error)
  }
}

const mazeretSil = async (durumID) => {
  if (!confirm('Bu mazeret silinsin mi?')) return

  try {
    await axios.delete(`http://localhost:8080/api/mazeretler/${durumID}`)
    setMessage('Mazeret başarıyla silindi.', 'success')
    await fetchMazeretler()
  } catch (error) {
    setMessage('Mazeret silinemedi.', 'error')
    console.error(error)
  }
}

const personelAdiGetir = (personelID) => {
  const personel = props.personeller.find(p => p.personelID === personelID)
  return personel
    ? `${personel.unvan} ${personel.ad} ${personel.soyad}`
    : `Personel ID: ${personelID}`
}

const sayfaliMazeretler = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return mazeretler.value.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(mazeretler.value.length / kayitSayisi.value)
})

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}

watch(seciliPersonelId, () => {
  aktifSayfa.value = 1
  fetchMazeretler()
})
</script>
