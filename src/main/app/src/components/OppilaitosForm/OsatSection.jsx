import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { FormFieldCheckboxGroup } from '../FormFields';
import { getFirstLanguageValue } from '../../utils';
import useLanguage from '../useLanguage';
import useTranslation from '../useTranslation';

const OsatSection = ({ organisaatioOid, name }) => {
  const language = useLanguage();
  const { hierarkia } = useOrganisaatioHierarkia(organisaatioOid);
  const { t } = useTranslation();

  const options = useMemo(() => {
    return (get(hierarkia, '[0].children') || []).map(({ nimi, oid }) => ({
      value: oid,
      label: getFirstLanguageValue(nimi, language),
    }));
  }, [hierarkia, language]);

  return (
    <>
      <Field
        component={FormFieldCheckboxGroup}
        label={t('oppilaitoslomake.valitseOppilaitoksenOsat')}
        options={options}
      />
    </>
  );
};

export default OsatSection;
