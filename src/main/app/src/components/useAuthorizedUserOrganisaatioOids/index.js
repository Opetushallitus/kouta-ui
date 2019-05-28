import { getKayttajanOrganisaatioOids } from '../../apiUtils';
import useApiAsync from '../useApiAsync';

const useAuthorizedUserOrganisaatioOids = () => {
  const { data, ...rest } = useApiAsync({
    promiseFn: getKayttajanOrganisaatioOids,
  });

  return { organisaatioOids: data, ...rest };
};

export default useAuthorizedUserOrganisaatioOids;
