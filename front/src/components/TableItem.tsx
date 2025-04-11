import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { deleteItem, getAllItem } from "../api/item";
import Swal from "sweetalert2";
import Paginator from "./Paginator";
import { Dispatch, SetStateAction } from "react";
import { Item } from "../pages/Tasks";

interface TableProps {
  data: Item[];
  send: boolean;
  setSend: (status: boolean) => void;
  setData: (items: Item[]) => void;
  setForm: (item: Item) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;

function TableItem({
  data,
  send,
  setSend,
  setData,
  setForm,
  currentPage,
  totalPages,
  setCurrentPage,
}: TableProps) {
  const { t } = useTranslation();

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("thisActionIsIrreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
    });

    if (!result.isConfirmed) return;

    setSend(true);
    try {
      await deleteItem(id);
      const res = await getAllItem();
      if (res?.data && Array.isArray(res.data)) {
        setData(res.data);
      }
      Swal.fire(t("deleted"), t("itemDeletedSuccessfully"), "success");
    } catch {
      Swal.fire("Error", "Error deleting task", "error");
    } finally {
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-200 w-full p-5 rounded-lg">
      <p className="uppercase">{t("registerTable")}</p>
      <table className="w-full p-3 rounded-lg text-center">
        <thead>
          <tr className="uppercase">
            <th scope="col">ID</th>
            <th scope="col">{t("title")}</th>
            <th scope="col">{t("description")}</th>
            <th scope="col">{t("status")}</th>
            <th scope="col">{t("dueDate")}</th>
            <th scope="col">{t("image")}</th>
            <th scope="col">{t("actions")}</th>
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
                    src={`${baseURL}/uploads/${d.imageUrl}`}
                    alt="task-img"
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
              </td>
              <td className="flex gap-2 justify-center py-2">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-red-600 hover:text-red-800 text-xl"
                  title={t("delete")}
                >
                  🗑️
                </button>
                <button
                  onClick={() => setForm(d)}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title={t("edit")}
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
        <div className="flex gap-2 bg-gray-300 p-4 rounded animate-pulse">
          <div className="h-2 w-2 rounded-full bg-black" />
          <div className="h-2 w-2 rounded-full bg-black" />
          <div className="h-2 w-2 rounded-full bg-black" />
        </div>
      )}
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default TableItem;
