import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import _ from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import {
  createFormFieldComponent,
  simpleMapProps,
} from '#/src/components/formFields';
import { CRUD_ROLES, ENTITY, ORGANISAATIOTYYPPI } from '#/src/constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useLanguage from '#/src/hooks/useLanguage';
import { Radio } from '#/src/components/virkailija';
import { useGetCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

const JARJESTYSPAIKATTOMAT_OPETUSTAVAT = [
  'opetuspaikkakk_2#1', // Verkko
  'opetuspaikkakk_3#1', // Eta
  'opetuspaikkakk_5#1', // Itsenainen
];

const Container = styled.div<{ isLast: boolean }>`
  ${({ isLast }) =>
    !isLast &&
    css`
      margin-bottom: 4px;
    `}
`;

type RadioGroupChild = React.ReactElement<{
  checked?: boolean;
  value: string;
  onChange?: (arg: any) => void;
  disabled?: boolean;
  error?: boolean;
}>;

// TODO: Use RadioGroup from virkailija-ui-components when it supports disabled-props for individual Radio-elements
export const RadioGroup = ({
  value,
  onChange,
  disabled = false,
  error = false,
  children: childrenProp,
}) => {
  const validChildren = React.Children.toArray(childrenProp).filter(c =>
    React.isValidElement(c)
  ) as RadioGroupChild[];

  const childrenCount = React.Children.count(validChildren);

  return (
    <>
      {validChildren.map((child, index) => {
        const checked = value !== undefined && child?.props?.value === value;
        const element = React.cloneElement(child, {
          checked,
          onChange,
          disabled: disabled || child.props?.disabled,
          error,
        });

        return (
          <Container
            key={_.uniqueId('RadioContainer_')}
            isLast={index === childrenCount - 1}
          >
            {element}
          </Container>
        );
      })}
    </>
  );
};

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

const JarjestyspaikkaSection = ({
  tarjoajat,
  opetustapaKoodiUrit,
  toteutusOrganisaatioOid,
}: {
  tarjoajat: Array<string>;
  opetustapaKoodiUrit: Array<string>;
  toteutusOrganisaatioOid: string;
}) => {
  const { t } = useTranslation();

  const { hierarkia = [] } = useOrganisaatioHierarkia(toteutusOrganisaatioOid);

  const getCanUpdate = useGetCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE
  );

  const language = useLanguage();
  const jarjestyspaikkaOptions = useMemo(
    () =>
      _.pipe(
        flattenHierarkia,
        _.filter(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
        _.map(org => ({
          value: org?.oid,
          label: getFirstLanguageValue(org?.nimi, language),
          disabled:
            // Disabled when none of tarjoajat is found up in the organization's
            // hierarchy including organization itself  or when user has no
            // update rights for the organization.
            _.every(tarjoaja => !_.includes(tarjoaja, org?.parentOidPath))(
              tarjoajat
            ) || !getCanUpdate(org),
        })),
        _.sortBy('label')
      )(hierarkia),
    [getCanUpdate, hierarkia, language, tarjoajat]
  );

  const jarjestyspaikkaOidRequired = _.difference(opetustapaKoodiUrit)(
    JARJESTYSPAIKATTOMAT_OPETUSTAVAT
  );

  return jarjestyspaikkaOidRequired ? (
    <div {...getTestIdProps('jarjestyspaikkaOidSelection')}>
      <Field
        label={t('hakukohdelomake.valitseJarjestyspaikka')}
        component={JarjestyspaikkaRadioGroup}
        options={jarjestyspaikkaOptions}
        name={`jarjestyspaikkaOid`}
      />
    </div>
  ) : null;
};

export default JarjestyspaikkaSection;
