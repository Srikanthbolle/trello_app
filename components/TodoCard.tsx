import React from "react";
import { Todo, TypedColumn } from "../typings";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/16/solid";

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
  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      ref={innerRef}
      {...draggableProps}
      {...draggableHandleProps}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button className="text-red-500 hover:text-red-500">
          <XCircleIcon className="ml-5 w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
