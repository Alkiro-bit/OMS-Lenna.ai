<template>
  <div class="login-page">

    <div class="form-card">
      <div class="form-header">
        <h2>Welcome</h2>
        <p>Sign with your Lenna.ai account to continue.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <label>
          Email
          <input
            type="email"
            v-model="form.email"
            placeholder="your@company.com"
            required
          />
        </label>

        <label>
          Password  
          <input
            type="password"
            v-model="form.password"
            placeholder="Enter password"
            required
          />
        </label>

        <label class="checkbox-row">
          <input type="checkbox" v-model="form.remember" />
          Keep me signed in on this device
        </label>

        <button type="submit">Sign in</button>
      </form>

      <p class="hint">Your role (PM, HR Finance, Management) is set by HR.</p>
      <p class="hint">LOVE FAREL & SHEILA</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

function handleSubmit() {
  //nanti ganti sama API / database integrationnya
  console.log('login attempt', { ...form })
  alert('Login submitted.')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
  background: radial-gradient(circle at top left, #3b5bff 0%, #1d3d9f 45%, #090f2e 100%);
  color: white;
}


.form-card {
  width: min(420px, 100%);
  margin: 0 auto;
  padding: 38px;
  background: #ffffff;
  color: #15161f;
  border-radius: 28px;
  box-shadow: 0 0 80px rgba(255, 255, 255, 0.262)
}

.form-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #111827;
}

.form-header p {
  margin: 10px 0 28px;
  color: #4b5563;
  line-height: 1.6;
}

form {
  display: grid;
  gap: 18px;
  width: 100%;
}

label {
  display: grid;
  gap: 10px;
  width: 100%;
  font-size: 0.95rem;
  color: #111827;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #f8fafc;
  color: #111827;
  font-size: 0.98rem;
}

input[type='email']::placeholder,
input[type='password']::placeholder {
  color: #9ca3af;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
  color: #4b5563;
}

button {
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.hint {
  margin-top: 18px;
  font-size: 0.9rem;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 28px;
  }

  .hero-panel {
    order: 2;
  }
}

@media (max-width: 720px) {
  .login-page {
    padding: 20px;
  }

  .hero-panel,
  .form-card {
    padding: 28px;
    border-radius: 24px;
  }
}
</style>
