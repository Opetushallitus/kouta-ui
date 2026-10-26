import iterateTree from '#/src/utils/iterateTree';

type MuodostumisSaanto = {
  laajuus: {
    minimi: number;
  };
};

type Osa = {
  osaamisala?: {
    osaamisalakoodiArvo: string;
  };
  muodostumisSaanto?: MuodostumisSaanto;
  osat?: Array<Osa>;
};

// Asetetaan osaamisalan "vanhemman" muodostumisSaanto rekursiivisesti alaspäin
// sellaisille osaamisaloille, joilta se puuttuu,
// jotta voidaan käyttöliittymässä näyttää osaamisalan laajuus.
const getOsaamisalaLaajuus = (
  ePerusteOsat: Array<Osa>,
  osaamisalakoodi: string
): number | null => {
  const osat = ePerusteOsat.map(ePerusteOsa => {
    return setDefaultMuodostumisSaanto(ePerusteOsa);
  });

  let osaamisalaLaajuus: number | null = null;
  iterateTree(
    osat,
    osa => {
      if (osa.osaamisala?.osaamisalakoodiArvo === osaamisalakoodi) {
        osaamisalaLaajuus = osa.muodostumisSaanto.laajuus.minimi;
      }
    },
    {
      childrenKey: 'osat',
    }
  );

  return osaamisalaLaajuus;
};

const setDefaultMuodostumisSaanto = (
  osaamisala: Osa,
  defaultMuodostumisSaanto?: MuodostumisSaanto
): Osa => {
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
