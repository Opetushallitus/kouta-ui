import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  createFormFieldComponent,
  simpleMapProps,
} from '#/src/components/formFields';
import { Radio, RadioGroup, Spin } from '#/src/components/virkailija';
import {
  CRUD_ROLES,
  ENTITY,
  OPETUSHALLITUS_ORGANISAATIO_OID,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useGetCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi, {
  getOrganisaatioTyypit,
} from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const useJarjestyspaikkaOptions = ({ hierarkia, tarjoajat }) => {
  const { t } = useTranslation();
  const getCanUpdate = useGetCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE
  );

  const selectedValues = useFieldValue('jarjestyspaikkaOid');

  const language = useUserLanguage();

  return useMemo(
    () =>
      _fp.flow(
        flattenHierarkia,
        _fp.filter(
          (org: any) =>
            selectedValues?.includes(org?.oid) ||
            (organisaatioMatchesTyyppi([
              ORGANISAATIOTYYPPI.TOIMIPISTE,
              ORGANISAATIOTYYPPI.OPPILAITOS,
            ])(org) &&
              _fp.some((tarjoaja: any) =>
                _fp.includes(tarjoaja, org?.parentOidPath)
              )(tarjoajat))
        ),
        _fp.map(org => ({
          value: org?.oid,
          label: getOrganisaatioLabel(org, language, t),
          disabled: !getCanUpdate(org),
        })),
        _fp.sortBy('label')
      )(hierarkia),
    [getCanUpdate, hierarkia, language, tarjoajat, selectedValues, t]
  );
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
  toteutusOrganisaatioOid: string;
}) => {
  const { t } = useTranslation();

  const { hierarkia = [], isLoading } = useOrganisaatioHierarkia(
    OPETUSHALLITUS_ORGANISAATIO_OID
  );

  const jarjestyspaikkaOptions = useJarjestyspaikkaOptions({
    tarjoajat,
    hierarkia,
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
