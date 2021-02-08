import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Flex, { FlexItem } from '#/src/components/Flex';
import { FormFieldInput } from '#/src/components/formFields';
import { FormLabel } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';
import isKorkeakouluKoulutustyyppi from '#/src/utils/koulutus/isKorkeakouluKoulutustyyppi';

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
