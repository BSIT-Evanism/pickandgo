import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { GripVertical, Plus, X } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { contentStore, setContent } from "@/stores/content"
import { useStore } from "@nanostores/react"

type ContentBlock = {
    id: string
    type: "heading" | "paragraph" | "list" | "link" | "image"
    content: string
}

export const ContentEditor = ({ initialContent }: { initialContent: ContentBlock[] }) => {

    const content = useStore(contentStore)

    const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent || [])
    const [draggedItem, setDraggedItem] = useState<number | null>(null)
    const [dragOverItem, setDragOverItem] = useState<number | null>(null)

    const updateContent = useCallback(() => {
        setContent(blocks)
    }, [blocks])

    useEffect(() => {
        updateContent()
    }, [updateContent])


    const addBlock = (type: ContentBlock['type']) => {
        const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            type,
            content: type === 'list' ? '• ' : ''
        }
        setBlocks([...blocks, newBlock])

        // Set focus after adding a list block
        if (type === 'list') {
            requestAnimationFrame(() => {
                const textareas = document.querySelectorAll('textarea');
                const lastTextarea = textareas[textareas.length - 1];
                if (lastTextarea) {
                    lastTextarea.focus();
                    lastTextarea.setSelectionRange(2, 2); // Position cursor after "• "
                }
            });
        }
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id))
    }

    const updateBlockContent = (id: string, content: string) => {
        setBlocks(blocks.map(block =>
            block.id === id ? { ...block, content } : block
        ))
    }

    const handleDragStart = (index: number) => {
        setDraggedItem(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverItem(index)
    }

    const handleDragEnd = () => {
        if (draggedItem === null || dragOverItem === null) return

        const newBlocks = [...blocks]
        const draggedBlock = newBlocks[draggedItem]
        newBlocks.splice(draggedItem, 1)
        newBlocks.splice(dragOverItem, 0, draggedBlock)

        setBlocks(newBlocks)
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const renderBlock = (block: ContentBlock) => {
        switch (block.type) {
            case 'heading':
                return (
                    <input
                        type="text"
                        className="w-full text-2xl font-bold border-none focus:outline-none bg-transparent"
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        placeholder="Heading"
                    />
                )
            case 'paragraph':
                return (
                    <textarea
                        className="w-full min-h-[100px] border-none focus:outline-none bg-transparent resize-none"
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        placeholder="Type your paragraph here..."
                    />
                )
            case 'list':
                return (
                    <textarea
                        className="w-full min-h-[100px] border-none focus:outline-none bg-transparent resize-none"
                        value={block.content}
                        onChange={(e) => {
                            const value = e.target.value;
                            const lastChar = value[value.length - 1];

                            // If user just pressed enter (new line)
                            if (lastChar === '\n') {
                                // Add bullet point to the new line if the previous line wasn't empty
                                const lines = value.split('\n');
                                const previousLine = lines[lines.length - 2];

                                if (previousLine.trim() !== '') {
                                    const newValue = value + '• ';
                                    updateBlockContent(block.id, newValue);

                                    // Set cursor position after bullet point
                                    requestAnimationFrame(() => {
                                        const textarea = e.target;
                                        const position = value.length + 2; // +2 to place cursor after "• "
                                        textarea.setSelectionRange(position, position);
                                    });
                                    return;
                                }
                            }

                            updateBlockContent(block.id, value);
                        }}
                        placeholder="• List item (one per line)"
                    />
                )
            case 'link':
                return (
                    <input
                        type="text"
                        className="w-full text-sm border-none focus:outline-none bg-transparent"
                        value={block.content}
                        onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        placeholder="Link"
                    />
                )
            case 'image':
                return (
                    <div className="flex items-center h-24 gap-2">
                        <input
                            type="text"
                            className="w-full text-sm border-none focus:outline-none bg-transparent"
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                            placeholder="Image URL"
                        />
                        <img src={block.content ? block.content : 'https://placehold.co/600x400'} alt="Image" className=" w-24 h-24 rounded-md" />
                    </div>
                )

            // Add other block types as needed
            default:
                return null
        }
    }

    return (
        <div className="rounded-lg w-full h-full bg-slate-50 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Content Editor</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Block
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => addBlock('heading')}>
                            Heading
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addBlock('paragraph')}>
                            Paragraph
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addBlock('list')}>
                            List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addBlock('link')}>
                            Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addBlock('image')}>
                            Image
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2">
                {blocks.map((block, index) => (
                    <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-start bg-slate-200 gap-2 p-3 rounded-lg group relative
                            ${dragOverItem === index ? 'border-t-2 border-blue-500' : ''}
                            ${draggedItem === index ? 'opacity-50' : ''}
                            hover:bg-gray-100 transition-colors`}
                    >
                        <div className="mt-2 cursor-move">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            {renderBlock(block)}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                            onClick={() => removeBlock(block.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {blocks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    Add a block to get started
                </div>
            )}
        </div>
    )
}