import { Board } from "../typings";
import formatTodoForAi from "./formatTodoForAi";

const fetchSuggetion=async(board:Board)=>{
    const todos= formatTodoForAi(board);
    const res=await fetch("/api/generateSummary",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({todos}),
    })
    const GPTdata= await res.json();
    const {content} =GPTdata
    return content;
}

export default fetchSuggetion;