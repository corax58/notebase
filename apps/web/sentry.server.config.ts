// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fcfe9337a0a92aa05bb6d35537dc2679@o4508574746083328.ingest.de.sentry.io/4512262556155984",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1,
  environment:
    process.env.VERCEL_GIT_COMMIT_REF === "staging"
      ? "staging"
      : (process.env.VERCEL_ENV ?? "development"),

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    userInfo: false,
    httpBodies: [],
  },
  beforeSend(event) {
    if (event.request) {
      delete event.request.data; // note text
      delete event.request.cookies;
      if (event.request.headers) {
        for (const k of Object.keys(event.request.headers)) {
          if (k.toLowerCase() === "authorization") {
            delete event.request.headers[k];
          }
        }
      }
    }
    return event;
  },
});
