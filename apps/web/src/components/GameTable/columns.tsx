'use client';

import { Button } from '@/components/ui/button';
import { ICON_URL } from '@/constants';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { UserGameData } from 'shared-types';
import { getTotalHours } from '../../lib/utils';

export const columns: ColumnDef<UserGameData>[] = [
  {
    accessorKey: 'img_icon_url',
    header: 'Icon',
    cell: ({ row }) => {
      const appId = row.getValue('appid');
      const iconUrl = row.getValue('img_icon_url');
      const imageUrl = `${ICON_URL}${appId}/${iconUrl}.jpg`;
      return <img src={imageUrl} />;
    },
  },
  {
    accessorKey: 'appid',
    header: 'Appid',
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'playtime_forever',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Hours Played
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const totalMins = parseFloat(row.getValue('playtime_forever'));
      const hours = getTotalHours(totalMins)
      return <div className="text-right font-medium pr-3">{hours}</div>;
    },
  },
  {
    accessorKey: 'metacritic',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Metacritic
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium pr-3">{row.getValue('metacritic')}</div>;
    },
  },
  {
    accessorKey: 'release_date',
    header: 'Release Date',
  },
];
