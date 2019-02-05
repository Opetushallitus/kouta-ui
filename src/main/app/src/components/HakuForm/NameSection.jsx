import React from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Typography from '../Typography';
import LanguageSelector from '../LanguageSelector';
import Input from '../Input'
import { getThemeProp } from '../../theme';

const Notification = styled(Typography)`
  color: ${getThemeProp('palette.primary.main')};
`;

const renderInputField = ({ input}) => {
  const { onChange, value } = input;
  return (
    <Input onChange={onChange} value={value} />
  );
};

const NameSection = ({ languages, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value }) => {
          return (
            <>
              <div>
                <Typography variant="h6" marginBottom={1}>
                  Anna haulle nimi
                </Typography>
                <Field name="nimi" component={renderInputField} />
                <Notification variant="h6" marginTop={1.375}>
                  Huom! Tämä teksti näkyy oppijalle Opintopolun sivuilla
                </Notification>
              </div>
            </>
          );
        }}
      </LanguageSelector>
    </div>
  );
};

export default NameSection;
