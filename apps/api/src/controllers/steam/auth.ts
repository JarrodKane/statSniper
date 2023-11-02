import { Request, Response } from 'express';
import SteamAuth from 'node-steam-openid';

// Using https://www.npmjs.com/package/node-steam-openid to get the openid
// https://openid.net/certified-open-id-developer-tools/
// This is used to get the users steamId if they don't have it and want to sign in

// This is the Steam OpenID configuration object
const steam = new SteamAuth({
  realm: 'http://localhost:3002', // Site name displayed to users on logon
  returnUrl: 'http://localhost:3002/auth/steam/authenticate', // Your return route
  apiKey: 'F8ACC3280A73602F29EDF342F57E1515', // Steam API key
});

export const getSteamId = async (req: Request, res: Response) => {
  const redirectUrl = await steam.getRedirectUrl();
  return res.redirect(redirectUrl);
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const user = await steam.authenticate(req);
    console.log(user);
    res.json(user);
    //...do something with the data
  } catch (error) {
    console.error(error);
  }
};
