import React from 'react';
import { FormSection } from 'redux-form';
import styled from 'styled-components';

import Collapse, { UncontrolledCollapse } from '../Collapse';
import Button from '../Button';
import ResetFormSection from '../ResetFormSection';
import { isFunction } from '../../utils';

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

  return (
    <CollapseWrapper>
      <CollapseComponent
        footer={
          <CollapseFooterContainer>
            {section ? (
              <ResetFormSection name={section}>
                {({ onReset }) => (
                  <Button type="button" variant="outlined" onClick={onReset}>
                    Tyhjennä tiedot
                  </Button>
                )}
              </ResetFormSection>
            ) : null}

            {isFunction(onContinue) ? (
              <Button type="button" onClick={onContinue}>
                Jatka
              </Button>
            ) : null}
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
