
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


const Home = () => {

  const [loading, setLoading] = useState(false)

  const handleSubmitSteamId = async (steamId: string) => {
    try {
      setLoading(true)
      const data = await fetch(`${BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steamId })
      })

      const json = await data.json()
      console.log(json)
    } catch (error) {
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


    </>
  );
};

export default Home;
