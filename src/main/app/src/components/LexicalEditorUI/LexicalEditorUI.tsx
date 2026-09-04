import { useState, useRef, useEffect, useId } from 'react';

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

// Tämä synkka on OHJELMALLINEN, ei käyttäjän muokkaus, eikä siitä siksi saa lähteä
// onChangea. OnChangePlugin ohittaa history-merge-tagilla merkityt päivitykset
// (ignoreHistoryMergeTagChange on oletuksena true), joten tagi on se kytkin.
//
// Ilman tätä kielivälilehden vaihto TUHOAA sen kielen tekstin, jolta poistutaan.
// Mitattu lomakkeen tilasta, kuvaus fi="AAA suomeksi" sv="BBB ruotsiksi":
//
//   fi -> sv vaihdon jälkeen   fi="BBB ruotsiksi"  sv="BBB ruotsiksi"
//
// Ketju: välilehden vaihto muuttaa Fieldin name-propin (kuvaus.fi -> kuvaus.sv),
// tämä efekti ajaa setEditorStaten, se laukaisee OnChangePluginin, ja onChange on
// react-final-formin input.onChange. Se rakennetaan useConstantCallbackilla, jonka
// ref.current päivitetään EFEKTISSÄ - ja React ajaa lapsen efektit ennen vanhemman,
// joten tämä plugin ehtii kirjoittaa ennen kuin sulkeuma on päivitetty. Kirjoitus
// menee siis edellisen renderin nimeen eli väärälle kielelle.
//
// Vika ei näy koskemattomassa kentässä, koska kirjasto palauttaa alkuarvon takaisin
// kentän rekisteröityessä uudelleen. Juuri siksi tuhoutuu nimenomaan käyttäjän oma
// muokkaus: sitä ei ole alkuarvossa palautettavaksi.
//
// Sama kuvio kuin isInitialMount-vartijassa alla; se suojasi vain mountin, tämä
// suojaa päivityspolun. redux-formilla ongelmaa ei ollut, koska sen käsittelijä luki
// kentän nimen vasta kutsuhetkellä.
const HISTORY_MERGE = { tag: 'history-merge' };

/* We need this, so that when editor is updated in the fly,
   eg. when changing language, the state updates accordingly. */
const UpdatePlugin = ({ value }: { value?: EditorState }) => {
  const [editor] = useLexicalComposerContext();
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the initial mount to avoid triggering onChange during setup
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (value) {
      // If the update was done by lexical internally the editorstate object identity remains the same -> no need to reset the editor state
      if (value !== editor.getEditorState()) {
        editor.setEditorState(value, HISTORY_MERGE);
      }
    } else {
      editor.update(() => {
        $getRoot().clear();
      }, HISTORY_MERGE);
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
  const id = useId();
  const editorId = `LexicalEditor__${id}`;

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
      <LexicalComposer initialConfig={config}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <EditorScroller>
              <Editor ref={onRef}>
                <ContentEditable
                  onFocus={() => {
                    setHasFocus(true);
                    onFocus();
                  }}
                  onBlur={() => {
                    setHasFocus(false);
                    onBlur();
                  }}
                />
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
        <OnChangePlugin onChange={onChange} ignoreSelectionChange />
        <UpdatePlugin value={value} />
      </LexicalComposer>
    </Container>
  );
};
