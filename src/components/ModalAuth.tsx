import { useState } from "react"
import { Signin } from "./Signin"
import Signup from "./Signup"



export const ModalAuth = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"signin" | "signup">("signin")

    return (
        <>
            <button className="hover:bg-slate-200 p-2 rounded-md hover:underline" onClick={() => setIsOpen(true)}>
                Signin / Signup
            </button>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center ${isOpen ? "block" : "hidden"}`}>
                <button className="absolute top-5 right-5 bg-red-400 text-white p-1 rounded-md -z-20" onClick={() => setIsOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-lg relative">
                    <div className="flex w-full min-h-10 z-30 justify-center">
                        <button className={`w-1/2 ${mode === "signin" ? "bg-black text-white" : "bg-white text-black"}`} onClick={() => setMode("signin")}>Signin</button>
                        <button className={`w-1/2 ${mode === "signup" ? "bg-black text-white" : "bg-white text-black"}`} onClick={() => setMode("signup")}>Signup</button>
                    </div>
                    {mode === "signin" ? <Signin /> : <Signup />}
                </div>
            </div>
        </>
    )
}