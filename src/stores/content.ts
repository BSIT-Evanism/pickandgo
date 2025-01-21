import { atom } from "nanostores";

type ContentBlock = {
    id: string
    type: "heading" | "paragraph" | "list" | "link" | "image"
    content: string
}

export const contentStore = atom<ContentBlock[]>([])

export const setContent = (blocks: ContentBlock[]) => {
    contentStore.set(blocks)
}