import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Input from '../Input';
import Flex, { FlexItem } from '../Flex';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const AloituspaikatSection = ({ koulutustyyppi }) => {
  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);

  const aloituspaikatField = (
    <>
      <Typography variant="h6" marginBottom={1}>
        Aloituspaikkojen lukumäärä
      </Typography>
      <Field
        name="aloituspaikkamaara"
        component={renderInputField}
        type="number"
      />
    </>
  );

  const ensikertalaisetField = (
    <>
      <Typography variant="h6" marginBottom={1}>
        Ensikertalaisten aloituspaikkojen lukumäärä
      </Typography>
      <Field
        name="ensikertalaismaara"
        component={renderInputField}
        type="number"
      />
    </>
  );

  return (
    <>
      {isKorkeakoulu ? (
        <Flex>
          <FlexItem grow={1} paddingRight={1}>
            {aloituspaikatField}
          </FlexItem>
          <FlexItem grow={1} paddingLeft={1}>
            {ensikertalaisetField}
          </FlexItem>
        </Flex>
      ) : (
        aloituspaikatField
      )}
    </>
  );
};

export default AloituspaikatSection;
