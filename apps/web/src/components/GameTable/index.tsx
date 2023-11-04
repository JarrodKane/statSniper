import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"

// import { UserGameStats } from "shared-types"

export default function GameTable(gamesData: []) {


  return (
    <>
      <DataTable columns={columns} data={gamesData} />
    </>
  )
}
