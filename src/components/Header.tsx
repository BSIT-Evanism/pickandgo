import { ModalAuth } from "./ModalAuth"
import { Signout } from "./Signout"



export const MainHeader = ({ session }: { session: any }) => {
    return (
        <div className="flex shadow-md justify-between p-4">
            <a href="/" className="text-2xl font-bold">Logo</a>
            {session ? <Signout /> : <ModalAuth />}
        </div>
    )
}