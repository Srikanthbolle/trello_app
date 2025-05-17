import { create } from "zustand";
import { getTodosGroupedByColumn } from "../lib/getTodosGroupedByColumn";
import { Board, Column, Todo, TypedColumn } from "../typings";
import { database, ID, storage } from "../appwrite";
import uploadImage from "../lib/uploadImage";
import { title } from "process";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput:string
  searchString: string;
  image:File | null;
  addTask:(todo:string,columnId:TypedColumn,image?:File | null)=> void;
  setImage:(image:File | null)=>void;
  newTaskType:TypedColumn;
  setNewTaskType:(columnId:TypedColumn)=>void;
  setSearchString: (searchString: string) => void;
  setNewTaskInput:(input:string)=>void;
  deleteTask:(taskIndex:number,todoId:Todo,id:TypedColumn)=>void;
}

export const useBoardStore = create<BoardState>((set,get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  newTaskInput:"",
  image:null,
  newTaskType:'todo',
  setSearchString: (searchString) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  deleteTask:async(taskIndex:number,todo:Todo,id:TypedColumn)=>{
    const newColumns = new Map(get().board.columns)
    // delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex,1)
    set({board:{columns:newColumns}})
    if(todo.image){
        await storage.deleteFile(todo.image?.bucketId,todo.image?.fileId)
    }
  },
  setNewTaskInput:(input:string)=>set({newTaskInput:input}),
  setNewTaskType:(columnId:TypedColumn)=>set({newTaskType:columnId}),
  setImage:(image:File | null)=>set({image}),
  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      }
    );
  },
  addTask:async(todo:string,columnId:TypedColumn,image?:File | null)=> {
    let file:Image | undefined;
    if (Image){
      const fileUploaded= await uploadImage(image);
      if (fileUploaded){
        file={
          bucketId:fileUploaded.bucketId,
          fileId:fileUploaded.$id,
        }
        
      };
    }
   const {$id}= await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title:todo,
        status:columnId,
        ...(file && {image:JSON.stringify(file)}),
      }
    )
    set({newTaskInput:""});
    set((state)=>{
      const newColumns=new Map(state.board.columns);
      const newTodo:Todo={
        $id,
        $createdAt:new Date().toDateString(),
        title:todo,
        status:columnId,
        ...(file && {image:file}),
      }
      const column=newColumns.get(columnId);
      if (!column){
        newColumns.set(columnId,{
          id:columnId,
          todos:[newTodo],

        })
      }else{
        newColumns.get(columnId)?.todos.push(newTodo)
      }
      return {
        board:{
          columns:newColumns,
        }
      }
    })
  }
 
}));