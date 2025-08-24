import React, { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartDataJson = {
  monthlyData: [
    { month: "Jan", profit: 200, Expenditure: 100 },
    { month: "Feb", profit: 400, Expenditure: 300 },
    { month: "Mar", profit: 500, Expenditure: 200 },
    { month: "Apr", profit: 600, Expenditure: 1000 },
    { month: "May", profit: 2000, Expenditure: 500 },
    { month: "Jun", profit: 300, Expenditure: 900 },
    { month: "Jul", profit: 500, Expenditure: 1000 },
    { month: "Aug", profit: 600, Expenditure: 300 },
    { month: "Sep", profit: 200, Expenditure: 400 },
    { month: "Oct", profit: 1400, Expenditure: 500 },
    { month: "Nov", profit: 200, Expenditure: 500 },
    { month: "Dec", profit: 1800, Expenditure: 500 },
  ],
  yearlyData: [
    { year: 2025, profit: 20000, Expenditure: 1000 },
    { year: 2024, profit: 20000, Expenditure: 1000 },
    { year: 2023, profit: 20000, Expenditure: 1000 },
    { year: 2022, profit: 20000, Expenditure: 1000 },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#6B7280",
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true, // now shows small color box for dataset
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = context.parsed.y.toLocaleString();
          return `${label}: ${value}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        color: "#6B7280",
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6B7280",
        font: {
          size: 12,
        },
      },
    },
  },
};


function Chart({view, chartDataJson}) {
  

  const chartData =
    view === "monthly"
      ? {
          labels: chartDataJson.monthlyData.map((d) => d.month),
          datasets: [
            {
              label: "Profit",
              data: chartDataJson.monthlyData.map((d) => d.Profit),
              backgroundColor: "rgba(43, 127, 255,0.7)", // blue
              borderRadius: 6,
            },
            {
              label: "Expenditure",
              data: chartDataJson.monthlyData.map((d) => d.Expenditure),
              backgroundColor: "rgba(115, 147, 179,0.7)", // gray blue
              borderRadius: 6,
            },
          ],
        }
      : {
          labels: chartDataJson.yearlyData.map((d) => d.year.toString()),
          datasets: [
            {
              label: "Profit",
              data: chartDataJson.yearlyData.map((d) => d.Profit),
              backgroundColor: "rgba(43, 127, 255,0.7)", // blue
              borderRadius: 6,
            },
            {
              label: "Expenditure",
              data: chartDataJson.yearlyData.map((d) => d.Expenditure),
              backgroundColor: "rgba(115, 147, 179,0.7)", // gray blue
              borderRadius: 6,
            },
          ],
    };

  return (
    <div className="w-full rounded-md p-2 bg-white border border-neutral-300 h-[390px]">
      <Bar options={chartOptions} data={chartData} />
    </div>
  )
}

export default Chart