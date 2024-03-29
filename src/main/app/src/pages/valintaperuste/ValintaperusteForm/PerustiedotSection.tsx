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
import { ENTITY } from '#/src/constants';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import { useIsKoulutustyyppiDisabledGetter } from '#/src/hooks/useOppilaitosTyypit';
import { getTestIdProps } from '#/src/utils';

type Props = {
  name: string;
  canEditTyyppi: boolean;
  organisaatioOid: string;
};

export const PerustiedotSection = ({
  name,
  canEditTyyppi = true,
  organisaatioOid,
}: Props) => {
  const { t } = useTranslation();
  const { options: hakutapaOptions } = useKoodistoOptions({
    koodisto: 'hakutapa',
  });
  const { options: haunkohdejoukkoOptions } = useKoodistoOptions({
    koodisto: 'haunkohdejoukko',
  });

  const { getIsDisabled, isLoading } = useIsKoulutustyyppiDisabledGetter({
    entityType: ENTITY.SORA_KUVAUS,
    organisaatioOid,
  });

  return (
    <>
      <Field
        disabled={isLoading || !canEditTyyppi}
        name={`${name}.tyyppi`}
        required
        component={FormFieldKoulutustyyppiSelect}
        label={t('yleiset.valitseKoulutustyyppi')}
        getIsDisabled={getIsDisabled}
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
      <Divider marginTop={3} marginBottom={3} />
    </>
  );
};
