import React from "react";
import type { FarmActivity } from "@/db/schema";
import { useState, useEffect } from "react";


export const HeadlineSectionCarousel = ({ mainData }: { mainData: FarmActivity[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (progress >= 100) {
            setProgress(0);
            setCurrentIndex((prev) => (prev + 1) % mainData.length);
        }

        if (mainData.length > 1) {
            const interval = setInterval(() => {
                setProgress((prev) => prev + 2);
            }, 250);
            return () => clearInterval(interval);
        }
    }, [progress, mainData.length]);

    return (
        <>
            {mainData.length > 0 ? (
                <div className="relative">
                    {mainData.length > 1 && (
                        <div className="flex gap-2 absolute top-10 left-1/4 w-1/2">
                            {mainData.map((_, index) => (
                                <div
                                    key={index}
                                    className="flex-1 h-1 bg-gray-200"
                                >
                                    <div
                                        className="h-full bg-green-600 transition-all duration-100"
                                        style={{
                                            width: currentIndex === index ? `${progress}%` :
                                                index < currentIndex ? '100%' : '0%'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <MainHeadline key={mainData[currentIndex].id} mainData={mainData[currentIndex]} />
                </div>
            ) : (
                <section className="flex items-center justify-center py-10 text-white bg-white sm:py-16 md:py-24 lg:py-32">
                    <div className="relative max-w-3xl px-10 text-center auto lg:px-0">
                        <div className="p-8 rounded-lg border-4 border-yellow-400 bg-yellow-50">
                            <h1 className="text-6xl font-extrabold text-black mb-4">No recent activity</h1>
                            <p className="text-xl text-gray-600">There are currently no activities to display. Please check back later.</p>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};



export const MainHeadline = React.memo(({ mainData }: { mainData: FarmActivity }) => {
    const recentDescription = mainData.description?.find((block) => block.type === "paragraph")?.content || "No description available";

    return (
        <>
            <section
                className="flex items-center justify-center py-10 text-white bg-white sm:py-16 md:py-24 lg:py-32"
            >
                <div className="relative max-w-3xl px-10 text-center auto lg:px-0">
                    <div
                        className="flex flex-col w-full md:flex-row md:justify-between md:items-start"
                    >
                        <div className="flex flex-col min-h-full justify-between mr-5">
                            <h1
                                className="relative flex flex-col text-6xl text-left font-extrabold text-black"
                            >
                                <span>Recent</span>
                                <span>Activity</span>
                                <span style={{ viewTransitionName: `activity-name-${mainData.id}` }} className="text-green-600 mt-2"
                                >{mainData.name || "No name available"}</span
                                >
                            </h1>
                            <div className="text-sm my-4 text-gray-500">
                                <p>
                                    Published on {
                                        mainData.createdAt
                                            ? new Date(mainData.createdAt).toLocaleDateString()
                                            : "No date available"
                                    }
                                </p>
                            </div>
                            <a href={`/activities/${mainData.id}`} className="text-white bg-green-600 p-2 text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300 border-2 border-black">
                                Read more
                            </a>
                        </div>
                        <div className="md:w-1/2 lg:w-auto">
                            <img
                                style={{ viewTransitionName: `activity-image-${mainData.id}` }}
                                src={mainData.image || "https://placehold.co/600x400@2x.png"}
                                alt="Recent Activity"
                                loading="eager"
                                className="object-cover mt-3 rounded-lg h-64 md:h-80 lg:h-96 w-full md:w-auto"
                            />
                        </div>
                    </div>

                    <div className="my-8 md:my-12 lg:my-12 border-b border-gray-300"></div>

                    <h2 className="text-left text-gray-500 xl:text-xl">
                        <span className="text-green-600 px-2 py-1 text-xs rounded-md">Preview</span>
                        <br />
                        {recentDescription.slice(0, 100)}...
                    </h2>
                </div>
            </section>

        </>
    );
});

// Add display name for debugging purposes
MainHeadline.displayName = 'MainHeadline';
