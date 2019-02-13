import React from 'react';
import { FormName, change } from 'redux-form';
import { connect } from 'react-redux';

const ClearFormSection = ({ name, children, onClearSectionFields }) => (
  <FormName>
    {({ form }) =>
      children({
        onClear: () => {
          onClearSectionFields(form, name);
        },
      })
    }
  </FormName>
);

export default connect(null, dispatch => ({
  onClearSectionFields: (form, section) => {
    dispatch(change(form, section, null));
  },
}))(ClearFormSection);
