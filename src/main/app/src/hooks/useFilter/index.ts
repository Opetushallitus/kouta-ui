import { assign, createMachine, interpret } from 'xstate';

export const filterMachine = createMachine({
  id: 'filterMachine',
  context: {
    nimi: '',
    hakuNimi: '',
    // koulutustyyppi: '',
    // page: 0,
    // orderBy: 'asc',
    // tila: '',
    // julkinen: '',
    // nakyvyys: '',
    // hakutapa: '',
    // koulutuksenAlkamiskausi: '',
    // koulutuksenAlkamisvuosi: '',
    // orgWhitelist: '',
  },
  on: {
    SET_NIMI: {
      actions: [
        assign({ nimi: (context, event) => event.nimi }),
        context => console.log(`nimi set: ${context.nimi}`),
      ],
    },
    SET_HAKUNIMI: {
      actions: [
        assign({ hakuNimi: (context, event) => event.hakuNimi }),
        context => console.log(`hakuNimi set: ${context.hakuNimi}`),
      ],
    },
    // SET_KOULUTUSTYYPPI: {
    //   actions: assign({
    //     koulutustyyppi: (context, event) => event.koulutustyyppi,
    //   })
    // },
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
