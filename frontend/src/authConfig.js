import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "cfd13ecd-d84b-4950-91f4-84a336e04d31",
    authority: "https://zimaxai.ciamlogin.com/zimaxai.onmicrosoft.com/b2c_1_signup_email_only",
    knownAuthorities: ["zimaxai.ciamlogin.com"],
    redirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) {
          console.log(`[MSAL][${LogLevel[level]}]: ${message}`);
        }
      },
      logLevel: LogLevel.Info, // Options: Error, Warning, Info, Verbose
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
}; 