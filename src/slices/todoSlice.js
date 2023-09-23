import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from '../config/Config';

const initialValue = {
  filterStatus: 'all',
  todoList: [],
};

export const fetchTodoData = createAsyncThunk(
  'todo/fetchData',
  async () => {
    const res = await Axios.get('/getAllTodos');
    return res.data.data;
  }
);

export const todoSlice = createSlice({
  name: 'todo',
  initialState: initialValue,
  reducers: {
    addTodo: (state, action) => {
      state.todoList.push(action.payload);
    },
    updateTodo: (state, action) => {
      const {id, newData } = action.payload
      const index = state.todoList.findIndex(data => data._id === id);
      if (index !== -1) {
        state.todoList[index] = {...newData, _id: id};
      }
    },
    deleteTodo: (state, action) => {
      const id = action.payload;
      const index = state.todoList.findIndex(data => data._id === id);
      if (index !== -1) {
        state.todoList.splice(index, 1);
      }
  },
  updateFilterStatus: (state, action) => {
    state.filterStatus = action.payload;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodoData.fulfilled, (state, action) => {
        state.loading = false;
        state.todoList = action.payload;
      })
      .addCase(fetchTodoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addTodo, updateTodo, deleteTodo, updateFilterStatus } =
  todoSlice.actions;
export default todoSlice.reducer;
