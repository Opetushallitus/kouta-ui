import { ORGANISAATIOTYYPPI } from '#/src/constants';
import organisaatioMachesTyyppi from './organisaatioService/organisaatioMatchesTyyppi';

const organisaatioIsOppilaitos = organisaatioMachesTyyppi(
  ORGANISAATIOTYYPPI.OPPILAITOS
);

export default organisaatioIsOppilaitos;
