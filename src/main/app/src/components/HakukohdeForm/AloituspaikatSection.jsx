import React from 'react';
import { Field } from 'redux-form';

import Flex, { FlexItem } from '../Flex';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import useTranslation from '../useTranslation';
import { FormFieldInput } from '../FormFields';

const AloituspaikatSection = ({ koulutustyyppi }) => {
  const isKorkeakoulu = KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi);
  const { t } = useTranslation();

  const aloituspaikatField = (
    <>
      <Field
        name="aloituspaikkamaara"
        component={FormFieldInput}
        type="number"
        label={t('hakukohdelomake.aloituspaikkojenLukumaara')}
      />
    </>
  );

  const ensikertalaisetField = (
    <>
      <Field
        name="ensikertalaismaara"
        component={FormFieldInput}
        type="number"
        label={t('hakukohdelomake.ensikertalaistenAloituspaikkojenLukumaara')}
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
