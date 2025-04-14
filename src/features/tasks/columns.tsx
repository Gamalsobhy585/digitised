import { ColumnDef,Row } from "@tanstack/react-table";
import {  Task } from "./type";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import {  SquarePen, Eye, Trash2 } from "lucide-react";




export const getTaskColumns = (): ColumnDef<Task>[] => {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="mx-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={("select all")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mx-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={("select row")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ("id"),
      cell: ({ row }) => (
        <div className={ "text-center"}>
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full`}
        >
          {("title")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`${  "text-center" }`}>
          {row.getValue("title")}
        </div>
      ),
    },
 
    {
      accessorKey: "status_display", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status_display");
        const statusClass = status === "completed" ? "text-green-600" : "text-yellow-600";
        return (
          <div className={`capitalize ${statusClass}`}>
            {status as string}
          </div>
        );
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full`}
        >
          {("due date")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`text-center`}>
          {row.getValue("due_date") || "-"}
        </div>
      ),
    },

    {
      id: "actions",
      header: () => (
        <div className={`text-center`}>
          {("actions")}
        </div>
      ),
      enableHiding: false,
      cell: ({ row, table }: { row: Row<Task>; table: any }) => {
        const onDelete = table.options.meta?.onDelete;
        const onEdit = table.options.meta?.onEdit;
        return (
          <div className="flex items-center gap-2 justify-center text-primary">
            <SquarePen
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onEdit && onEdit(row.original)}
              aria-label={("Edit")}
            />
            <Eye
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => table.options.meta?.onShow(row.original)}
              aria-label={("View")}
            />
            <Trash2
              size={24}
              className="cursor-pointer hover:text-red-500"
              onClick={() => onDelete && onDelete(row.original.id)}
              aria-label={("Delete")}
            />
          </div>
        );
      },
    },
  ];
};