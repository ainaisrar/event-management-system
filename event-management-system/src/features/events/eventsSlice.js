import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchClassifications,
  fetchEventById,
  fetchEvents,
} from "../../services/ticketmaster";

export const loadEvents = createAsyncThunk(
  "events/loadEvents",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchEvents(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadEventById = createAsyncThunk(
  "events/loadEventById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEventById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadClassifications = createAsyncThunk(
  "events/loadClassifications",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchClassifications();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    selectedEvent: null,
    classifications: [],
    status: "idle",
    detailStatus: "idle",
    categoriesStatus: "idle",
    error: null,
    detailError: null,
  },
  reducers: {
    clearSelectedEvent(state) {
      state.selectedEvent = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load events.";
      })
      .addCase(loadEventById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.selectedEvent = null;
      })
      .addCase(loadEventById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedEvent = action.payload;
      })
      .addCase(loadEventById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Unable to load this event.";
      })
      .addCase(loadClassifications.pending, (state) => {
        state.categoriesStatus = "loading";
      })
      .addCase(loadClassifications.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.classifications = action.payload;
      })
      .addCase(loadClassifications.rejected, (state) => {
        state.categoriesStatus = "failed";
      });
  },
});

export const { clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;