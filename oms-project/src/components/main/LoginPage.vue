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
          Track. Approve. Optimize<br />
          Employee, PM, HR
        </h1>

        <p>
          Dari form kertas ke satu platform. Pengajuan lembur yang lebih mudah,
          lebih cepat, dan tidak ada yang terlewat.
        </p>

        <div class="stats">
          <div class="stat-wrapper">
            <div class="floating-emoji">👨‍💻👩‍💻</div>
            <div class="stat">
              <h2>Employees</h2>
              <span>Request overtime seamlessly</span>
            </div>
          </div>

          <div class="stat-wrapper">
            <div class="floating-emoji">✅📊</div>
            <div class="stat">
              <h2>PM & HR</h2>
              <span
                >Approve with full <br />
                visibility</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- panel kanan -->
    <div class="right-panel">
      <div class="login-card">
        <h1>Welcome</h1>
        <p class="subtitle">Sign with your @lenna.ai account to continue.</p>

        <form @submit.prevent="login">
          <label class="form-label">Work email</label>
          <input type="email" v-model="email" placeholder="" />

          <label class="form-label">Password</label>
          <input type="password" v-model="password" placeholder="" />

          <!-- <div class="remember">
            <input type="checkbox" v-model="remember">
            <span>Keep me signed in on this device</span>
          </div> -->

          <button type="submit" class="submit-btn">Sign in</button>
        </form>

        <!-- <p class="footer">
          Your role (PM, HR Finance, Management) is set by HR.
        </p> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const remember = ref(false);

const login = async () => {
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  if (!email.value || !password.value) {
    alert("Please fill in both email and password.");
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    const user = response.data;

    localStorage.setItem("token", user.access_token);
    localStorage.setItem("email", user.email);
    localStorage.setItem("role", user.role);
    localStorage.setItem("name", user.name);

    const visitedKey = `visited_${user.email}`;
    const hasVisited = localStorage.getItem(visitedKey);

    if (!hasVisited) {
      localStorage.setItem("isFirstLogin", "true");
      localStorage.setItem(visitedKey, "true");
    } else {
      localStorage.setItem("isFirstLogin", "false");
    }

    if (user.role === "employee") {
      window.location.href = "/dashboard";
    } else if (user.role === "product_manager") {
      window.location.href = "/review-approvals";
      } else if (user.role === "human_resource") {
        window.location.href = "/dashboard-hr";
      } 
  } catch (error) {
    alert("Email atau password salah");
    console.log(error);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: "Plus Jakarta Sans", "Inter", sans-serif;
}

/* style buat panel kiri */
@media (max-width: 1200px) {
  .left-panel {
    max-width: 50%;
    min-width: 460px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .login-card {
    width: min(100%, 420px);
  }
}

.left-panel {
  flex: 1;
  max-width: 48%;
  min-width: 460px;
  background: linear-gradient(135deg, #202184, #383bea);
  border-top-right-radius: 280px;
  border-bottom-right-radius: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: clamp(40px, 5vw, 70px);
}

.hero {
  text-align: center;
  max-width: 520px;
}

.icons {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 38px;
  margin-bottom: 35px;
}

.hero h1 {
  font-size: clamp(30px, 3vw, 40px);
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero p {
  font-size: 17px;
  margin-bottom: 45px;
  opacity: 0.95;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
}

.stat {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  padding: 20px 30px;
  border-radius: 20px;
  min-width: 200px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  width: clamp(170px, 18vw, 220px);
}

.stat h2 {
  font-size: 25px;
  margin-bottom: 8px;
}

/* kalo ini style buat panel kanan */
.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.stat-wrapper {
  position: relative;
}

.floating-emoji {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 34px;
  z-index: 2;
}

.login-card {
  width: min(100%, 460px);
  background: white;
  padding: 55px;
  border-radius: 24px;
  border: 1px solid #ddd;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.login-card h1 {
  font-size: clamp(34px, 4vw, 52px);
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
  transition: 0.3s;
  font-family: "Plus Jakarta Sans";
  font-weight: 666;
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
