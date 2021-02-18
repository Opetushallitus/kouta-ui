import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import Editor from '#/src/components/Editor';
import { Flex, FlexItem } from '#/src/components/Flex';
import IconButton from '#/src/components/IconButton';
import RemoveButton from '#/src/components/RemoveButton';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from '#/src/components/Sortable';
import Spacing from '#/src/components/Spacing';
import TableInput from '#/src/components/TableInput';
import {
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  Icon,
} from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const MoveButton = SortableHandle(props => (
  <Button as="div" style={{ cursor: 'grab', width: '100%' }} {...props} />
));

const InputContainer = styled(FlexItem)`
  max-width: 100%;
  min-width: 0;
`;

const InputWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
`;

const AddContentDropdown = ({ onAdd }) => {
  const { t } = useTranslation();

  const onAddText = useCallback(() => {
    onAdd({ tyyppi: 'teksti', data: null });
  }, [onAdd]);

  const onAddTable = useCallback(() => {
    onAdd({ tyyppi: 'taulukko', data: null });
  }, [onAdd]);

  const overlay = (
    <DropdownMenu {...getTestIdProps('sisaltoMenu')}>
      <DropdownMenuItem onClick={onAddText} {...getTestIdProps('lisaaTekstia')}>
        {t('valintaperustelomake.lisaaTekstia')}
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={onAddTable}
        {...getTestIdProps('lisaaTaulukko')}
      >
        {t('valintaperustelomake.lisaaTaulukko')}
      </DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <Dropdown overlay={overlay}>
      {({ onToggle, ref }) => (
        <div ref={ref} style={{ display: 'inline-block' }}>
          <IconButton
            iconType="add"
            color="primary"
            variant="text"
            onClick={onToggle}
            {...getTestIdProps('sisaltoMenuToggle')}
          >
            {t('valintaperustelomake.lisaaSisaltoa')}
          </IconButton>
        </div>
      )}
    </Dropdown>
  );
};

const renderTableInputField = ({ input, language, ...props }) => (
  <TableInput {...input} language={language} {...props} />
);

const renderEditorField = ({ input }) => <Editor {...input} />;

const ContentField = ({ tyyppi, name, language }) => {
  if (tyyppi === 'taulukko') {
    return (
      <Field
        name={`${name}.data`}
        component={renderTableInputField}
        language={language}
        {...getTestIdProps('taulukkoSisalto')}
      />
    );
  } else if (tyyppi === 'teksti') {
    return (
      <Field
        name={`${name}.data.${language}`}
        component={renderEditorField}
        {...getTestIdProps('tekstiSisalto')}
      />
    );
  }

  return null;
};

const FieldSortableElement = SortableElement(props => <div {...props} />);

const FieldsSortableContainer = SortableContainer(({ fields, language, t }) => {
  return (
    <div>
      {fields.map((content, index) => {
        const contentValue = fields.get(index);

        return (
          <FieldSortableElement key={index} index={index}>
            <Flex marginBottom={index < fields.length - 1 ? 2 : 0}>
              <InputContainer grow={1}>
                <InputWrapper>
                  <ContentField
                    {...contentValue}
                    name={content}
                    language={language}
                  />
                </InputWrapper>
              </InputContainer>
              <FlexItem grow={0} paddingLeft={2}>
                <Spacing marginBottom={2}>
                  <MoveButton variant="outlined" color="primary" type="button">
                    <Icon type="drag_indicator" /> {t('yleiset.siirra')}
                  </MoveButton>
                </Spacing>
                <RemoveButton onClick={() => fields.remove(index)} />
              </FlexItem>
            </Flex>
          </FieldSortableElement>
        );
      })}
      <Spacing marginTop={fields.length > 0 ? 2 : 0}>
        <AddContentDropdown onAdd={content => fields.push(content)} />
      </Spacing>
    </div>
  );
});

const renderFields = props => {
  const { fields } = props;

  return (
    <FieldsSortableContainer
      {...props}
      lockAxis="y"
      onSortEnd={({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
          fields.swap(oldIndex, newIndex);
        }
      }}
      useDragHandle
    />
  );
};

export const SisaltoFields = ({ language = 'fi', ...props }) => {
  const { t } = useTranslation();

  return (
    <FieldArray {...props} component={renderFields} language={language} t={t} />
  );
};
