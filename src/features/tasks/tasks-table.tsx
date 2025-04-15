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
import { useEffect, useState } from "react";
import {  Task } from './type';
import { Input } from "../../components/ui/input";
import {Table,TableBody, TableCell,TableHead,TableHeader,TableRow,} from "../../components/ui/table";
import { CirclePlus,GripVertical } from "lucide-react";
import { AddTask } from "./add-task";
import { z } from "zod";
import { taskSchema } from "./schemas";
import { getTaskColumns } from "./columns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  UniqueIdentifier,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { changeOrder } from "./api";
import { toast } from "react-toastify";




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
  onReorderSuccess?: () => void;
    
  onAdd: (task: {
    title: string;
    status: 1 | 2;
    description?: string | null;
    due_date?: string | null;
  }) => void;
}

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
  onReorderSuccess,
}: TasksTableProps) {
  const columns = getTaskColumns();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [items, setItems] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);


  const SortableRow = ({ row, ...props }: { row: any; [key: string]: any }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: row.original.id,
    });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      zIndex: isDragging ? 1 : 0,
    };
  
    return (
      <tr
        ref={setNodeRef}
        style={style}
        className="border-b hover:bg-gray-50"
        {...props}
      >
        {row.getVisibleCells().map((cell: { id: string; column: any; getContext: () => any }) => (
          <td key={cell.id} className="px-4 py-3">
            {cell.column.id === 'drag-handle' ? (
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </button>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </td>
        ))}
      </tr>
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragStart = (event: import('@dnd-kit/core').DragStartEvent) => {
    setActiveId(event.active.id);
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const originalItems = [...items];
    
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);

    setItems(newItems);

    try {
      await changeOrder(Number(active.id), Number(over.id));
      
      onReorderSuccess?.();
      
      toast.success("Tasks reordered successfully");
    } catch (error) {
      // Revert on error
      setItems(originalItems);
      toast.error("Failed to reorder tasks");
      console.error("Reorder error:", error);
    }
    
    setActiveId(null);
  };






  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: items || [],
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
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
          <SortableContext
            items={(items || []).map(item => item?.id).filter(Boolean)}
            strategy={verticalListSortingStrategy}
          >
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
                ) : tasks?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <SortableRow key={row.id} row={row} />
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
              </SortableContext>
            </TableBody>
          </Table>
          <DragOverlay>
          {activeId ? (
            <tr className="border-b bg-white shadow-lg">
              {table.getRowModel().rows.find(row => row.original && row.original.id === activeId)
                ?.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {cell.column.id === 'drag-handle' ? (
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                ))}
            </tr>
          ) : null}
        </DragOverlay>
        </DndContext>
      </div>
    
      <div className="flex fixed right-[4%] bottom-[2%] items-center justify-end space-x-2 py-4">
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
