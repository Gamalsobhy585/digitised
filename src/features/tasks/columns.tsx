import { ColumnDef,Row } from "@tanstack/react-table";
import {  Task } from "./type";
import { Button } from "../../components/ui/button";
import {  SquarePen, Eye, Trash2, GripVertical } from "lucide-react";




export const getTaskColumns = (): ColumnDef<Task>[] => {

  return [
    {
      id: 'drag-handle',
      cell: () => <GripVertical className="h-4 w-4" />,
      size: 40,
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