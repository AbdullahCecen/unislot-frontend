<template>
  <div class="flex items-center justify-center h-screen bg-gray-900">
    <div class="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-blue-600 mb-2">UniSlot</h1>
        <p class="text-gray-500 text-sm">Akıllı Sınav ve Gözetmen Yönetim Sistemi</p>
      </div>

      <div class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border p-3 rounded-lg"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Şifre"
          class="w-full border p-3 rounded-lg"
          @keyup.enter="handleLogin"
        />

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg shadow"
        >
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>

        <p v-if="errorMessage" class="text-sm text-red-600 text-center font-semibold">
          {{ errorMessage }}
        </p>

        <p class="text-sm text-gray-500 text-center">
          Admin: admin@gmail.com / 1234<br />
          Gözetmen: abdullah@gmail.com / 1234
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['login'])

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Email ve şifre zorunludur.'
    return
  }

  try {
    loading.value = true

    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('role', response.data.role)

    if (response.data.personelId !== null && response.data.personelId !== undefined) {
      localStorage.setItem('personelId', response.data.personelId)
    } else {
      localStorage.removeItem('personelId')
    }

    emit('login', {
      role: response.data.role,
      personelId: response.data.personelId
    })
  } catch (error) {
    errorMessage.value = 'Email veya şifre hatalı.'
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
