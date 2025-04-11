import { useEffect, useState } from "react";
import Language from "../components/Language";
import { getAllItem } from "../api/item";
import CreateItem from "../components/CreateItem";
import TableItem from "../components/TableItem";
import FilterTasks from "../components/FilterItem";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export interface Item {
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  image?: string;
  imageUrl?: string;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;
const socket = io(baseURL);

function App() {
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>({});

  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 5;

  useEffect(() => {
    socket.on("taskCreated", (task) => {
      Swal.fire(`Tarea creada Titulo: ${task.title}`);
      filterPurchases(1);
    });

    socket.on("taskUpdated", (task) => {
      Swal.fire(`Tarea actualizada Titulo: ${task.title}`);
      filterPurchases(1);
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
    };
  }, []);

  useEffect(() => {
    filterPurchases(1);
  }, [filter]);

  useEffect(() => {
    filterPurchases(currentPage);
  }, [currentPage]);

  const filterPurchases = async (page: number): Promise<void> => {
    try {
      setSend(true);
      const resp = await getAllItem(
        `page=${page}&limit=${limit}&purchaseView=true&${filter}`
      );
      if(resp){
        setTotalItems(resp.data.totalItems);
        setTotalPages(resp.data.totalPages);
        setData(resp.data.data);
      }
    } catch {
      Swal.fire("Error fetching messages");
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 bg-gray-800 min-h-screen w-full p-10 text">
      <div className="flex gap-2">
        <Language />
      </div>

      <div className="text-black flex flex-col gap-2">
        <CreateItem
          form={form}
          setForm={setForm}
          setSend={setSend}
        />
        <FilterTasks setFilter={setFilter} totalItems={totalItems} />
        <TableItem
          data={data}
          send={send}
          setSend={setSend}
          setData={setData}
          setForm={setForm}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default App;
