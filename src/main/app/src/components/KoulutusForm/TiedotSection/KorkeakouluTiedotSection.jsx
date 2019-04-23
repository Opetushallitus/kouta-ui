import React from 'react';
import { Field } from 'redux-form';

import KoulutusSelect from '../KoulutusSelect';
import Spacing from '../../Spacing';
import TutkintoNimikeSelect from './TutkintonimikeSelect';
import useKoodistoOptions from '../../useKoodistoOptions';
import useTranslation from '../../useTranslation';
import { getTestIdProps, noop } from '../../../utils';

import {
  FormFieldInput,
  FormFieldSelect,
  createFormFieldComponent,
} from '../../FormFields';

const KoulutusField = createFormFieldComponent(
  KoulutusSelect,
  ({ input, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

const TutkintoNimikeField = createFormFieldComponent(
  TutkintoNimikeSelect,
  ({ input, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

export const KorkeakoulutuTiedotSection = ({ koulutustyyppi, language }) => {
  const { options: laajuusOptions } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <div {...getTestIdProps('koulutuskoodiSelect')}>
          <Field
            name="koulutus"
            component={KoulutusField}
            koulutustyyppi={koulutustyyppi}
            label={t('koulutuslomake.valitseKoulutuskoodi')}
          />
        </div>
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('nimiInput')}>
        <Field
          name={`nimi.${language}`}
          component={FormFieldInput}
          label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
        />
      </Spacing>

      <Spacing marginBottom={2}>
        <div {...getTestIdProps('tutkintonimikeSelect')}>
          <Field
            name="tutkintonimike"
            component={TutkintoNimikeField}
            label={t('koulutuslomake.valitseTutkintonimike')}
          />
        </div>
      </Spacing>

      <div {...getTestIdProps('opintojenLaajuusSelect')}>
        <Field
          name="opintojenLaajuus"
          component={FormFieldSelect}
          options={laajuusOptions}
          label={t('koulutuslomake.valitseOpintojenLaajuus')}
        />
      </div>
    </>
  );
};

export default KorkeakoulutuTiedotSection;
