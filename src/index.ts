import RingCentral from '@rc-ex/core';
import WSExtension from '@rc-ex/ws';
import DebugExtension from '@rc-ex/debug';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const debugExt = new DebugExtension();
  await rc.installExtension(debugExt);
  const wsExt = new WSExtension({
    debugMode: true,
  });
  await rc.installExtension(wsExt);
  await wsExt.subscribe(['/restapi/v1.0/account/~/presence?detailedTelephonyState=true&sipData=true'], (event) => {
    // do nothing, because we have debugMode to print all events
  });

  // make sure that oauth token is refreshed before it expires
  setInterval(async () => {
    await rc.refresh();
  }, 3000000); // 50 minutes
};
main();
