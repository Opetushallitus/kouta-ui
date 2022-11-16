import { assign, createMachine } from 'xstate';

export const hakuMachine = createMachine({
  id: 'hakuMachine',
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

export const hakukohdeMachine = createMachine({
  id: 'hakukohdeMachine',
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

export const koulutusMachine = createMachine({
  id: 'koulutusMachine',
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

export const toteutusMachine = createMachine({
  id: 'toteutusMachine',
  context: {
    values: {
      page: 0,
      nimi: '',
      koulutustyyppi: [],
      tila: [],
      orderBy: '',
    },
  },
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

export const valintaperusteMachine = createMachine({
  id: 'valintaperusteMachine',
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
// export const hakuService = useInterpret(hakuMachine)
// export const hakukohdeService = useInterpret(hakukohdeMachine)
// export const koulutusService = useInterpret(koulutusMachine)
// export const toteutusService = useInterpret(toteutusMachine)
// export const valintaperusteService = useInterpret(valintaperusteMachine)
