import { createSlice } from "@reduxjs/toolkit";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readStoredUser(),
    error: null,
    registered: false,
  },
  reducers: {
    registerUser(state, action) {
      const { name, email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const exists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        state.error = "This email is already registered";
        state.registered = false;
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      state.error = null;
      state.registered = true;
    },

    loginUser(state, action) {
      const { email, password } = action.payload;
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const found = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (found) {
        state.user = { name: found.name, email: found.email };
        localStorage.setItem("currentUser", JSON.stringify(state.user));
        state.error = null;
        state.registered = false;
      } else {
        state.error = "Wrong email or password";
        state.user = null;
      }
    },

    logoutUser(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("currentUser");
    },

    clearAuthMessages(state) {
      state.error = null;
      state.registered = false;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthMessages } =
  authSlice.actions;
export default authSlice.reducer;