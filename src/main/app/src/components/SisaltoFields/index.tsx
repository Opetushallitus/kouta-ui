import { RefObject, useCallback } from 'react';

import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { isSortable, useSortable } from '@dnd-kit/react/sortable';
import { useTranslation } from 'react-i18next';
import { Field, FieldArray, FieldArrayFieldsProps } from 'redux-form';
import styled from 'styled-components';

import { FormButton } from '#/src/components/FormButton';
import IconButton from '#/src/components/IconButton';
import { LexicalEditorUI } from '#/src/components/LexicalEditorUI';
import RemoveButton from '#/src/components/RemoveButton';
import TableInput from '#/src/components/TableInput';
import {
  Box,
  Dropdown,
  DropdownMenu,
  DropdownMenuItem,
  Icon,
} from '#/src/components/virkailija';
import { Sisalto } from '#/src/types/formTypes';
import { getTestIdProps } from '#/src/utils';

const InputContainer = styled(Box)`
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
        <div
          ref={ref as RefObject<HTMLDivElement>}
          style={{ display: 'inline-block' }}
        >
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

const renderEditorField = ({ input }) => <LexicalEditorUI {...input} />;

const ContentField = ({
  tyyppi,
  name,
  language,
}: {
  tyyppi: string;
  name: string;
  language: LanguageCode;
}) => {
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

const SortableBlock = ({
  id,
  index,
  fieldValue,
  fieldName,
  language,
  fields,
}: {
  id: string;
  index: number;
  fieldValue: Sisalto;
  fieldName: string;
  language: LanguageCode;
  fields: FieldArrayFieldsProps<Sisalto>;
}) => {
  const { t } = useTranslation();
  const { ref, isDragging, handleRef } = useSortable({
    id,
    index,
  });

  return (
    <Box
      key={id}
      display="flex"
      ref={ref}
      data-dragging={isDragging}
      marginBottom={index < fields.length - 1 ? 2 : 0}
    >
      <InputContainer flexGrow={1}>
        <InputWrapper>
          <ContentField {...fieldValue} name={fieldName} language={language} />
        </InputWrapper>
      </InputContainer>
      <Box flexGrow={0} paddingLeft={2}>
        <Box ref={handleRef} marginBottom={2}>
          <FormButton
            as="div"
            variant="outlined"
            color="primary"
            type="button"
            style={{ cursor: 'grab', width: '100%' }}
          >
            <Icon type="drag_indicator" /> {t('yleiset.siirra')}
          </FormButton>
        </Box>
        <RemoveButton onClick={() => fields.remove(index)} />
      </Box>
    </Box>
  );
};

const SortableContainer = (props: {
  fields: FieldArrayFieldsProps<Sisalto>;
  language: LanguageCode;
}) => {
  const { fields } = props;
  return (
    <DragDropProvider
      onDragEnd={(event: DragEndEvent) => {
        if (event.canceled) return;

        const { source } = event.operation;

        if (isSortable(source)) {
          const { initialIndex, index } = source;

          if (initialIndex !== index) {
            fields.move(initialIndex, index);
          }
        }
      }}
    >
      <Box style={{ position: 'relative' }}>
        {fields.map((fieldName: string, index: number) => {
          const fieldValue = fields.get(index);
          const id = JSON.stringify(fieldValue);

          return (
            <SortableBlock
              key={id}
              id={id}
              index={index}
              fieldValue={fieldValue}
              fieldName={fieldName}
              {...props}
            />
          );
        })}
      </Box>
      <Box marginTop={fields.length > 0 ? 2 : 0}>
        <AddContentDropdown
          onAdd={(content: Sisalto) => fields.push(content)}
        />
      </Box>
    </DragDropProvider>
  );
};

export const SisaltoFields = ({
  name,
  language = 'fi',
  ...props
}: {
  name: string;
  language: LanguageCode;
}) => {
  return (
    <FieldArray
      name={name}
      {...props}
      component={SortableContainer}
      language={language}
    />
  );
};
