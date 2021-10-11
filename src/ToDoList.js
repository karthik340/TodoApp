import React,{useContext,useEffect,useState} from "react";
import { TodosContext } from "./App";
import {Table,Form,Button} from 'react-bootstrap'
import useAPI from "./useApi";
import axios from "axios";
import {v4 as uuidv4 } from 'uuid';
function ToDoList()
{
    const {state,dispatch} = useContext(TodosContext)
    const [toDoText,setTodoText] =useState("")
    const [editMode, setEditMode] =useState(false)
    const [editToDo, setEditToDo] =useState(null)
    const buttonTitle = editMode ? 'Edit':'Add';

    const endpoint = "https://to-do-karthik340.herokuapp.com/todos/"
    const savedTodos = useAPI(endpoint)
    
    useEffect(()=>{
        dispatch({type:"get",payload:savedTodos})},[savedTodos])
    const handleSubmit = async event=>{
        event.preventDefault();
        if(editMode)
        {
            await axios.patch(endpoint+editToDo.id,{text:toDoText})
            dispatch({type:'edit',payload:{...editToDo,text:toDoText}})
            setEditMode(false);
            setEditToDo(null);
        }
        else
        {
            const newToDo = {id:uuidv4(),text:toDoText}
            const response = await axios.post(endpoint,newToDo)
            dispatch({type:'add',payload:newToDo})
        }
        setTodoText("")
    };
    return(
        <div>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Control
                 type="text" 
                 placeholder="Enter ToDo"
                 onChange={event=>setTodoText(event.target.value)}
                 value={toDoText}
                 />
                </Form.Group>
                <Button variant="primary" type="submit">{buttonTitle}</Button>
            </Form>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>To Do</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
         {
             state.todos.map(todo=>(
                 <tr key={todo.id}>
                     <td>{todo.text}</td>

                     <td onClick={()=>{
                         setTodoText(todo.text);
                         setEditMode(true)
                         setEditToDo(todo)
                     }}>
                        <Button variant="link">Edit</Button>
                     </td>

                     <td onClick={ async ()=> { 
                         await axios.delete(endpoint + todo.id)
                         dispatch({type:'delete',payload:todo})
                         }}>
                             <Button variant="link">Delete</Button>
                         </td>
                     </tr>
             ))
         }
        </tbody>
      </Table>
      </div>
    )
}
export default ToDoList;