export function HormoneLegend() {
  return (
    <div className="flex justify-center gap-4 mt-4 text-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2" />
        Estrogen
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2" />
        Progesterone
      </div>
    </div>
  );
}
