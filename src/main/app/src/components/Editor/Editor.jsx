import 'draft-js/dist/Draft.css';

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

import styled, { css } from 'styled-components';
import { setLightness } from 'polished';

import {
  Editor as DraftEditor,
  EditorState as DraftEditorState,
  RichUtils,
} from 'draft-js';

import { spacing, getThemeProp } from '../../theme';
import Icon from '../Icon';
import Select from '../Select';
import Dropdown, { DropdownMenu } from '../Dropdown';
import Input from '../Input';
import Flex, { FlexItem } from '../Flex';
import Button from '../Button';
import createEmptyEditorState from '../../utils/draft/createEmptyEditorState';

import {
  getBlockType,
  inlineIsActive,
  blockIsActive,
  getSelectionLinkUrl,
} from './utils';

const Container = styled.div`
  border: 1px solid ${getThemeProp('colors.inputBorder')};
  border-radius: ${getThemeProp('shape.borderRadius')};
  background-color: white;
  box-shadow: 0 0 0 0 transparent;
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: ${getThemeProp('colors.primary.main')};
  }

  ${({ hasFocus }) =>
    hasFocus &&
    css`
      border-color: ${getThemeProp('colors.primary.main')};
      box-shadow: 0 0 0 3px ${getThemeProp('colors.primary.focusOutline')};
    `}
`;

const EditorWrapper = styled.div`
  padding: ${spacing(1)};
  ${getThemeProp('typography.body')};
`;

const EditorContent = styled.div`
  max-height: 250px;
  overflow-y: auto;
`;

const Toolbar = styled.div`
  padding: ${spacing(1)};
  border-bottom: 1px solid ${getThemeProp('colors.inputBorder')};
  display: flex;
  align-items: center;
`;

const StyleIcon = styled(Icon)`
  color: ${getThemeProp('palette.text.primary')};
  font-size: 1.4rem;
`;

const StyleButtonBase = styled.button.attrs({ type: 'button' })`
  line-height: ${getThemeProp('typography.lineHeight')};
  background-color: transparent;
  transition: background-color 0.25s;
  border: 0px none;
  border-radius: ${getThemeProp('shape.borderRadius')};
  width: 2.2rem;
  height: 2.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      setLightness(0.9, theme.palette.text.primary)};
  }

  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) =>
        setLightness(0.9, theme.palette.text.primary)};
    `}
`;

const HeaderSelectContainer = styled.div`
  margin-left: ${spacing(1)};
  width: 15rem;
`;

const LinkDropdownContainer = styled.div`
  padding: ${spacing(1)};
  width: 20rem;
`;

const focusRef = ref => {
  setTimeout(() => {
    ref && ref.current && ref.current.focus();
  }, 100);
};

const StyleButton = ({
  icon,
  styleName,
  onChange,
  editorState,
  inline,
  block,
  editorRef,
  ...props
}) => {
  const onSelect = useCallback(() => {
    if (inline) {
      onChange(RichUtils.toggleInlineStyle(editorState, styleName));
    } else if (block) {
      onChange(RichUtils.toggleBlockType(editorState, styleName));
    }

    focusRef(editorRef);
  }, [editorState, onChange, inline, block, editorRef, styleName]);

  const isActive = useMemo(() => {
    if (inline) {
      return inlineIsActive({ editorState, styleName });
    } else if (block) {
      return blockIsActive({ editorState, styleName });
    }

    return false;
  }, [editorState, styleName, inline, block]);

  return (
    <StyleButtonBase
      tabIndex="-1"
      onClick={onSelect}
      active={isActive}
      {...props}
    >
      <StyleIcon type={icon} />
    </StyleButtonBase>
  );
};

const HEADER_OPTIONS = [
  { value: 'unstyled', label: 'Normaali teksti' },
  { value: 'header-one', label: 'Otsikko 1' },
  { value: 'header-two', label: 'Otsikko 2' },
  { value: 'header-three', label: 'Otsikko 3' },
];

const HeaderSelect = ({ editorState, onChange, editorRef }) => {
  const onSelect = useCallback(
    ({ value }) => {
      onChange(RichUtils.toggleBlockType(editorState, value));
      focusRef(editorRef);
    },
    [onChange, editorState, editorRef],
  );

  const value = useMemo(() => {
    return getBlockType(editorState);
  }, [editorState]);

  return (
    <HeaderSelectContainer>
      <Select
        tabIndex="-1"
        options={HEADER_OPTIONS}
        value={{ value }}
        onChange={onSelect}
        menuPortalTarget={document.body}
        isClearable={false}
      />
    </HeaderSelectContainer>
  );
};

const LinkDropdown = ({ value, onChange, onSubmit }) => {
  const inputRef = useRef();

  useEffect(() => {
    focusRef(inputRef);
  }, []);

  return (
    <LinkDropdownContainer>
      <Flex>
        <FlexItem grow={1} paddingRight={1}>
          <Input
            placeholder="https://..."
            value={value}
            onChange={onChange}
            ref={inputRef}
          />
        </FlexItem>
        <FlexItem grow={0}>
          <Button type="button" onClick={onSubmit}>
            Lisää
          </Button>
        </FlexItem>
      </Flex>
    </LinkDropdownContainer>
  );
};

const LinkButton = ({ editorState, onChange, editorRef, ...props }) => {
  const [link, setLink] = useState('');

  const onAddLink = useCallback(() => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: link },
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = DraftEditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    onChange(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey,
      ),
    );

    setLink('');
    focusRef(editorRef);
  }, [onChange, editorState, link, editorRef]);

  const onLinkChange = useCallback(
    e => {
      setLink(e.target.value);
    },
    [setLink],
  );

  const setLinkByEditorState = useCallback(() => {
    setLink(getSelectionLinkUrl(editorState));
  }, [editorState]);

  const overlay = ({ onToggle }) => (
    <DropdownMenu>
      <LinkDropdown
        value={link}
        onChange={onLinkChange}
        editorState={editorState}
        onSubmit={() => {
          onAddLink();
          onToggle();
          focusRef(editorRef);
        }}
      />
    </DropdownMenu>
  );

  return (
    <Dropdown
      overlay={overlay}
      closeOnOverlayClick={false}
      portalTarget={document.body}
      overflow
    >
      {({ onToggle, ref, open }) => (
        <div ref={ref}>
          <StyleButtonBase
            tabIndex="-1"
            onClick={e => {
              e.preventDefault();
              !open && setLinkByEditorState();
              onToggle();
            }}
            active={open}
            {...props}
          >
            <StyleIcon type="insert_link" />
          </StyleButtonBase>
        </div>
      )}
    </Dropdown>
  );
};

const emptyEditorState = createEmptyEditorState();

export const EditorState = DraftEditorState;

export const Editor = ({
  value,
  onChange,
  inputProps,
  onFocus = () => {},
  onBlur = () => {},
  ...props
}) => {
  const editorState = value ? value : emptyEditorState;
  const [hasFocus, setHasFocus] = useState(false);
  const editorRef = useRef();

  const styleButtonProps = { editorState, onChange, editorRef };

  return (
    <Container className="Editor__" hasFocus={hasFocus}>
      <Toolbar>
        <StyleButton
          icon="format_bold"
          styleName="BOLD"
          title="Lihavointi"
          inline
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_italic"
          styleName="ITALIC"
          title="Kursivointi"
          inline
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_underline"
          styleName="UNDERLINE"
          title="Alleviivaus"
          inline
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_list_bulleted"
          styleName="unordered-list-item"
          title="Lista"
          block
          {...styleButtonProps}
        />
        <StyleButton
          icon="format_list_numbered"
          styleName="ordered-list-item"
          title="Numeroitu lista"
          block
          {...styleButtonProps}
        />
        <LinkButton {...styleButtonProps} title="Linkki" />
        <HeaderSelect {...styleButtonProps} />
      </Toolbar>
      <EditorWrapper>
        <EditorContent>
          <DraftEditor
            onFocus={() => {
              setHasFocus(true);
              onFocus();
            }}
            onBlur={() => {
              setHasFocus(false);
              onBlur();
            }}
            ref={editorRef}
            editorState={editorState}
            onChange={onChange}
            {...props}
          />
        </EditorContent>
      </EditorWrapper>
    </Container>
  );
};

export default Editor;
