import { useSelector } from 'react-redux';

import { selectOrganisaatio } from '#/src/state/organisaatioSelection';

export const useSelectedOrganisaatioOid = () => useSelector(selectOrganisaatio);
