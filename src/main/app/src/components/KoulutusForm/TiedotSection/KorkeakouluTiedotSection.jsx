import React from 'react';
import { Field } from 'redux-form';

import KoulutusSelect from '../KoulutusSelect';
import Typography from '../../Typography';
import Spacing from '../../Spacing';
import Input from '../../Input';
import TutkintoNimikeSelect from './TutkintonimikeSelect';
import useKoodistoOptions from '../../useKoodistoOptions';
import Select from '../../Select';

const noop = () => {};

const renderKoulutusField = ({ input, koulutustyyppi }) => (
  <KoulutusSelect koulutustyyppi={koulutustyyppi} {...input} onBlur={noop} />
);

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderTutkintoNimikeField = ({ input }) => (
  <TutkintoNimikeSelect {...input} onBlur={noop} />
);

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} onBlur={noop} />
);

export const KorkeakoulutuTiedotSection = ({ koulutustyyppi, language }) => {
  const { options: laajuusOptions } = useKoodistoOptions({ koodisto: 'opintojenlaajuus' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          Valitse koulutuskoodi
        </Typography>
        <Field
          name="koulutus"
          component={renderKoulutusField}
          koulutustyyppi={koulutustyyppi}
        />
      </Spacing>
  
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          Muokkaa koulutuksen nimeä
        </Typography>
        <Field name={`nimi.${language}`} component={renderInputField} />
      </Spacing>
  
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          Valitse tutkintonimike
        </Typography>
        <Field name="tutkintonimike" component={renderTutkintoNimikeField} />
      </Spacing>
  
      <Typography variant="h6" marginBottom={1}>
        Opintojen laajuus
      </Typography>
      <Field name="opintojenLaajuus" component={renderSelectField} options={laajuusOptions} />
    </>
  );
}

export default KorkeakoulutuTiedotSection;
