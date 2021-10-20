import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  createFormFieldComponent,
  simpleMapProps,
} from '#/src/components/formFields';
import { Radio, RadioGroup } from '#/src/components/virkailija';
import { CRUD_ROLES, ENTITY, ORGANISAATIOTYYPPI } from '#/src/constants';
import { useGetCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getTestIdProps } from '#/src/utils';
import iterateTree from '#/src/utils/iterateTree';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const JARJESTYSPAIKATTOMAT_OPETUSTAVAT = [
  'opetuspaikkakk_2#1', // Verkko
  'opetuspaikkakk_3#1', // Eta
  'opetuspaikkakk_5#1', // Itsenainen
];

const JarjestyspaikkaRadioGroup = createFormFieldComponent(
  ({ disabled, options, value, error, onChange }) => {
    return (
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

const useOppilaitokset = hierarkia => {
  const oppilaitokset: Array<any> = [];
  iterateTree(hierarkia, org => {
    if (organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org)) {
      oppilaitokset.push(org);
    }
  });
  return oppilaitokset;
};

export const JarjestyspaikkaSection = ({
  tarjoajat,
  toteutusOrganisaatioOid,
}: {
  tarjoajat: Array<string>;
  toteutusOrganisaatioOid: string;
}) => {
  const { t } = useTranslation();

  const { hierarkia = [] } = useOrganisaatioHierarkia(toteutusOrganisaatioOid);

  const oppilaitokset = useOppilaitokset(hierarkia);

  const getCanUpdate = useGetCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE
  );

  const language = useUserLanguage();
  const jarjestyspaikkaOptions = useMemo(
    () =>
      _fp.flow(
        flattenHierarkia,
        (organisaatiot: any) => {
          const toimipisteet = _fp.filter(
            organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)
          )(organisaatiot);

          return _fp.isEmpty(toimipisteet) ? oppilaitokset : toimipisteet;
        },
        _fp.map(org => ({
          value: org?.oid,
          label: getFirstLanguageValue(org?.nimi, language),
          disabled:
            // Disabled when none of tarjoajat is found up in the organization's
            // hierarchy including organization itself  or when user has no
            // update rights for the organization.
            _fp.every(tarjoaja => !_fp.includes(tarjoaja, org?.parentOidPath))(
              tarjoajat
            ) || !getCanUpdate(org),
        })),
        _fp.sortBy('label')
      )(hierarkia),
    [getCanUpdate, hierarkia, language, tarjoajat, oppilaitokset]
  );

  const jarjestyspaikkaOidRequired = _fp.difference(opetustapaKoodiUrit)(
    JARJESTYSPAIKATTOMAT_OPETUSTAVAT
  );

  return jarjestyspaikkaOidRequired ? (
    <div {...getTestIdProps('jarjestyspaikkaOidSelection')}>
      <Field
        label={t('hakukohdelomake.valitseJarjestyspaikka')}
        component={JarjestyspaikkaRadioGroup}
        options={jarjestyspaikkaOptions}
        name={`jarjestyspaikkaOid`}
        required
      />
    </div>
  ) : null;
};
