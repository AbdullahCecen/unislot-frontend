<template>
  <div v-if="activeTab === 'gorevlerim'">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
      Görevlerim
    </h2>

    <div v-if="gorevler.length === 0" class="text-center py-8 text-gray-500 italic">
      Size atanmış gözetmenlik görevi bulunmamaktadır.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-left">
        <tr>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Tarih / Saat</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Bölüm</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Ders</th>
          <th class="py-3 px-4 border-b font-semibold text-gray-600">Salon</th>
        </tr>
        </thead>

        <tbody>
        <tr
          v-for="gorev in gorevler"
          :key="`${gorev.sinavId}-${gorev.salonAdi}`"
          class="hover:bg-blue-50 transition-colors"
        >
          <td class="py-3 px-4 border-b text-gray-800 font-bold">
            {{ gorev.tarih }} <br />
            <span class="text-xs text-gray-500">{{ gorev.saat }}</span>
          </td>
          <td class="py-3 px-4 border-b text-gray-800">{{ gorev.bolumAd }}</td>
          <td class="py-3 px-4 border-b text-gray-800">
            <span class="font-bold">{{ gorev.dersKodu }}</span> - {{ gorev.dersAdi }}
          </td>
          <td class="py-3 px-4 border-b text-gray-800 font-semibold">
            {{ gorev.salonAdi }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  },
  gorevler: {
    type: Array,
    required: true
  }
})
</script>
