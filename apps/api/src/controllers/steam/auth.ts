import { Request, Response } from 'express';
import SteamAuth from 'node-steam-openid';
import { insertUserProvider } from '../../database/dbQueries';

// Using https://www.npmjs.com/package/node-steam-openid to get the openid
// https://openid.net/certified-open-id-developer-tools/
// This is used to get the users steamId if they don't have it and want to sign in

// This is the Steam OpenID configuration object
const steam = new SteamAuth({
  realm: 'http://localhost:3002', // Site name displayed to users on logon
  returnUrl: 'http://localhost:3002/v1/auth/steam/authenticate', // Your return route
  apiKey: 'F8ACC3280A73602F29EDF342F57E1515', // Steam API key
});

export const getSteamId = async (req: Request, res: Response) => {
  const redirectUrl = await steam.getRedirectUrl();
  return res.redirect(redirectUrl);
};

export const redirect = async (req: Request, res: Response) => {
  try {
    const user = await steam.authenticate(req);

    const { steamid, username, avatar } = user;

    // TODO: change out the hard codded 1 for the user id, this should be stored in the browser once they sign in
    const userId = 1;
    const providerId = 1;

    await insertUserProvider({
      user_id: userId,
      provider_id: providerId,
      unique_Id: Number(steamid),
      name: username,
      avatar: avatar.medium,
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error authenticating with Steam' });
  }
};
