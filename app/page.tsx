'use client'

import BlackjackGame from "@/components/BlackjackGame";


export default function Home() {
  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center p-4">
      <BlackjackGame />
    </div>
  )
}