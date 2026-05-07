<template>
  <div v-if="activeTab === 'rapor'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Genel Sınav Takvimi ve Raporu
    </h2>

    <div
      v-if="message"
      :class="[
        'mb-4 px-4 py-3 rounded-lg font-semibold no-print',
        messageType === 'success'
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      ]"
    >
      {{ message }}
    </div>

    <div class="flex justify-between items-center mb-4 no-print">
      <p class="text-sm text-gray-500">
        Sınavları listeleyebilir, salon/gözetmen atayabilir ve program raporu oluşturabilirsiniz.
      </p>

      <div class="flex gap-2">
        <button
          v-if="activeRole === 'admin'"
          @click="topluSalonAta"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold shadow"
        >
          Toplu Salon Ata (Optimize)
        </button>
        <button
          @click="raporOlustur"
          class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded font-bold shadow"
        >
          Rapor Oluştur
        </button>

        <button
          @click="yazdir"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow"
        >
          PDF / Yazdır
        </button>
      </div>
    </div>

    <div v-if="raporlar.length === 0" class="text-center py-8 text-gray-500 italic">
      Sisteme henüz atanmış bir sınav bulunmamaktadır.
    </div>

    <div v-else class="overflow-x-auto mb-8 no-print">
      <div class="flex justify-between items-center mb-3">
        <div class="text-sm text-gray-600">
          Toplam {{ raporlar.length }} sınav kaydı
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
        <thead class="bg-gray-800 text-white text-left">
        <tr>
          <th class="py-3 px-4 border-b font-semibold">Tarih / Saat</th>
          <th class="py-3 px-4 border-b font-semibold">Bölüm</th>
          <th class="py-3 px-4 border-b font-semibold">Ders Kodu & Adı</th>
          <th class="py-3 px-4 border-b font-semibold">Ayrılan Kapasite</th>
          <th v-if="activeRole === 'admin'" class="py-3 px-4 border-b font-semibold">
            İşlemler
          </th>
        </tr>
        </thead>

        <tbody>
        <tr
          v-for="rapor in sayfaliRaporlar"
          :key="rapor.sinavId"
          class="hover:bg-blue-50 transition-colors"
        >
          <td class="py-3 px-4 border-b text-gray-800 font-bold text-blue-600">
            {{ rapor.tarih }} <br />
            <span class="text-xs text-gray-500">{{ rapor.saat }}</span>
          </td>

          <td class="py-3 px-4 border-b text-gray-800">
            {{ rapor.bolumAd }}
          </td>

          <td class="py-3 px-4 border-b text-gray-800">
            <span class="font-bold">{{ rapor.dersKodu }}</span> - {{ rapor.dersAdi }}
          </td>

          <td class="py-3 px-4 border-b text-gray-800">
            {{ rapor.ayrilanKapasite || 0 }} Kişilik Salon Ayrıldı
          </td>

          <td v-if="activeRole === 'admin'" class="py-3 px-4 border-b whitespace-nowrap">
            <button
              @click="salonAta(rapor.sinavId)"
              :disabled="rapor.ayrilanKapasite > 0"
              :class="[
                'text-white px-3 py-1 rounded text-sm font-medium shadow',
                rapor.ayrilanKapasite > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              ]"
            >
              {{ rapor.ayrilanKapasite > 0 ? 'Salon Atandı' : 'Salon Ata' }}
            </button>

            <button
              @click="gozetmenAta(rapor.sinavId)"
              class="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium shadow"
            >
              Gözetmen Ata
            </button>

            <button
              @click="salonlariGor(rapor.sinavId)"
              class="ml-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium shadow"
            >
              Salonları Gör
            </button>

            <button
              @click="gozetmenleriGor(rapor.sinavId)"
              class="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium shadow"
            >
              Gözetmenleri Gör
            </button>

            <button
              @click="guncelleModalAc(rapor)"
              class="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium shadow"
            >
              Güncelle
            </button>

            <button
              @click="sinavSil(rapor.sinavId)"
              class="ml-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium shadow"
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

    <div v-if="programGoster" id="print-area" class="mt-8 border-t pt-6">
      <div class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-2xl font-bold text-blue-900">
          UniSlot Genel Sınav Programı
        </h3>

        <p class="text-sm text-gray-600 mt-1">
          Oluşturulma Tarihi: {{ olusturmaTarihi }}
        </p>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-4">
        Oluşturulan Sınav Programı
      </h3>

      <div v-if="programVerileri.length === 0" class="text-center py-8 text-gray-500 italic">
        Rapor oluşturmak için önce salon ve gözetmen atamaları yapılmalıdır.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden report-table">
          <thead>
          <tr class="bg-blue-900 text-white">
            <th rowspan="2" class="py-3 px-4 border text-left min-w-[180px]">
              Derslik
            </th>

            <th
              v-for="kolon in programKolonlari"
              :key="kolon"
              colspan="2"
              class="py-3 px-4 border text-center min-w-[260px]"
            >
              {{ kolon }}
            </th>
          </tr>

          <tr class="bg-blue-800 text-white">
            <template v-for="kolon in programKolonlari" :key="`${kolon}-alt`">
              <th class="py-2 px-3 border text-center">Ders</th>
              <th class="py-2 px-3 border text-center">Gözetmen</th>
            </template>
          </tr>
          </thead>

          <tbody>
          <tr
            v-for="salon in programSalonlari"
            :key="salon"
            class="hover:bg-gray-50"
          >
            <td class="py-3 px-4 border font-bold text-gray-800 bg-gray-100">
              {{ salon }}
            </td>

            <template v-for="kolon in programKolonlari" :key="`${salon}-${kolon}`">
              <td class="py-3 px-4 border align-top">
                <div v-if="programTablosu[salon] && programTablosu[salon][kolon]">
                  <div class="font-bold text-blue-800">
                    {{ programTablosu[salon][kolon].dersKodu }}
                  </div>
                  <div class="text-sm text-gray-800">
                    {{ programTablosu[salon][kolon].dersAdi }}
                  </div>
                </div>

                <div v-else class="text-gray-400 italic text-sm">
                  Boş
                </div>
              </td>

              <td class="py-3 px-4 border align-top">
                <div v-if="programTablosu[salon] && programTablosu[salon][kolon]">
                  <span class="font-semibold text-gray-800">
                    {{ programTablosu[salon][kolon].gozetmen || 'Atanmadı' }}
                  </span>
                </div>

                <div v-else class="text-gray-400 italic text-sm">
                  Boş
                </div>
              </td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showSalonModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-[450px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">Atanan Salonlar</h3>
          <button @click="showSalonModal = false" class="text-red-500 font-bold text-xl">
            &times;
          </button>
        </div>

        <div v-if="atananSalonlar.length === 0" class="text-gray-500 italic text-center py-4">
          Bu sınav için henüz salon ataması yapılmamış.
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="(salon, index) in atananSalonlar"
            :key="index"
            class="bg-blue-50 border border-blue-200 p-3 rounded"
          >
            <div class="font-semibold text-blue-800">{{ salon.ad }}</div>
            <div class="text-sm text-gray-600">
              Tip: {{ salon.tip }} |
              Kat: {{ salon.kat ?? '-' }} |
              Kapasite: {{ salon.kapasite }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="showGozetmenModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-[500px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">Atanan Gözetmenler</h3>
          <button @click="showGozetmenModal = false" class="text-red-500 font-bold text-xl">
            &times;
          </button>
        </div>

        <div v-if="atananGozetmenler.length === 0" class="text-gray-500 italic text-center py-4">
          Bu sınav için henüz gözetmen ataması yapılmamış.
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="gozetmen in atananGozetmenler"
            :key="gozetmen.atamaId"
            class="bg-green-50 border border-green-200 p-3 rounded"
          >
            <div class="font-semibold text-green-800">
              {{ gozetmen.unvan }} {{ gozetmen.ad }} {{ gozetmen.soyad }}
            </div>
            <div class="text-sm text-gray-600">
              Salon: {{ gozetmen.salonAdi }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="guncelleModalGoster"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-[400px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">Sınav Tarihi / Oturum Güncelle</h3>
          <button @click="guncelleModalKapat" class="text-red-500 font-bold text-xl hover:text-red-700">
            &times;
          </button>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Tarih</label>
          <input
            type="date"
            v-model="guncellenecekVeri.tarih"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Oturum</label>
          <select
            v-model="guncellenecekVeri.oturumId"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option v-for="oturum in oturumlar" :key="oturum.oturumId" :value="oturum.oturumId">
              {{ oturum.tanim }} ({{ oturum.baslangicSaat }} - {{ oturum.bitisSaat }})
            </option>
          </select>
        </div>

        <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          <button @click="guncelleModalKapat" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium shadow">
            İptal
          </button>
          <button @click="sinavGuncelleKaydet" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium shadow">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  activeRole: {
    type: String,
    required: true
  },
  raporlar: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['refresh-rapor'])

const message = ref('')
const messageType = ref('success')

const showSalonModal = ref(false)
const showGozetmenModal = ref(false)

const atananSalonlar = ref([])
const atananGozetmenler = ref([])

const kayitSayisi = ref(5)
const aktifSayfa = ref(1)

const programGoster = ref(false)
const programVerileri = ref([])
const olusturmaTarihi = ref('')

// Güncelleme State'leri
const guncelleModalGoster = ref(false)
const oturumlar = ref([])
const guncellenecekVeri = ref({
  sinavId: null,
  tarih: '',
  oturumId: null
})

const sayfaliRaporlar = computed(() => {
  const baslangic = (aktifSayfa.value - 1) * kayitSayisi.value
  const bitis = baslangic + kayitSayisi.value
  return props.raporlar.slice(baslangic, bitis)
})

const toplamSayfa = computed(() => {
  return Math.ceil(props.raporlar.length / kayitSayisi.value)
})

const programKolonlari = computed(() => {
  return [...new Set(programVerileri.value.map(item => `${item.tarih} / ${item.oturum}`))]
})

const programSalonlari = computed(() => {
  return [...new Set(programVerileri.value.map(item => item.salonAdi))]
})

const programTablosu = computed(() => {
  const tablo = {}

  programVerileri.value.forEach(item => {
    const salon = item.salonAdi
    const kolon = `${item.tarih} / ${item.oturum}`

    if (!tablo[salon]) {
      tablo[salon] = {}
    }

    tablo[salon][kolon] = item
  })

  return tablo
})

const setMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const sayfaDegistir = (sayfa) => {
  if (sayfa < 1 || sayfa > toplamSayfa.value) return
  aktifSayfa.value = sayfa
}

const kayitSayisiDegisti = () => {
  aktifSayfa.value = 1
}

const yazdir = () => {
  if (!programGoster.value) {
    setMessage('PDF almak için önce rapor oluşturmalısınız.', 'error')
    return
  }

  window.print()
}

const raporOlustur = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/raporlar/program')
    programVerileri.value = response.data
    programGoster.value = true
    olusturmaTarihi.value = new Date().toLocaleDateString('tr-TR')
    setMessage('Sınav programı raporu oluşturuldu.', 'success')
  } catch (error) {
    setMessage('Rapor oluşturulurken hata oluştu.', 'error')
    console.error(error)
  }
}

const salonAta = async (sinavId) => {
  if (!confirm('Bu sınav için otomatik salon ataması başlatılsın mı?')) return

  try {
    const response = await axios.post(`http://localhost:8080/api/sinavlar/${sinavId}/salon-ata`)
    setMessage(response.data.message || 'Salon ataması başarıyla tamamlandı.', 'success')
    emit('refresh-rapor')
  } catch (error) {
    setMessage(error.response?.data?.message || 'Salon ataması başarısız.', 'error')
    console.error(error)
  }
}

const gozetmenAta = async (sinavId) => {
  if (!confirm('Bu sınav için otomatik gözetmen ataması başlatılsın mı?')) return

  try {
    const response = await axios.post(`http://localhost:8080/api/sinavlar/${sinavId}/gozetmen-ata`)
    setMessage(response.data || 'Gözetmen ataması başarıyla tamamlandı.', 'success')
    emit('refresh-rapor')
  } catch (error) {
    setMessage(error.response?.data || 'Gözetmen ataması başarısız.', 'error')
    console.error(error)
  }
}

const salonlariGor = async (sinavId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sinavlar/${sinavId}/salonlar`)
    atananSalonlar.value = response.data
    showSalonModal.value = true
  } catch (error) {
    setMessage('Salonlar getirilirken hata oluştu.', 'error')
    console.error(error)
  }
}

const gozetmenleriGor = async (sinavId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sinavlar/${sinavId}/gozetmenler`)
    atananGozetmenler.value = response.data
    showGozetmenModal.value = true
  } catch (error) {
    setMessage('Gözetmenler getirilirken hata oluştu.', 'error')
    console.error(error)
  }
}

const sinavSil = async (sinavId) => {
  if (!confirm('Bu sınav ve bağlı salon/gözetmen atamaları silinsin mi?')) return

  try {
    const response = await axios.delete(`http://localhost:8080/api/sinavlar/${sinavId}`)
    setMessage(response.data || 'Sınav başarıyla silindi.', 'success')
    programGoster.value = false
    programVerileri.value = []
    emit('refresh-rapor')
  } catch (error) {
    setMessage(error.response?.data || 'Sınav silinemedi.', 'error')
    console.error(error)
  }
}

// Güncelleme Fonksiyonları
const fetchOturumlar = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/oturumlar')
    oturumlar.value = response.data
  } catch (error) {
    console.error('Oturumlar getirilirken hata:', error)
  }
}

const guncelleModalAc = async (rapor) => {
  if (oturumlar.value.length === 0) {
    await fetchOturumlar()
  }

  guncellenecekVeri.value = {
    sinavId: rapor.sinavId,
    tarih: rapor.tarih,
    oturumId: rapor.oturumId || ''
  }
  guncelleModalGoster.value = true
}

const guncelleModalKapat = () => {
  guncelleModalGoster.value = false
}

const sinavGuncelleKaydet = async () => {
  if (!guncellenecekVeri.value.tarih || !guncellenecekVeri.value.oturumId) {
    setMessage('Tarih ve oturum seçimi zorunludur.', 'error')
    return
  }

  try {
    const payload = {
      tarih: guncellenecekVeri.value.tarih,
      oturumId: guncellenecekVeri.value.oturumId
    }

    const response = await axios.put(`http://localhost:8080/api/sinavlar/${guncellenecekVeri.value.sinavId}`, payload)

    setMessage(response.data || 'Sınav başarıyla güncellendi.', 'success')
    guncelleModalKapat()
    emit('refresh-rapor') // Verilerin ana sayfada yenilenmesini sağlar
  } catch (error) {
    setMessage(error.response?.data?.message || 'Sınav güncellenirken hata oluştu.', 'error')
    console.error(error)
  }
}
const topluSalonAta = async () => {
  if (!confirm('Sistemdeki atanmamış tüm sınavlar için optimize edilmiş salon ataması başlatılacak. Onaylıyor musunuz?')) return

  try {
    const response = await axios.post('http://localhost:8080/api/sinavlar/toplu-salon-ata')
    setMessage(response.data, 'success')
    emit('refresh-rapor') // Listeyi yenile
  } catch (error) {
    setMessage(error.response?.data || 'Toplu atama işlemi başarısız oldu.', 'error')
    console.error(error)
  }
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
  }

  #print-area {
    border: none !important;
    padding-top: 0 !important;
    margin-top: 0 !important;
  }

  .report-table {
    font-size: 11px;
  }

  .report-table th,
  .report-table td {
    padding: 6px !important;
  }
}
</style>
