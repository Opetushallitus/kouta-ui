import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  createFormFieldComponent,
  simpleMapProps,
} from '#/src/components/formFields';
import { Radio, RadioGroup, Spin } from '#/src/components/virkailija';
import { CRUD_ROLES, ENTITY, ORGANISAATIOTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useGetCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import organisaatioMatchesTyyppi, {
  getOrganisaatioTyypit,
} from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const useJarjestyspaikkaOptions = ({ tarjoajaOids }) => {
  const { t } = useTranslation();
  const getCanUpdate = useGetCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE
  );

  const selectedValue = useFieldValue('jarjestyspaikkaOid');

  const selectableOids = [selectedValue, ...tarjoajaOids].filter(Boolean);

  const { organisaatiot: orgs, ...rest } = useOrganisaatiot(selectableOids);

  const language = useUserLanguage();

  const jarjestyspaikkaOptions = useMemo(
    () =>
      _fp.flow(
        _fp.filter(
          organisaatioMatchesTyyppi([
            ORGANISAATIOTYYPPI.TOIMIPISTE,
            ORGANISAATIOTYYPPI.OPPILAITOS,
          ])
        ),
        _fp.map(org => ({
          value: org?.oid,
          label: getOrganisaatioLabel(org, language, t),
          disabled: !getCanUpdate(org),
        })),
        _fp.sortBy('label')
      )(orgs),
    [getCanUpdate, orgs, language, t]
  );

  return { options: jarjestyspaikkaOptions, ...rest };
};

const JarjestyspaikkaRadioGroup = createFormFieldComponent(
  ({ disabled, options, value, error, onChange, isLoading }) => {
    return isLoading ? (
      <Spin />
    ) : (
      <RadioGroup
        value={value}
        disabled={disabled}
        error={error}
        onChange={onChange}
      >
        {options.map(({ value, disabled, label }) => (
          <Radio key={value} value={value} disabled={disabled}>
            {label}
          </Radio>
        ))}
      </RadioGroup>
    );
  },
  simpleMapProps
);

const getOrganisaatioTyyppiTranslation = (org, t) => {
  const organisaatioTyyppi = getOrganisaatioTyypit(org)?.[0];
  return t(`organisaatiotyypit.${organisaatioTyyppi}`);
};

const getOrganisaatioLabel = (org, language, t) => {
  const nimi = getFirstLanguageValue(org?.nimi, language);
  const tyyppi = getOrganisaatioTyyppiTranslation(org, t);
  return nimi + (tyyppi ? ` (${tyyppi})` : '');
};

export const JarjestyspaikkaSection = ({
  tarjoajat,
}: {
  tarjoajat: Array<string>;
}) => {
  const { t } = useTranslation();

  const { options: jarjestyspaikkaOptions, isLoading } =
    useJarjestyspaikkaOptions({
      tarjoajaOids: tarjoajat,
    });

  return (
    <div {...getTestIdProps('jarjestyspaikkaOidSelection')}>
      <Field
        label={t('hakukohdelomake.valitseJarjestyspaikka')}
        component={JarjestyspaikkaRadioGroup}
        options={jarjestyspaikkaOptions}
        name="jarjestyspaikkaOid"
        required
        isLoading={isLoading}
      />
    </div>
  );
};
