import YooptaEditor, { createYooptaEditor, type YooptaContentValue, type YooptaEventChangePayload, type YooptaOnChangeOptions } from '@yoopta/editor';
import { useState, useMemo, useRef, useEffect } from 'react';
import ParagraphCommands from '@yoopta/paragraph'
import BlockquoteCommands from '@yoopta/blockquote'
import Embed from '@yoopta/embed';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

const plugins = [
    ParagraphCommands,
    BlockquoteCommands,
    Table,
    Divider.extend({
        elementProps: {
            divider: (props) => ({
                ...props,
                color: '#007aff',
            }),
        },
    }),
    Accordion,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Callout,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
    Link,
    Embed
];

const tools = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar,
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool,
    },
}

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const initValue: YooptaContentValue = {
    'id-1': {
        id: 'id-1',
        type: 'HeadingOne',
        meta: {
            order: 0,
            depth: 0,
        },
        value: [
            {
                id: 'heading-element-id',
                type: 'heading-one',
                children: [
                    {
                        text: 'Start writing...',
                    },
                ],
                props: {
                    nodeType: 'block',
                },
            },
        ],
    },
    'id-2': {
        id: 'id-2',
        type: 'Paragraph',
        meta: {
            order: 1,
            depth: 0,
        },
        value: [
            {
                text: 'You can use / to show block options',
            },
        ],
    },
}

export default function Editor() {
    const editor = useMemo(() => createYooptaEditor(), []);
    const [value, setValue] = useState<YooptaContentValue>(initValue);
    const [countdown, setCountdown] = useState(60);
    const selectionRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    handleChange();
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const onChange = (value: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(value);
    };

    function handleChange() {
        console.log('DATA ON CHANGE', editor.getEditorValue());
    }

    return (
        <div
            className='max-w-[40vw] w-full'
            ref={selectionRef}
        >
            <div className='bg-blue-500 text-white p-2 rounded-md absolute top-4 right-4' >
                Auto Saving in {countdown} seconds
            </div>
            <YooptaEditor
                autoFocus
                placeholder='Write something...'
                editor={editor}
                tools={tools}
                // @ts-ignore
                plugins={plugins}
                marks={MARKS}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}