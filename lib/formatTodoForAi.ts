import { Board, Todo, TypedColumn } from "../typings"

const formatTodoForAi=(board:Board)=>{
    const todos=Array.from(board.columns.entries());
    const flatArray = todos.reduce((map,[key,value])=>{
        map[key] =value.todos;
        return map
    },{} as { [key in TypedColumn]:Todo[]});
    //reduce to key:value(length)
    const flattedArrayCounted = Object.entries((flatArray).reduce(
        (map,[key,value])=>{
            map[key as TypedColumn] = value.length;
            return map;
        },
        {} as { [key in TypedColumn]:number}
    ))
return flattedArrayCounted;
}
export default formatTodoForAi;