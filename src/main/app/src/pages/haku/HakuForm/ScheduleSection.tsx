import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldDateTimeInput,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { HakuajatFields } from '#/src/components/HakuajatFields';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';

const ScheduleSection = ({
  isOphVirkailija,
  isYhteishaku,
  isErillishaku,
  name,
  language,
}) => {
  const { t } = useTranslation();

  const haullaErillinenAloitusajankohta = useFieldValue(
    `${name}.ajankohtaKaytossa`
  );

  // TODO: Hakuajoille required-arvot validointien mukaan (alkamisaika aina, päättymisaika yhteis- ja erillishauille)
  return (
    <Box mb={-4}>
      <FieldGroup
        title={t('hakulomake.hakuaika')}
        {...getTestIdProps('hakuajat')}
        required
      >
        <FieldArray
          name={`${name}.hakuaika`}
          component={HakuajatFields}
          t={t}
        />
      </FieldGroup>

      <FieldGroup title={t('yleiset.koulutuksenAjankohta')}>
        <Box mb={2}>
          <Field name={`${name}.ajankohtaKaytossa`} component={FormFieldSwitch}>
            {t('hakulomake.haullaErillinenAloitusajankohta')}
          </Field>
        </Box>
        {haullaErillinenAloitusajankohta && (
          <KoulutuksenAloitusajankohtaFields
            section={name}
            name={`${name}.ajankohtaTyyppi`}
            language={language}
            kausiRequired={isYhteishaku}
          />
        )}
      </FieldGroup>

      {(isYhteishaku || isErillishaku) && isOphVirkailija ? (
        <FieldGroup
          title={t('hakulomake.aikatauluTulevaisuudesta')}
          {...getTestIdProps('tulevaisuudenaikataulu')}
        >
          <FieldArray
            name={`${name}.aikataulu`}
            component={HakuajatFields}
            t={t}
          />
        </FieldGroup>
      ) : null}

      {(isYhteishaku || isErillishaku) && isOphVirkailija ? (
        <>
          <FieldGroup
            title={t('hakulomake.hakukohteenLisaamisenJaPerumisenTakaraja')}
            {...getTestIdProps('perumisenTakaraja')}
          >
            <Field
              name={`${name}.lisaamisenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>

          <FieldGroup
            title={t('hakulomake.hakukohteenMuokkauksenTakaraja')}
            {...getTestIdProps('muokkauksenTakaraja')}
          >
            <Field
              name={`${name}.muokkauksenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>

          <FieldGroup
            title={t('hakulomake.ajastettuHaunJulkaisupaivamaara')}
            {...getTestIdProps('julkaisupaivamaara')}
          >
            <Field
              name={`${name}.ajastettuJulkaisu`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>

          <FieldGroup
            title={t(
              'hakulomake.ajastettuHaunHakukohdeidenArkistointipaivamaara'
            )}
            {...getTestIdProps('hakukohteidenArkistointipaivamaara')}
          >
            <Field
              name={`${name}.ajastettuHakukohteidenArkistointi`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>
        </>
      ) : null}
    </Box>
  );
};

export default ScheduleSection;
