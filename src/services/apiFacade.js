import axios from 'axios';

// 環境変数からAPIのベースURLを設定
const API_BASE_URL = 'http://localhost:8080';

const apiFacade = {
  // ユーザー登録のメソッド
  registerUser(username, email, password) {
    return axios.post(`${API_BASE_URL}/auth/register`, {
      username,
      password,
      email,
    });
  },

  // ユーザーログインのメソッド
  loginUser(username, password) {
    return axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    }).then(response => {
      if (response.status === 200) {
        // 成功した場合の処理
        return response.data;
      } else {
        throw new Error('Login failed'); // ステータスが200以外の場合
      }
    }).catch(error => {
      console.error('API Error:', error); // エラーの詳細を出力
      throw error; // エラーを再スロー
    });
  }
};

export default apiFacade;