//To run this code, in the terminal, cd to this path and then run: npm start
//To exit the server, press Ctrl + C
//Then open http://localhost:3000 in your browser
//This code visualizes the partial sums of a series defined by the user.
//It allows the user to input a series term (a_n), a start index, and the number of terms to sum.
//It computes the partial sums and displays them in a line chart.
//It also displays the final partial sum after the computation is complete.
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
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


import { evaluate, parse } from "mathjs";
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
    let fixed = expr;
  
    // Fix exponent formatting: (-1)^n or (-1)^(n+1) → (-1)^{n} or {n+1}
    fixed = fixed.replace(/\(-1\)\^\(?([^)]+)\)?/g, (_, exp) => `(-1)^{${exp}}`);
  
    // Fix general a^b → a^{b} (if not already done)
    // fixed = fixed.replace(/([a-zA-Z0-9])\^([a-zA-Z0-9]+)/g, '$1^{$2}');
    fixed = fixed.replace(/([a-zA-Z0-9]+)\^\(?([^)]+)\)?/g, (_, base, exponent) => {
    return `${base}^{${exponent}}`;
});

  
    // Wrap divisions into \frac if top-level form: expr/expr
    if (/^[^\/]+\/[^\/]+$/.test(fixed)) {
      const [num, denom] = fixed.split('/');
      fixed = `\\frac{${num}}{${denom}}`;
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

            let modified = an;

            // Match and evaluate (-1)^(n), (-1)^(n+1), (-1)^(n-1)
            const signMatch = modified.match(/\(-1\)\^\(?([^)]+)\)?/);
            if (signMatch) {
              // Replace `n` in the exponent and evaluate
              const exponentStr = signMatch[1].replace(/n/g, `${nVal}`);
              const signVal = Math.pow(-1, eval(exponentStr));  // safely eval n+1, n-1, etc.

              // Replace only the full matched portion like (-1)^(n+1)
              modified = modified.replace(signMatch[0], `${signVal}`);
            }

            // Now substitute remaining n's and convert to LaTeX
            let substituted = modified.replace(/n/g, `${nVal}`);
            substituted = toLatexCompatible(substituted);

            return `\\left(${substituted}\\right)`;
          }).join(" + ") +
          (() => {
            const lastN = startIndex + N - 1;

            let lastTerm = an;

            const signMatch = lastTerm.match(/\(-1\)\^\(?([^)]+)\)?/);
            if (signMatch) {
              const exponentStr = signMatch[1].replace(/n/g, `${lastN}`);
              const signVal = Math.pow(-1, eval(exponentStr));
              lastTerm = lastTerm.replace(signMatch[0], `${signVal}`);
            }

            lastTerm = lastTerm.replace(/n/g, `${lastN}`);
            lastTerm = toLatexCompatible(lastTerm);

            return ` + \\cdots + \\left(${lastTerm}\\right)`;
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
