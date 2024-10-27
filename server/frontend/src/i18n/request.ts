import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async () => ({
  // (defaults to the current time)
  now: new Date(),
 
  // (defaults to the server's time zone)
  timeZone: 'Europe/Amsterdam',
 
  // (requires an explicit preference)
  locale: 'en',

  formats: {
    dateTime: {
      shortDateTime: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
}));