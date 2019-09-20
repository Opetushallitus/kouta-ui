import React from 'react';
import { Field } from 'redux-form';

import Flex, { FlexItem } from '../Flex';
import useTranslation from '../useTranslation';
import { FormFieldInput } from '../formFields';
import isKorkeakouluKoulutustyyppi from '../../utils/isKorkeakouluKoulutustyyppi';
import FormLabel from '../FormLabel';
import { getTestIdProps } from '../../utils';

const MinMaxFields = ({ minName, maxName, minId, ...props }) => {
  return (
    <Flex alignCenter {...props}>
      <FlexItem grow={1} {...getTestIdProps('min')}>
        <Field
          id={minId}
          name={minName}
          component={FormFieldInput}
          type="number"
        />
      </FlexItem>
      <FlexItem grow={0} paddingLeft={2} paddingRight={2}>
        -
      </FlexItem>
      <FlexItem grow={1} {...getTestIdProps('max')}>
        <Field name={maxName} component={FormFieldInput} type="number" />
      </FlexItem>
    </Flex>
  );
};

const AloituspaikatSection = ({ koulutustyyppi, name }) => {
  const isKorkeakoulu = isKorkeakouluKoulutustyyppi(koulutustyyppi);
  const { t } = useTranslation();

  const minAloituspaikkamaaraName = `${name}.minAloituspaikkamaara`;

  const aloituspaikatField = (
    <>
      <FormLabel htmlFor={minAloituspaikkamaaraName}>
        {t('hakukohdelomake.aloituspaikkojenLukumaara')}
      </FormLabel>

      <MinMaxFields
        minId={minAloituspaikkamaaraName}
        minName={minAloituspaikkamaaraName}
        maxName={`${name}.maxAloituspaikkamaara`}
        {...getTestIdProps('aloituspaikkamaara')}
      />
    </>
  );

  const minEnsikertalaismaaraName = `${name}.minEnsikertalaismaara`;

  const ensikertalaisetField = (
    <>
      <FormLabel htmlFor={minEnsikertalaismaaraName}>
        {t('hakukohdelomake.ensikertalaistenAloituspaikkojenLukumaara')}
      </FormLabel>

      <MinMaxFields
        minId={minEnsikertalaismaaraName}
        minName={minEnsikertalaismaaraName}
        maxName={`${name}.maxEnsikertalaismaara`}
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
