import React from 'react';
import { FormName, resetSection } from 'redux-form';
import { connect } from 'react-redux';

const ResetFormSection = ({ name, onResetSection, children = () => null }) => {
  return (
    <FormName>
      {({ form }) => children({ onReset: () => onResetSection(form, name) })}
    </FormName>
  );
};

export default connect(
  null,
  dispatch => ({
    onResetSection: (form, name) => dispatch(resetSection(form, name)),
  }),
)(ResetFormSection);
