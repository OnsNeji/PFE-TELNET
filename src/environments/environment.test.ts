export const environment = {
  production: false,
  apiUrl: 'https://telnetteamiis2/service/api/',
  localUrl: 'https://telnetteamiis2/',
  captchaEndpointUrl: 'captcha-endpoint.ashx',

  inactivityTimeoutPeriode: 900,
  inactivityTimeoutPing: 1,
  timeBeforeSessionExpiration: 300000,

  maxPictureFileSize: 50, // 50 en KOctets

  maxEstimateFileSize: 2048, // 2048 en KOctets
  maxOrderFileSize: 1024, // 1024 en KOctets

  commitTime: 'commit_time',

  minStrengthScore: 70,
  activitiesStrengthCheck: 'ALL' // Separate Activity Id to be Secured With ',' or Put ALL To Secure All Activities
};
