import React from 'react';
import { Field } from 'redux-form';

import KoulutusSelect from '../KoulutusSelect';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';
import { createFormFieldComponent, selectMapProps } from '../../FormFields';

const KoulutusField = createFormFieldComponent(KoulutusSelect, selectMapProps);

export const KoulutuskoodiField = ({ koulutustyyppi, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('koulutuskoodiSelect')}>
      <Field
        name={`${name}.koulutus`}
        component={KoulutusField}
        koulutustyyppi={koulutustyyppi}
        label={t('koulutuslomake.valitseKoulutuskoodi')}
      />
    </div>
  );
};

export default KoulutuskoodiField;
