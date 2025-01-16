import { BlockNoteView } from "@blocknote/mantine"
import type { Block } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"


export const ViewerComponent = ({ document }: { document: Block[] }) => {

    const viewer = useCreateBlockNote({
        initialContent: document
    })

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-50 p-8 prose prose-slate prose-lg">
            <BlockNoteView
                theme="light"
                editable={false}
                editor={viewer}
                className="min-h-[50vh]"
            />
        </div>
    )
}