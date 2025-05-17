import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo, TypedColumn } from "../typings";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import TodoCard from "./TodoCard";
import { useBoardStore } from "../Store/BoardStore";
import { useModalStore } from "../Store/ModalStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const idToColumnText: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, todos, index }: Props) => {
  const searchString = useBoardStore((state) => state.searchString);
  const setNewTaskType=useBoardStore((state)=>state.setNewTaskType)
  const openModal=useModalStore((state)=>state.openModal)
  const handleAddTodo=()=>{
    setNewTaskType(id)
    openModal()
  }

  return (
    
    <div className="bg-gray-100 rounded-md p-2 shadow-md">
      <h2 className="font-bold flex justify-between text-xl p-2">
        {idToColumnText[id]}
        <span className="text-gray-500 bg-gray-200 rounded-full px-2 py-2 text-sm font-normal">
          {!searchString
            ? todos.length
            : todos.filter((todo) =>
                todo.title.toLowerCase().includes(searchString.toLowerCase())
              ).length}
        </span>
      </h2>
      

      <Droppable key={id} droppableId={id}  type="task" isDropDisabled ={false} isCombineEnabled={true} ignoreContainerClipping={true}>
  {(provided) => (
    <div
      className="space-y-2"
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
            {
                    todos.map((todo,index)=>{
                      if (searchString && !todo.title.toLowerCase().includes(searchString.toLowerCase())) return null
                      return (
<Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                      >
                        {
                          (provided)=>(
                            <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            draggableHandleProps={provided.dragHandleProps}
                            />
                          )
                        }
                      </Draggable>
                      )
                      
})
                  }
      {provided.placeholder}

      <div className="flex items-end justify-end p-2">
        <button
          onClick={handleAddTodo}
          className="text-green-500 hover:text-green-600"
        >
          <PlusCircleIcon className="w-10 h-10" />
        </button>
      </div>
    </div>
  )}
</Droppable>

    </div>
  );
};

export default Column;
