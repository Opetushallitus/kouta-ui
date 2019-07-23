import React from 'react';

import TyyppiSection from './TyyppiSection';
import HakutavanRajausSection from './HakutavanRajausSection';
import KohdejoukonRajausSection from './KohdejoukonRajausSection';
import KieliversiotFields from '../KieliversiotFields';
import Divider from '../Divider';
import { getTestIdProps } from '../../utils';

const PerustiedotSection = ({ canEditTyyppi = true }) => {
  return (
    <>
      {canEditTyyppi ? (
        <div {...getTestIdProps('tyyppiSection')}>
          <TyyppiSection name="tyyppi" />
          <Divider marginTop={3} marginBottom={3} />
        </div>
      ) : null}
      <div {...getTestIdProps('kieliversiotSection')}>
        <KieliversiotFields name="kieliversiot" />
      </div>
      <Divider marginTop={3} marginBottom={3} />
      <div {...getTestIdProps('hakutapaSection')}>
        <HakutavanRajausSection name="hakutapa" />
      </div>
      <Divider marginTop={3} marginBottom={3} />
      <div {...getTestIdProps('kohdejoukkoSection')}>
        <KohdejoukonRajausSection name="kohdejoukko" />
      </div>
    </>
  );
};

export default PerustiedotSection;
