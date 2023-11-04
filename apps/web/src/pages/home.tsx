
import { ProfileForm } from "@/components/ProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";


const Home = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search for Steam Stats</CardTitle>
          <CardDescription>
            <p>Enter your Steam ID to search for your stats</p>
            <a className='underline' href="https://help.steampowered.com/en/faqs/view/2816-BE67-5B69-0FEC" target="_blank" rel="noopener noreferrer">How to find your Steam ID</a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>


    </>
  );
};

export default Home;
