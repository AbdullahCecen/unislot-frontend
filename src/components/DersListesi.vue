<template>
  <div v-if="activeTab === 'dersler'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Sistemdeki Dersler
    </h2>

    <div v-if="loading" class="text-center py-8 text-gray-500 animate-pulse">
      Veriler Spring Boot'tan çekiliyor...
    </div>

    <div
      v-else-if="dersler.length === 0"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded text-yellow-700"
    >
      Sistemde henüz kayıtlı bir ders bulunmuyor.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-left">
        <tr>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Ders Kodu</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Ders Adı</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Öğrenci Sayısı</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Yarıyıl</th>
        </tr>
        </thead>

        <tbody>
        <tr
          v-for="ders in dersler"
          :key="ders.dersId"
          class="hover:bg-blue-50 transition-colors"
        >
          <td class="py-3 px-4 border-b text-gray-800">{{ ders.dersKodu }}</td>
          <td class="py-3 px-4 border-b text-gray-800 font-medium">{{ ders.ad }}</td>
          <td class="py-3 px-4 border-b text-gray-800">{{ ders.ogrenciSayisi }}</td>
          <td class="py-3 px-4 border-b text-gray-800">{{ ders.yariyil }}. Dönem</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Viewer için bilgi mesajı -->
    <div
      v-if="activeRole === 'viewer'"
      class="mt-4 text-sm text-gray-500 italic text-center"
    >
      Sadece görüntüleme yetkiniz bulunmaktadır.
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: String,
  activeRole: String,
  dersler: Array,
  loading: Boolean
})
</script>
