import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldEditor,
  FormFieldInput,
  FormFieldSelect,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAMATTOMAT_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
} from '#/src/constants';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';

const LaajuusFields = ({ name, disabled }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
  });

  return (
    <Box display="flex" mx={-1}>
      <Box px={1} flexGrow={1} {...getTestIdProps('laajuus')}>
        <Field
          name={`${name}.laajuus`}
          component={FormFieldInput}
          label={t('toteutuslomake.laajuus')}
          type="number"
          disabled={disabled}
        />
      </Box>

      <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
        <Field
          name={`${name}.laajuusyksikko`}
          component={FormFieldSelect}
          label={t('toteutuslomake.laajuusyksikko')}
          options={options}
          disabled={disabled}
          isClearable
        />
      </Box>
    </Box>
  );
};

export const TiedotSection = ({ language, name, koulutustyyppi }) => {
  const { t } = useTranslation();

  const disableFieldsCopiedFromKoulutus = [
    KOULUTUSTYYPPI.OSAAMISALA,
    KOULUTUSTYYPPI.TUTKINNON_OSA,
  ].includes(koulutustyyppi);

  return (
    <>
      {_fp
        .without(
          [
            KOULUTUSTYYPPI.VALMA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.LUVA,
            KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
          ],
          KOULUTUSTYYPIT
        )
        .includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            disabled={
              disableFieldsCopiedFromKoulutus ||
              koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS
            }
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
            <LaajuusFields
              name={name}
              disabled={disableFieldsCopiedFromKoulutus}
            />
          </Box>
        </>
      )}

      {_fp
        .without(
          [
            KOULUTUSTYYPPI.VALMA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.LUVA,
            KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
          ],
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
