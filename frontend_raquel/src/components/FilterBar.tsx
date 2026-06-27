interface FilterBarProps { tipoAtivo: string; onTipoChange: (t: string) => void; }

const TIPOS = [
  { label: "Todos", value: "" },
  { label: "Casa", value: "CASA" },
  { label: "Apartamento", value: "APARTAMENTO" },
  { label: "Terreno", value: "TERRENO" },
  { label: "Sobrado", value: "SOBRADO" },
  { label: "Sala Comercial", value: "SALA_COMERCIAL" },
  { label: "Chácara", value: "CHACARA" },
];

export default function FilterBar({ tipoAtivo, onTipoChange }: FilterBarProps) {
  return (
    <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex gap-2 flex-nowrap md:flex-wrap w-max md:w-auto">
        {TIPOS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTipoChange(t.value)}
            className={`px-4 py-2 rounded-lg text-[.78rem] font-medium uppercase tracking-wide border transition-all duration-150 cursor-pointer whitespace-nowrap ${
              tipoAtivo === t.value
                ? "bg-[#EA580C] text-white border-[#EA580C]"
                : "bg-transparent text-gray-500 border-gray-200 hover:border-[#EA580C] hover:text-[#EA580C] active:bg-[#EA580C]/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
