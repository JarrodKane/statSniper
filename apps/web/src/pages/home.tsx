
import { ProfileForm } from "@/components/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { BASE_URL } from "@/constants";
import { useState } from "react";
import { UserGameStats } from 'shared-types';
import GameTable from "../components/GameTable";
import { getTotalHours } from "../lib/utils";

import { Skeleton } from "@/components/ui/skeleton";


const Home = () => {

  const [loading, setLoading] = useState(false)
  const [gameData, setGameData] = useState<UserGameStats>({})


  const handleSubmitSteamId = async (steamId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steamId })
      })

      const data: UserGameStats = await response.json()
      setGameData(data)
    } catch (error) {
      setGameData({})
      console.error(error)
    } finally {
      setLoading(false)
    }
    // TODO: Handle errors, and handle success
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search for Steam Stats</CardTitle>
          <CardDescription>
            Enter your Steam ID to search for your stats
          </CardDescription>
          <CardDescription>
            <a className='underline' href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC" target="_blank" rel="noopener noreferrer">How to find your Steam ID</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm callBack={handleSubmitSteamId} loading={loading} />
        </CardContent>
      </Card>
      {gameData.steam && (
        <Card>
          <CardHeader>
            <CardTitle>Steam Stats</CardTitle>
            {/* <CardDescription> */}
            <div className='flex gap-3'>
              Total Play Time: {loading ? <Skeleton className="w-[100px] h-[20px] rounded-full" /> : getTotalHours(gameData.steam.totalPlayTime)}
            </div>
            {/* </CardDescription> */}
          </CardHeader>
          <CardContent>
            <GameTable games={gameData.steam.games} loading={loading} />
          </CardContent>
        </Card>
      )
      }

    </>
  );
};

export default Home;
