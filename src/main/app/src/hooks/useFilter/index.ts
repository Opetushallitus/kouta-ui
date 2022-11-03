import { assign, createMachine, interpret } from 'xstate';

export const filterMachine = createMachine({
  id: 'filterMachine',
  context: {
    haku: {
      page: 0,
      nimi: '',
    },
    hakukohde: {
      page: 0,
      nimi: '',
      hakuNimi: '',
    },
    koulutus: {
      page: 0,
      nimi: '',
    },
    toteutus: {
      page: 0,
      nimi: '',
    },
    valintaperuste: {
      page: 0,
      nimi: '',
    },
  },
  on: {
    SET_HAKU: {
      actions: [
        assign({
          haku: (context, event) => ({ ...context.haku, ...event.haku }),
        }),
      ],
    },
    SET_HAKUKOHDE: {
      actions: [
        assign({
          hakukohde: (context, event) => ({
            ...context.hakukohde,
            ...event.hakukohde,
          }),
        }),
      ],
    },
    SET_KOULUTUS: {
      actions: [
        assign({
          koulutus: (context, event) => ({
            ...context.koulutus,
            ...event.koulutus,
          }),
        }),
      ],
    },
    SET_TOTEUTUS: {
      actions: [
        assign({
          toteutus: (context, event) => ({
            ...context.toteutus,
            ...event.toteutus,
          }),
        }),
      ],
    },
    SET_VALINTAPERUSTE: {
      actions: [
        assign({
          valintaperuste: (context, event) => ({
            ...context.valintaperuste,
            ...event.valintaperuste,
          }),
        }),
      ],
    },
  },
});

export const filterService = interpret(filterMachine).start();

// nimi,
//   hakuNimi,
//   koulutustyyppi,
//   page,
//   orderBy,
//   tila,
//   julkinen,
//   nakyvyys,
//   hakutapa,
//   koulutuksenAlkamiskausi,
//   koulutuksenAlkamisvuosi,
//   orgWhitelist,
