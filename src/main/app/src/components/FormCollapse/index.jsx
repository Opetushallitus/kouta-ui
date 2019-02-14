import React from 'react';
import { FormSection } from 'redux-form';
import styled from 'styled-components';

import Collapse, { UncontrolledCollapse } from '../Collapse';
import Button from '../Button';
import ClearFormSection from './ClearFormSection';
import { isFunction, isString } from '../../utils';

const CollapseFooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CollapseWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const renderChildren = ({ onContinue, children, section }) => {
  const renderedChildren = isFunction(children)
    ? children({ onContinue })
    : children;

  return section ? (
    <FormSection name={section}>{renderedChildren}</FormSection>
  ) : (
    renderedChildren
  );
};

const FormCollapse = ({
  onContinue,
  section,
  children = null,
  controlled = true,
  open = false,
  clearable = true,
  actions: actionsProp = null,
  index,
  header: headerProp = null,
  id,
  ...props
}) => {
  const CollapseComponent = controlled ? Collapse : UncontrolledCollapse;

  const collapseProps = controlled
    ? {
        open,
      }
    : {
        defaultOpen: true,
      };

  const actions = actionsProp ? (
    actionsProp
  ) : isFunction(onContinue) ? (
    <Button type="button" onClick={onContinue}>
      Jatka
    </Button>
  ) : null;

  const header = isString(headerProp)
    ? `${index + 1} ${headerProp}`
    : headerProp;

  return (
    <CollapseWrapper {...id && { id }}>
      <CollapseComponent
        header={header}
        footer={
          <CollapseFooterContainer>
            {section && clearable ? (
              <ClearFormSection name={section}>
                {({ onClear }) => (
                  <Button type="button" variant="outlined" onClick={onClear}>
                    Tyhjennä tiedot
                  </Button>
                )}
              </ClearFormSection>
            ) : null}
            {actions}
          </CollapseFooterContainer>
        }
        {...collapseProps}
        {...props}
      >
        {renderChildren({ onContinue, children, section })}
      </CollapseComponent>
    </CollapseWrapper>
  );
};

export default FormCollapse;
