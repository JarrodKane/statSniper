import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { UserGameData } from 'shared-types';

type GameTableProps = {
  games: UserGameData[];
  loading?: boolean;
};

const GameTable: React.FC<GameTableProps> = ({ games, loading }) => {
  if (!games) {
    return (
      <DataTable columns={columns} data={[]} />
    );
  }

  return (
    <DataTable columns={columns} data={games} loading={loading} />
  );
};

export default GameTable;