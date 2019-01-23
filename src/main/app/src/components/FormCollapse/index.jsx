import React from 'react';
import { FormSection } from 'redux-form';
import styled from 'styled-components';

import Collapse from '../Collapse';
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

const FormCollapse = ({ onContinue, section, children = null, ...props }) => {
  return (
    <CollapseWrapper>
      <Collapse
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
        {...props}
      >
        {section ? (
          <FormSection name={section}>{children}</FormSection>
        ) : (
          children
        )}
      </Collapse>
    </CollapseWrapper>
  );
};

export default FormCollapse;
