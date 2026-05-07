<template>
  <Login v-if="!isLoggedIn" @login="handleLogin" />

  <div v-else class="h-screen bg-gray-50 font-sans flex flex-col">
    <Header
      :active-role="activeRole"
      @logout="logout"
    />

    <div class="flex flex-1 overflow-hidden">
      <Sidebar
        :active-tab="activeTab"
        :active-role="activeRole"
        @change-tab="handleTabChange"
        @backup="sistemYedegiAl"
      />

      <main class="flex-1 p-8 overflow-y-auto relative">
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

        <div class="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <SinavYonetimi
            :active-tab="activeTab"
            :dersler="dersler"
            @sinav-olusturuldu="sinavOlusturuldu"
          />

          <SinavRaporu
            :active-tab="activeTab"
            :active-role="activeRole"
            :raporlar="raporlar"
            @refresh-rapor="fetchRapor"
          />

          <BolumYonetimi
            :active-tab="activeTab"
            :bolumler="bolumler"
            v-model:yeniBolumAdi="yeniBolumAdi"
            @bolum-kaydet="bolumKaydet"
            @bolum-sil="bolumSil"
          />

          <DerslikYonetimi
            :active-tab="activeTab"
            :derslikler="derslikler"
            v-model:yeniDerslik="yeniDerslik"
            @derslik-kaydet="derslikKaydet"
            @derslik-sil="derslikSil"
          />

          <PersonelYonetimi
            :active-tab="activeTab"
            :personeller="personeller"
            :bolumler="bolumler"
            v-model:yeniPersonel="yeniPersonel"
            @personel-kaydet="personelKaydet"
            @personel-sil="personelSil"
          />

          <MazeretYonetimi
            :active-tab="activeTab"
            :personeller="personeller"
          />

          <YeniDersKaydi
            v-model:yeni-ders="yeniDers"
            :active-tab="activeTab"
            :bolumler="bolumler"
            :dersler="dersler"
            @ders-kaydet="dersKaydet"
            @ders-sil="dersSil"
          />
          <Gorevlerim
            :active-tab="activeTab"
            :gorevler="gorevlerim"
          />
          <OturumYonetimi :active-tab="activeTab" />
        </div>

        <div
          v-if="showSalonModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-xl w-96">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-gray-800">Atanan Sınav Salonları</h3>
              <button
                @click="showSalonModal = false"
                class="text-red-500 font-bold text-xl hover:text-red-700"
              >
                &times;
              </button>
            </div>

            <div
              v-if="atananSalonlar.length === 0"
              class="text-gray-500 italic text-center py-4"
            >
              Bu sınav için henüz salon ataması yapılmamış.
            </div>

            <ul v-else class="space-y-2">
              <li
                v-for="(salon, index) in atananSalonlar"
                :key="index"
                class="bg-blue-50 border border-blue-200 p-3 rounded flex justify-between"
              >
                <span class="font-semibold text-blue-800">{{ salon.ad }}</span>
                <span class="text-sm text-gray-600">Kapasite: {{ salon.kapasite }}</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

import Login from '@/components/Login.vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'
import DersListesi from '@/components/DersListesi.vue'
import SinavRaporu from '@/components/SinavRaporu.vue'
import BolumYonetimi from '@/components/BolumYonetimi.vue'
import DerslikYonetimi from '@/components/DerslikYonetimi.vue'
import PersonelYonetimi from '@/components/PersonelYonetimi.vue'
import YeniDersKaydi from '@/components/YeniDersKaydi.vue'
import Gorevlerim from '@/components/Gorevlerim.vue'
import SinavYonetimi from '@/components/SinavYonetimi.vue'
import OturumYonetimi from '@/components/OturumYonetimi.vue'
import MazeretYonetimi from '@/components/MazeretYonetimi.vue'

const activeTab = ref('dersler')
const isLoggedIn = ref(false)
const activeRole = ref(null)

const dersler = ref([])
const loading = ref(false)

const raporlar = ref([])
const bolumler = ref([])
const derslikler = ref([])
const personeller = ref([])
const gorevlerim = ref([])

const showSalonModal = ref(false)
const atananSalonlar = ref([])

const message = ref('')
const messageType = ref('success')

const yeniDers = ref({
  dersKodu: '',
  ad: '',
  dersTuru: '',
  ogrenciSayisi: null,
  yariyil: null,
  bolumId: null
})


const yeniBolumAdi = ref('')

const yeniDerslik = ref({
  ad: '',
  tip: '',
  kat: null,
  kapasite: null,
  aktif: 1
})

const yeniPersonel = ref({
  ad: '',
  soyad: '',
  unvan: '',
  bolumID: null
})

const setMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
}

const handleLogin = (data) => {
  activeRole.value = data.role
  isLoggedIn.value = true

  localStorage.setItem('role', data.role)

  if (data.personelId) {
    localStorage.setItem('personelId', data.personelId)
  }

  if (data.role === 'viewer') {
    activeTab.value = 'gorevlerim'
    fetchGorevlerim()
    return
  }

  activeTab.value = 'dersler'
  fetchDersler()
  fetchBolumler()
}

const handleTabChange = (tab) => {
  activeTab.value = tab

  if (tab === 'dersler') fetchDersler()
  if (tab === 'rapor') fetchRapor()
  if (tab === 'gorevlerim') fetchGorevlerim()
  if (tab === 'bolumler') fetchBolumler()
  if (tab === 'derslikler') fetchDerslikler()
  if (tab === 'personeller') {
    fetchPersoneller()
    fetchBolumler()
  }
  if (tab === 'yeniDers') fetchBolumler()
  if (tab === 'mazeretler') fetchPersoneller()
}

const logout = () => {
  isLoggedIn.value = false
  activeRole.value = null
  activeTab.value = 'dersler'
  localStorage.removeItem('role')
  localStorage.removeItem('personelId')
}

const fetchDersler = async () => {
  loading.value = true
  try {
    const response = await axios.get('http://localhost:8080/api/dersler')
    dersler.value = response.data
  } catch (error) {
    setMessage('Dersler yüklenirken hata oluştu.', 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const dersKaydet = async () => {
  try {
    await axios.post('http://localhost:8080/api/dersler', yeniDers.value)

    setMessage('Ders başarıyla eklendi.', 'success')

    yeniDers.value = {
      dersKodu: '',
      ad: '',
      dersTuru: '',
      ogrenciSayisi: null,
      yariyil: null,
      bolumId: null
    }

    activeTab.value = 'dersler'
    fetchDersler()
  } catch (error) {
    setMessage('Ders kaydedilirken hata oluştu.', 'error')
    console.error(error)
  }
}

const salonAta = async (sinavId) => {
  if (!confirm('Bu sınav için otomatik salon ataması başlatılsın mı?')) return

  try {
    const response = await axios.post(`http://localhost:8080/api/sinavlar/${sinavId}/salon-ata`)
    setMessage(response.data.message || 'Salon ataması başarılı.', 'success')
    fetchRapor()
  } catch (error) {
    setMessage(error.response?.data?.message || 'Atama işlemi başarısız.', 'error')
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
const fetchBolumler = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/bolumler')
    bolumler.value = response.data
  } catch (error) {
    setMessage('Bölümler yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const bolumKaydet = async () => {
  if (!yeniBolumAdi.value) {
    setMessage('Bölüm adı boş olamaz.', 'error')
    return
  }

  try {
    await axios.post('http://localhost:8080/api/bolumler', { bolumAd: yeniBolumAdi.value })

    setMessage('Bölüm başarıyla eklendi.', 'success')
    yeniBolumAdi.value = ''
    fetchBolumler()
  } catch (error) {
    setMessage('Bölüm eklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const bolumSil = async (id) => {
  if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return

  try {
    await axios.delete(`http://localhost:8080/api/bolumler/${id}`)

    setMessage('Bölüm başarıyla silindi.', 'success')
    fetchBolumler()
  } catch (error) {
    setMessage('Bu bölüm silinemez. Bağlı ders/personel olabilir.', 'error')
    console.error(error)
  }
}

const fetchDerslikler = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/derslikler')
    derslikler.value = response.data
  } catch (error) {
    setMessage('Derslikler yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const derslikKaydet = async () => {
  // 1. İf şartına kat kontrolü eklendi
  if (!yeniDerslik.value.ad || !yeniDerslik.value.tip || yeniDerslik.value.kapasite <= 0 || yeniDerslik.value.kat === null || yeniDerslik.value.kat === '') {
    setMessage('Derslik adı, kat, tip ve kapasite bilgileri zorunludur.', 'error')
    return
  }

  try {
    await axios.post('http://localhost:8080/api/derslikler', yeniDerslik.value)

    setMessage('Derslik başarıyla eklendi.', 'success')

    // 2. Form sıfırlanırken kat da sıfırlanacak
    yeniDerslik.value = {
      ad: '',
      tip: '',
      kat: null, // <-- YENİ EKLENDİ
      kapasite: null,
      aktif: 1
    }

    fetchDerslikler()
  } catch (error) {
    setMessage('Derslik eklenirken hata oluştu.', 'error')
    console.error(error)
  }
}
const derslikSil = async (id) => {
  if (!confirm('Bu dersliği silmek istediğinize emin misiniz?')) return

  try {
    await axios.delete(`http://localhost:8080/api/derslikler/${id}`)

    setMessage('Derslik başarıyla silindi.', 'success')
    fetchDerslikler()
  } catch (error) {
    setMessage('Bu derslik silinemez. Bu dersliğe bağlı sınav salonu kaydı olabilir.', 'error')
    console.error(error)
  }
}

const fetchPersoneller = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/personeller')
    personeller.value = response.data
  } catch (error) {
    setMessage('Personeller yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const personelKaydet = async () => {
  if (
    !yeniPersonel.value.ad ||
    !yeniPersonel.value.soyad ||
    !yeniPersonel.value.unvan ||
    !yeniPersonel.value.bolumID
  ) {
    setMessage('Personel adı, soyadı, ünvanı ve bölümü zorunludur.', 'error')
    return
  }
  try {
    await axios.post('http://localhost:8080/api/personeller', yeniPersonel.value)

    setMessage('Personel başarıyla eklendi.', 'success')

    yeniPersonel.value = {
      ad: '',
      soyad: '',
      unvan: '',
      bolumID: null
    }

    fetchPersoneller()
  } catch (error) {
    setMessage('Personel eklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const personelSil = async (id) => {
  if (!confirm('Bu personeli silmek istediğinize emin misiniz?')) return

  try {
    await axios.delete(`http://localhost:8080/api/personeller/${id}`)

    setMessage('Personel başarıyla silindi.', 'success')
    fetchPersoneller()
  } catch (error) {
    setMessage('Bu personel silinemez. Bağlı kayıt olabilir.', 'error')
    console.error(error)
  }
}

const fetchRapor = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/raporlar/sinav-programi')
    raporlar.value = response.data
  } catch (error) {
    setMessage('Rapor yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}
const fetchGorevlerim = async () => {
  const personelId = localStorage.getItem('personelId')

  if (!personelId) {
    setMessage('Personel bilgisi bulunamadı. Lütfen tekrar giriş yapın.', 'error')
    return
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/sinavlar/personel/${personelId}/gorevler`)
    gorevlerim.value = response.data
  } catch (error) {
    setMessage('Görevleriniz yüklenirken hata oluştu.', 'error')
    console.error(error)
  }
}

const sistemYedegiAl = async () => {
  if (!confirm('Sistemin güncel yedeği alınacak, onaylıyor musunuz?')) return

  try {
    const response = await axios.post('http://localhost:8080/api/dersler/yedek-al')
    setMessage(response.data, 'success')
  } catch (error) {
    setMessage('Yedekleme sırasında hata oluştu.', 'error')
    console.error(error)
  }
}

onMounted(() => {
  const savedRole = localStorage.getItem('role')
  const personelId = localStorage.getItem('personelId')

  if (!savedRole) return

  activeRole.value = savedRole
  isLoggedIn.value = true

  if (savedRole === 'viewer') {
    activeTab.value = 'gorevlerim'
    fetchGorevlerim()
    return
  }
  activeTab.value = 'dersler'
  fetchDersler()
  fetchBolumler()
})

watch(message, () => {
  if (message.value) {
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
})
const sinavOlusturuldu = async () => {
  await fetchRapor()
  activeTab.value = 'rapor'
}
const dersSil = async (dersId) => {
  if (!confirm('Bu ders silinsin mi?')) return

  try {
    await axios.delete(`http://localhost:8080/api/dersler/${dersId}`)
    await fetchDersler()
    await fetchRapor()
    alert('Ders başarıyla silindi.')
  } catch (error) {
    alert(error.response?.data || 'Ders silinemedi.')
    console.error(error)
  }
}
</script>
