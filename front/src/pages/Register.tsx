import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { registerUser } from "../api/auth";
import Swal from "sweetalert2";

interface FormData {
  email?: string;
  password?: string;
  role?: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        role: [formData.role],
      });

      if (response!.status === 201) {
        Swal.fire("Registro exitoso");
        navigate("/login");
      } else {
        Swal.fire("Registro fallido");
      }
    } catch {
      Swal.fire("Error en el registro:");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 gap-3 flex flex-col items-center  justify-center">
      <Link to="/" className="flex ms-2">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          className="h-8 me-3"
          alt="FlowBite Logo"
        />
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
          CRUD
        </span>
      </Link>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2">Correo electrónico</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="usuario@example.com"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Contraseña</label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="********"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Rol</label>

            <select
              {...register("role")}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-500">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
