import React, { useCallback } from 'react';
import { FieldArray, Field } from 'redux-form';
import styled from 'styled-components';

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from '../Sortable';

import TableInput from '../TableInput';
import Editor from '../Editor';
import Button from '../Button';
import Icon from '../Icon';
import Spacing from '../Spacing';
import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import { spacing } from '../../theme';

import Dropdown, { DropdownMenu, DropdownMenuItem } from '../Dropdown';

const MoveButton = SortableHandle(props => (
  <div>
    <Button as="div" style={{ cursor: 'grab' }} {...props} />
  </div>
));

const InputContainer = styled(FlexItem)`
  max-width: 100%;
  min-width: 0;
`;

const InputWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
`;

const AddIcon = styled(Icon).attrs({ type: 'add' })`
  font-size: 1rem;
  margin-left: ${spacing(0.5)};
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
          <Button
            onClick={onToggle}
            type="button"
            color="primary"
            variant="text"
            {...getTestIdProps('sisaltoMenuToggle')}
          >
            {t('valintaperustelomake.lisaaSisaltoa')} <AddIcon />
          </Button>
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
                  <MoveButton
                    variant="outlined"
                    color="primary"
                    type="button"
                    fullWidth
                  >
                    <Icon type="drag_indicator" /> {t('yleiset.siirra')}
                  </MoveButton>
                </Spacing>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="button"
                  fullWidth
                  onClick={() => fields.remove(index)}
                >
                  {t('yleiset.poista')}
                </Button>
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

export default SisaltoFields;
