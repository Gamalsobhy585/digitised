"use client"
import { TasksTable } from "../../../features/tasks/tasks-table";
import {
  getTasks,
  deleteTask,
  createTask,
  getTask,
  updateTask,
  importFile
} from "../../../features/tasks/api";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { toast } from "react-toastify";
import { UpdateTaskVariables } from "../../../features/tasks/type";
import { Task } from "../../../features/tasks/type";
import { Upload, FileUp } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { ChangeEvent } from 'react';
import { ApiResponse } from "@/lib/types";





const Tasks = () => {

  // import
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleImportFile({ target: { files: { ...acceptedFiles, item: (index: number) => acceptedFiles[index] || null } } });
      }
    },
    onDropRejected: () => {
      toast.error("Please upload only CSV or Excel files");
    }
  });
  



  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    null
  );
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);


  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks", currentPage, searchQuery, filter],
    queryFn: () =>
      getTasks({
        page: currentPage,
        query: searchQuery,
        filter: getApiFilterValue(filter),
      }),
  });

  const getApiFilterValue = (uiFilter: string) => {
    switch (uiFilter) {
      case "pending": return "pending";
      case "completed": return "completed";
      default: return "";
    }
  };




// import

const importMutation = useMutation<ApiResponse<any>, Error, File>({
  mutationFn: importFile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setIsImportDialogOpen(false);
    toast.success("Tasks imported successfully");
  },
  onError: (error) => {
    const errorMessage = error instanceof Error ? error.message : "Failed to import tasks";
    toast.error(errorMessage);
  }
});
const handleImportFile = (e: ChangeEvent<HTMLInputElement> | { target: { files: FileList | null } }) => {
  const file = e.target.files?.[0];
  
  if (!file) {
    toast.error("Please select a file first");
    return;
  }

  const validTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (!validTypes.includes(file.type)) {
    toast.error("Please upload only CSV or Excel files");
    return;
  }

  importMutation.mutate(file);
};



        


  const handleFilterChange = (filterValue: string) => {
    let apiFilterValue = "";
    
    if (filterValue === "pending") {
      apiFilterValue = "pending";
    } else if (filterValue === "completed") {
      apiFilterValue = "completed";
    } else if (filterValue === "all") {
      apiFilterValue = ""; 
    }
    
    setFilter(filterValue); 
    setCurrentPage(1);
    

  };

  

  const showMutation = useMutation({
    mutationFn: getTask,
    onSuccess: (data) => {
    setSelectedTask({
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      status_display: data.status_display, 
      due_date: data.due_date,
    });
    },
    onError: (error) => {
      toast.error(`Error fetching task details ${error}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateTaskVariables) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      toast.error(`Error Update task details ${error}`);
    },
  });

  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentPage, searchQuery, filter],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", currentPage, searchQuery, filter],
      });
    },
  });




//
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };



  
  const handleShow = (id: string) => {
    showMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
       <div className="flex gap-x-3">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Import Tasks
            </button>
        
          
            
            {isImportDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import Tasks</h2>
              <button 
                onClick={() => setIsImportDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <p className="text-sm">Upload a CSV or Excel file containing tasks data</p>
              
              <div 
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragActive ? 'bg-blue-50 border-blue-500' : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <FileUp className="mx-auto h-8 w-8 mb-4 text-gray-400" />
                <p className="mb-2 text-sm">
                  {isDragActive ? 'Drop the file here' : 'Drag and drop your file here or'}
                </p>
                <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:underline">
                  Browse files
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImportFile}
                    disabled={importMutation.isLoading}
                  />
                </label>
              </div>

              {importMutation.isLoading && (
                <div className="text-center">Importing Tasks...</div>
              )}
            </div>
          </div>
        </div>
      )}

          </div>

      <TasksTable
        tasks={data && 'data' in data ? data.data : []}
        isLoading={isLoading}
        error={isError && error instanceof Error ? error.message : null}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        onDelete={handleDelete}
        onAdd={addMutation.mutate}
        onShow={(params) => handleShow(params.id)}
        onUpdate={(params) => updateMutation.mutate(params)}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </>
  );
};

export default Tasks;
