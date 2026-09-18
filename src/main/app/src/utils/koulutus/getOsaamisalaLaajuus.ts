import {
  MuodostumisSaanto,
  OsaamisalaOsa,
} from '#/src/utils/ePeruste/getEPerusteRakenne';
import iterateTree from '#/src/utils/iterateTree';

// Asetetaan osaamisalan "vanhemman" muodostumisSaanto rekursiivisesti alaspäin
// sellaisille osaamisaloille, joilta se puuttuu,
// jotta voidaan käyttöliittymässä näyttää osaamisalan laajuus.
const getOsaamisalaLaajuus = (
  ePerusteOsat: Array<OsaamisalaOsa>,
  osaamisalakoodi: string
): number | undefined => {
  const osat = ePerusteOsat.map(ePerusteOsa => {
    return setDefaultMuodostumisSaanto(ePerusteOsa);
  });

  let osaamisalaLaajuus: number | undefined;
  iterateTree(
    osat,
    (osa: OsaamisalaOsa) => {
      if (osa.osaamisala?.osaamisalakoodiArvo === osaamisalakoodi) {
        osaamisalaLaajuus = osa.muodostumisSaanto?.laajuus?.minimi;
      }
    },
    {
      childrenKey: 'osat',
    }
  );

  return osaamisalaLaajuus;
};

const setDefaultMuodostumisSaanto = (
  osaamisala: OsaamisalaOsa,
  defaultMuodostumisSaanto?: MuodostumisSaanto
): OsaamisalaOsa => {
  const muodostumisSaanto =
    osaamisala.muodostumisSaanto || defaultMuodostumisSaanto;

  return {
    ...osaamisala,
    muodostumisSaanto,
    osat: osaamisala.osat?.map(osa => {
      return setDefaultMuodostumisSaanto(osa, muodostumisSaanto);
    }),
  };
};

export default getOsaamisalaLaajuus;
export { setDefaultMuodostumisSaanto };
