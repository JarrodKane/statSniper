'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from "lucide-react";
import { UserGameData } from 'shared-types';


export const columns: ColumnDef<UserGameData>[] = [
  {
    accessorKey: 'appid',
    header: 'Appid',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'playtime_forever',
    header: ({ column }) => {
      return (
        <div className='text-right'>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Hours Played
            < ArrowUpDown className="ml-2 h-4 w-4" />
          </Button >
        </div>

      )
    },
    cell: ({ row }) => {
      const totalMins = parseFloat(row.getValue("playtime_forever"))
      const hours = Math.floor(totalMins / 60)


      return <div className="text-right font-medium pr-3">{hours}</div>
    },
  },
  {
    accessorKey: 'rtime_last_played',
    header: 'Last Played',
  },
  {
    accessorKey: 'release_date',
    header: 'Release Date',
  },
];


// header: ({ column }) => {
//   return (
//     <Button
//       variant="ghost"
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//     >
//       Email
//       <ArrowUpDown className="ml-2 h-4 w-4" />
//     </Button>
//   )
// },