import React from 'react';
import VUCButton from '@opetushallitus/virkailija-ui-components/Button';

export const Button = props => {
  return (
    <div className="ButtonWrapper">
      <VUCButton {...props} />
    </div>
  );
};

export default Button;
