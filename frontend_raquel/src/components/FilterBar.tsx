interface FilterBarProps { tipoAtivo: string; onTipoChange: (t: string) => void; }
const TIPOS = [
  { label: "Todos", value: "" },{ label: "Casa", value: "CASA" },{ label: "Apartamento", value: "APARTAMENTO" },
  { label: "Terreno", value: "TERRENO" },{ label: "Sobrado", value: "SOBRADO" },{ label: "Sala Comercial", value: "SALA_COMERCIAL" },{ label: "Chácara", value: "CHACARA" },
];
export default function FilterBar({ tipoAtivo, onTipoChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {TIPOS.map((t) => (
        <button key={t.value} onClick={() => onTipoChange(t.value)}
          className={`px-4 py-2 rounded-sm text-[.78rem] font-medium uppercase tracking-wide border transition-all cursor-pointer ${
            tipoAtivo === t.value ? "bg-[#EA580C] text-white border-[#EA580C]" : "bg-transparent text-gray-500 border-gray-200 hover:border-[#EA580C] hover:text-[#EA580C]"
          }`}>{t.label}</button>
      ))}
    </div>
  );
}
