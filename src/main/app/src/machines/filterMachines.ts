import { assign, createMachine, interpret } from 'xstate';

const initialMachine = createMachine({
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
    RESET_PAGINATION: {
      actions: assign(context => {
        return (context.values.page = 0);
      }),
    },
  },
});

export const hakuMachine = initialMachine.withContext({
  values: {
    page: 0,
    nimi: '',
    tila: [],
    orderBy: '',
    hakutapa: [],
    koulutuksenAlkamiskausi: null,
    koulutuksenAlkamisvuosi: [],
  },
});

export const hakukohdeMachine = initialMachine.withContext({
  values: {
    page: 0,
    nimi: '',
    hakuNimi: '',
    koulutustyyppi: [],
    tila: [],
    orgWhitelist: [],
    orderBy: '',
  },
});

export const koulutusMachine = initialMachine.withContext({
  values: {
    page: 0,
    nimi: '',
    koulutustyyppi: [],
    tila: [],
    nakyvyys: null,
    orderBy: '',
  },
});

export const toteutusMachine = initialMachine.withContext({
  values: {
    page: 0,
    nimi: '',
    koulutustyyppi: [],
    tila: [],
    orderBy: '',
  },
});

export const valintaperusteMachine = initialMachine.withContext({
  values: {
    page: 0,
    nimi: '',
    koulutustyyppi: [],
    tila: [],
    nakyvyys: null,
    orderBy: '',
  },
});

export const hakuService = interpret(hakuMachine).start();
export const hakukohdeService = interpret(hakukohdeMachine).start();
export const koulutusService = interpret(koulutusMachine).start();
export const toteutusService = interpret(toteutusMachine).start();
export const valintaperusteService = interpret(valintaperusteMachine).start();
