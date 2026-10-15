import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "eventRegistrations";

function readRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persistRegistrations(registrations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

const registrationsSlice = createSlice({
  name: "registrations",
  initialState: {
    items: readRegistrations(),
    message: null,
    error: null,
  },
  reducers: {
    registerForEvent(state, action) {
      const { email, event } = action.payload;
      const alreadyRegistered = state.items.some(
        (registration) =>
          registration.userEmail === email && registration.event.id === event.id
      );

      if (alreadyRegistered) {
        state.error = "You are already registered for this event.";
        state.message = null;
        return;
      }

      state.items.push({
        id: `${email}-${event.id}`,
        userEmail: email,
        event,
        registeredAt: new Date().toISOString(),
      });
      persistRegistrations(state.items);
      state.error = null;
      state.message = "You are registered for this event.";
    },
    cancelRegistration(state, action) {
      const { email, eventId } = action.payload;
      const originalLength = state.items.length;
      state.items = state.items.filter(
        (registration) =>
          !(
            registration.userEmail === email &&
            registration.event.id === eventId
          )
      );

      if (state.items.length === originalLength) {
        state.error = "Registration could not be found.";
        state.message = null;
        return;
      }

      persistRegistrations(state.items);
      state.error = null;
      state.message = "Your registration has been cancelled.";
    },
    clearRegistrationFeedback(state) {
      state.message = null;
      state.error = null;
    },
  },
});

export const {
  registerForEvent,
  cancelRegistration,
  clearRegistrationFeedback,
} = registrationsSlice.actions;
export default registrationsSlice.reducer;