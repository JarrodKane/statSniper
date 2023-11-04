import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { UserGameStats } from 'shared-types';

type GameTableProps = {
  gamesData: UserGameStats;
  loading?: boolean;
};

const GameTable: React.FC<GameTableProps> = ({ gamesData, loading }) => {
  if (!gamesData.steam) {
    return (
      <>
        <DataTable columns={columns} data={[]} />
      </>
    );
  }

  const { totalPlayTime, games } = gamesData.steam
  return (
    <Card>
      <CardHeader>
        <CardTitle>Steam Stats</CardTitle>
        <CardDescription>
          Total Play Time: {totalPlayTime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={games} loading={loading} />
      </CardContent>
    </Card>
  );
};

export default GameTable;