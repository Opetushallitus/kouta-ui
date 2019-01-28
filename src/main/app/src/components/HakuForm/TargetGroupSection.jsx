import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';

const renderRadioGroupField = ({ input }) =>  (
  <RadioGroup {...input}>
    <Radio value="10">
      10 Aikuiskoulutus
    </Radio>
    <Radio value="11">
      11 Ammatillinen koulutus ja lukiokoulutus
    </Radio>
    <Radio value="12">
      12 Korkeakoulutus
    </Radio>
    <Radio value="13">
      13 Täydennyskoulutus
    </Radio>
    <Radio value="14">
      14 Vapaa sivistyö
    </Radio>
    <Radio value="15">
      15 Ammatillinen peruskoulutus erityisopetuksena
    </Radio>
    <Radio value="16">
      16 Valmentava ja kuntouttava koulutus
    </Radio>
    <Radio value="17">
      17 Perusopetuksen jälkeinen valmistava koulutus
    </Radio>
    <Radio value="18">
      18 Vapaan sivistystyön koulutus
    </Radio>
    <Radio value="19">
      19 Aikuisten perusopetus
    </Radio>
    <Radio value="20">
      20 erityisopetuksena järjestettävä ammatillinen koulutus
    </Radio>
    <Radio value="21">
      21 Yhteishaun ulkopuolinen lukiokoulutus
    </Radio>
    <Radio value="22">
      22 Pelastusalan koulutus
    </Radio>
    <Radio value="23">
      23 Ammatillinen koulutus
    </Radio>
    <Radio value="24">
      24 Lukiokoulutus
    </Radio>
  </RadioGroup>
);

const TargetGroupSection = () => (
  <div>
    <Typography variant="h6" marginBottom={2}>
      Haun kohdejoukko
    </Typography>
    <Field name="type" component={renderRadioGroupField} />
  </div>
);

export default TargetGroupSection;
