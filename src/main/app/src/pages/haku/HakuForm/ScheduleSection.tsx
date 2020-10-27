import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';

import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import { Box } from '#/src/components/virkailija';
import HakuajatFields from '#/src/components/HakuajatFields';
import FieldGroup from '#/src/components/FieldGroup';
import DateTimeRange from '#/src/components/DateTimeRange';
import {
  FormFieldDateTimeInput,
  FormFieldRadioGroup,
  FormFieldYearSelect,
  FormFieldSwitch,
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { useFieldValue } from '#/src/hooks/form';
import { createStyledRadioSection } from '#/src/components/createStyledRadioSection';

const KausiJaVuosiFields = ({ name }) => {
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });
  const { t } = useTranslation();

  const tiedossaTarkkaAjankohta = useFieldValue(
    `${name}.tiedossaTarkkaAjankohta`
  );

  return (
    <Spacing>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          label={t('hakulomake.valitseAlkamiskausi')}
          options={options}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.vuosi`}
          component={FormFieldYearSelect}
          placeholder={t('hakulomake.valitseAlkamisvuosi')}
        />
      </Box>
      <Box flexGrow="1" p={1}>
        <Field
          name={`${name}.tiedossaTarkkaAjankohta`}
          component={FormFieldSwitch}
        >
          {t('hakulomake.tiedossaTarkkaAjankohta')}
        </Field>
      </Box>
      {tiedossaTarkkaAjankohta && (
        <Box flexGrow="1" p={1}>
          <DateTimeRange
            startProps={{
              name: `${name}.tarkkaAlkaa`,
            }}
            endProps={{
              name: `${name}.tarkkaPaattyy`,
            }}
          />
        </Box>
      )}
    </Spacing>
  );
};

const ToteutuksenAjankohtaFields = createStyledRadioSection([
  {
    label: t => t('hakulomake.alkamiskausi'),
    value: 'alkamiskausi',
    FieldsComponent: KausiJaVuosiFields,
  },
  {
    label: t => t('hakulomake.aloitusHenkilokohtaisenSuunnitelmanMukaisesti'),
    value: 'aloitusHenkilokohtaisenSuunnitelmanMukaisesti',
  },
]);

const ScheduleSection = ({ isOphVirkailija, isYhteishaku, name }) => {
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

      <FieldGroup
        title={t('hakulomake.toteutuksenAjankohta')}
        {...getTestIdProps('toteutuksenAjankohta')}
      >
        <Field
          name={`${name}.toteutuksenAjankohta`}
          component={ToteutuksenAjankohtaFields}
          section={name}
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
