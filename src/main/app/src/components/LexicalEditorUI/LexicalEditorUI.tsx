import { useState, useRef, useEffect } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $getRoot, EditorState } from 'lexical';

import { Container, EditorScroller, Editor } from './Components';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import EditorTheme from './themes/EditorTheme';
import { LEXICAL_NODES, isEditorState } from './utils';

interface LexicalEditorUIProps {
  value?: EditorState;
  onChange?: any;
  inputProps?: any;
  onFocus?: any;
  onBlur?: any;
  disabled?: boolean;
  hideHeaderSelect?: boolean;
}

const generateId = () =>
  `LexicalEditor__${Math.round(Math.random() * 10000).toString()}`;

const useId = () => {
  const ref = useRef<string>();

  if (!ref.current) {
    ref.current = generateId();
  }

  return ref.current;
};

/* We need this, so that when editor is updated in the fly,
   eg. when changing language, the state updates accordingly. */
const UpdatePlugin = ({ value }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (isEditorState(value) && !value.isEmpty()) {
      editor.setEditorState(value);
    } else {
      editor.update(() => {
        $getRoot().clear();
      });
    }
  }, [value, editor]);

  return null;
};

export const LexicalEditorUI = ({
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  disabled,
}: LexicalEditorUIProps) => {
  const editorId = useId();
  const config = {
    namespace: editorId,
    theme: EditorTheme,
    onError: error => {
      console.error(error);
    },
    nodes: LEXICAL_NODES,
    editorState: isEditorState(value) && !value.isEmpty() ? value : null,
  };

  const [hasFocus, setHasFocus] = useState(false);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <Container className="Editor__" hasFocus={hasFocus} disabled={disabled}>
      <LexicalComposer
        onFocus={() => {
          setHasFocus(true);
          onFocus();
        }}
        onBlur={() => {
          setHasFocus(false);
          onBlur();
        }}
        onChange={onChange}
        initialConfig={config}
      >
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <EditorScroller>
              <Editor ref={onRef}>
                <ContentEditable />
              </Editor>
            </EditorScroller>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <>
          {floatingAnchorElem && (
            <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
          )}
        </>
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
        <UpdatePlugin value={value} />
      </LexicalComposer>
    </Container>
  );
};
