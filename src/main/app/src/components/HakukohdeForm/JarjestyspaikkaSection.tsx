import React from 'react';
import { Field } from 'redux-form';
import _ from 'lodash/fp';

import { useTranslation } from 'react-i18next';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { FormFieldRadioGroup } from '../formFields';
import { ORGANISAATIOTYYPPI } from '../../constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatioService/organisaatioMatchesTyyppi';
import { getFirstLanguageValue, getTestIdProps } from '#/src/utils';
import useLanguage from '#/src/components/useLanguage';
const JARJESTYSPAIKATTOMAT_OPETUSTAVAT = [
  'opetuspaikkakk_2#1', // Verkko
  'opetuspaikkakk_3#1', // Eta
  'opetuspaikkakk_5#1', // Itsenainen
];

const JarjestyspaikkaSection = ({ tarjoajat, opetustapaKoodiUrit }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(tarjoajat, {
    filter: _.negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });
  const language = useLanguage();
  const jarjestysOptions = _.flatMapDeep(({ children }) => children)(
    hierarkia
  ).map(({ oid, nimi }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi, language),
  }));
  const jarjestyspaikkaOidRequired = _.difference(opetustapaKoodiUrit)(
    JARJESTYSPAIKATTOMAT_OPETUSTAVAT
  );

  return jarjestyspaikkaOidRequired ? (
    <div {...getTestIdProps('jarjestyspaikkaOidSelection')}>
      <Field
        label={t('hakukohdelomake.valitseJarjestyspaikka')}
        component={FormFieldRadioGroup}
        options={jarjestysOptions}
        name={`jarjestyspaikkaOid`}
      />
    </div>
  ) : null;
};

export default JarjestyspaikkaSection;
