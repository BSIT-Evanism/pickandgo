import { saveStatus, wordCount } from "@/stores/editor";
import { useStore } from "@nanostores/react";
import { Badge } from "./ui/badge";

export const EditorBar = () => {
    const count = useStore(wordCount);
    const status = useStore(saveStatus);
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <Badge variant="outline">
                Words: {count}
            </Badge>
            <Badge variant="outline">
                {status ? 'Saved' : 'Saving...'}
            </Badge>
        </div>
    );
};
