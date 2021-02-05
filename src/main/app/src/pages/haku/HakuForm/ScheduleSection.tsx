import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldDateTimeInput } from '#/src/components/formFields';
import { HakuajatFields } from '#/src/components/HakuajatFields';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const ScheduleSection = ({ isOphVirkailija, isYhteishaku, name, language }) => {
  const { t } = useTranslation();

  return (
    <Box mb={-4}>
      <FieldGroup
        title={t('hakulomake.hakuaika')}
        name={`${name}.hakuaikaGroup`}
        {...getTestIdProps('hakuajat')}
      >
        <FieldArray
          name={`${name}.hakuaika`}
          component={HakuajatFields}
          t={t}
        />
      </FieldGroup>

      <FieldGroup title={t('yleiset.koulutuksenAjankohta')}>
        <KoulutuksenAloitusajankohtaFields
          section={name}
          name={`${name}.ajankohtaTyyppi`}
          language={language}
        />
      </FieldGroup>

      {isYhteishaku && isOphVirkailija ? (
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

      {isYhteishaku && isOphVirkailija ? (
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
        </>
      ) : null}
    </Box>
  );
};

export default ScheduleSection;
