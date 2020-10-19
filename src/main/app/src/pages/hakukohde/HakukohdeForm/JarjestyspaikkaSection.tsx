import React from 'react';
import { Field } from 'redux-form';
import _ from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { FormFieldRadioGroup } from '#/src/components/formFields';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useLanguage from '#/src/hooks/useLanguage';
import { flatFilterHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

const JARJESTYSPAIKATTOMAT_OPETUSTAVAT = [
  'opetuspaikkakk_2#1', // Verkko
  'opetuspaikkakk_3#1', // Eta
  'opetuspaikkakk_5#1', // Itsenainen
];

const JarjestyspaikkaSection = ({
  tarjoajat,
  opetustapaKoodiUrit,
  organisaatioOid,
}: {
  tarjoajat: Array<string>;
  opetustapaKoodiUrit: Array<string>;
  organisaatioOid: string;
}) => {
  const { t } = useTranslation();

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  const language = useLanguage();
  const jarjestyspaikkaOptions = flatFilterHierarkia(
    hierarkia,
    _.overEvery([
      organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE),
      org =>
        // Select intersection of organisaatio branches from selected organisaatio and tarjoajat
        _.some(tarjoaja => _.includes(tarjoaja, org?.parentOidPath))(tarjoajat),
    ])
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
        options={jarjestyspaikkaOptions}
        name={`jarjestyspaikkaOid`}
      />
    </div>
  ) : null;
};

export default JarjestyspaikkaSection;
