import { useState } from "react"
import { Signin } from "./Signin"
import Signup from "./Signup"
import { createPortal } from "react-dom"

export const ModalAuth = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<"signin" | "signup">("signin")

    return (
        <>
            <button className="font-medium leading-6 text-gray-600 hover:text-gray-900" onClick={() => setIsOpen(true)}>
                Sign in
            </button>
            {isOpen && createPortal(
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 top-0 left-0 flex justify-center items-center">
                    <button
                        className="absolute top-5 right-5 text-white p-1 rounded-md hover:text-gray-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg relative max-w-md w-full mx-4">
                        <div className="flex w-full border-b border-gray-200">
                            <button
                                className={`w-1/2 py-4 font-medium transition-colors ${mode === "signin" ? "text-gray-900 border-b-2 border-indigo-600" : "text-gray-600 hover:text-gray-900"}`}
                                onClick={() => setMode("signin")}
                            >
                                Sign in
                            </button>
                            <button
                                className={`w-1/2 py-4 font-medium transition-colors ${mode === "signup" ? "text-gray-900 border-b-2 border-indigo-600" : "text-gray-600 hover:text-gray-900"}`}
                                onClick={() => setMode("signup")}
                            >
                                Sign up
                            </button>
                        </div>
                        <a href="#_" className="flex items-center mt-10 mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0">
                            <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">Pick and Go<span className="text-indigo-600" data-primary="indigo-600">.</span></span>
                        </a>
                        {mode === "signin" ? <Signin /> : <Signup />}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}