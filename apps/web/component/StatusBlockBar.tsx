import { BarChart, Bar, XAxis, YAxis } from "recharts";

export const StatusBlockBar = ({
  dataStatusArr = [],
  width = 400,
  height = 30,
  highlightIndex,
}: {
  dataStatusArr: boolean[];
  width?: number;
  height?: number;
  highlightIndex?: number;
}) => {
  const len = dataStatusArr.length;
  const getWidthByIndex = (i: number) =>
    Math.round(((i + 1) * 100) / len) - Math.round((i * 100) / len);

  const data = dataStatusArr.reduce(
    (acc, _cur, i) => {
      return { ...acc, [i]: getWidthByIndex(i) };
    },
    { name: "A" }
  );

  console.log({ dataStatusArr, highlightIndex });
  return (
    <BarChart
      id="status-block-bar"
      width={width}
      height={height}
      data={[data]}
      layout="vertical"
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {dataStatusArr.map((v, i) => (
        <Bar
          key={`${i}-${v}`}
          dataKey={i}
          stackId="A"
          fill={i === highlightIndex ? "#0e7411" : v ? "#76ff03" : "#bdbdbd"}
        />
      ))}
      <XAxis type="number" domain={[0, 100]} hide />
      <YAxis type="category" hide />
    </BarChart>
  );
};
