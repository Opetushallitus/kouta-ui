import { assign, createMachine, interpret } from 'xstate';

const initialMachine = createMachine({
  id: 'initialMachine',
  on: {
    SET_VALUES: {
      actions: [
        assign({
          values: (context, event) => ({
            ...context.values,
            ...event.values,
          }),
        }),
      ],
    },
  },
});

export const hakuMachine = initialMachine
  .withConfig({ id: 'hakuMachine' })
  .withContext({
    context: {
      values: {
        page: 0,
        nimi: '',
        tila: [],
        orderBy: '',
        hakutapa: [],
        koulutuksenAlkamiskausi: null,
        koulutuksenAlkamisvuosi: [],
      },
    },
  });

export const hakukohdeMachine = initialMachine
  .withConfig({ id: 'hakukohdeMachine' })
  .withContext({
    context: {
      values: {
        page: 0,
        nimi: '',
        hakuNimi: '',
        koulutustyyppi: [],
        tila: [],
        orgWhitelist: [],
        orderBy: '',
      },
    },
  });

export const koulutusMachine = initialMachine
  .withConfig({ id: 'koulutusMachine' })
  .withContext({
    context: {
      values: {
        page: 0,
        nimi: '',
        koulutustyyppi: [],
        tila: [],
        nakyvyys: null,
        orderBy: '',
      },
    },
  });

export const toteutusMachine = initialMachine
  .withConfig({ id: 'toteutusMachine' })
  .withContext({
    context: {
      values: {
        page: 0,
        nimi: '',
        koulutustyyppi: [],
        tila: [],
        orderBy: '',
      },
    },
  });

export const valintaperusteMachine = initialMachine
  .withConfig({ id: 'valintaperusteMachine' })
  .withContext({
    context: {
      values: {
        page: 0,
        nimi: '',
        koulutustyyppi: [],
        tila: [],
        nakyvyys: null,
        orderBy: '',
      },
    },
  });

//TODO RESET PAGINATION IN ALL MACHINES:
// RESET_PAGINATION: {
//   actions: [
//     assign({
//       haku: (context) => (context.haku.page = 0),
//     }),
//     assign({
//       hakukohde: context => (context.hakukohde.page = 0),
//     }),
//     assign({
//       koulutus: context => (context.koulutus.page = 0),
//     }),
//     assign({
//       toteutus: context => (context.toteutus.page = 0),
//     }),
//     assign({
//       valintaperuste: context => (context.valintaperuste.page = 0),
//     }),
//
export const hakuService = interpret(hakuMachine).start();
export const hakukohdeService = interpret(hakukohdeMachine).start();
export const koulutusService = interpret(koulutusMachine).start();
export const toteutusService = interpret(toteutusMachine).start();
export const valintaperusteService = interpret(valintaperusteMachine).start();
