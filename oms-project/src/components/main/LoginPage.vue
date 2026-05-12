<template>
  <div class="container">

    <!-- panel kiri -->
    <div class="left-panel">
      <div class="hero">

        <div class="icons">
          <i class="fa-regular fa-clock"></i>
          <i class="fa-regular fa-file-lines"></i>
          <i class="fa-regular fa-message"></i>
        </div>

        <h1>
          Log, acknowledge,<br>
          approve – All in one place.
        </h1>

        <p>
          Dari form kertas ke satu platform. Pengajuan lembur yang
          lebih mudah, lebih cepat, dan tidak ada yang terlewat.
        </p>

        <div class="stats">
          <div class="stat">
            <h2>150 hrs</h2>
            <span>Tracked this month</span>
          </div>

          <div class="stat">
            <h2>1.5 days</h2>
            <span>Avg approval time</span>
          </div>
        </div>

      </div>
    </div>

    <!-- panel kanan -->
    <div class="right-panel">
      <div class="login-card">

        <h1>Welcome</h1>
        <p class="subtitle">
          Sign with your Lenna.ai account to continue.
        </p>

        <form @submit.prevent="login">

          <label class="form-label">Work email</label>
          <input
            type="email"
            v-model="email"
            placeholder=""
          >

          <label class="form-label">Password</label>
          <input
            type="password"
            v-model="password"
            placeholder=""
          >

          <div class="remember">
            <input type="checkbox" v-model="remember">
            <span>Keep me signed in on this device</span>
          </div>

          <button type="submit" class="submit-btn">Sign in</button>
        </form>

        <p class="footer">
          Your role (PM, HR Finance, Management) is set by HR.
        </p>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const remember = ref(false)

// dummy users
const users = [
  {
    email: 'employee@lenna.com',
    password: '123',
    role: 'employee'
  },
  {
    email: 'pm@lenna.com',
    password: '123',
    role: 'product_manager'
  },
  {
    email: 'hr@lenna.com',
    password: '123',
    role: 'hr'
  }
]

const login = () => {
  if (!email.value || !password.value) {
    alert('Please fill in both email and password.')
    return
  }

  const user = users.find(
    u =>
      u.email === email.value &&
      u.password === password.value
  )

  if (!user) {
    alert('Email or password is incorrect.')
    return
  }

  localStorage.setItem('role', user.role)

  if (user.role === 'employee') {
    window.localStorage.setItem('token', 'blalblalva');
    window.location.href ='/dashboard'
  } else {
    alert('Dashboard for this role is not available yet.')
  }
}
</script>

<style scoped>


.container {
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
}

/* style buat panel kiri */
.left-panel {
  width: 55%;
  background: linear-gradient(135deg, #202184,#383BEA );
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 60px;
}

.hero {
  text-align: center;
  max-width: 650px;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 38px;
  margin-bottom: 35px;
}

.hero h1 {
  font-size: 58px;
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  margin-bottom: 45px;
  opacity: .95;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.stat {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  padding: 24px 34px;
  border-radius: 20px;
  min-width: 220px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.18);
}

.stat h2 {
  font-size: 34px;
  margin-bottom: 8px;
}

/* kalo ini style buat panel kanan */
.right-panel {
  width: 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 500px;
  background: white;
  padding: 55px;
  border-radius: 24px;
  border: 1px solid #ddd;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.login-card h1 {
  font-size: 52px;
  margin-bottom: 15px;
}

.subtitle {
  color: #666;
  margin-bottom: 35px;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  border: 1px solid #bbb;
  border-radius: 12px;
  margin-bottom: 25px;
  font-size: 16px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.submit-btn {
  width: 100%;
  background: #4374f7;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 17px;
  cursor: pointer;
  transition: .3s;
}
.submit-btn:hover {
  background: #2f60eb;
}

.footer {
  margin-top: 22px;
  color: #666;
  font-size: 14px;
  
}
</style>