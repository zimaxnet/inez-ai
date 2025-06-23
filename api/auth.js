const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.GRAPH_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.GRAPH_TENANT_ID}`,
    clientSecret: process.env.GRAPH_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Microsoft Graph client
const getAuthenticatedClient = async () => {
  const authResponse = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });

  const client = Client.init({
    authProvider: (done) => {
      done(null, authResponse.accessToken);
    },
  });

  return client;
};

// In-memory store for activation codes (replace with a database in production)
const activationCodes = {};

module.exports = async function (context, req) {
  // Enable CORS
  context.res = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    context.res.status = 200;
    return;
  }

  const { method, url } = req;
  const path = url.split('/').pop(); // Get the last part of the URL

  try {
    if (method === 'POST' && path === 'signup-email') {
      return await handleSignupEmail(context, req);
    } else if (method === 'POST' && path === 'activate') {
      return await handleActivate(context, req);
    } else {
      context.res.status = 404;
      context.res.body = { message: 'Endpoint not found' };
    }
  } catch (error) {
    console.error('Function error:', error);
    context.res.status = 500;
    context.res.body = { message: 'Internal server error' };
  }
};

async function handleSignupEmail(context, req) {
  const { email } = req.body;
  if (!email) {
    context.res.status = 400;
    context.res.body = { message: 'Email is required.' };
    return;
  }

  // 1. Generate activation code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  activationCodes[email] = code;

  try {
    // 2. Send email with Microsoft Graph
    const client = await getAuthenticatedClient();
    const sendMail = {
      message: {
        subject: 'Activate your account',
        body: {
          contentType: 'Text',
          content: `Your activation code is: ${code}`,
        },
        toRecipients: [
          {
            emailAddress: {
              address: email,
            },
          },
        ],
      },
      saveToSentItems: 'true',
    };

    await client.api(`/users/${process.env.GRAPH_USER_ID}/sendMail`).post(sendMail);
    
    // 3. Store code and associate with user (in-memory for now)
    console.log(`Activation code for ${email}: ${code}`);
    context.res.status = 200;
    context.res.body = { message: 'Activation code sent.' };

  } catch (error) {
    console.error(error);
    context.res.status = 500;
    context.res.body = { message: 'Error sending activation email.' };
  }
}

function handleActivate(context, req) {
  const { email, code } = req.body;
  if (!email || !code) {
    context.res.status = 400;
    context.res.body = { message: 'Email and code are required.' };
    return;
  }

  // 1. Verify code
  if (activationCodes[email] === code) {
    delete activationCodes[email]; // Code used, so remove it
    // 2. Complete registration (e.g., set emailVerified to true in your database)
    console.log(`Account activated for ${email}`);
    context.res.status = 200;
    context.res.body = { message: 'Account activated successfully.' };
  } else {
    context.res.status = 400;
    context.res.body = { message: 'Invalid activation code.' };
  }
} 