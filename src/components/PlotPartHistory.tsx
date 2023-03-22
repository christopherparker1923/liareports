import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export function PlotPartHistory(plotProps: {
  plotProps?: {
    date: Date;
    price: number;
    leadTime: number;
    stock: number;
  }[];
}) {
  if (!plotProps.plotProps) return null;

  const data = plotProps.plotProps.map((p, i) => ({
    ...p,
    dateTime: p.date.getTime(),
    index: i,
  }));

  console.log("data", data);

  const latestDate = data[data.length - 1]?.date;
  const dateOneYearAgo = latestDate ? new Date(latestDate.getTime()) : null;
  if (latestDate && dateOneYearAgo) {
    dateOneYearAgo.setFullYear(latestDate.getFullYear() - 1);
  }
  const xMin = dateOneYearAgo?.getTime() || 0;
  const xMax = latestDate?.getTime() || 0;

  console.log("latestDate", latestDate);
  console.log("yearago", dateOneYearAgo);

  console.log("xmin", xMin);
  console.log("xmax", xMax);

  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        allowDataOverflow={false}
        scale="time"
        type="number"
        domain={[xMin, xMax]}
        dataKey="date"
        tickFormatter={(value: Date) => {
          const date = new Date(value);
          const month = date.getMonth();
          const day = date.getDate();
          const year = date.getFullYear();
          return `${month + 1}/${day}/${year}`;
        }}
      />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="price"
        stroke="#8884d8"
        yAxisId="left"
        name="Price"
      />
      <Line
        type="monotone"
        dataKey="leadTime"
        stroke="#82ca9d"
        yAxisId="right"
        name="Lead Time"
      />
      <Line
        type="monotone"
        dataKey="stock"
        stroke="#cc295f"
        yAxisId="right"
        name="Stock"
      />
    </LineChart>
  );
}
