<template>
  <div v-if="activeTab === 'dersler'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Sınav Yönetimi
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
      <select v-model="yeniSinav.dersId" class="border p-3 rounded bg-white">
        <option :value="null">Ders Seçin</option>
        <option v-for="ders in dersler" :key="ders.dersId" :value="ders.dersId">
          {{ ders.dersKodu }} - {{ ders.ad }}
        </option>
      </select>

      <input v-model="yeniSinav.tarih" type="date" class="border p-3 rounded" />

      <select v-model="yeniSinav.oturumId" class="border p-3 rounded bg-white">
        <option :value="null">Oturum Seçin</option>
        <option
          v-for="oturum in oturumlar"
          :key="oturum.oturumId"
          :value="oturum.oturumId"
        >
          {{ oturum.tanim }} / {{ oturum.baslangicSaat.slice(0, 5) }} - {{ oturum.bitisSaat.slice(0, 5) }}
        </option>
      </select>

      <button
        @click="sinavOlustur"
        :disabled="loading"
        class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded px-4"
      >
        {{ loading ? 'Kaydediliyor...' : 'Sınav Oluştur' }}
      </button>
    </div>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded text-blue-700 text-sm">
      Sınav oluşturduktan sonra salon ve gözetmen atamalarını
      <b>Sınav Raporu</b> ekranından yapabilirsiniz.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineProps({
  activeTab: String,
  dersler: Array
})

const emit = defineEmits(['sinav-olusturuldu'])

const oturumlar = ref([])
const loading = ref(false)
const message = ref('')
const messageType = ref('success')

const yeniSinav = ref({
  dersId: null,
  tarih: '',
  oturumId: null
})

const setMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 3000)
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

const sinavOlustur = async () => {
  if (!yeniSinav.value.dersId || !yeniSinav.value.tarih || !yeniSinav.value.oturumId) {
    setMessage('Ders, tarih ve oturum seçimi zorunludur.', 'error')
    return
  }

  loading.value = true

  try {
    await axios.post('http://localhost:8080/api/sinavlar', yeniSinav.value)

    setMessage('Sınav başarıyla oluşturuldu.', 'success')

    yeniSinav.value = {
      dersId: null,
      tarih: '',
      oturumId: null
    }

    emit('sinav-olusturuldu')
  } catch (error) {
    const hataMesaji = error.response?.data || 'Sınav oluşturulamadı.'
    setMessage(hataMesaji, 'error')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOturumlar()
})
</script>
