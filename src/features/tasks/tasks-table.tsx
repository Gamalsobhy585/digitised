"use client";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import {  Task } from './type';
import { Input } from "../../components/ui/input";
import {Table,TableBody, TableCell,TableHead,TableHeader,TableRow,} from "../../components/ui/table";
import { CirclePlus } from "lucide-react";
import { AddTask } from "./add-task";
import { z } from "zod";
import { taskSchema } from "./schemas";
import { getTaskColumns } from "./columns";



interface TasksTableProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  filter:string;
  onFilterChange(filter: string): void;
  onSearchChange: (query: string) => void;
  onDelete: (id: string) => void; 
  onShow: (params:{id: string}) => void;
  onUpdate: (params: { id: string; data: z.infer<typeof taskSchema> }) => void;
  selectedTask: Task | null; 
  setSelectedTask: (task: Task | null) => void; 
    
  onAdd: (task: {
    title: string;
    status: 1 | 2;
    description?: string | null;
    due_date?: string | null;
  }) => void;}

export function TasksTable({
  tasks,
  isLoading,
  error,
  currentPage,
  onPageChange,
  searchQuery,
  filter,
  onFilterChange,
  onSearchChange,
  onDelete,
  onAdd,
  onShow,
  onUpdate,
}: TasksTableProps) {
  const columns = getTaskColumns();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: tasks || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onDelete, 
      onAdd,
      onShow: (task: Task) => {
        setSelectedTask(task);
        setIsViewDialogOpen(true);
        onShow({ id: task.id }); 
      }
      ,
      onEdit: (task: Task) => {
        setSelectedTask(task);
        setIsEditDialogOpen(true);
      },
    },
  });

  return (
    <div className="w-full">
    <div className="flex justify-between items-center py-4">
    <div className="flex items-center gap-4">
      <Input 
        placeholder="Search" 
        value={searchQuery} 
        onChange={(e) => onSearchChange(e.target.value)} 
        className="max-w-sm" 
      />
       <select id="statusFilter" 
          className="w-full appearance-none bg-white border border-gray-200 shadow-sm px-4 py-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange(e.target.value)}       
          defaultValue={filter || "all"}

          value={filter || "all"}>
          <option value="all" selected={filter === "all" || !filter}>All</option>
          <option value="pending" selected={filter === "pending"}>Pending</option>
          <option value="completed" selected={filter === "completed"}>Completed</option>
        </select>
    
    </div>

  {/* Action Buttons */}
  <div className="flex items-center gap-1">
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <CirclePlus
          stroke="#DF0612"
          size={30}
          className="cursor-pointer"
          aria-label="Add Task"
        />
      </DialogTrigger>
      <DialogContent className="w-1/3 md:rounded-3xl">
        <AddTask
       
        onAdd={onAdd}

        />
      </DialogContent>
    </Dialog>
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="w-1/3 md:rounded-3xl">
        <AddTask 
          isViewMode={true} 
          initialData={selectedTask} 
          onShow={onShow} 
        
        />
      </DialogContent>
    </Dialog>
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="w-1/3 md:rounded-3xl">
        <AddTask
          isEditMode={true}
          initialData={selectedTask}
          onSubmit={(data) =>
            selectedTask && onUpdate({ id: selectedTask.id, data })
          }
        />
      </DialogContent>
    </Dialog>
  </div>
</div>
      <div className="rounded-2xl border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {error}
                </TableCell>
              </TableRow>
            ) : tasks.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    
      <div
        className='flex fixed "right-[4%]"} bottom-[2%] items-center justify-end space-x-2 py-4'
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
        previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
