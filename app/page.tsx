"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // Show loader

    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      const botMessage = { role: "assistant", content: response?.text?.() || "Error: No response" };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Internal Server Error. Please try again later." }]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="container flex h-16 items-center px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
        </div>
      </header>

      <main className="flex-1 container py-6 flex justify-center">
        <Card className="w-full max-w-5xl h-[85vh] flex flex-col shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white">Chat with AI Assistant</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <h3 className="text-lg font-medium">Welcome to AI Chatbot!</h3>
                <p className="mt-2">Start a conversation by typing a message below.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.role !== "user" && (
                      <Avatar>
                        <AvatarFallback className="bg-emerald-600 text-white">G</AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`rounded-lg px-4 py-2 text-sm shadow-md ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-gray-300 dark:bg-gray-600 px-1 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {message.role === "user" && (
                      <Avatar>
                        <AvatarFallback className="bg-gray-400 text-white">U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Dot Loader Effect */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-600 text-white">G</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm shadow-md">
                    <span className="dot-loader"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-4 bg-gray-100 dark:bg-gray-900 rounded-b-xl">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-gray-400 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" disabled={!input.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
