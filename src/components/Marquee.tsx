import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"

export const MarqueeComponent = ({ feed }: { feed: any }) => {
    const [news] = useState([
        "Recent Activity: " + (feed?.activity?.name || ""),
        "Upcoming Event: " + (feed?.event?.name || ""),
        "Promotion: " + (feed?.promotion?.name || ""),
    ])

    return (
        <div className="bg-black text-white py-2 overflow-hidden relative">
            <Marquee>
                <div className="flex justify-evenly w-full">
                    {news.map((item, index) => (
                        <span key={index} className="mx-4">
                            {item}
                            <span className="mx-4">•</span>
                        </span>
                    ))}
                </div>
            </Marquee>
        </div>
    )
}
