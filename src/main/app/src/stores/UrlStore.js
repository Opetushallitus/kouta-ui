import {observable} from 'mobx';
import {urls as ophUrls} from 'oph-urls-js';
import {development, production} from '../tarjonta-urls.js';

class UrlStore {
    @observable urls = ophUrls;

    async loadFrontProperties() {
        await this.urls.load({overrides: '/kouta/rest/config/frontProperties'});
    }

    constructor() {
        console.log('Ollaan ympäristössä ' + process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
            this.urls.addProperties(development);
        } else {
            this.urls.addProperties(production);
            this.loadFrontProperties();
        }
    }
}

let urlStore = null;

export const getUrlStore = () => {
  if (!urlStore) {
    urlStore = new UrlStore();
  }
  return urlStore;
};
