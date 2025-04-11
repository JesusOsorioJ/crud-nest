import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { newItem, updateItem } from "../api/item";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { Item } from "../pages/Tasks";

interface Props {
  form: Item;
  setForm: (item: Item) => void;
  setSend: (status: boolean) => void;
}

const CreateItem = ({ form, setForm, setSend }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<Item>({
    defaultValues: form,
  });

  useEffect(() => {
    if (form.dueDate) {
      reset({
        ...form,
        dueDate: format(form.dueDate, "yyyy-MM-dd"),
      });
    }
  }, [form, reset]);

  const onSubmit: SubmitHandler<Item> = async (formData) => {
    try {
      setSend(true);
      let response;

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        image: formData.image?.[0],
      };

      if (form.id) {
        response = await updateItem(form.id, payload);
      } else {
        response = await newItem(payload);
      }

      if (response && (response.status === 200 || response.status === 201)) {
        reset({});
      } else {
        Swal.fire("Error", "Tarea fallida", "error");
      }
    } catch {
      Swal.fire("Error", "Error en la tarea", "error");
    } finally {
      setForm({} as Item);
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-200 w-full p-5 rounded-lg">
      <p className="uppercase">
        {form.id ? `${t("writeMessage")} ${form.id}` : t("createRegister")}
      </p>

      <form
        className="flex w-full gap-4 flex-wrap"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="capitalize">Title</label>
          <input
            {...register("title")}
            className="w-full p-3 bg-gray-300 rounded-lg"
            placeholder="Usuario@example.com"
          />
        </div>
        <div>
          <label className="capitalize">Description</label>
          <textarea
            required
            {...register("description")}
            className="w-full p-3 bg-gray-300 rounded-lg"
            placeholder={t("writeMessage")}
          />
        </div>
        <div>
          <label className="capitalize">Status</label>
          <select
            required
            {...register("status")}
            className="w-full border border-gray-300 p-2 rounded"
            defaultValue="TODO"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <div>
          <label className="capitalize">Due Date</label>
          <input
            type="date"
            required
            {...register("dueDate")}
            className="w-full p-3 bg-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="capitalize">Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full p-3 bg-gray-300 rounded-lg"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({} as Item);
            reset({});
          }}
          className="px-5 bg-[#b1b1b1] py-[6px] rounded-lg self-center uppercase"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-5 bg-blue-500 text-white py-[6px] rounded-lg self-center uppercase"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
