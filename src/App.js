import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function App() {
  const [an, setAn] = useState("1/n!");
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState("infty");
  const [N, setN] = useState(1000);
  const [Sn, setSn] = useState([]);

  function evaluateSeries() {
    let snValues = [];
    let sum = 0;
    for (let n = 0; n <= N; n++) {
      try {
        let expr = an.replace(/n/g, `(${n})`);
        let term = eval(expr);
        sum += term;
        snValues.push(sum);
      } catch {
        alert("Error evaluating a_n expression. Please check syntax.");
        return;
      }
    }
    setSn(snValues);
  }

  const data = {
    labels: Array.from({ length: Sn.length }, (_, i) => i),
    datasets: [
      {
        label: "Partial Sum S_n",
        data: Sn,
        fill: false,
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Series Visualizer</h2>
      <div className="mb-2">
        <label className="block">aₙ = </label>
        <input
          className="border p-2 w-full"
          value={an}
          onChange={(e) => setAn(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <label className="block">Start Index:</label>
        <input
          className="border p-2 w-full"
          type="number"
          value={startIndex}
          onChange={(e) => setStartIndex(Number(e.target.value))}
        />
      </div>
      <div className="mb-2">
        <label className="block">N (number of terms to sum):</label>
        <input
          className="border p-2 w-full"
          type="number"
          value={N}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={evaluateSeries}
      >
        Compute Partial Sums
      </button>

      {Sn.length > 0 && (
        <div className="mt-6">
          <Line data={data} />
        </div>
      )}
    </div>
  );
}
