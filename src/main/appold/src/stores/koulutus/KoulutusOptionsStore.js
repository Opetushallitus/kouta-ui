import {initState} from "../../utils/stateUtils";

export const APP_STATE_KOULUTUSTYYPPI_OPTIONS = 'APP_STATE_KOULUTUSTYYPPI_OPTIONS';



export const KoulutusOptionsStore = () => {
    configureKoulutustyyppiOptions();
};

export const configureKoulutustyyppiOptions = () => initState(APP_STATE_KOULUTUSTYYPPI_OPTIONS, [
    {
        value: 'amm',
        label: 'Ammatillinen koulutus'
    },
    {
        value: 'kk',
        label: 'Korkeakoulukoulutus'
    },
    {
        value: 'lk',
        label: 'Lukiokoulutus'
    }]
);