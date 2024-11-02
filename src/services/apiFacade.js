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
        localStorage.setItem('token', response.data.token);
        setAuthToken();
        return response.data;
      } else {
        throw new Error('Login failed'); 
      }
    }).catch(error => {
      console.error('API Error:', error); 
      throw error; 
    })
  },
  async uploadExcelFile(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Error uploading Excel file:', error);
      throw error; 
    }
  },
  async getActivities(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities`, {
        params: { userId } 
      });
      if (response.status === 200) {
        return response.data; // 活動データを返す
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error; // エラーをスロー
    }
  },
};

export default apiFacade;