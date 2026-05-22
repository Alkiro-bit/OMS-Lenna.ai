<template>
  <div class="profile-page">
    <!-- HEADER -->
    <div class="profile-header">
      <h1>My Profile</h1>
      <p>Manage your account information</p>
    </div>

    <!-- PROFILE CARD -->
    <div class="profile-card">
      <!-- PROFILE IMAGE -->
      <div class="image-section">
        <div class="avatar-wrapper">
          <img
            :src="previewImage || defaultAvatar"
            alt="Profile"
            class="profile-image"
          />

          <label for="fileInput" class="upload-btn">
            <i class="fa-solid fa-camera"></i>
          </label>

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            hidden
          />
        </div>

        <h2>{{ profile.name }}</h2>
        {{ profile.position }}
      </div>

      <!-- FORM -->
      <div class="form-section">
        <div class="input-group">
          <label>Full Name</label>
          <input
            type="text"
            v-model="profile.name"
            disabled
          />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input
            type="email"
            v-model="profile.email"
            disabled
          />
        </div>

        <div class="input-group">
          <label>Position</label>
          <input type="text" v-model="profile.position" disabled />
        </div>

        <div class="button-group">
          <button class="save-btn" @click="saveProfile">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import axios from "axios";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Profile&background=1D127D&color=ffffff";

const previewImage = ref(null);
const refreshUserData = inject("refreshUserData");

const profile = ref({
  name: "",
  email: "",
  position: "",
  profile_picture: "",
});

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://127.0.0.1:8000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    profile.value = response.data.data;

    // tampilkan foto kalau ada
    if (profile.value.profile_picture) {
      previewImage.value = `http://127.0.0.1:8000/storage/profile_pictures/${profile.value.profile_picture}`;
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchProfile();
});

const selectedFile = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (file) {
    selectedFile.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const saveProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    if (selectedFile.value) {
      formData.append("profile_picture", selectedFile.value);
    }

    await axios.post(
      "http://127.0.0.1:8000/api/profile/update",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile picture updated!");

    fetchProfile();

    await refreshUserData();
  } catch (error) {
    console.error(error);
    alert("Failed to update profile picture");
  }
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.profile-page {
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #1e1b8f, #3b82f6);
  font-family: Poppins, "Plus Jakarta Sans", Arial, sans-serif;
}

.profile-header {
  color: white;
  margin-bottom: 30px;
}

.profile-header h1 {
  font-size: 32px;
  font-weight: bold;
}

.profile-header p {
  opacity: 0.8;
  margin-top: 5px;
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  gap: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

/* LEFT */
.image-section {
  width: 280px;
  text-align: center;
}

.avatar-wrapper {
  position: relative;
  width: 180px;
  margin: auto;
}

.profile-image {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #eef2ff;
}

.upload-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #4f46e5;
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.upload-btn:hover {
  background: #3730a3;
}

.image-section h2 {
  margin-top: 20px;
  font-size: 24px;
}

.image-section span {
  color: gray;
}

/* RIGHT */
.form-section {
  flex: 1;
  min-width: 300px;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.input-group input {
  width: 100%;
  height: 52px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 15px;
  transition: 0.3s;
}

.input-group input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.button-group {
  margin-top: 30px;
}

.save-btn {
  background: linear-gradient(90deg, #4ac82b, #2fc824);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 555;
  transition: 0.3s;
  font-family: "Plus Jakarta Sans";
}

.save-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
  }

  .image-section {
    width: 100%;
  }
}
</style>
