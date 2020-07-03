import { ORGANISAATIOTYYPPI } from '#/src/constants';
import organisaatioMachesTyyppi from './organisaatioMatchesTyyppi';

const organisaatioIsOppilaitos = organisaatioMachesTyyppi(
  ORGANISAATIOTYYPPI.OPPILAITOS
);

export default organisaatioIsOppilaitos;
