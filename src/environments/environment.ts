const host = window.location.hostname;
const port = 3000;
let https = false;
let str = 'http://';
let web_host = host;

if (host === 'localhost') {
  https = false;
  str = 'http://';
  web_host = host + ':4200';
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  env: 'dev',
  production: false,
  staging: false,

  // captcha_site_key: '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU',

  // API_URL: 'https://b634se4hde.execute-api.us-east-2.amazonaws.com/dev',
  API_URL: 'https://d365jxlrgh.execute-api.us-east-2.amazonaws.com/dev/',
  PROFILE_URL: 'https://vdci0c911h.execute-api.us-east-2.amazonaws.com/dev/',
  PROFILE_SEARCH: 'https://1hzf62m5b8.execute-api.us-east-2.amazonaws.com/dev/search/',
  imageUrl: 'https://kp1isgthr4.execute-api.us-east-2.amazonaws.com/dev/s3/',
  // imageUrl: 'https://t9dokzqtq9.execute-api.us-east-2.amazonaws.com/dev',
  SETTING_URL: 'https://pxn7ak85x1.execute-api.us-east-2.amazonaws.com/dev/settings',
  POST_URL: 'https://sth0i52mfd.execute-api.us-east-2.amazonaws.com/dev/post',
  PACK_URL: 'https://qaioc5fcf0.execute-api.us-east-2.amazonaws.com/dev/pack',
  AGREEMENT_URL: ' https://niwr104krf.execute-api.us-east-2.amazonaws.com/dev/',
  RELEASE_URL: 'https://4f5z0pcw6b.execute-api.us-east-2.amazonaws.com/dev/',
  PRODUCT_URL: 'https://7jipfp444c.execute-api.us-east-2.amazonaws.com/dev/product',
  EXCLUSIVE_URL: 'https://tspj9jsd2g.execute-api.us-east-2.amazonaws.com/dev/exclusive',
  TAGS_URL: 'https://1mgipeqau4.execute-api.us-east-2.amazonaws.com/dev/tags',
  ACCESS_KEY_ID: 'AKIAJDVV3R2Q36ZNWYLA',
  SECRET_ACCESS_KEY: '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',
  PAYMENT: 'https://dl9bblutqc.execute-api.us-east-2.amazonaws.com/dev/payment',
  MODERATION: 'https://ku94jis6z5.execute-api.us-east-2.amazonaws.com/dev/',
  LOGS: 'https://yelsurtyh2.execute-api.us-east-2.amazonaws.com/dev/logs',
  COMMENTS: 'https://xpwyll8n77.execute-api.us-east-2.amazonaws.com/dev',
  VOTES: 'https://2tc4cb4j1m.execute-api.us-east-2.amazonaws.com/dev',
  SUBSCRIPTION_URL: 'https://t6kstmq7s3.execute-api.us-east-2.amazonaws.com/dev',
  CHAT_URL: 'https://3qwcqv8nn7.execute-api.us-east-2.amazonaws.com/dev/chat',
  CATEGORY_URL: 'https://ddkph7ls6e.execute-api.us-east-2.amazonaws.com/dev/categories',
  HOTLINK_URL: 'https://4q7wt5h6z8.execute-api.us-east-2.amazonaws.com/dev/hotlink',
  NOTIFICATION_URL: 'https://3ntcldcehb.execute-api.us-east-2.amazonaws.com/dev/sns/publish/',
  OFFLINE_NOTIFICATION_URL: 'https://1pspwnpuwh.execute-api.us-east-2.amazonaws.com/dev/notification',
  LIVE_NOTIFICATION_URL: 'https://sqs.us-east-2.amazonaws.com/581396462716/',
  QUICK_QUESTION_URL: 'https://4gtiu7unx5.execute-api.us-east-2.amazonaws.com/dev/quick_message',
  FEED_URL: 'https://89e9lvnf79.execute-api.us-east-2.amazonaws.com/dev/feeds',
  TAXES_URL: 'https://aqipzsmtw7.execute-api.us-east-2.amazonaws.com/dev/taxes/get-payment-info/',

};
