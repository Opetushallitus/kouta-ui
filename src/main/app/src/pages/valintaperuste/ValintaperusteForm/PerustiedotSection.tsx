import React from 'react';

import TyyppiSection from './TyyppiSection';
import HakutavanRajausSection from './HakutavanRajausSection';
import KohdejoukonRajausSection from './KohdejoukonRajausSection';
import KieliversiotFields from '#/src/components/KieliversiotFields';
import { Divider } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const PerustiedotSection = ({ name, canEditTyyppi = true }) => {
  return (
    <>
      {canEditTyyppi ? (
        <div {...getTestIdProps('tyyppiSection')}>
          <TyyppiSection name={`${name}.tyyppi`} />
          <Divider marginTop={3} marginBottom={3} />
        </div>
      ) : null}
      <div {...getTestIdProps('kieliversiotSection')}>
        <KieliversiotFields name={`${name}.kieliversiot`} />
      </div>
      <Divider marginTop={3} marginBottom={3} />
      <div {...getTestIdProps('hakutapaSection')}>
        <HakutavanRajausSection name={`${name}.hakutapa`} />
      </div>
      <Divider marginTop={3} marginBottom={3} />
      <div {...getTestIdProps('kohdejoukkoSection')}>
        <KohdejoukonRajausSection name={`${name}.kohdejoukko`} />
      </div>
    </>
  );
};

export default PerustiedotSection;
