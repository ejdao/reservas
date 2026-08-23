const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
      includeSecondaries: true,
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    (pkg) => pkg.startsWith('@primeuix/themes/'),
    (pkg) => pkg === '@primeuix/styled' || pkg.startsWith('@primeuix/styled/'),
    (pkg) => pkg === '@primeuix/styles' || pkg.startsWith('@primeuix/styles/'),
  ],

  features: { ignoreUnusedDeps: true },
});
