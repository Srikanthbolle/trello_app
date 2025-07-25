import { create } from "zustand";
import { getTodosGroupedByColumn } from "../lib/getTodosGroupedByColumn";
import { Board, Column, Todo, TypedColumn } from "../typings";
import { database, storage } from "../appwrite";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput:string
  searchString: string;
  image:File | null;
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
}));