import logo from './logo.svg';
import React,{useReducer} from 'react'
import './App.css';
import {v4 as uuidv4 } from 'uuid';
import { Button } from 'react-bootstrap';
import ToDoList from './ToDoList';
const todosInitialState = {
  todos:[]
}
function todosReducer(state,action)
{
  switch(action.type)
  {
    case 'get':
      return {...state,todos:action.payload}
    case 'add':
      const addedToDos = [...state.todos,action.payload];
      return {...state,todos:addedToDos};
    case 'delete':
      const todofilterlist=state.todos.filter(todo=>todo.id!==action.payload.id);
      console.log('hello')
      return {...state,todos:todofilterlist};
    case 'edit':
      const updateToDo = {...action.payload};
      const updatedToDoIndex = state.todos.findIndex(t=> t.id===action.payload.id);
      const updatedToDos = [
        ...state.todos.slice(0,updatedToDoIndex),
        updateToDo,
        ...state.todos.slice(updatedToDoIndex+1)
      ];
      return {...state,todos:updatedToDos}
    default:
      return todosInitialState;
  }
}
export const TodosContext = React.createContext();
function App() {
  const [state,dispatch] =  useReducer(todosReducer,todosInitialState)
  return (
   <TodosContext.Provider value={{state,dispatch}}>
     <ToDoList/>

     </TodosContext.Provider>
  );
}

export default App;
