import { ModalAuth } from "./ModalAuth"
import { Signout } from "./Signout"



export const MainHeader = ({ role, pathname }: { role: string | null, pathname: string }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50">
            <a href="/" className="text-2xl font-bold hover:text-slate-700 transition-colors">Logo</a>
            <div className="bg-slate-100 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <a href="/" className="hover:text-slate-900">Home</a>
                    {pathname !== '/' && pathname.split('/').filter(Boolean).map((segment, index, array) => {
                        const path = '/' + array.slice(0, index + 1).join('/')
                        return (
                            <div key={path} className="flex items-center gap-2">
                                <span>/</span>
                                <a href={path} style={{
                                    viewTransitionName: segment + index
                                }} className="hover:text-slate-900 capitalize">
                                    {segment}
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
            <nav className="flex items-center gap-6">
                <div className="flex bg-slate-100 rounded-lg p-2 gap-8">
                    <a href="/" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/' ? 'text-slate-900 underline' : ''}`}>Home</a>
                    <a href="/tickets" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/tickets' ? 'text-slate-900 underline' : ''}`}>Tickets</a>
                    <a href="/news" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/news' ? 'text-slate-900 underline' : ''}`}>News</a>
                    {role === 'admin' && (
                        <>
                            <a href="/admin" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/admin' ? 'text-slate-900 underline' : ''}`}>Admin</a>
                            <a href="/grid" className={`text-slate-600 hover:text-slate-900 transition-colors ${pathname === '/grid' ? 'text-slate-900 underline' : ''}`}>Grid</a>
                        </>
                    )}
                </div>
                <div className="ml-4">
                    {role !== null ? <Signout /> : <ModalAuth />}
                </div>
            </nav>
        </div>
    )
}