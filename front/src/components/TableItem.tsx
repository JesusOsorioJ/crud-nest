import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Item } from "../App";
import { deleteItem, getAllItem } from "../api/item";
import Swal from "sweetalert2";

interface TableProps {
  data: Item[];
  send: boolean;
  setSend: (status: boolean) => void;
  setData: (items: Item[]) => void;
  setForm: (item: Item) => void;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;

function TableItem({ data, send, setSend, setData, setForm }: TableProps) {
  const { t } = useTranslation();

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const isConfirmed = window.confirm(t("sureTodelete"));
    if (!isConfirmed) return;

    setSend(true);
    try {
      await deleteItem(id);
      const res = await getAllItem();
      if (res?.data && Array.isArray(res.data)) {
        setData(res.data);
      }
    } catch {
      Swal.fire("Error deleting message:");
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-200 dark:bg-gray-800 w-full p-5 rounded-lg">
      <p className="text-[20px]">{t("registerTable")}</p>
      <table className="w-full p-3 bg-gray-300 dark:bg-gray-900 rounded-lg text-center">
        <thead>
          <tr className="uppercase">
            <th>ID</th>
            <th>{t("title")}</th>
            <th>{t("description")}</th>
            <th>{t("status")}</th>
            <th>{t("dueDate")}</th>
            <th>{t("image")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.title}</td>
              <td>{d.description}</td>
              <td>{d.status}</td>

              <td>
                {d.dueDate
                  ? format(new Date(d.dueDate), "MM/dd/yyyy pp")
                  : "N/A"}
              </td>
              <td>
                {d.imageUrl && (
                  <img
                    src={`${baseURL}/uploads/${d.imageUrl}`} // Ajusta según tu ruta pública
                    alt="task-img"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>
              <td className="flex gap-1 justify-center">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-1 text-[20px] rounded-br-lg rounded"
                >
                  🗑️
                </button>
                <button
                  onClick={() => setForm(d)}
                  className="px-1 text-[20px] rounded-br-lg rounded"
                >
                  ✏️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && !send && (
        <p className="text-center">{t("nothingToShow")}</p>
      )}

      {send && (
        <div className="flex gap-2 bg-gray-300 dark:bg-gray-900 p-4 rounded animate-pulse">
          <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
          <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
          <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
        </div>
      )}
    </div>
  );
}

export default TableItem;
