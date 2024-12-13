type CustomLegendProps = {
  data: {
    [key: string]: string | number
  }[]
  colors: string[]
}

export default function CustomLegend({ data, colors }: CustomLegendProps) {
  return (
    <div className="flex justify-center mt-4">
      {data.map((entry, index) => (
        <div key={`legend-item-${index}`} className="flex items-center mr-4">
          <div
            className="w-3 h-3 mr-2"
            style={{ backgroundColor: colors[index % colors.length] }}
          ></div>
          <span className="text-sm text-zinc-900 dark:text-zinc-200">
            {entry.label || entry.name}
          </span>
        </div>
      ))}
    </div>
  )
}
