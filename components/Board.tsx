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

  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
    getBoard();
  }, []);

  if (!hasMounted) return null;

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

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol = {
      id: startColIndex[0],
      todos: [...startColIndex[1].todos],
    };
    const finishCol = {
      id: finishColIndex[0],
      todos: [...finishColIndex[1].todos],
    };

    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol.id === finishCol.id) return;

    const [todoMoved] = startCol.todos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      startCol.todos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, startCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      finishCol.todos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, startCol);
      newColumns.set(finishCol.id, finishCol);
      updateTodoInDB(todoMoved, finishCol.id);
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
                <Column key={`${id}-${index}`} id={id} todos={column.todos} index={index} />

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
