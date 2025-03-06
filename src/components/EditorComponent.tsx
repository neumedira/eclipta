import React, { useRef, useEffect, useState } from 'react';
import JoditEditor from 'jodit-react';

interface EditorComponentProps {
  content: string;
  onContentChange: (content: string) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ content, onContentChange }) => {
    const editor = useRef<JoditEditor>(null);
    const [editorContent, setEditorContent] = useState(content || '');

    const config = React.useMemo(() => ({
        readonly: false,
        toolbarButtonSize: 'middle',
        removeButtons: ['file','video','spellcheck','speechRecognize','print','classSpan'],
        height: 300,
        uploader: {
            insertImageAsBase64URI: true,
        },
    }), []);

    const handleChange = (newContent: string) => {
        // Menambahkan style untuk <ol> dan <ul>
        const cleanedContent = newContent
            .replace(/<span[^>]*data-jodit-selection_marker[^>]*><\/span>/gi, '')
            .replace(/<ol([^>]*)>/gi, '<ol$1 style="list-style-type: decimal;padding-left: 30px;">')
            .replace(/<ul([^>]*)>/gi, '<ul$1 style="list-style-type: disc;padding-left: 30px;">');
        setEditorContent(cleanedContent);
        onContentChange(cleanedContent);
    };

    useEffect(() => {
        if (content !== editorContent) {
            setEditorContent(content || '');
        }
    }, [content]);

    return (
        <div>
            <JoditEditor
                ref={editor}
                value={editorContent}
                config={config}
                onBlur={handleChange}
            />

<style>{`
.jodit-wysiwyg ol {
    list-style-type: decimal;
    padding-left: 30px;
}
.jodit-wysiwyg ul {
    list-style-type: disc;
    padding-left: 30px;
}
`}</style>
        </div>
    );
};

export default EditorComponent;