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
  KOULUTUSTYYPPI,
  ORGANISAATIOTYYPPI,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useGetCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useKoodisto from '#/src/hooks/useKoodisto';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import JarjestaaUrheilijanAmmatillistaKoulutustaField from '#/src/pages/hakukohde/HakukohdeForm/JarjestaaUrheilijanAmmatillistaKoulutustaField';
import { getTestIdProps } from '#/src/utils';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import { useOppilaitoksetByOids } from '#/src/utils/hakukohde/getOppilaitoksetByOids';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { enrichOrganisaatiot } from '#/src/utils/organisaatio/enrichOrganisaatiot';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi, {
  getOrganisaatioTyypit,
} from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const useOrganisaatiotyyppiMap = () => {
  const { data: organisaatiotyypit } = useKoodisto({
    koodisto: 'organisaatiotyyppi',
  });

  return useMemo(
    () =>
      _fp.flow(
        _fp.map((k: any) => [
          k?.koodiUri,
          _fp.toLower(getKoodiNimiTranslation(k)),
        ]),
        _fp.fromPairs
      )(organisaatiotyypit),
    [organisaatiotyypit]
  );
};

const getOrganisaatioLabel = (org, language, organisaatiotyyppiMap, t) => {
  const nimi = getFirstLanguageValue(org?.nimi, language);
  const organisaatiotyyppi = getOrganisaatioTyypit(org)?.[0];
  const tyyppi = organisaatiotyyppiMap[organisaatiotyyppi];
  const jarjestaaUrheilijanAmmKoulutusta = org.jarjestaaUrheilijanAmmKoulutusta
    ? `, ${t('yleiset.urheilijanAmmKoulutus')}`
    : '';
  return (
    nimi + (tyyppi ? ` (${tyyppi}${jarjestaaUrheilijanAmmKoulutusta})` : '')
  );
};

export const useJarjestyspaikkaOptions = ({ tarjoajaOids, t }) => {
  const getCanUpdate = useGetCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE
  );

  const selectedValue = useFieldValue('jarjestyspaikkaOid');

  const { hierarkia, oppilaitokset } = useOppilaitoksetByOids(tarjoajaOids);

  const flattenedHierarkia = useMemo(
    () => flattenHierarkia(hierarkia),
    [hierarkia]
  );

  const hierarkiaOids = flattenedHierarkia.map(org => org.oid);

  const { organisaatio: selectedOrganisaatio, isLoading: isSelectedLoading } =
    useOrganisaatio(
      hierarkiaOids.includes(selectedValue) ? null : selectedValue,
      { enabled: !hierarkiaOids.includes(selectedValue) }
    );

  const orgs = [selectedOrganisaatio, ...flattenedHierarkia].filter(Boolean);
  const enrichedOrgs = enrichOrganisaatiot(orgs, oppilaitokset);

  const language = useUserLanguage();

  const organisaatiotyyppiMap = useOrganisaatiotyyppiMap();

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
          label: getOrganisaatioLabel(org, language, organisaatiotyyppiMap, t),
          disabled: !getCanUpdate(org),
          jarjestaaUrheilijanAmmKoulutusta:
            org.jarjestaaUrheilijanAmmKoulutusta,
        })),
        _fp.sortBy('label')
      )(enrichedOrgs),
    [getCanUpdate, language, organisaatiotyyppiMap, enrichedOrgs, t]
  );

  return {
    options: jarjestyspaikkaOptions,
    isLoading: isSelectedLoading,
  };
};

const JarjestyspaikkaRadioGroup = createFormFieldComponent(
  ({
    disabled,
    options,
    value,
    error,
    onChange,
    isLoading,
    koulutustyyppi,
  }) => {
    return isLoading ? (
      <Spin />
    ) : (
      <>
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
        <JarjestaaUrheilijanAmmatillistaKoulutustaField
          options={options}
          koulutustyyppi={koulutustyyppi}
        />
      </>
    );
  },
  simpleMapProps
);

export const JarjestyspaikkaSection = ({
  tarjoajat,
  koulutustyyppi,
}: {
  tarjoajat: Array<string>;
  koulutustyyppi: KOULUTUSTYYPPI;
}) => {
  const { t } = useTranslation();

  const { options: jarjestyspaikkaOptions, isLoading } =
    useJarjestyspaikkaOptions({
      tarjoajaOids: tarjoajat,
      t,
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
        koulutustyyppi={koulutustyyppi}
      />
    </div>
  );
};
