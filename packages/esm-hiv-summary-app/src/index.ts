import { defineConfigSchema, getAsyncLifecycle } from '@openmrs/esm-framework';

const backendDependencies = { 'webservices.rest': '^2.2.0' };

const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

function setupOpenMRS() {
  const moduleName = '@ampath/esm-hiv-summary-app';

  const options = {
    featureName: 'hiv-summary',
    moduleName,
  };

  defineConfigSchema(moduleName, {});

  return {
    extensions: [
      {
        id: 'hiv-summary-widget',
        slot: 'patient-chart-summary-dashboard-slot',
        load: getAsyncLifecycle(() => import('./hiv-summary.component'), options),
        meta: {
          columnSpan: 4,
        },
      },
    ],

    // To be removed, used this for development purposes
    pages: [
      {
        route: /^patient\/.+\/hiv-summary/,
        load: getAsyncLifecycle(() => import('./hiv-summary.component'), options),
        online: true,
        offline: true,
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
