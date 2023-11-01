import axios from 'axios';
import { Request, Response } from 'express';

export const getPlayerStats = async (req: Request, res: Response) => {
  const { steamId } = req.params;
  const apiKey = process.env.STEAM_API_KEY;
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve player stats' });
  }
};

export const getOwnedGames = async (req: Request, res: Response) => {
  const steamPathId = req.params.steamId;
  const apiKey = process.env.STEAM_API_KEY;

  const parts = steamPathId.split('=');
  const steamId = parts[1];

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve players games' });
  }
};
