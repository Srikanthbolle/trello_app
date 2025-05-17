"use client";
import React, { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useBoardStore } from "../Store/BoardStore";
import Column from "./Column";
import { TypedColumn, Column as ColumnType } from "../typings";

const Board = () => {
  const board = useBoardStore((state) => state.board);
  const getBoard = useBoardStore.getState().getBoard;
  const setBoardState = useBoardStore((state) => state.setBoardState);
  const updateTodoInDB = useBoardStore((state) => state.updateTodoInDB);



  useEffect(() => {
   
    getBoard();
  }, []);

  

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
  
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
      return;
    }
  
    const startCol = board.columns.get(source.droppableId as TypedColumn);
    const finishCol = board.columns.get(destination.droppableId as TypedColumn);
  
    if (!startCol || !finishCol) return;
  
    if (source.index === destination.index && source.droppableId === destination.droppableId)
      return;
  
    const newStartTodos = [...startCol.todos];
    const [movedTodo] = newStartTodos.splice(source.index, 1);
  
    if (source.droppableId === destination.droppableId) {
      newStartTodos.splice(destination.index, 0, movedTodo);
      const newCol = { ...startCol, todos: newStartTodos };
      const newColumns = new Map(board.columns);
      newColumns.set(source.droppableId as TypedColumn, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      const newFinishTodos = [...finishCol.todos];
      newFinishTodos.splice(destination.index, 0, movedTodo);
  
      const newColumns = new Map(board.columns);
      newColumns.set(source.droppableId as TypedColumn, {
        ...startCol,
        todos: newStartTodos,
      });
      newColumns.set(destination.droppableId as TypedColumn, {
        ...finishCol,
        todos: newFinishTodos,
      });
  
      updateTodoInDB(movedTodo, destination.droppableId as TypedColumn);
      setBoardState({ ...board, columns: newColumns });
    }
  };
  

  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column" isDropDisabled={false} isCombineEnabled ={true} ignoreContainerClipping={true}>
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column key={id} id={id} todos={column.todos} index={index} />

              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
