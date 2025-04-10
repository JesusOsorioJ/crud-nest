import { useEffect, useState } from "react";
import Language from "../components/Language";
import { getAllItem } from "../api/item";
import CreateItem from "../components/CreateItem";
import TableItem from "../components/TableItem";
import FilterTasks from "../components/FilterItem";
import Paginator from "../components/Paginator";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

export interface Item {
  id?: number;
  content: string;
  updatedAt?: string;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;
const socket = io(baseURL);

function App() {
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>({ content: "" });

  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
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

  const filterPurchases = async (page) => {
    try {
      setSend(true);
      const resp = await getAllItem(
        `page=${page}&limit=${limit}&purchaseView=true&${filter}`
      );
      setTotalItems(resp.data.totalItems);
      setTotalPages(resp.data.totalPages);
      setData(resp.data.data);
    } catch {
      Swal.fire("Error fetching messages");
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 bg-gray-800  min-h-screen w-full p-10 text">
      <div className="flex gap-2">
        <Language />
      </div>

      <div className="text-black flex flex-col gap-2">
        <CreateItem
          form={form}
          setForm={setForm}
          setData={setData}
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
