import { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldSelect,
  createFormFieldComponent,
  FormFieldEditor,
  FormFieldSwitch,
  FormFieldIntegerInput,
} from '#/src/components/formFields';
import { KoulutuksenAloitusajankohtaFields } from '#/src/components/KoulutuksenAloitusajankohtaFields';
import { Box, FormLabel } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, TOHTORITUTKINTOTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useLisatiedotOptions } from '#/src/hooks/useKoodistoOptions';
import { useKoulutuksetByTutkintotyyppi } from '#/src/hooks/useKoulutuksetByTutkintotyyppi';
import { getTestIdProps } from '#/src/utils';
import { isEnglishChosen } from '#/src/utils/isEnglishChosen';
import { isTohtorikoulutus } from '#/src/utils/koulutus/isTohtorikoulutus';
import { isTutkintoonJohtavaKorkeakoulutus } from '#/src/utils/koulutus/isTutkintoonJohtavaKorkeakoulutus';

import { ApurahaFields } from './ApurahaFields';
import { DiplomiFields } from './DiplomiFields';
import KielivalikoimaFields from './KielivalikoimaFields';
import MaksullisuusFields from './MaksullisuusFields';
import OpetusaikaCheckboxGroup from './OpetusaikaCheckboxGroup';
import OpetuskieliCheckboxGroup from './OpetuskieliCheckboxGroup';
import OpetustapaCheckboxGroup from './OpetustapaCheckboxGroup';

const makeCountLimitOnChange = (onChange, max) => items =>
  _fp.isArray(items) && items.length <= max && onChange(items);

const OpetusaikaField = createFormFieldComponent(
  OpetusaikaCheckboxGroup,
  ({ input: { value, onChange, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    onChange: makeCountLimitOnChange(onChange, 2),
    ...props,
  })
);

const OpetuskieliField = createFormFieldComponent(
  OpetuskieliCheckboxGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const OpetustapaField = createFormFieldComponent(
  OpetustapaCheckboxGroup,
  ({ input: { value, ...input }, ...props }) => ({
    ...input,
    value: value || [],
    ...props,
  })
);

const OsiotFields = ({ language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);

  const osiotArrWithLabels = useMemo(() => {
    return (osiot || []).map(({ value, label }) => ({
      value,
      label: label
        ? label
        : _fp.get(
            'label',
            osiotOptions.find(({ value: v }) => v === value)
          ) || null, // TODO: Use something else than null as a label, when not found
    }));
  }, [osiot, osiotOptions]);

  return (
    <>
      {osiotArrWithLabels.map(({ value, label }, index) => (
        <Box
          marginBottom={index === osiot.length - 1 ? 0 : 2}
          key={value}
          {...getTestIdProps(`osioKuvaus.${value}`)}
        >
          <Field
            name={`${name}.osioKuvaukset.${value}.${language}`}
            component={FormFieldEditor}
            label={label}
          />
        </Box>
      ))}
    </>
  );
};

const SuunniteltuKestoFields = ({ name }) => {
  const { t } = useTranslation();

  return (
    <FieldGroup
      title={t('toteutuslomake.opintojenSuunniteltuKesto')}
      HeadingComponent={FormLabel}
      required
    >
      <Box display="flex">
        <Box>
          <Field
            name={`${name}.suunniteltuKesto.vuotta`}
            label={t('toteutuslomake.vuotta')}
            component={FormFieldIntegerInput}
            min={0}
            type="number"
          />
        </Box>
        <Box ml={2}>
          <Field
            name={`${name}.suunniteltuKesto.kuukautta`}
            label={t('toteutuslomake.kuukautta')}
            component={FormFieldIntegerInput}
            min={0}
            max={11}
            type="number"
          />
        </Box>
      </Box>
    </FieldGroup>
  );
};

const isLukuvuosimaksuVisible = (
  koulutustyyppi: KOULUTUSTYYPPI,
  opetuskielet?: Array<string>,
  tohtorikoulutukset?: Array<Koodi>,
  koulutusKoodiurit?: Array<string>
) => {
  return (
    isTutkintoonJohtavaKorkeakoulutus(koulutustyyppi) &&
    !isTohtorikoulutus(koulutusKoodiurit, tohtorikoulutukset) &&
    isEnglishChosen(opetuskielet)
  );
};

export const JarjestamisTiedotSection = ({
  language,
  koulutustyyppi,
  name,
  koulutusKoodiurit,
  toteutuksenMetadata,
}) => {
  const { t } = useTranslation();

  const osiotOptions = useLisatiedotOptions();

  const opetuskielet = useFieldValue<Array<string>>(`${name}.opetuskieli`);

  const toteutuksellaErillinenAloitusajankohta = useFieldValue(
    `${name}.ajankohta.ajankohtaKaytossa`
  );

  const { data: tohtorikoulutukset } = useKoulutuksetByTutkintotyyppi(
    TOHTORITUTKINTOTYYPPI
  );

  return (
    <>
      <FieldGroup title={t('yleiset.opetuskieli')}>
        <Box display="flex">
          <Box flexGrow={0} flexBasis="30%">
            <Field
              name={`${name}.opetuskieli`}
              component={OpetuskieliField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetuskieli')}
              required
            />
          </Box>
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetuskieliKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        </Box>
      </FieldGroup>
      <FieldGroup title={t('toteutuslomake.suunniteltuKesto')}>
        <Box display="flex">
          <Box flexGrow={0} flexBasis="30%">
            <SuunniteltuKestoFields name={name} />
          </Box>
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.suunniteltuKestoKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        </Box>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.opetusaika')}>
        <Box display="flex">
          <Box flexGrow={0} flexBasis="30%">
            <Field
              name={`${name}.opetusaika`}
              component={OpetusaikaField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetusaika')}
              helperText={t('yleiset.voitValitaEnintaan', { lukumaara: 2 })}
              required
            />
          </Box>
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetusaikaKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        </Box>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.paaasiallinenOpetustapa')}>
        <Box display="flex">
          <Box flexGrow={0} flexBasis="30%">
            <Field
              name={`${name}.opetustapa`}
              component={OpetustapaField}
              label={t('toteutuslomake.valitsePaaasiallinenOpetustapa')}
              required
            />
          </Box>
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.opetustapaKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        </Box>
      </FieldGroup>

      <FieldGroup title={t('toteutuslomake.opetuksenMaksullisuus')}>
        <Box display="flex">
          <Box flexGrow={0} flexBasis="30%">
            <MaksullisuusFields
              isLukuvuosimaksuVisible={isLukuvuosimaksuVisible(
                koulutustyyppi,
                opetuskielet,
                tohtorikoulutukset,
                koulutusKoodiurit
              )}
              name={name}
              label={t('toteutuslomake.onkoOpetusMaksullista')}
            />
          </Box>
          <Box flexGrow={1} paddingLeft={4}>
            <Field
              name={`${name}.maksullisuusKuvaus.${language}`}
              component={FormFieldEditor}
              label={t('yleiset.tarkempiKuvaus')}
              hideHeaderSelect
            />
          </Box>
        </Box>
      </FieldGroup>

      {/* ApurahaFields contains conditional rendering -> FieldGroup moved there */}
      <ApurahaFields
        language={language}
        name={name}
        koulutustyyppi={koulutustyyppi}
        toteutuksenMetadata={toteutuksenMetadata}
      />

      <FieldGroup title={t('yleiset.koulutuksenAjankohta')}>
        <Box mb={2}>
          <Field
            name={`${name}.ajankohta.ajankohtaKaytossa`}
            component={FormFieldSwitch}
          >
            {t('toteutuslomake.toteutuksellaErillinenAloitusajankohta')}
          </Field>
        </Box>
        {toteutuksellaErillinenAloitusajankohta && (
          <KoulutuksenAloitusajankohtaFields
            section={`${name}.ajankohta`}
            name={`${name}.ajankohta.ajankohtaTyyppi`}
            language={language}
          />
        )}
      </FieldGroup>

      {koulutustyyppi === KOULUTUSTYYPPI.LUKIOKOULUTUS && (
        <>
          <Box marginBottom={4}>
            <KielivalikoimaFields name={name} />
          </Box>

          <Box marginBottom={4}>
            <DiplomiFields name={`${name}.diplomit`} />
          </Box>
        </>
      )}

      <FieldGroup title={t('yleiset.valitseLisattavaOsio')}>
        <Field
          name={`${name}.osiot`}
          component={FormFieldSelect}
          options={osiotOptions}
          isMulti
        />
      </FieldGroup>

      <OsiotFields
        language={language}
        osiotOptions={osiotOptions}
        name={name}
      />
    </>
  );
};
