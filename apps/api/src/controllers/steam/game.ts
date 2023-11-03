import axios from 'axios';
import { insertGame } from '../../database/dbQueries';
import * as Types from '../../types';

type GameResult =
  | Types.SteamAppDetailsResponse['data']['data']
  | { error: string };

export const GameController = {
  async getGame(appId: number): Promise<GameResult> {
    try {
      const response = await axios.get<Types.SteamAppDetailsResponse>(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );

      const gameData = response.data[appId].data;
      try {
        // TODO: There are some apps that I had that have no value but return a success, I'm not sure why this happens, it might be an dlc or product, but not a game, or a game that's been removed
        // Example appId: 2350
        // For now we will just ignore these and not count them towards the gamers score
        if (gameData?.name) {
          await insertGame({
            app_id: appId,
            provider_id: 1,
            name: gameData?.name,
            release_date: gameData?.release_date.date || '',
            image: gameData?.header_image || '',
          });
          return gameData;
        }
      } catch (error) {
        console.error(error);
        return { error: 'No Data' };
      }
      return { error: 'No Data' };
    } catch (error) {
      console.error(error);
      return { error: 'No Data' };
    }
  },
};
