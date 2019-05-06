import { development as developmentUrls } from './urls';

export const configure = async urls => {
  const { NODE_ENV, REACT_APP_CYPRESS } = process.env;

  const isCypress = !!REACT_APP_CYPRESS;

  if (['development', 'test'].includes(NODE_ENV)) {
    urls.addProperties(developmentUrls({ isCypress }));
  } else {
    await urls.load({ overrides: '/kouta/rest/config/frontProperties' });
  }

  return urls;
};

export default configure;
