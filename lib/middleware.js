import express from 'express';
import swig from 'swig-templates';
import swigFilters from './filters';
import router from './router';
import assets from '../build-assets.json';
import DBHelper from './dbhelper';

const middleware = config => {
  const app = express();
  DBHelper.init();
  app.locals.assets = assets;

  //Set up swig
  const swigOptions = {
    cache: process.env.NODE_ENV === 'production' ? 'memory' : false,
  };
  const swigEngine = new swig.Swig(swigOptions);
  app.engine('html', swigEngine.renderFile);
  Object.keys(swigFilters).forEach(name => {
    swig.setFilter(name, swigFilters[name]);
  });

  //App configuration
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'pug');
  app.set('view options', { layout: false });

  app.use('/', router(config));

  app.set('read_only',      config.options.readOnly      || false);
  app.set('gridFSEnabled',  config.options.gridFSEnabled || false);

  return app;
};

export default middleware;

