import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSwitch,
} from '#/src/components/formFields';
import OpintojenLaajuusFieldExtended from '#/src/components/OpintojenLaajuusFieldExtended';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import { ToteutusTiedotSectionProps } from '#/src/types/toteutusTypes';
import { getTestIdProps } from '#/src/utils';

export const TiedotSection = ({
  language,
  name,
  koulutustyyppi,
}: ToteutusTiedotSectionProps) => {
  const { t } = useTranslation();

  const disableFieldsCopiedFromKoulutus = [
    KOULUTUSTYYPPI.OSAAMISALA,
    KOULUTUSTYYPPI.TUTKINNON_OSA,
  ].includes(koulutustyyppi);

  return (
    <>
      {_fp
        .without(
          [KOULUTUSTYYPPI.TELMA, KOULUTUSTYYPPI.LUKIOKOULUTUS],
          KOULUTUSTYYPIT
        )
        .includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            disabled={disableFieldsCopiedFromKoulutus}
            label={t('toteutuslomake.toteutuksenNimi')}
            required
          />
        </Box>
      )}

      {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
        koulutustyyppi
      ) && (
        <Box mb={2}>
          <Field
            name={`${name}.ammatillinenPerustutkintoErityisopetuksena`}
            component={FormFieldSwitch}
          >
            {t('toteutuslomake.ammatillinenPerustutkintoErityisopetuksena')}
          </Field>
        </Box>
      )}
      {
        /* TODO: name-attribuutin alkuun sectionin name. Muuten validointivirheen tullessa tätä kenttää ei osata korostaa oikein. */
        <Box mb={2} {...getTestIdProps('toteutuksenKuvaus')}>
          <Field
            name={`kuvaus.${language}`}
            component={FormFieldEditor}
            label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
          />
        </Box>
      }

      {_fp
        .without(
          [KOULUTUSTYYPPI.OSAAMISALA, KOULUTUSTYYPPI.TUTKINNON_OSA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        )
        .includes(koulutustyyppi) && (
        <>
          <Box mb={2} {...getTestIdProps('ilmoittautumislinkki')}>
            <Field
              name={`${name}.ilmoittautumislinkki.${language}`}
              component={FormFieldInput}
              label={t('toteutuslomake.ilmoittautumislinkki')}
            />
          </Box>
          <Box mb={2}>
            <OpintojenLaajuusFieldExtended
              name={name}
              disabled={disableFieldsCopiedFromKoulutus}
            />
          </Box>
        </>
      )}

      {_fp
        .without(
          [KOULUTUSTYYPPI.TELMA],
          TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT
        )
        .includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('aloituspaikat')}>
          <Field
            name={`${name}.aloituspaikat`}
            component={FormFieldInput}
            label={t('toteutuslomake.aloituspaikat')}
            type="number"
          />
        </Box>
      )}
    </>
  );
};
