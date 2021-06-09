import iterateTree from '#/src/utils/iterateTree';

const getOsaamisalaLaajuus = (ePerusteOsat, osaamisalakoodi) => {
  const osat = ePerusteOsat.map(ePerusteOsa => {
    return setDefaultMuodostumisSaanto(ePerusteOsa);
  });

  let osaamisalaLaajuus = null;
  iterateTree(
    osat,
    osa => {
      if (
        osa.osaamisala &&
        osa.osaamisala.osaamisalakoodiArvo === osaamisalakoodi
      ) {
        osaamisalaLaajuus = osa.muodostumisSaanto.laajuus.minimi;
      }
    },
    {
      childrenKey: 'osat',
    }
  );

  return osaamisalaLaajuus;
};

const setDefaultMuodostumisSaanto = (osaamisala, defaultMuodostumisSaanto) => {
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
