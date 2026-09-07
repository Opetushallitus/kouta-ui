import React from 'react';

import { Input } from '#/src/components/virkailija';

export const UrlInput = ({ onChange, onBlur, ...props }) => {
  // Etuliite lisätään blurissa, ja muutos annetaan lomakkeelle onChangella. redux-formin
  // BLUR-reducer kirjoitti tapahtuman arvon kentän arvoksi, joten e.target.valuen
  // mutatointi riitti; react-final-formin onBlur vain merkitsee kentän kosketetuksi,
  // ja ilman onChangea etuliite katoaisi hiljaa.
  const usedOnBlur = e => {
    const value: string = e?.target?.value;
    if (value && !value.startsWith('http')) {
      e.target.value = 'http://' + value;
      onChange?.(e);
    }
    onBlur(e);
  };

  return <Input onChange={onChange} onBlur={usedOnBlur} {...props} />;
};
