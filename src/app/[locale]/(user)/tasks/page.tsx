import { TasksTable } from "../../../../features/tasks/tasks-table";
import {
  getTasks,
  deleteTask,
  createTask,
  getTask,
  updateTask,
} from "../../../../features/tasks/api";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { toast } from "react-toastify";
import { UpdateTaskVariables } from "../../../../features/tasks/type";
import { Task } from "../../../../features/tasks/type";


const Tasks = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    null
  );

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

      <TasksTable
        tasks={data?.data || []}
        isLoading={isLoading}
        error={isError ? error.message : null}
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
