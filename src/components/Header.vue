<template>
  <header class="header">
    <div class="header-left">
      <div v-if="showMenu" class="menu-icon" @click="$emit('toggle-sidebar')">
        <v-icon>mdi-menu</v-icon>
      </div>
      <h1 class="header-title">sbm-application</h1>
    </div>
    
    <!-- 認証済みユーザーのプロフィールアイコン -->
    <div v-if="isAuthenticated" class="profile-section" @click="goToSettings">
      <v-avatar size="36" class="profile-avatar">
        <img 
          v-if="!profileImageInfo?.profile_image_url"
          src="/default-avatar.svg"
          alt="Profile"
          class="profile-img"
        />
        <img 
          v-else
          :src="imageDataUrl"
          :key="imageKey"
          alt="Profile"
          class="profile-img"
          @error="handleImageError"
        />
      </v-avatar>
      <div v-if="profileImageInfo?.is_google_image" class="google-badge-header">
        <v-icon size="12" color="primary">mdi-google</v-icon>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import apiFacade from '../services/apiFacade';

export default {
  name: "Header",
  props: {
    showMenu: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      profileImageInfo: null,
      imageDataUrl: null,
      imageKey: Date.now(),
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  watch: {
    // 認証状態が変わったときにプロフィール画像を取得
    isAuthenticated: {
      handler(newVal) {
        if (newVal) {
          this.fetchProfileImage();
        } else {
          this.clearProfileData();
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // プロフィール画像更新イベントをリスン
    window.addEventListener('profile-image-updated', this.handleProfileImageUpdate);
  },
  beforeUnmount() {
    // イベントリスナーをクリーンアップ
    window.removeEventListener('profile-image-updated', this.handleProfileImageUpdate);
  },
  methods: {
    // プロフィール画像更新イベントのハンドラー
    handleProfileImageUpdate() {
      this.fetchProfileImage();
    },

    async fetchProfileImage() {
      try {
        // 認証チェック
        if (!this.isAuthenticated) return;
        
        const response = await apiFacade.getProfileImage();
        if (response && response.success) {
          this.profileImageInfo = response.data;
          this.imageKey = Date.now();
          
          if (response.data && response.data.profile_image_url) {
            await this.loadImageWithAuth(response.data.profile_image_url);
          } else {
            this.imageDataUrl = null;
          }
        }
      } catch (error) {
        console.warn('Could not fetch profile image in header:', error);
        // エラー時はデフォルト状態を保持
        this.profileImageInfo = null;
        this.imageDataUrl = null;
      }
    },

    async loadImageWithAuth(imageUrl) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(imageUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            this.imageDataUrl = e.target.result;
          };
          
          reader.readAsDataURL(blob);
        }
      } catch (error) {
        console.error('Error loading image with auth in header:', error);
      }
    },

    handleImageError(event) {
      event.target.src = '/default-avatar.svg';
    },

    goToSettings() {
      console.log('Profile icon clicked - navigating to settings');
      // Vue Routerを使用してSPA内でのナビゲーション
      this.$router.push('/settings');
    },

    clearProfileData() {
      this.profileImageInfo = null;
      this.imageDataUrl = null;
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #00bfa5; /* ネオミント */
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 24px;
}

.menu-icon {
  margin-right: 20px;
  cursor: pointer;
}

.profile-section {
  position: relative;
  cursor: pointer;
}

.profile-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.google-badge-header {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.v-icon {
  color: #ffffff;
}

@media (max-width: 600px) {
  .header-title {
    font-size: 20px;
  }
  
  .profile-avatar {
    width: 32px !important;
    height: 32px !important;
  }
  
  .google-badge-header {
    width: 14px;
    height: 14px;
  }
  
  .google-badge-header .v-icon {
    font-size: 10px;
  }
}
</style>
