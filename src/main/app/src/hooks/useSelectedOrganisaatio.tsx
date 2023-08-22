import { useSelector } from '#/src/hooks/reduxHooks';
import { selectOrganisaatio } from '#/src/state/organisaatioSelection';

export const useSelectedOrganisaatioOid = () => useSelector(selectOrganisaatio);
