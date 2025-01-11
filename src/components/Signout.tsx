import { authClient } from "@/lib/auth-client"

export const Signout = () => {
    const handleSignout = async () => {
        const { data, error } = await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/";
                }
            }
        })
    }
    return <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleSignout}>Signout</button>
}