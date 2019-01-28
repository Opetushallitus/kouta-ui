import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import Radio, { RadioGroup } from '../Radio';

const renderSearchTypeField = ({ input }) => (
  <RadioGroup {...input}>
    <Radio value="a">
      Jatkuva haku / Erillishaku
    </Radio>
    <Radio value="b">
      Yhteishaku (näkyy vain rekisterin pitäjälle)
    </Radio>
  </RadioGroup>
);

const SearchTypeSection = props => {
  return ( 
  <div>
  <Typography variant="h6" marginBottom={2}>
    Valitse hakutapa
  </Typography>
  <Field name="type" component={renderSearchTypeField} />
  </div>);
};

export default SearchTypeSection;
