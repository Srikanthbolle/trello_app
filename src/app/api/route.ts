import { NextResponse } from "next/server";
import openai from "../../../openai";
import { stringify } from "querystring";
export async function POST(request:Request) {
    // todos in the body of the post req 
    const {todos} = await request.json();

    // communicate with openAI GPT
    const response = await openai.createChatCompletion({
        model: "gpt-4.1",
        temperature:0.8,
        n:1,
        stream:false,
        messages:[
            {
                role:'system',
                content:`when responding, welcome the user always as Mr.Srikanth  and say welcome to PAPAFAM to the Todo App! limit the response  to 200 character`,
            },
            {
                role: 'user',
                content:`always summarize responses in less than 3 sentences and end with 'Let me know if you need anything else, Mr.Srikanth:${JSON.stringify(todos)}`,
              },
        ]
    })
    const {data}=response;
    return NextResponse.json(data.choices[0].message)
}