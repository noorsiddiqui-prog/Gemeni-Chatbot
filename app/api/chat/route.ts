// import { GoogleGenerativeAI } from "@google/generative-ai"
// import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai-sdk"
// import { NextResponse } from "next/server"

// const genAI = new GoogleGenerativeAI("AIzaSyC9FGy84ZZdECjjtGvO3OFe3_tDSr9sgQM")

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json()

//     if (!messages || messages.length === 0) {
//       return NextResponse.json({ error: "No messages found" }, { status: 400 })
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
//     const chat = model.startChat()
//     const result = await chat.sendMessageStream(messages[messages.length - 1].content)
    
//     const stream = GoogleGenerativeAIStream(result)
//     return new StreamingTextResponse(stream)
    
//   } catch (error) {
//     console.error("Chat API Error:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }
