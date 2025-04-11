import { useEffect, useState } from "react";
import Language from "../components/Language";
import { getAllItem } from "../api/item";
import CreateItem from "../components/CreateItem";
import TableItem from "../components/TableItem";
import FilterTasks from "../components/FilterItem";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export interface Item {
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  image?: string;
  imageUrl?: string;
}

export interface UsernameRole {
  username: string | null;
  role: string | null;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;
const socket = io(baseURL);

function App() {
  const [send, setSend] = useState<boolean>(false);
  const [data, setData] = useState<Item[]>([]);
  const [form, setForm] = useState<Item>({});
  const [usernameRole, setUsernameRole] = useState<UsernameRole>();

  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const limit = 2;
  const { t } = useTranslation();

  useEffect(() => {
    const handleTaskCreated = (task: { title: string }) => {
      Swal.fire({
        icon: "success",
        title: t("taskCreated"),
        text: `${t("title")}: ${task.title}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      filterPurchases(1);
    };

    const handleTaskUpdated = (task: { title: string }) => {
      Swal.fire({
        icon: "info",
        title: t("taskUpdated"),
        text: `${t("title")}: ${task.title}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      filterPurchases(1);
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);

    // return () => {
    //   socket.off("taskCreated", handleTaskCreated);
    //   socket.off("taskUpdated", handleTaskUpdated);
    // };
  }, []);

  useEffect(() => {
    filterPurchases(1);
  }, [filter]);

  useEffect(() => {
    filterPurchases(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const username = localStorage.getItem("username") ;
    const role = localStorage.getItem("role");
    setUsernameRole({username,role})
  }, [currentPage]);

  const filterPurchases = async (page: number): Promise<void> => {
    try {
      setSend(true);
      const resp = await getAllItem(
        `page=${page}&limit=${limit}&purchaseView=true&${filter}`
      );
      if (resp) {
        setTotalItems(resp.data.totalItems);
        setTotalPages(resp.data.totalPages);
        setData(resp.data.data);
      }
    } catch {
      Swal.fire(t("fetchError"));
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 bg-gray-800 min-h-screen w-full p-10 text">
      <div className="flex gap-4 items-center">
        <Language />
        <p className="text-white uppercase">
          {`${usernameRole?.username} - ${usernameRole?.role}`}
        </p>
      </div>

      <div className="text-black flex flex-col gap-2">
        <CreateItem form={form} setForm={setForm} setSend={setSend} />
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
