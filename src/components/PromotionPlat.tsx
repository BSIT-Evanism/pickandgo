import { actions } from "astro:actions"
import { navigate } from "astro:transitions/client"



export const PromotionPlat = ({ promotion, open }: { promotion: any, open: boolean }) => {

    async function closePromotion() {
        try {
            const { data, error } = await actions.closePromotion()
            if (data?.success) {
                navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative space-y-10">
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={closePromotion}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close promotion"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <a href="/" className="flex items-center mb-5 font-medium my-10 text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0">
                        <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">Pick and Go<span className="text-indigo-600" data-primary="indigo-600">.</span></span>
                    </a>

                    <h2 className="text-5xl font-bold text-center mb-4 leading-relaxed "><span className="text-slate-400 text-xl">Recent Promotion:</span><br /> {promotion?.name}</h2>

                    <div className="text-center mb-6 text-lg p-2 rounded-lg bg-slate-100">
                        <p className="text-lg mb-2 opacity-70">{promotion?.description}</p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={closePromotion}
                            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Continue to Site
                        </button>
                    </div>
                </div>
            </div>
        )
    )
}
