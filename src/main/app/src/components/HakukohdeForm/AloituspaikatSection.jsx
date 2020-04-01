import React from 'react';
import { Field } from 'redux-form';

import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { FormFieldInput } from '../formFields';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';
import FormLabel from '../FormLabel';
import { getTestIdProps } from '../../utils';

const AloituspaikatSection = ({ koulutustyyppi, name }) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();

  const aloituspaikkamaaraName = `${name}.aloituspaikkamaara`;

  const aloituspaikatField = (
    <>
      <FormLabel htmlFor={aloituspaikkamaaraName}>
        {t('hakukohdelomake.aloituspaikkojenLukumaara')}
      </FormLabel>

      <Field
        id={aloituspaikkamaaraName}
        name={aloituspaikkamaaraName}
        component={FormFieldInput}
        type="number"
        {...getTestIdProps('aloituspaikkamaara')}
      />
    </>
  );

  const ensikertalaismaaraName = `${name}.ensikertalaismaara`;

  const ensikertalaisetField = (
    <>
      <FormLabel htmlFor={ensikertalaismaaraName}>
        {t('hakukohdelomake.ensikertalaistenAloituspaikkojenLukumaara')}
      </FormLabel>

      <Field
        id={ensikertalaismaaraName}
        name={ensikertalaismaaraName}
        component={FormFieldInput}
        type="number"
        {...getTestIdProps('ensikertalaismaara')}
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
