import axios from 'axios';

// 環境変数からAPIのベースURLを設定
const API_BASE_URL = 'http://localhost:8080';

// トークンの設定
const setAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization']; // トークンがない場合はヘッダーを削除
  }
}

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
        // 成功した場合、トークンをローカルストレージに保存
        localStorage.setItem('token', response.data.token); // 適宜プロパティ名を修正
        setAuthToken(); // トークンをヘッダーに設定
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