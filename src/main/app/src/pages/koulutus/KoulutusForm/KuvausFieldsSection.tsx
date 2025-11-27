import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldEditor } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';

export const KuvausFieldsSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Box {...getTestIdProps('kuvausInput')}>
        <Field
          disabled={disabled}
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.kuvaus')}
          required={[
            KOULUTUSTYYPPI.TUVA,
            KOULUTUSTYYPPI.TELMA,
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
            KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
            KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
            KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
            KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
            KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
            KOULUTUSTYYPPI.ERIKOISLAAKARI,
            KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
            KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS,
          ].includes(koulutustyyppi)}
        />
      </Box>
      {[
        KOULUTUSTYYPPI.TUVA,
        KOULUTUSTYYPPI.TELMA,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OPISTOVUOSI,
        KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_MUU,
        KOULUTUSTYYPPI.AIKUISTEN_PERUSOPETUS,
        KOULUTUSTYYPPI.TAITEEN_PERUSOPETUS,
      ].includes(koulutustyyppi) && (
        <Box mb={2} {...getTestIdProps('linkkiEPerusteisiinInput')}>
          <Field
            disabled={disabled}
            name={`${name}.linkkiEPerusteisiin.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.linkkiEPerusteisiin')}
          />
        </Box>
      )}
      <Box mb={2} {...getTestIdProps('osaamistavoitteet')}>
        <Field
          disabled={disabled}
          name={`${name}.osaamistavoitteet.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.osaamistavoitteet')}
          required={true}
        />
      </Box>
    </>
  );
};
