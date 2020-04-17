import { development as developmentUrls } from './urls';

export const configure = async (urls, httpClient) => {
  const { NODE_ENV, REACT_APP_CYPRESS } = process.env;

  const isCypress = !!REACT_APP_CYPRESS;

  if (['development', 'test'].includes(NODE_ENV)) {
    urls.addProperties(developmentUrls({ isCypress }));
  } else {
    const { data } = await httpClient.get('/kouta/rest/config/frontProperties');
    urls.addProperties(data);
  }

  return urls;
};

export default configure;
