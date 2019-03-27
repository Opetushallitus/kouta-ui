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
import DropdownIcon from '../DropdownIcon';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';

const MoveButton = SortableHandle(props => (
  <div>
    <Button as="div" style={{ cursor: 'grab' }} {...props} />
  </div>
));

const InputContainer = styled(FlexItem)`
  overflow-x: auto;
  overflow-y: hidden;
`;

const AddContentDropdown = ({ onAdd }) => {
  const onAddText = useCallback(() => {
    onAdd({ tyyppi: 'teksti', data: null });
  }, [onAdd]);

  const onAddTable = useCallback(() => {
    onAdd({ tyyppi: 'taulukko', data: null });
  }, [onAdd]);

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem onClick={onAddText}>Lisää tekstiä</DropdownMenuItem>
      <DropdownMenuItem onClick={onAddTable}>Lisää taulukko</DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown overlay={overlay}>
      {({ onToggle, visible, ref }) => (
        <div ref={ref} style={{ display: 'inline-block' }}>
          <Button
            onClick={onToggle}
            type="button"
            color="primary"
            variant="outlined"
          >
            Lisää sisältöä <DropdownIcon open={visible} />
          </Button>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const renderTableInputField = ({ input, language }) => (
  <TableInput {...input} language={language} />
);

const renderEditorField = ({ input }) => <Editor {...input} />;

const ContentField = ({ tyyppi, name, language }) => {
  if (tyyppi === 'taulukko') {
    return (
      <Field
        name={`${name}.data`}
        component={renderTableInputField}
        language={language}
      />
    );
  } else if (tyyppi === 'teksti') {
    return (
      <Field name={`${name}.data.${language}`} component={renderEditorField} />
    );
  }

  return null;
};

const FieldSortableElement = SortableElement(props => <div {...props} />);

const FieldsSortableContainer = SortableContainer(({ fields, language }) => {
  return (
    <div>
      {fields.map((content, index) => {
        const contentValue = fields.get(index);

        return (
          <FieldSortableElement key={index} index={index}>
            <Flex marginBottom={index < fields.length - 1 ? 2 : 0}>
              <InputContainer grow={1}>
                <ContentField
                  {...contentValue}
                  name={content}
                  language={language}
                />
              </InputContainer>
              <FlexItem grow={0} paddingLeft={2}>
                <Spacing marginBottom={2}>
                  <MoveButton
                    variant="outlined"
                    color="primary"
                    type="button"
                    fullWidth
                  >
                    <Icon type="drag_indicator" /> Siirrä
                  </MoveButton>
                </Spacing>
                <Button
                  variant="outlined"
                  color="secondary"
                  type="button"
                  fullWidth
                  onClick={() => fields.remove(index)}
                >
                  Poista
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

export const ValintatapaContentFields = ({ language = 'fi', ...props }) => (
  <FieldArray {...props} component={renderFields} language={language} />
);

export default ValintatapaContentFields;
