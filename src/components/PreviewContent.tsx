import { contentStore, setContent } from "@/stores/content"
import { actions } from "astro:actions"
import { useStore } from "better-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"

type ContentBlock = {
    id: string
    type: "heading" | "paragraph" | "list" | "link" | "image"
    content: string
}

export const PreviewContent = ({ activityId, initialContent, name, imageLink, activeState }: { activityId: string, initialContent: ContentBlock[] | undefined, name: string, imageLink: string, activeState: boolean }) => {

    const content = useStore(contentStore)
    const [tab, setTab] = useState<"preview" | "edit">("preview")
    const [image, setImage] = useState<string>(imageLink)
    const [activityName, setActivityName] = useState<string>(name)
    const [loadingState, setLoadingState] = useState<boolean>(false)
    const [active, setActive] = useState<boolean>(activeState)

    useEffect(() => {
        if (initialContent) {
            setContent(initialContent)
        }
    }, [initialContent])

    async function saveContent() {
        setLoadingState(true)
        try {
            const response = actions.admin.updateFarmActivity({
                id: activityId,
                description: content
            })

            toast.promise(response, {
                loading: "Saving content...",
                success: () => {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                    setLoadingState(false)
                    return "Content saved!"
                },
                error: "Failed to save content"
            })
        } catch (e) {
            console.error(e)
        }
    }

    async function saveDetails() {
        setLoadingState(true)
        try {

            const { data, error } = await actions.admin.editFarmActivity({
                id: activityId,
                name: activityName,
                image: image,
                active: active
            })

            if (error) {
                toast.error(error.message)
                setLoadingState(false)
                return
            }

            toast.success("Activity details saved")
            setLoadingState(false)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (e) {
            console.error(e)
            toast.error("Failed to save activity details")
            setLoadingState(false)
        }
    }


    const renderBlock = (block: ContentBlock) => {
        switch (block.type) {
            case 'heading':
                return <h2 className="text-2xl font-bold">{block.content}</h2>
            case 'paragraph':
                return <p className="whitespace-pre-wrap">{block.content}</p>
            case 'list':
                return <div className="whitespace-pre-wrap">{block.content}</div>
            case 'link':
                return <a href={block.content} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{block.content}</a>
            case 'image':
                return <img src={block.content || 'https://placehold.co/600x400'} alt="Content" className="rounded-md max-w-full h-auto" />
            default:
                return null
        }
    }

    return (
        <div className="rounded-lg w-full h-[60%] mt-2 bg-slate-50 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Content Preview</h2>

            </div>
            <div className="flex justify-between items-center mb-4 gap-2 bg-slate-200 rounded-lg p-2">
                <button className={cn("w-full rounded-lg p-2", tab === "preview" && "bg-slate-500 text-slate-50")} onClick={() => setTab("preview")}>Preview</button>
                <button className={cn("w-full rounded-lg p-2", tab === "edit" && "bg-slate-500 text-slate-50")} onClick={() => setTab("edit")}>Edit</button>
            </div>
            {tab === "preview" && (
                <>
                    <div className="space-y-4 overflow-y-auto bg-slate-100 rounded-lg p-3 max-h-full">
                        {content.map((block) => (
                            <div key={block.id} className="p-3 ">
                                {renderBlock(block)}
                            </div>
                        ))}
                        {content.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No content to preview
                            </div>
                        )}
                    </div>
                    <Button className="mt-4 w-full" onClick={saveContent} disabled={loadingState}>{loadingState ? "Saving..." : "Save"}</Button>
                </>

            )}
            {tab === "edit" && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>Name</Label>
                        <Input required value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="Name" name="name" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Image</Label>
                        <Input required value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image" name="image" />
                        {image && /^https?:\/\//.test(image) ?
                            <img src={image} alt="Image" className="rounded-md max-w-full h-auto" />
                            :
                            <div className="rounded-md max-w-full h-auto p-4 bg-slate-200 flex items-center justify-center">
                                <p className="text-gray-500">No image selected</p>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>Active</Label>
                        <Switch checked={active} onCheckedChange={(e) => {
                            setActive(e.valueOf())
                        }} />
                    </div>
                    <Button onClick={saveDetails} className="mt-4 w-full" disabled={loadingState}>{loadingState ? "Saving..." : "Save"}</Button>
                </div>
            )}
        </div>
    )
}