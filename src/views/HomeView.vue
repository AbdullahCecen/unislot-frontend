<template>
  <div class="flex h-screen bg-gray-50 font-sans">

    <aside class="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
      <div class="p-6 text-3xl font-extrabold border-b border-gray-800 text-center tracking-wider text-blue-400">
        UniSlot
      </div>
      <nav class="flex-1 p-4 space-y-3 mt-4">
        <button @click="activeTab = 'dersler'" :class="{'bg-blue-600 shadow-lg': activeTab === 'dersler', 'hover:bg-gray-800 text-gray-300': activeTab !== 'dersler'}" class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3">
           Sınav Yönetimi
        </button>
        <button @click="activeTab = 'rapor'; fetchRapor()" :class="{'bg-blue-600 shadow-lg': activeTab === 'rapor', 'hover:bg-gray-800 text-gray-300': activeTab !== 'rapor'}" class="w-full text-left px-4 py-3 rounded-lg transition-all font-medium flex items-center gap-3">
          📊 Sınav Raporu
        </button>
      </nav>
      <div class="p-4 border-t border-gray-800 text-center">
        <button @click="sistemYedegiAl" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow transition-colors duration-200">
           Sistemi Yedekle
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto relative">

      <div class="flex justify-end space-x-3 mb-8">
        <button @click="showBolumYonetimiModal = true; fetchBolumler()" class="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 font-bold py-2 px-4 rounded shadow-sm transition"> Bölümler</button>
        <button @click="showDerslikYonetimiModal = true; fetchDerslikler()" class="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 font-bold py-2 px-4 rounded shadow-sm transition"> Mekanlar</button>
        <button @click="showPersonelYonetimiModal = true; fetchPersoneller(); fetchBolumler()" class="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-300 font-bold py-2 px-4 rounded shadow-sm transition"> Personeller</button>
        <button @click="showModal = true" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded shadow-lg transition">+ Yeni Ders Ekle</button>
      </div>

      <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">

        <div v-if="activeTab === 'dersler'">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Sistemdeki Dersler</h2>

          <div v-if="loading" class="text-center py-8 text-gray-500 animate-pulse">Veriler Spring Boot'tan çekiliyor...</div>
          <div v-else-if="dersler.length === 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded text-yellow-700">Sistemde henüz kayıtlı bir ders bulunmuyor.</div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-100 text-left">
              <tr>
                <th class="py-3 px-4 border-b font-semibold text-gray-600">Ders Kodu</th>
                <th class="py-3 px-4 border-b font-semibold text-gray-600">Ders Adı</th>
                <th class="py-3 px-4 border-b font-semibold text-gray-600">Öğrenci Sayısı</th>
                <th class="py-3 px-4 border-b font-semibold text-gray-600">Yarıyıl</th>
                <th class="py-3 px-4 border-b font-semibold text-gray-600">İşlemler</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="ders in dersler" :key="ders.dersId" class="hover:bg-blue-50 transition-colors">
                <td class="py-3 px-4 border-b text-gray-800">{{ ders.dersKodu }}</td>
                <td class="py-3 px-4 border-b text-gray-800 font-medium">{{ ders.ad }}</td>
                <td class="py-3 px-4 border-b text-gray-800">{{ ders.ogrenciSayisi }}</td>
                <td class="py-3 px-4 border-b text-gray-800">{{ ders.yariyil }}. Dönem</td>
                <td class="py-3 px-4 border-b text-gray-800">
                  <button @click="salonAta(ders.dersId)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium shadow">Salon Ata</button>
                  <button @click="salonlariGor(ders.dersId)" class="ml-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium shadow">Salonları Gör</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'rapor'">
          <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Genel Sınav Takvimi ve Raporu</h2>

          <div v-if="raporlar.length === 0" class="text-center py-8 text-gray-500 italic">Sisteme henüz atanmış bir sınav bulunmamaktadır. Lütfen Dersler sekmesinden sınav salon ataması yapınız.</div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-800 text-white text-left">
              <tr>
                <th class="py-3 px-4 border-b font-semibold">Tarih / Saat</th>
                <th class="py-3 px-4 border-b font-semibold">Bölüm</th>
                <th class="py-3 px-4 border-b font-semibold">Ders Kodu & Adı</th>
                <th class="py-3 px-4 border-b font-semibold">Toplam Ayarlanan Kapasite</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(rapor, index) in raporlar" :key="index" class="hover:bg-blue-50 transition-colors">
                <td class="py-3 px-4 border-b text-gray-800 font-bold text-blue-600">{{ rapor.tarih }} <br> <span class="text-xs text-gray-500">{{ rapor.saat }}</span></td>
                <td class="py-3 px-4 border-b text-gray-800">{{ rapor.bolumAd }}</td>
                <td class="py-3 px-4 border-b text-gray-800"><span class="font-bold">{{ rapor.dersKodu }}</span> - {{ rapor.dersAdi }}</td>
                <td class="py-3 px-4 border-b text-gray-800">{{ rapor.ayrilanKapasite }} Kişilik Salon Ayrıldı</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-96">
          <h3 class="text-lg font-bold mb-4">Yeni Ders Kaydı</h3>
          <div class="space-y-3">
            <input v-model="yeniDers.dersKodu" placeholder="Ders Kodu (Örn: YZM2126)" class="w-full border p-2 rounded">
            <input v-model="yeniDers.ad" placeholder="Ders Adı (Örn: Veritabanı Sistemleri)" class="w-full border p-2 rounded">
            <input v-model="yeniDers.dersTuru" placeholder="Ders Türü (Zorunlu/Seçmeli)" class="w-full border p-2 rounded">
            <input v-model="yeniDers.ogrenciSayisi" type="number" min="0" placeholder="Öğrenci Sayısı" class="w-full border p-2 rounded">
            <select v-model="yeniDers.yariyil" class="w-full border p-2 rounded bg-white text-gray-700">
              <option disabled :value="null">Lütfen Yarıyıl Seçin</option>
              <option :value="1">1. Yarıyıl (1. Sınıf - Güz)</option>
              <option :value="2">2. Yarıyıl (1. Sınıf - Bahar)</option>
              <option :value="3">3. Yarıyıl (2. Sınıf - Güz)</option>
              <option :value="4">4. Yarıyıl (2. Sınıf - Bahar)</option>
              <option :value="5">5. Yarıyıl (3. Sınıf - Güz)</option>
              <option :value="6">6. Yarıyıl (3. Sınıf - Bahar)</option>
              <option :value="7">7. Yarıyıl (4. Sınıf - Güz)</option>
              <option :value="8">8. Yarıyıl (4. Sınıf - Bahar)</option>
            </select>
            <select v-model="yeniDers.bolumId" class="w-full border p-2 rounded bg-white text-gray-700">
              <option disabled value="null">Lütfen Bir Bölüm Seçin</option>
              <option v-for="bolum in bolumler" :key="bolum.bolumID" :value="bolum.bolumID">{{ bolum.bolumAd }}</option>
            </select>
          </div>
          <div class="mt-6 flex justify-end space-x-2">
            <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">İptal</button>
            <button @click="dersiKaydet" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Kaydet</button>
          </div>
        </div>
      </div>

      <div v-if="showSalonModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-96">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">Atanan Sınav Salonları</h3>
            <button @click="showSalonModal = false" class="text-red-500 font-bold text-xl hover:text-red-700">&times;</button>
          </div>
          <div v-if="atananSalonlar.length === 0" class="text-gray-500 italic text-center py-4">Bu ders için henüz bir salon ataması yapılmamış.</div>
          <ul v-else class="space-y-2">
            <li v-for="(salon, index) in atananSalonlar" :key="index" class="bg-blue-50 border border-blue-200 p-3 rounded flex justify-between">
              <span class="font-semibold text-blue-800">{{ salon.ad }}</span>
              <span class="text-sm text-gray-600">Kapasite: {{ salon.kapasite }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showBolumYonetimiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">Bölüm Yönetimi</h3>
            <button @click="showBolumYonetimiModal = false" class="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
          </div>
          <div class="flex gap-2 mb-4">
            <input v-model="yeniBolumAdi" placeholder="Yeni Bölüm Adı (Örn: Makine Müh.)" class="flex-1 border p-2 rounded">
            <button @click="bolumKaydet" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold">Ekle</button>
          </div>
          <div class="max-h-60 overflow-y-auto border rounded">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">ID</th>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Bölüm Adı</th>
                <th class="py-2 px-3 border-b text-right text-sm font-semibold text-gray-600">İşlem</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="bolum in bolumler" :key="bolum.bolumID" class="hover:bg-gray-50">
                <td class="py-2 px-3 border-b text-sm text-gray-800">{{ bolum.bolumID }}</td>
                <td class="py-2 px-3 border-b text-sm text-gray-800">{{ bolum.bolumAd }}</td>
                <td class="py-2 px-3 border-b text-right">
                  <button @click="bolumSil(bolum.bolumID)" class="text-red-500 hover:text-red-700 text-sm font-bold">Sil</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showDerslikYonetimiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">Derslik (Mekan) Yönetimi</h3>
            <button @click="showDerslikYonetimiModal = false" class="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
          </div>
          <div class="flex gap-2 mb-4">
            <input v-model="yeniDerslik.ad" placeholder="Salon Adı" class="flex-2 border p-2 rounded w-2/5">
            <select v-model="yeniDerslik.tip" class="flex-1 border p-2 rounded w-1/5" :class="{'text-gray-400': !yeniDerslik.tip, 'text-black': yeniDerslik.tip}">
              <option value="" disabled>Tip</option>
              <option value="Amfi" class="text-black">Amfi</option>
              <option value="Sınıf" class="text-black">Sınıf</option>
              <option value="Lab" class="text-black">Lab</option>
            </select>
            <input v-model="yeniDerslik.kapasite" type="number" min="1" placeholder="Kapasite" class="flex-1 border p-2 rounded w-1/5">
            <button @click="derslikKaydet" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold w-1/5">Ekle</button>
          </div>
          <div class="max-h-60 overflow-y-auto border rounded">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Salon Adı</th>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Tip</th>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Kapasite</th>
                <th class="py-2 px-3 border-b text-right text-sm font-semibold text-gray-600">İşlem</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="derslik in derslikler" :key="derslik.derslikID" class="hover:bg-gray-50">
                <td class="py-2 px-3 border-b text-sm text-gray-800 font-medium">{{ derslik.ad }}</td>
                <td class="py-2 px-3 border-b text-sm text-gray-800">{{ derslik.tip }}</td>
                <td class="py-2 px-3 border-b text-sm text-gray-800">{{ derslik.kapasite }} Kişi</td>
                <td class="py-2 px-3 border-b text-right">
                  <button @click="derslikSil(derslik.derslikID)" class="text-red-500 hover:text-red-700 text-sm font-bold">Sil</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="showPersonelYonetimiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-gray-800">Personel Yönetimi</h3>
            <button @click="showPersonelYonetimiModal = false" class="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
          </div>
          <div class="flex gap-2 mb-4">
            <input v-model="yeniPersonel.ad" placeholder="Ad" class="flex-1 border p-2 rounded w-1/5">
            <input v-model="yeniPersonel.soyad" placeholder="Soyad" class="flex-1 border p-2 rounded w-1/5">
            <select v-model="yeniPersonel.unvan" class="flex-1 border p-2 rounded w-1/5" :class="{'text-gray-400': !yeniPersonel.unvan, 'text-black': yeniPersonel.unvan}">
              <option value="" disabled>Ünvan</option>
              <option value="Prof. Dr." class="text-black">Prof. Dr.</option>
              <option value="Doç. Dr." class="text-black">Doç. Dr.</option>
              <option value="Dr. Öğr. Üyesi" class="text-black">Dr. Öğr. Üyesi</option>
              <option value="Öğr. Gör." class="text-black">Öğr. Gör.</option>
              <option value="Arş. Gör." class="text-black">Arş. Gör.</option>
            </select>
            <select v-model="yeniPersonel.bolumID" class="flex-1 border p-2 rounded w-1/5" :class="{'text-gray-400': !yeniPersonel.bolumID, 'text-black': yeniPersonel.bolumID}">
              <option :value="null" disabled>Bölüm</option>
              <option v-for="bolum in bolumler" :key="bolum.bolumID" :value="bolum.bolumID" class="text-black">{{ bolum.bolumAd }}</option>
            </select>
            <button @click="personelKaydet" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold w-1/5">Ekle</button>
          </div>
          <div class="max-h-60 overflow-y-auto border rounded">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-100">
              <tr>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Ünvan</th>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Ad Soyad</th>
                <th class="py-2 px-3 border-b text-left text-sm font-semibold text-gray-600">Bölüm ID</th>
                <th class="py-2 px-3 border-b text-right text-sm font-semibold text-gray-600">İşlem</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="personel in personeller" :key="personel.personelID" class="hover:bg-gray-50">
                <td class="py-2 px-3 border-b text-sm text-gray-800">{{ personel.unvan }}</td>
                <td class="py-2 px-3 border-b text-sm text-gray-800 font-medium">{{ personel.ad }} {{ personel.soyad }}</td>
                <td class="py-2 px-3 border-b text-sm text-gray-800">Bölüm: {{ personel.bolumID }}</td>
                <td class="py-2 px-3 border-b text-right">
                  <button @click="personelSil(personel.personelID)" class="text-red-500 hover:text-red-700 text-sm font-bold">Sil</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// --- SEKME YÖNETİMİ ---
const activeTab = ref('dersler')

// --- DERSLER ---
const dersler = ref([])
const loading = ref(true)
const showModal = ref(false)
const yeniDers = ref({ dersKodu: '', ad: '', dersTuru: '', ogrenciSayisi: null, yariyil: null, bolumId: null })

const fetchDersler = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/dersler')
    dersler.value = response.data
  } catch (error) { console.error(error) } finally { loading.value = false }
}

const dersiKaydet = async () => {
  try {
    await axios.post('http://localhost:8080/api/dersler', yeniDers.value)
    showModal.value = false
    yeniDers.value = { dersKodu: '', ad: '', dersTuru: '', ogrenciSayisi: null, yariyil: null, bolumId: null }
    fetchDersler()
  } catch (error) { alert("Hata oluştu!"); console.error(error) }
}

// --- AKILLI ATAMA & SALONLAR ---
const showSalonModal = ref(false)
const atananSalonlar = ref([])

const salonAta = async (dersId) => {
  if (!confirm("Bu ders için otomatik salon ataması başlatılsın mı?")) return;
  try {
    const response = await axios.post(`http://localhost:8080/api/dersler/${dersId}/salon-ata`);
    alert("Başarılı: " + response.data);
  } catch (error) { alert("Atama işlemi başarısız!"); console.error(error); }
}

const salonlariGor = async (dersId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/dersler/${dersId}/salonlar`)
    atananSalonlar.value = response.data
    showSalonModal.value = true
  } catch (error) { console.error(error) }
}

// --- BÖLÜM YÖNETİMİ ---
const showBolumYonetimiModal = ref(false)
const bolumler = ref([])
const yeniBolumAdi = ref('')

const fetchBolumler = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/bolumler')
    bolumler.value = response.data
  } catch (error) { console.error(error) }
}

const bolumKaydet = async () => {
  if (!yeniBolumAdi.value) return;
  try {
    await axios.post('http://localhost:8080/api/bolumler', { bolumAd: yeniBolumAdi.value })
    yeniBolumAdi.value = ''
    fetchBolumler()
  } catch (error) { console.error(error); }
}

const bolumSil = async (id) => {
  if (!confirm("Emin misiniz?")) return;
  try { await axios.delete(`http://localhost:8080/api/bolumler/${id}`); fetchBolumler() } catch (error) { alert("Hata!"); }
}

// --- DERSLİK YÖNETİMİ ---
const showDerslikYonetimiModal = ref(false)
const derslikler = ref([])
const yeniDerslik = ref({ ad: '', tip: '', kapasite: null, aktif: 1 })

const fetchDerslikler = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/derslikler')
    derslikler.value = response.data
  } catch (error) { console.error(error) }
}

const derslikKaydet = async () => {
  if (!yeniDerslik.value.ad || !yeniDerslik.value.tip || yeniDerslik.value.kapasite <= 0) return;
  try {
    await axios.post('http://localhost:8080/api/derslikler', yeniDerslik.value)
    yeniDerslik.value = { ad: '', tip: '', kapasite: null, aktif: 1 }
    fetchDerslikler()
  } catch (error) { console.error(error); }
}

const derslikSil = async (id) => {
  if (!confirm("Emin misiniz?")) return;
  try { await axios.delete(`http://localhost:8080/api/derslikler/${id}`); fetchDerslikler() } catch (error) { alert("Hata!"); }
}

// --- PERSONEL YÖNETİMİ ---
const showPersonelYonetimiModal = ref(false)
const personeller = ref([])
const yeniPersonel = ref({ ad: '', soyad: '', unvan: '', bolumID: null })

const fetchPersoneller = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/personeller')
    personeller.value = response.data
  } catch (error) { console.error(error) }
}

const personelKaydet = async () => {
  if (!yeniPersonel.value.ad || !yeniPersonel.value.bolumID) return;
  try {
    await axios.post('http://localhost:8080/api/personeller', yeniPersonel.value)
    yeniPersonel.value = { ad: '', soyad: '', unvan: '', bolumID: null }
    fetchPersoneller()
  } catch (error) { console.error(error); }
}

const personelSil = async (id) => {
  if (!confirm("Emin misiniz?")) return;
  try { await axios.delete(`http://localhost:8080/api/personeller/${id}`); fetchPersoneller() } catch (error) { alert("Hata!"); }
}

// --- SINAV RAPORU YÖNETİMİ (YENİ) ---
const raporlar = ref([])

const fetchRapor = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/raporlar/sinav-programi')
    raporlar.value = response.data
  } catch (error) {
    console.error("Rapor çekilirken hata oluştu:", error)
  }
}

// --- YEDEKLEME ---
const sistemYedegiAl = async () => {
  if (!confirm("Sistemin güncel yedeği alınacak, onaylıyor musunuz?")) return;
  try {
    const response = await axios.post(`http://localhost:8080/api/dersler/yedek-al`);
    alert(response.data);
  } catch (error) { console.error(error); }
}

onMounted(() => {
  fetchDersler()
  fetchBolumler()
})
</script>
