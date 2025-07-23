import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";


  const data = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 2000 },
    { month: "May", value: 4500 },
    { month: "Jun", value: 1000 },
    { month: "Jul", value: 7000 },
    { month: "Aug", value: 3000 },
    { month: "Sep", value: 6000 },
  ];
  
  

function Chart() {
  return (
   <div className="rounded-lg border border-neutral-300 p-4 bg-white w-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Investment Trends</p>
          <h2 className="text-2xl font-semibold">$15,000</h2>
        </div>
        <div className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm font-medium">
          ⬈ 10%
        </div>
      </div>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#007bff"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart