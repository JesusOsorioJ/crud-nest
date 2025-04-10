import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { newItem, updateItem } from "../api/item";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { format } from "date-fns";

interface FormData {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string;
  image: any;
}

interface Props {
  form: Item;
  setForm: (item: Item) => void;
  setSend: (status: boolean) => void;
  setData: (items: Item[]) => void;
}

const CreateItem = ({ form, setForm, setSend, setData }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (form.dueDate) {
      reset({ ...form, dueDate: format(form.dueDate, "yyyy-MM-dd") });
    }
  }, [form]);

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setSend(true);
      let response;

      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        dueDate: formData.dueDate,
        image: formData.image[0],
      };

      if (form.id) {
        response = await updateItem(form.id, payload);
      } else {
        response = await newItem(payload);
      }

      if (response!.status === 201 || response!.status === 200) {
        reset({});
      } else {
        Swal.fire("Tarea fallido");
      }
    } catch {
      Swal.fire("Error en la Tarea:");
    } finally {
      setForm({});
      setSend(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center bg-gray-200 dark:bg-gray-800 w-full p-5 rounded-lg">
      <p className="uppercase">
        {form.id ? `${t("writeMessage")} ${form.id}` : t("createRegister")}
      </p>

      <form
        className="flex w-full gap-4 flex-wrap"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="capitalize">title</label>
          <input
            {...register("title")}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 rounded-lg"
            placeholder="usuario@example.com"
          />
        </div>
        <div>
          <label className="capitalize">description</label>

          <textarea
            required
            {...register("description")}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 rounded-lg"
            placeholder={t("writeMessage")}
          />
        </div>
        <div>
          <label className="capitalize">status</label>

          <select
            required
            defaultValue="TODO"
            {...register("status")}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>
        <div>
          <label className="capitalize">dueDate</label>

          <input
            type="date"
            required
            {...register("dueDate")}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 rounded-lg"
            placeholder={t("writeMessage")}
          />
        </div>
        <div>
          <label className="capitalize">Imagen</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full p-3 bg-gray-300 dark:bg-gray-900 rounded-lg"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({});
            reset({});
          }}
          className="px-5 bg-[#b1b1b1] py-[6px] rounded-lg self-center uppercase"
        >
          Cancelar
        </button>
        <button className="px-5 bg-white py-[6px]  rounded-lg self-center uppercase">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
