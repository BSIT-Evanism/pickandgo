import { ModalAuth } from "./ModalAuth"
import { Signout } from "./Signout"
import { Button } from "./ui/button"



export const MainHeader = ({ role, pathname }: { role: string | null, pathname: string }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50">
            <a href="/" className="text-2xl font-bold hover:text-slate-700 transition-colors">Logo</a>
            <nav className="flex items-center gap-6">
                <div className="flex gap-8">
                    <a href="/" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/' ? 'text-slate-900 underline' : ''}`}>Home</a>
                    <a href="/about" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/about' ? 'text-slate-900 underline' : ''}`}>About</a>
                    <a href="/news" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/news' ? 'text-slate-900 underline' : ''}`}>News</a>
                    {role === 'admin' && <a href="/admin" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/admin' ? 'text-slate-900 underline' : ''}`}>Admin</a>}
                </div>
                <div className="ml-4">
                    {role !== null ? <Signout /> : <ModalAuth />}
                </div>
            </nav>
        </div>
    )
}