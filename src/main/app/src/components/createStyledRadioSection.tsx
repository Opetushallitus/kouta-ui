import React from 'react';

import _ from 'lodash';
import { transparentize } from 'polished';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  createFormFieldComponent,
  simpleMapProps,
} from '#/src/components/formFields';
import { Box, Radio } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

const StyledGrayRadio = styled(Radio)`
  background-color: ${getThemeProp('colors.grayLighten6', transparentize(0.5))};
  padding: 19px 10px;
  margin-bottom: 10px;
`;

const StyledBlueBox = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 30px;
  margin-bottom: 20px;
`;

export const createStyledRadioSection = radioConfig =>
  createFormFieldComponent(
    ({
      onChange,
      value,
      section,
      disabled,
      language,
      error,
      fieldsComponentProps = {},
    }) => {
      const { t } = useTranslation();
      return (
        <Box display="flex" flexDirection="column">
          {radioConfig.map(
            ({ label = '', value: radioValue, FieldsComponent }) => {
              const isChecked = value === radioValue;
              return (
                <Box key={radioValue} display="flex" flexDirection="column">
                  <StyledGrayRadio
                    checked={isChecked}
                    value={radioValue}
                    onChange={onChange}
                    disabled={disabled}
                    error={error}
                  >
                    {_.isFunction(label) ? label(t) : label}
                  </StyledGrayRadio>
                  {isChecked && FieldsComponent && (
                    <StyledBlueBox>
                      <FieldsComponent
                        name={section}
                        language={language}
                        {...fieldsComponentProps}
                      />
                    </StyledBlueBox>
                  )}
                </Box>
              );
            }
          )}
        </Box>
      );
    },
    simpleMapProps
  );
