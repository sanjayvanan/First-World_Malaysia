import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'; // <--- CHANGED: Import your configured API

// 1. ASYNC ACTION: Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // <--- CHANGED: Use 'api' and relative path. 
      // This automatically prepends the correct BASE_URL (localhost or production domain)
      const response = await api.post('/api/auth/login', { email, password });
      
      // Save to LocalStorage (Essential for persistence)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data; 
    } catch (err) {
      // Standardize error message capture
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Login failed');
    }
  }
);

// 2. INITIAL STATE 
// Safely load from LocalStorage so the user stays logged in on refresh
const loadState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        return {
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
            loading: false,
            error: null
        };
    }
  } catch (e) {
    console.error("Failed to load auth state:", e);
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadState(),
  reducers: {
    setCredentials: (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUser, setCredentials } = authSlice.actions;
export default authSlice.reducer;