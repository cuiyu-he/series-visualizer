//To run this code, in the terminal, cd to this path and then run: npm start
//To exit the server, press Ctrl + C
//Then open http://localhost:3000 in your browser
//This code visualizes the partial sums of a series defined by the user.
//It allows the user to input a series term (a_n), a start index, and the number of terms to sum.
//It computes the partial sums and displays them in a line chart.
//It also displays the final partial sum after the computation is complete.
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
// } from "chart.js";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";


import { evaluate } from "mathjs";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';



// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip
);

export default function App() {
  const [finalSum, setFinalSum] = useState(null);
  const [an, setAn] = useState("1/n");
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState("infty");
  const [N, setN] = useState(1000);
  const [Sn, setSn] = useState([]);
  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "top",
  //       align: "end",
  //       labels: {
  //         font: {
  //           size: 14,
  //         },
  //         usePointStyle: true,
  //         pointStyle: "circle", // 👈 switch from square to circle
  //       },
  //     },
  //     title: {
  //       display: true,
  //       text: "Partial Sums of the Series",
  //     },
  //   },
  // };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Partial Sums of the Series",
      },
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            // First line (index of sum)
            const index = tooltipItems[0].dataIndex + 1;
            return `S_${index}`;
          },
          label: function (tooltipItem) {
            // Second line (value of sum)
            return `Value: ${tooltipItem.formattedValue}`;
          },
        },
      },
    },
  };
  
  
  
  
  

  function evaluateSeries() {
    let snValues = [];
    let sum = 0;
    for (let n = startIndex; n <= N; n++) {
      try {
        // let expr = an.replace(/n/g, `(${n})`);
        // let term = eval(expr);
        let term = evaluate(an, { n });
        
        sum += term;
        snValues.push(sum);
      } catch {
        alert("Error evaluating a_n expression. Please check syntax.");
        return;
      }
    }
    setFinalSum(sum);
    setSn(snValues);
  }

  // const data = {
  //   labels: Array.from({ length: Sn.length }, (_, i) => i),
  //   datasets: [
  //     {
  //       label: "Partial Sum S_n",
  //       data: Sn,
  //       fill: false,
  //       borderColor: "blue",
  //       tension: 0.1,
  //     },
  //   ],
  // };
  // const data = {
  //   labels: Array.from({ length: Sn.length }, (_, i) => i + 1), // Always S₁ to S_N
  //   // datasets: [
  //   //   {
  //   //     label: "Partial Sum Sₙ",
  //   //     data: Sn,
  //   //     borderColor: "blue",
  //   //     backgroundColor: "rgba(0, 0, 255, 0.3)",
  //   //     fill: false,
  //   //     tension: 0.1,
  //   //   },
  //   // ],
  //   datasets: [
  //     {
  //       label: "Partial Sum Sₙ",
  //       data: Sn,
  //       borderColor: "blue",
  //       backgroundColor: "rgba(0, 0, 255, 0.3)",  // This makes the legend box filled
  //       fill: false, // Keeps the area under the line from being shaded
  //       tension: 0,
  //     },
  //   ],    
  // };
  const data = {
    labels: Array.from({ length: Sn.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Partial Sum Sₙ",
        data: Sn,
        borderColor: "red",
        backgroundColor: "blue",      // For point color
        pointRadius: 2,               // Size of each dot
        pointStyle: "circle",         // Style of dot
        showLine: false,              // ✅ Removes connecting line
      },
    ],
  };
  
  

  function toLatexCompatible(expr) {
    // Convert (-1)^n => (-1)^{n}
    let fixed = expr.replace(/\(-1\)\^n/g, "(-1)^{n}");
  
    // Convert simple x^y → x^{y} (excluding ones already inside braces)
    fixed = fixed.replace(/(\w)\^(\w)/g, "$1^{$2}");
  
    // If the expression matches the pattern (-1)^n/n exactly, use \frac
    if (/^\(-1\)\^n\/n$/.test(expr)) {
      fixed = `\\frac{(-1)^n}{n}`;
    }
  
    return fixed;
  }
  

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Series Visualizer</h2>
      {/* <div className="mb-2">
        <label className="block">aₙ = </label>
        <input
          className="border p-2 w-full"
          value={an}
          onChange={(e) => setAn(e.target.value)}
        />
      </div> */}
      {/* <div className="mb-2">
        <label className="block font-semibold mb-1">
          aₙ =
        </label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={an}
          onChange={(e) => setAn(e.target.value)}
          placeholder="e.g. (-1)^n/n"
        />
        <l className="text-sm text-gray-600 mt-1">
          (Use <code>log(n)</code> for ln(n), <code>log(2,n)</code> for log₂(n), and <code>exp(n)</code> for eⁿ)
        </l>
      </div> */}

      <div className="mb-2">
        <label className="block font-semibold mb-1">
          aₙ =
        </label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={an}
          onChange={(e) => setAn(e.target.value)}
          placeholder="e.g. ((-1)^n)/n"
        />
        <span className="text-sm text-gray-600 mt-1 block">
          (Use <code>log(n)</code> for ln(n), <code>log(2,n)</code> for log₂(n), and <code>exp(n)</code> for eⁿ.
          Use extra parentheses like <code>((-1)^n)/n</code> to ensure correct rendering.)
        </span>
      </div>




      {/* <div className="mb-2">
        <label className="block">aₙ = </label>
        <input
          className="border p-2 w-full"
          value={an}
          onChange={(e) => setAn(e.target.value)}
        />
        <small className="text-gray-600">
          (type <code>log(n)</code> for ln(n), <code>log(2,n)</code> for log₂(n), and <code>exp(n)</code> for eⁿ)
        </small>
      </div> */}

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
          {/* <BlockMath math={`S = \\sum_{n = ${startIndex}}^\\infty ${an}`} /> */}
          {/* <BlockMath math={
            (() => {
              let expr = an;

              // If input includes (-1)^... pattern, format it properly
              const signPattern = /\(-?1\)\^\(?([^)]+)\)?/;
              const match = expr.match(signPattern);
              if (match) {
                const exponent = match[1];
                // Use LaTeX exponent formatting
                expr = expr.replace(signPattern, `(-1)^{${exponent}}`);
              }

              return `S = \\sum_{n = ${startIndex}}^\\infty ${expr}`;
            })()
          } /> */}

        <BlockMath math={`S = \\sum_{n = ${startIndex}}^\\infty ${toLatexCompatible(an)}`} />


          <BlockMath math={
            `S_N = ` +
            Array.from({ length: 3 }, (_, i) => {
              const nVal = startIndex + i;

              let modifiedExpr = an;
              const signMatch = an.match(/\(-?1\)\^n/);
              if (signMatch) {
                const sign = Math.pow(-1, nVal);
                modifiedExpr = modifiedExpr.replace(/\(-?1\)\^n/, sign.toString());
              }

              const substitutedExpr = modifiedExpr.replace(/n/g, `${nVal}`);
              return `\\left(${substitutedExpr}\\right)`;
            }).join(" + ") +
            (() => {
              const lastN = startIndex + N - 1;
              let lastExpr = an;
              const signMatch = an.match(/\(-?1\)\^n/);
              if (signMatch) {
                const sign = Math.pow(-1, lastN);
                lastExpr = lastExpr.replace(/\(-?1\)\^n/, sign.toString());
              }
              lastExpr = lastExpr.replace(/n/g, `${lastN}`);
              return ` + \\cdots + \\left(${lastExpr}\\right)`;
            })()
          } />






          
          <Line data={data} options={options} />
          {finalSum !== null && (
            <div className="mt-4 text-lg">
              Final partial sum \( S_{N} \): <strong>{finalSum.toFixed(6)}</strong>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
