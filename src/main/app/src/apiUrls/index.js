import { development as developmentUrls } from './urls';

export const configure = async urls => {
  const { NODE_ENV } = process.env;

  if (['development', 'test'].includes(NODE_ENV)) {
    urls.addProperties(developmentUrls);
  } else {
    await urls.load({ overrides: '/kouta/rest/config/frontProperties' });
  }

  return urls;
};

export default configure;
