import "@blocknote/core/fonts/inter.css";
import { words, debounce } from "lodash";
import { BlockNoteView } from "@blocknote/mantine";
import { useStore } from "@nanostores/react";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo } from "react";
import { BlockNoteEditor, type Block } from "@blocknote/core";
import { addWordCount, saveStatus, wordCount } from "@/stores/editor";

interface TextBlock {
    type: 'text';
    text: string;
    styles?: Record<string, any>;
}

interface ContentBlock {
    type: string;
    content?: string | TextBlock[];
}

const countWords = (content: ContentBlock[]): number => {
    return content.reduce((count, block) => {
        if (!block.content) return count;

        if (typeof block.content === 'string') {
            return count + words(block.content).length;
        }

        // Using a single reduce instead of filter + map + join
        return count + block.content.reduce((textCount, item) =>
            item.type === 'text' ? textCount + words(item.text).length : textCount
            , 0);
    }, 0);
};

const initialContent = [
    {
        type: "heading",
        content: "Start writing...",
    },
    {
        type: "paragraph",
    },
    {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "Your post will appear here.",
                styles: { bold: true },
            },
        ],
    },
    {
        type: "paragraph",
        content: [
            {
                type: "text",
                text: "start by typing '/' to see available blocks",
                styles: { italic: true, textColor: 'gray' },
            },
        ],
    },
]

export const AdvancedEditor = () => {
    const editor = useMemo(() => {
        return BlockNoteEditor.create({
            initialContent: initialContent as Block[]
        });
    }, [initialContent]);

    useEffect(() => {
        // Initial word count
        saveStatus.set(true);
        const blocks = editor.document;
        const count = countWords(blocks as ContentBlock[]);
        addWordCount(count);

        // Create debounced function for saving
        const debouncedSave = debounce(() => {
            saveStatus.set(true);
        }, 2000);

        // Single subscription to handle both word count and save status
        const unsubscribe = editor.onChange(() => {
            const blocks = editor.document;
            const count = countWords(blocks as ContentBlock[]);
            addWordCount(count);

            // Handle save status
            saveStatus.set(false);
            debouncedSave();
        });

        // Cleanup
        return () => {
            unsubscribe?.();
            debouncedSave.cancel();
        };
    }, [editor]);

    return <BlockNoteView theme="light" editor={editor} />;
}