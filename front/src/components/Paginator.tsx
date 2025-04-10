const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const generarPaginador = () => {
    const totalPaginas = totalPages,
      paginaActual = currentPage;
    const paginasAMostrar = [];

    const maxPaginasAMostrar = 3; // Número máximo de páginas a mostrar

    if (totalPaginas <= maxPaginasAMostrar) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginasAMostrar.push(i);
      }
    } else {
      let inicio = Math.max(
        1,
        paginaActual - Math.floor(maxPaginasAMostrar / 2)
      );
      const fin = Math.min(totalPaginas, inicio + maxPaginasAMostrar - 1);

      if (fin - inicio < maxPaginasAMostrar - 1) {
        inicio = Math.max(1, fin - maxPaginasAMostrar + 1);
      }

      if (inicio > 1) {
        paginasAMostrar.push(1);
        if (inicio > 2) {
          paginasAMostrar.push("...");
        }
      }

      for (let i = inicio; i <= fin; i++) {
        paginasAMostrar.push(i);
      }

      if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) {
          paginasAMostrar.push("...");
        }
        paginasAMostrar.push(totalPaginas);
      }
    }

    return paginasAMostrar.map((page, index) => (
      <div
        key={index}
        className={`page-item ${
          currentPage === page
            ? "bg-[--primary] cursor-pointer text-[--textButton] flex justify-center items-center w-[48px] h-[40px] rounded-lg"
            : currentPage === page || page != "..."
            ? "w-[48px] h-[40px] cursor-pointer text-[--textColor] rounded-lg border-[1px] border-[--inputsBorder] flex justify-center items-center"
            : "text-[--textColor]"
        }`}
        onClick={page != "..." ? () => onPageChange(page) : null}
      >
        {page === "..." ? page : <span>{page}</span>}
      </div>
    ));
  };

  return totalPages > 1 ? (
    <div className="flex flex-row justify-center py-[20px] items-center gap-[20px]">
      {generarPaginador()}
    </div>
  ) : null;
};

export default Paginator;
