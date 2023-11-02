import axios from 'axios';
import { PROVIDERS_LIST } from '../../constants/providers';
import { insertGame } from '../../database/dbQueries';

export const GameController = {
  async getGame(appId: string) {
    try {
      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );

      const gameData = response.data[appId].data;

      try {
        await insertGame(
          appId,
          Object.keys(PROVIDERS_LIST)[0], // TODO: This needs to be dynamic, but we know we only have steam as a provider
          gameData?.name || null,
          gameData?.release_date.date || null,
          gameData?.header_image || null
        );
        return gameData;
      } catch (error) {
        console.error(error);
        return { error: 'Failed to insert game data' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'Failed to retrieve game data' };
    }
  },
};
