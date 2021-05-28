import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldKoulutustyyppiSelect,
  FormFieldRadioGroup,
  FormFieldSelect,
} from '#/src/components/formFields';
import { KieliversiotFields } from '#/src/components/KieliversiotFields';
import { Divider } from '#/src/components/virkailija';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

export const PerustiedotSection = ({ name, canEditTyyppi = true }) => {
  const { t } = useTranslation();
  const { options: hakutapaOptions } = useKoodistoOptions({
    koodisto: 'hakutapa',
  });
  const { options: haunkohdejoukkoOptions } = useKoodistoOptions({
    koodisto: 'haunkohdejoukko',
  });

  return (
    <>
      <Field
        disabled={!canEditTyyppi}
        name={`${name}.tyyppi`}
        required
        component={FormFieldKoulutustyyppiSelect}
        label={t('yleiset.valitseKoulutustyyppi')}
      />
      <Divider marginTop={3} marginBottom={3} />

      <div {...getTestIdProps('kieliversiotSection')}>
        <KieliversiotFields name={`${name}.kieliversiot`} />
      </div>
      <Divider marginTop={3} marginBottom={3} />
      <Field
        name={`${name}.hakutapa`}
        required
        component={FormFieldRadioGroup}
        options={hakutapaOptions}
        label={t('valintaperustelomake.valitseHakutapa')}
      />
      <Divider marginTop={3} marginBottom={3} />
      <div {...getTestIdProps('kohdejoukkoSection')}>
        <Field
          name={`${name}.kohdejoukko`}
          required
          component={FormFieldSelect}
          options={haunkohdejoukkoOptions}
          label={t('valintaperustelomake.valitseHaunKohdejoukko')}
        />
      </div>
    </>
  );
};
