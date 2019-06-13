import React from 'react';
import { Field } from 'redux-form';

import KoulutusSelect from '../KoulutusSelect';
import Spacing from '../../Spacing';
import TutkintonimikeSelect from './TutkintonimikeSelect';
import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';
import KoulutusalatSelect from './KoulutusalatSelect';
import Flex, { FlexItem } from '../../Flex';

import {
  FormFieldInput,
  FormFieldSelect,
  createFormFieldComponent,
  selectMapProps,
} from '../../FormFields';

const KoulutusField = createFormFieldComponent(KoulutusSelect, selectMapProps);

const TutkintonimikeField = createFormFieldComponent(
  TutkintonimikeSelect,
  selectMapProps,
);

const KoulutusalatField = createFormFieldComponent(
  KoulutusalatSelect,
  selectMapProps,
);

export const KorkeakoulutuTiedotSection = ({
  koulutustyyppi,
  language,
  name,
}) => {
  const { options: laajuusOptions } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <div {...getTestIdProps('koulutuskoodiSelect')}>
          <Field
            name={`${name}.koulutus`}
            component={KoulutusField}
            koulutustyyppi={koulutustyyppi}
            label={t('koulutuslomake.valitseKoulutuskoodi')}
          />
        </div>
      </Spacing>

      <Spacing marginBottom={2}>
        <div {...getTestIdProps('opintojenLaajuusSelect')}>
          <Field
            name={`${name}.opintojenLaajuus`}
            component={FormFieldSelect}
            options={laajuusOptions}
            label={t('koulutuslomake.valitseOpintojenLaajuus')}
          />
        </div>
      </Spacing>

      <Flex marginBottom={2}>
        <FlexItem
          grow={1}
          basis="50%"
          paddingRight={2}
          {...getTestIdProps('tutkintonimikeSelect')}
        >
          <Field
            name={`${name}.tutkintonimike`}
            component={TutkintonimikeField}
            label={t('koulutuslomake.valitseTutkintonimike')}
          />
        </FlexItem>
        <FlexItem
          grow={1}
          basis="50%"
          paddingLeft={2}
          {...getTestIdProps('koulutusalatSelect')}
        >
          <Field
            name={`${name}.koulutusalat`}
            component={KoulutusalatField}
            label={t('koulutuslomake.valitseKoulutusalat')}
          />
        </FlexItem>
      </Flex>

      <Spacing {...getTestIdProps('nimiInput')}>
        <Field
          name={`${name}.nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        />
      </Spacing>
    </>
  );
};

export default KorkeakoulutuTiedotSection;
