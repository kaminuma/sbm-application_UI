<template>
    <v-container>
      <v-card>
        <v-card-title>
          <span v-if="isLogin">Login</span>
          <span v-else>Register</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="username"
              :rules="[rules.required]"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-if="!isLogin"
              v-model="email"
              label="Email"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="[rules.required, rules.min]"
              label="Password"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              v-if="!isLogin"
              v-model="confirmPassword"
              :rules="[rules.required, rules.matchPassword]"
              label="Confirm Password"
              type="password"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-btn @click="submit" color="primary">{{ isLogin ? 'Login' : 'Register' }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="toggleLogin">{{ isLogin ? 'Switch to Register' : 'Switch to Login' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import apiFacade from '../services/apiFacade';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex'; 
  
  export default {
    data() {
      return {
        username: '',
        email:'',
        password: '',
        confirmPassword: '',
        valid: false,
        isLogin: true,
        rules: {
          required: (value) => !!value || 'Required.',
          min: (v) => (v && v.length >= 8) || 'Minimum 8 characters',
          matchPassword: (v) => v === this.password || 'Passwords must match',
        },
      };
    },
    setup() {
      const router = useRouter();
      const store = useStore();
      const isAuthenticated = computed(() => store.state.isAuthenticated);
      return { router, store, isAuthenticated };
    },
    methods: {
      toggleLogin() {
        this.isLogin = !this.isLogin;
        this.resetFields();
      },
      resetFields() {
        this.username = '';
        this.password = '';
        this.email = '';
        this.confirmPassword = '';
      },
      async submit() {
        if (this.$refs.form.validate()) {
          if (this.isLogin) {
            // ログイン
            try {
              const response = await apiFacade.loginUser(this.username, this.password); 
              // Vuexのactionを呼び出し
              const userId = response.userId; // userIdのみを抽出
              this.$store.dispatch('login', userId);
              this.$router.push('/schedule'); // 認証後にスケジュール画面へ遷移
            } 
            catch (error) {
              alert('Invalid credentials');
              console.error('Login error:', error);
            }
            } else {
            
              // ユーザー登録
            if (this.password !== this.confirmPassword) {
              alert("Passwords don't match");
              return;
            }
            try {
              await apiFacade.registerUser(this.username, this.email, this.password);
              alert('Registration successful! Please log in.');
              this.toggleLogin(); // 登録後はログイン画面に切り替え
            } catch (error) {
              alert('Registration failed. Please try again.');
            }
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    max-width: 400px;
    margin: auto;
  }
  </style>
  