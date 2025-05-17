import React, { useEffect, useState } from "react";
import { Todo, TypedColumn } from "../typings";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { useBoardStore } from "../Store/BoardStore";
import getUrl from "../lib/getUrl";
import Image from "next/image";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: any;
  draggableHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  draggableHandleProps,
}: Props) => {
    const deleteTask=useBoardStore((state)=>state.deleteTask)
    const [imageUrl,setImageUrl] =useState<string | null>(null)
    useEffect(()=>{
      if (todo.image){
        const fetchImage=async()=>{
          const url=await getUrl(todo.image!);
          if (url){
            setImageUrl(url.toString())
          }
        }
        fetchImage()
      }
    },[todo])

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      ref={innerRef}
      {...draggableProps}
      {...draggableHandleProps}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button onClick={()=>deleteTask(index,todo,id)} className="text-red-500 hover:text-red-500">
          <XCircleIcon className="ml-5 w-8 h-8" />
        </button>
      </div>
      {/* Add image */}
      {
        imageUrl && (
          <div className="w-full h-full rounded-b-md">
            <Image 
            src={imageUrl}
            alt="Task Image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
            />
          </div>
        )
      }
    </div>
  );
};

export default TodoCard;
