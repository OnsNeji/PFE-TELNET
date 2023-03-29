// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:44355/api/',
  localUrl: 'http://localhost:4200/',
  captchaEndpointUrl: 'captcha-endpoint.ashx',

  inactivityTimeoutPeriode: 900,
  inactivityTimeoutPing: 1,
  timeBeforeSessionExpiration: 300000,

  maxPictureFileSize: 50, // 50 en KOctets

  maxEstimateFileSize: 2048, // 2048 en KOctets
  maxOrderFileSize: 1024, // 1024 en KOctets

  commitTime: '',

  minStrengthScore: 70,
  activitiesStrengthCheck: 'ALL' // Separate Activity Id to be Secured With ',' or Put ALL To Secure All Activities
};
