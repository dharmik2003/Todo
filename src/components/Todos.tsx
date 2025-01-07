"use client";
import React, { useEffect, useState } from "react";
import { addTodos, deleteTodo, fetchTodos, updateTodo } from "../actions/todo";
import { Edit, X } from "lucide-react";
import Header from "./Header";
import { fetchUserData, getAuthenticatedUser } from "@/actions/users";

interface UserDataProps {
  id: number;
  name: string;
  email: string;
  created_at: string;
  user_id: string;
}

interface Task {
  id: number;
  title: string;
  user_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const TodoList = () => {
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
  });
  const [todos, setTodos] = useState<Task[]>([]);
  const [userData, setUserData] = useState<UserDataProps>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTodoData, setEditTodoData] = useState<any>(null);

  const handleTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTodoData({ ...todoData, [name]: value });
  };

  const handleAddTodo = async () => {
    setError(null);
    setSuccess(null);

    try {
      const response = await addTodos({
        ...todoData,
        user_id: userData?.user_id as string,
      });
      if (response) {
        setSuccess("Todo added successfully!");
        setTodoData({ title: "", description: "" });
        loadTodos();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const response = await deleteTodo(todoId);
      if (response) {
        setSuccess("Todo deleted successfully!");
        loadTodos();
      }
    } catch (error) {
      setError("Failed to delete todo");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      loadTodos();
    }
  }, [userData]);

  const loadTodos = async () => {
    if (!userData?.user_id) {
      return;
    }

    setLoading(true);
    try {
      const fetchedTodos = await fetchTodos(userData.user_id);
      setTodos(fetchedTodos as Task[]);
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching todos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const fetchId = await getAuthenticatedUser();
      if (fetchId?.id) {
        const fetchedUser = await fetchUserData(fetchId?.id);
        if (fetchedUser) {
          setUserData(fetchedUser.data);
        }
      }
    } catch (err: any) {
      console.error("err", err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleEditTodo = (todo: any) => {
    setEditTodoData(todo);
    setIsModalOpen(true);
  };

  const handleUpdateTodo = async () => {
    if (!editTodoData) return;

    try {
      const response = await updateTodo({
        id: editTodoData.id,
        title: editTodoData.title,
        description: editTodoData.description,
        user_id: editTodoData.user_id,
      });
      if (response.success) {
        setSuccess("Todo updated successfully!");
        setIsModalOpen(false);
        loadTodos();
      } else {
        setError(response.message || "Failed to update todo");
      }
    } catch (err) {
      setError("An error occurred while updating the todo");
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    // <div className="min-h-screen bg-gray-100 py-8 px-4">
    //   <div className="flex flex-col w-full h-full">
    //     <Header userName={userData?.name as string} />
    //     <div className="max-w-4xl mx-auto mt-5">
    //       {/* Add Todo Form */}
    //       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    //         <h2 className="text-2xl font-bold mb-6">Add New Todo</h2>

    //         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    //         {success && (
    //           <p className="text-green-500 text-sm mb-4">{success}</p>
    //         )}

    //         <div className="space-y-4">
    //           <input
    //             type="text"
    //             name="title"
    //             placeholder="Todo Title"
    //             value={todoData.title}
    //             onChange={handleTodoChange}
    //             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //           <input
    //             type="text"
    //             name="description"
    //             placeholder="Todo Description"
    //             value={todoData.description}
    //             onChange={handleTodoChange}
    //             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //           />
    //           <button
    //             onClick={handleAddTodo}
    //             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
    //           >
    //             Add Todo
    //           </button>
    //         </div>
    //       </div>

    //       {/* Todos Grid */}
    //       <div className="bg-white rounded-lg shadow-md p-6">
    //         <h2 className="text-2xl font-bold mb-6">My Todos</h2>
    //         {loading ? (
    //           <div className={"flex items-center justify-center gap-2"}>
    //             <div className="pageloader"></div>
    //             <div className="text-xl text-blue-200">Loading...</div>
    //           </div>
    //         ) : todos.length !== 0 ? (
    //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //             {todos.map((todo: any, index: any) => (
    //               <div
    //                 key={todo.id || index}
    //                 className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200"
    //               >
    //                 <button
    //                   onClick={() => handleEditTodo(todo)}
    //                   className="absolute top-2 right-10 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
    //                   aria-label="Edit todo"
    //                 >
    //                   <Edit size={16} className="text-blue-500" />
    //                 </button>
    //                 <button
    //                   onClick={() => handleDeleteTodo(todo.id)}
    //                   className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
    //                   aria-label="Delete todo"
    //                 >
    //                   <X size={16} className="text-red-500" />
    //                 </button>
    //                 <h3 className="font-semibold text-lg text-gray-800 mb-2">
    //                   {todo.title}
    //                 </h3>
    //                 <p className="text-gray-600 text-sm">{todo.description}</p>
    //               </div>
    //             ))}
    //           </div>
    //         ) : (
    //           <div className="h-[200px] flex flex-col justify-center items-center">
    //             <div className="text-xl text-gray-400">No Todos found</div>
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     {/* Edit Todo Modal */}
    //     {isModalOpen && editTodoData && (
    //       <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
    //         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
    //           <h2 className="text-2xl font-bold mb-4">Edit Todo</h2>
    //           {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    //           <div className="space-y-4">
    //             <input
    //               type="text"
    //               name="title"
    //               placeholder="Todo Title"
    //               value={editTodoData.title}
    //               onChange={(e) =>
    //                 setEditTodoData({
    //                   ...editTodoData,
    //                   title: e.target.value,
    //                 })
    //               }
    //               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             />
    //             <input
    //               type="text"
    //               name="description"
    //               placeholder="Todo Description"
    //               value={editTodoData.description}
    //               onChange={(e) =>
    //                 setEditTodoData({
    //                   ...editTodoData,
    //                   description: e.target.value,
    //                 })
    //               }
    //               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //             />
    //             <div className="flex justify-between gap-3">
    //               <button
    //                 onClick={handleCancelEdit}
    //                 className="bg-gray-300 w-full py-2 px-4 rounded-md"
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 onClick={handleUpdateTodo}
    //                 className="bg-blue-600 first-letter w-full text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
    //               >
    //                 Update
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>

    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loadingUser ? (
        <div className="min-h-screen w-full flex items-center justify-center gap-2">
          <div className="pageloader"></div>
          <div className="text-xl text-blue-200">Loading...</div>
        </div>
      ) : userData ? (
        <>
          <Header userName={userData.name} />
          <div className="max-w-4xl mx-auto mt-5">
            {/* Add Todo Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Add New Todo</h2>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm mb-4">{success}</p>
              )}
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Todo Title"
                  value={todoData.title}
                  onChange={handleTodoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Todo Description"
                  value={todoData.description}
                  onChange={handleTodoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTodo}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Todo
                </button>
              </div>
            </div>

            {/* Todos Grid */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">My Todos</h2>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="pageloader"></div>
                  <div className="text-xl text-blue-200">Loading...</div>
                </div>
              ) : todos.length !== 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {todos.map((todo: any, index: any) => (
                    <div
                      key={todo.id || index}
                      className="relative p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="absolute top-2 right-10 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                        aria-label="Edit todo"
                      >
                        <Edit size={16} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                        aria-label="Delete todo"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">
                        {todo.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {todo.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex flex-col justify-center items-center">
                  <div className="text-xl text-gray-400">No Todos found</div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen w-full flex items-center justify-center gap-2">
          <div className="pageloader"></div>
          <div className="text-xl text-blue-200">Loading...</div>
        </div>
      )}
    </div>
  );
};
