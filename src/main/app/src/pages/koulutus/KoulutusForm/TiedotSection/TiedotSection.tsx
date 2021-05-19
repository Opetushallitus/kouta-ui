import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import KoulutusalaSelect from '#/src/components/KoulutusalaSelect';
import KoulutusField from '#/src/components/KoulutusField';
import { Box, FormControl } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT,
  TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
  KOULUTUSALA_YLEISSIVISTAVA_KOODIURI,
} from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { KoulutuksenEPerusteTiedot } from '../KoulutuksenEPerusteTiedot';
import { useNimiFromKoulutusKoodi } from '../useNimiFromKoulutusKoodi';
import KoulutusalatField from './KoulutusalatField';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';

export const TiedotSection = ({ disabled, language, koulutustyyppi, name }) => {
  const { t } = useTranslation();

  useNimiFromKoulutusKoodi({
    nimiFieldName: `${name}.nimi`,
    koulutusFieldName: isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi)
      ? `${name}.korkeakoulutukset`
      : `${name}.koulutus`,
  });

  return (
    <Box mb={-2}>
      {TUTKINTOON_JOHTAVAT_AMMATILLISET_KOULUTUSTYYPIT.includes(
        koulutustyyppi
      ) && (
        <Box mb={2}>
          <KoulutuksenEPerusteTiedot
            disabled={disabled}
            language={language}
            name={name}
          />
        </Box>
      )}
      {[
        KOULUTUSTYYPPI.VALMA,
        KOULUTUSTYYPPI.TELMA,
        KOULUTUSTYYPPI.LUVA,
        KOULUTUSTYYPPI.PERUSOPETUKSEN_LISAOPETUS,
      ].includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('koulutuskoodiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            required
          />
        </Box>
      )}
      {isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi) && (
        <>
          <Box mb={2} {...getTestIdProps('korkeakoulutuskoodiSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.korkeakoulutukset`}
              koulutustyyppi={koulutustyyppi}
              language={language}
              isMultiSelect={true}
              valitseKoulutusLabel={t('yleiset.valitseKoulutukset')}
              required
            />
          </Box>

          <Box mb={2}>
            <OpintojenlaajuusField disabled={disabled} name={name} />
          </Box>

          <Box mb={2}>
            <TutkintonimikeField disabled={disabled} name={name} />
          </Box>

          <Box mb={2}>
            <KoulutusalatField disabled={disabled} name={name} />
          </Box>
        </>
      )}
      {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS && (
        <>
          <Box mb={2} {...getTestIdProps('koulutusSelect')}>
            <KoulutusField
              disabled={disabled}
              name={`${name}.koulutus`}
              koulutustyyppi={koulutustyyppi}
              language={language}
              valitseKoulutusLabel={t('yleiset.valitseKoulutus')}
              required
            />
          </Box>
          <Box mb={2}>
            <OpintojenlaajuusField disabled={disabled} name={name} />
          </Box>
          <Box mb={2}>
            <FormControl
              label={t('koulutuslomake.valitseKoulutusalat')}
              disabled={true}
            >
              <KoulutusalaSelect
                value={{ value: KOULUTUSALA_YLEISSIVISTAVA_KOODIURI }}
              />
            </FormControl>
          </Box>
        </>
      )}

      {[
        ...TUTKINTOON_JOHTAVAT_KORKEAKOULU_KOULUTUSTYYPIT,
        KOULUTUSTYYPPI.AVOIN_YO,
        KOULUTUSTYYPPI.AVOIN_AMK,
        KOULUTUSTYYPPI.TAYDENNYS_KOULUTUS,
        KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
        KOULUTUSTYYPPI.AMMATILLINEN_OPETTAJAKOULUTUS,
        KOULUTUSTYYPPI.AMMATILLINEN_ERITYISOPETTAJA_KOULUTUS,
        KOULUTUSTYYPPI.AMMATILLINEN_OPINTO_OHJAAJA_KOULUTUS,
        KOULUTUSTYYPPI.LUKIOKOULUTUS,
      ].includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('nimiInput')}>
          <Field
            disabled={disabled}
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
            required
          />
        </Box>
      )}
    </Box>
  );
};
