import React from 'react';
import { Field } from 'redux-form';

import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useTranslation from '../useTranslation';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../FormFields';
import { getTestIdProps } from '../../utils';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OrganizationSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);

  return (
    <div {...getTestIdProps('jarjestajatSelection')}>
      <Field
        name={name}
        hierarkia={hierarkia}
        component={JarjestajatField}
        label={t('koulutuslomake.valitseJarjestajat')}
      />
    </div>
  );
};

export default OrganizationSection;
