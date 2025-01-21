import { authClient } from "@/lib/auth-client"
import { Input } from "./ui/input"
import { useState } from "react"
import { Button } from "./ui/button"




export const EditProfile = () => {

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [error, setError] = useState("")

    async function handleChangePass() {
        const { data, error } = await authClient.changePassword({
            currentPassword: currentPassword,
            newPassword: newPassword,
        })
        if (error) {
            console.log(error)
            setError(error?.message || "An error occurred" as string)
        } else {
            console.log(data)
            setError("")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-8">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="mt-2 text-gray-600">Update your account settings</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <Input
                                id="current-password"
                                type="password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <Button
                            onClick={handleChangePass}
                            className="w-full mt-6"
                        >
                            Update Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}