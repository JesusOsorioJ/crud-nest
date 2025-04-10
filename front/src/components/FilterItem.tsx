"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

// Define types for the form data
interface FormData {
  assignedTo?: string;
  priority?: string;
  status?: string;
  order?: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

interface FilterTasksProps {
  setFilter: (filter: string) => void;
  totalItems: string;
}

export default function FilterTasks({
  setFilter,
  totalItems,
}: FilterTasksProps) {
  const { t } = useTranslation();

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    let result = Object.entries(formData)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join("&");

    result = result.trim() !== "" ? result.replace("+", "\\%2B") : result;
    setFilter(result);
    return;
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-200 rounded-md px-[30px] py-[20px]">
      <p className="text-center w-full uppercase">
        Filtro: total items {totalItems}
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-fit w-full  items-center gap-[20px] "
      >
        <div>
          <p className="capitalize">{t("status")}</p>
          <select
            {...register("status")}
            defaultValue=""
            className="w-full rounded-md p-3 text-black focus:outline-none"
          >
            <option value="">--</option>
            <option value={TaskStatus.TODO}>TODO</option>
            <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
            <option value={TaskStatus.DONE}>DONE</option>
          </select>
        </div>

        <div>
          <p className="capitalize">{t("dueDate")}</p>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full rounded-md p-3 text-black focus:outline-none"
          />
        </div>

        <div className="flex flex-col  items-center justify-between gap-[10px] pt-[20px] sm:flex-row">
          <button
            type="button"
            onClick={() => location.reload()}
            className="w-full uppercase bg-[#b1b1b1] rounded-lg px-[20px] py-[6px] sm:w-fit"
          >
            {t("reset")}
          </button>
          <button className="w-full uppercase rounded-lg bg-white px-[20px] py-[6px] sm:w-fit">
            {t("search")}
          </button>
        </div>
      </form>
    </div>
  );
}
