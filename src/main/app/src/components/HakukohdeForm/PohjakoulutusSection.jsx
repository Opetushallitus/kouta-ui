import React from 'react';
import { Field, formValues } from 'redux-form';

import Radio, { RadioGroup } from '../Radio';
import Typography from '../Typography';
import Input from '../Input';
import Spacing from '../Spacing';

const renderKoulutusvaatimusField = ({ input }) => (
  <RadioGroup {...input}>
    <Radio value="peruskoulu">Peruskoulu PK</Radio>
    <Radio value="lukio">Lukion oppimäärä YO</Radio>
    <Radio value="ammatillinen">Eristyisopetuksena järjestettävä ammattillinen perustutkinto</Radio>
    <Radio value="ei">Ei pohjakoulutusvaatimusta</Radio>
    <Radio value="muu">Muu</Radio>
  </RadioGroup>
);

const KoulutusvaatimusFieldValue = formValues({
  koulutusvaatimus: 'koulutusvaatimus',
})(({ koulutusvaatimus, children }) => children({ koulutusvaatimus }))

const PohjakoulutusSection = props => {
  return (
    <>
      <Typography variant="h6" marginBottom={1}>Valitse pohjakoulutusvaatimus</Typography>
      <Field name="koulutusvaatimus" component={renderKoulutusvaatimusField} />
      <KoulutusvaatimusFieldValue>
        {({ koulutusvaatimus }) => koulutusvaatimus === 'muu' ? (
          <Spacing marginTop={1}>
          
          </Spacing>
        ) : null}
      </KoulutusvaatimusFieldValue>
    </>
  );
};

export default PohjakoulutusSection;
