import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import dragData from "chartjs-plugin-dragdata";
import { FaRegTrashAlt, FaDice } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  dragData
);

const DEFAULT_KEYFRAMES = [
  { time: 0, value: 1 },
  { time: 1, value: 0.95 },
  { time: 2, value: 0.81 },
  { time: 3, value: 0.59 },
  { time: 4, value: 0.31 },
  { time: 5, value: 0 },
  { time: 6, value: -0.31 },
  { time: 7, value: -0.59 },
  { time: 8, value: -0.81 },
  { time: 9, value: -0.95 },
  { time: 10, value: -1 },
  { time: 11, value: -0.95 },
  { time: 12, value: -0.81 },
  { time: 13, value: -0.59 },
  { time: 14, value: -0.31 },
  { time: 15, value: 0 },
  { time: 16, value: 0.31 },
  { time: 17, value: 0.59 },
  { time: 18, value: 0.81 },
  { time: 19, value: 0.95 },
  { time: 20, value: 1 },
  { time: 21, value: 0.95 },
  { time: 22, value: 0.81 },
  { time: 23, value: 0.59 },
  { time: 24, value: 0.31 },
  { time: 25, value: 0 },
  { time: 26, value: -0.31 },
  { time: 27, value: -0.59 },
  { time: 28, value: -0.81 },
  { time: 29, value: -0.95 },
  { time: 30, value: -1 },
  { time: 31, value: -0.95 },
  { time: 32, value: -0.81 },
  { time: 33, value: -0.59 },
  { time: 34, value: -0.31 },
  { time: 35, value: 0 },
  { time: 36, value: 0.31 },
  { time: 37, value: 0.59 },
  { time: 38, value: 0.81 },
  { time: 39, value: 0.95 },
  { time: 40, value: 1 },
  { time: 41, value: 0.95 },
  { time: 42, value: 0.81 },
  { time: 43, value: 0.59 },
  { time: 44, value: 0.31 },
  { time: 45, value: 0 },
  { time: 46, value: -0.31 },
  { time: 47, value: -0.59 },
  { time: 48, value: -0.81 },
  { time: 49, value: -0.95 },
  { time: 50, value: -1 },
  { time: 51, value: -0.95 },
  { time: 52, value: -0.81 },
  { time: 53, value: -0.59 },
  { time: 54, value: -0.31 },
  { time: 55, value: 0 },
  { time: 56, value: 0.31 },
  { time: 57, value: 0.59 },
  { time: 58, value: 0.81 },
  { time: 59, value: 0.95 },
  { time: 60, value: 1 },
  { time: 61, value: 0.95 },
  { time: 62, value: 0.81 },
  { time: 63, value: 0.59 },
  { time: 64, value: 0.31 },
  { time: 65, value: 0 },
  { time: 66, value: -0.31 },
  { time: 67, value: -0.59 },
  { time: 68, value: -0.81 },
  { time: 69, value: -0.95 },
  { time: 70, value: -1 },
  { time: 71, value: -0.95 },
  { time: 72, value: -0.81 },
  { time: 73, value: -0.59 },
  { time: 74, value: -0.31 },
  { time: 75, value: 0 },
  { time: 76, value: 0.31 },
  { time: 77, value: 0.59 },
  { time: 78, value: 0.81 },
  { time: 79, value: 0.95 },
  { time: 80, value: 1 },
  { time: 81, value: 0.95 },
  { time: 82, value: 0.81 },
  { time: 83, value: 0.59 },
  { time: 84, value: 0.31 },
  { time: 85, value: 0 },
  { time: 86, value: -0.31 },
  { time: 87, value: -0.59 },
  { time: 88, value: -0.81 },
  { time: 89, value: -0.95 },
  { time: 90, value: -1 },
  { time: 91, value: -0.95 },
  { time: 92, value: -0.81 },
  { time: 93, value: -0.59 },
  { time: 94, value: -0.31 },
  { time: 95, value: 0 },
  { time: 96, value: 0.31 },
  { time: 97, value: 0.59 },
  { time: 98, value: 0.81 },
  { time: 99, value: 0.95 },
  { time: 100, value: 1 },
  { time: 101, value: 0.95 },
  { time: 102, value: 0.81 },
  { time: 103, value: 0.59 },
  { time: 104, value: 0.31 },
  { time: 105, value: 0 },
  { time: 106, value: -0.31 },
  { time: 107, value: -0.59 },
  { time: 108, value: -0.81 },
  { time: 109, value: -0.95 },
  { time: 110, value: -1 },
  { time: 111, value: -0.95 },
  { time: 112, value: -0.81 },
  { time: 113, value: -0.59 },
  { time: 114, value: -0.31 },
  { time: 115, value: 0 },
  { time: 116, value: 0.31 },
  { time: 117, value: 0.59 },
  { time: 118, value: 0.81 },
  { time: 119, value: 0.95 },
];

const KeyframeEditor = ({ darkMode }) => {
  const [keyframes, setKeyframes] = useState(() => {
    const savedKeyframes = localStorage.getItem("keyframes");
    return savedKeyframes ? JSON.parse(savedKeyframes) : DEFAULT_KEYFRAMES;
  });
  const [currentTime, setCurrentTime] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [pastedJSON, setPastedJSON] = useState("");
  const [randomMin, setRandomMin] = useState(-1);
  const [randomMax, setRandomMax] = useState(1);
  const [randomKeyframeCount, setRandomKeyframeCount] = useState(10);
  const [maxFrameNumber, setMaxFrameNumber] = useState(100);

  useEffect(() => {
    localStorage.setItem("keyframes", JSON.stringify(keyframes));
  }, [keyframes]);

  const updateKeyframesAndSave = (newKeyframes) => {
    setKeyframes(newKeyframes);
  };

  const addKeyframe = () => {
    if (currentTime !== "" && currentValue !== "") {
      const newKeyframe = {
        time: parseFloat(currentTime),
        value: parseFloat(currentValue),
      };
      updateKeyframesAndSave(
        [...keyframes, newKeyframe].sort((a, b) => a.time - b.time)
      );
      setCurrentTime("");
      setCurrentValue("");
    }
  };

  const removeKeyframe = (index) => {
    const updatedKeyframes = keyframes.filter((_, i) => i !== index);
    updateKeyframesAndSave(updatedKeyframes);
  };

  const updateKeyframe = (index, field, value) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index][field] = parseFloat(value);
    updateKeyframesAndSave(updatedKeyframes.sort((a, b) => a.time - b.time));
  };

  const randomizeKeyframe = (index) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index] = {
      ...updatedKeyframes[index],
      value: parseFloat(
        (Math.random() * (randomMax - randomMin) + randomMin).toFixed(3)
      ),
    };
    updateKeyframesAndSave(updatedKeyframes);
  };

  const randomizeAllKeyframes = () => {
    const updatedKeyframes = keyframes.map((keyframe) => ({
      ...keyframe,
      value: parseFloat(
        (Math.random() * (randomMax - randomMin) + randomMin).toFixed(3)
      ),
    }));
    updateKeyframesAndSave(updatedKeyframes);
  };

  const generateJSON = () => {
    const formattedJSON = keyframes.reduce((acc, keyframe) => {
      acc[keyframe.time.toFixed(0)] = `(${keyframe.value.toFixed(3)})`;
      return acc;
    }, {});
    return JSON.stringify(formattedJSON)
      .replace(/"/g, "")
      .replace(/^\{/, "")
      .replace(/\}$/, "");
  };

  const generateRandomKeyframes = () => {
    const newKeyframes = [];
    for (let i = 0; i < randomKeyframeCount; i++) {
      const time = Math.floor(Math.random() * maxFrameNumber);
      const value = parseFloat(
        (Math.random() * (randomMax - randomMin) + randomMin).toFixed(3)
      );
      newKeyframes.push({ time, value });
    }

    // Combine new keyframes with existing ones and sort
    const updatedKeyframes = [...keyframes, ...newKeyframes].sort(
      (a, b) => a.time - b.time
    );

    // Remove duplicates based on time
    const uniqueKeyframes = updatedKeyframes.filter(
      (keyframe, index, self) =>
        index === self.findIndex((t) => t.time === keyframe.time)
    );

    updateKeyframesAndSave(uniqueKeyframes);
  };

  const parseAndAddKeyframes = () => {
    try {
      // Remove all whitespace and split by commas
      const keyframePairs = pastedJSON.replace(/\s/g, "").split(",");
      const newKeyframes = keyframePairs.map((pair) => {
        const [time, value] = pair.split(":");
        return {
          time: parseFloat(time),
          value: parseFloat(value.replace(/[()]/g, "")),
        };
      });

      updateKeyframesAndSave(
        [...keyframes, ...newKeyframes].sort((a, b) => a.time - b.time)
      );
      setPastedJSON("");
    } catch (error) {
      alert("Error parsing input. Please check your format and try again.");
      console.error("Error parsing keyframes:", error);
    }
  };

  const handleDrag = (e, datasetIndex, index, value) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index] = {
      ...updatedKeyframes[index],
      value: parseFloat(value.toFixed(3)),
    };
    updateKeyframesAndSave(updatedKeyframes);
  };

  const prepareChartData = useCallback(() => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    return {
      labels: sortedKeyframes.map((kf) => kf.time),
      datasets: [
        {
          label: "Keyframes",
          data: sortedKeyframes.map((kf) => kf.value),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          pointHitRadius: 20,
        },
      ],
    };
  }, [keyframes]);

  const chartData = useMemo(() => prepareChartData(), [prepareChartData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Keyframe Editor",
      },
      dragData: {
        round: 3,
        showTooltip: true,
        onDrag: function (e, datasetIndex, index, value) {
          e.target.style.cursor = "grabbing";
        },
        onDragEnd: function (e, datasetIndex, index, value) {
          e.target.style.cursor = "default";
          handleDrag(e, datasetIndex, index, value);
        },
      },
      legend: {
        display: true,
        labels: {
          color: darkMode ? "#f8f8f2" : "#282a36",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "Keyframes",
          color: darkMode ? "#f8f8f2" : "#282a36",
        },
        ticks: {
          color: darkMode ? "#f8f8f2" : "#282a36",
        },
        grid: {
          color: darkMode ? "#484a69" : "rgba(68, 71, 90, 0.1)",
        },
      },
      y: {
        title: {
          display: false,
          text: "Value",
          color: darkMode ? "#f8f8f2" : "#282a36",
        },
        ticks: {
          color: darkMode ? "#f8f8f2" : "#282a36",
        },
        grid: {
          color: darkMode ? "#484a69" : "rgba(68, 71, 90, 0.1)",
        },
      },
    },
    font: {
      family:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    animation: {
      duration: 0,
    },
    defaults: {
      backgroundColor: darkMode ? "#282a36" : "#f8f8f2",
      borderColor: "#ff0000",
    },
  };

  return (
    <>
      <div className="mb-4 bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600">
        <Line className="max-h-64" data={chartData} options={chartOptions} />
      </div>
      <div className="flex flex-col lg:flex-row">
        <div
          className={`w-full lg:w-1/2 p-4 mx-auto mr-4 bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600 ${
            darkMode ? "text-dracula-foreground" : "text-dracula-background"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Input</h2>
          <div className="mb-4 flex space-between">
            <input
              type="number"
              placeholder="Time"
              value={currentTime}
              onChange={(e) => setCurrentTime(e.target.value)}
              className={`border rounded px-2 py-1 w-1/4 mr-2 ${
                darkMode
                  ? "bg-dracula-background-700 border-dracula-background-600"
                  : "bg-dracula-foreground border-dracula-background-300"
              }`}
            />
            <input
              type="number"
              placeholder="Value"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`border rounded px-2 py-1 w-1/4 mr-2 ${
                darkMode
                  ? "bg-dracula-background-700 border-dracula-background-600"
                  : "bg-dracula-foreground border-dracula-background-300"
              }`}
            />
            <button
              onClick={addKeyframe}
              className={`px-4 py-1 w-1/2 rounded ${
                darkMode
                  ? "bg-dracula-cyan-600 hover:bg-dracula-cyan-700"
                  : "bg-dracula-cyan-500 hover:bg-dracula-cyan-600"
              } text-dracula-foreground`}
            >
              Add Keyframe
            </button>
          </div>

          <div className="mb-4 flex flex-col">
            <label
              htmlFor="pastedJSON"
              className={`block text-md font-medium mb-1 ${
                darkMode
                  ? "text-dracula-foreground-300"
                  : "text-dracula-background-700"
              }`}
            >
              Paste existing keyframes:
            </label>
            <textarea
              id="pastedJSON"
              value={pastedJSON}
              onChange={(e) => setPastedJSON(e.target.value)}
              className={`w-full border rounded p-2 max-h-32 ${
                darkMode
                  ? "bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground"
                  : "bg-dracula-foreground border-dracula-background-300"
              }`}
              rows={4}
            />
            <button
              onClick={parseAndAddKeyframes}
              className={`mt-2 px-4 py-2 rounded ${
                darkMode
                  ? "bg-dracula-cyan-600 hover:bg-dracula-cyan-700"
                  : "bg-dracula-cyan-500 hover:bg-dracula-cyan-600"
              } text-dracula-foreground`}
            >
              Parse and Add Keyframes
            </button>
          </div>
          <div
            className={`w-full flex flex-col ${
              darkMode ? "text-dracula-foreground" : "text-dracula-background"
            }`}
          >
            <h2 className="text-md font-medium mb-4">Randomization Range</h2>
            <div className="mb-4 flex space-between">
              <input
                type="number"
                placeholder="Min Value"
                value={randomMin}
                onChange={(e) => setRandomMin(parseFloat(e.target.value))}
                className={`border rounded px-2 py-1 w-1/2 mr-2 ${
                  darkMode
                    ? "bg-dracula-background-700 border-dracula-background-600"
                    : "bg-dracula-foreground border-dracula-background-300"
                }`}
              />
              <input
                type="number"
                placeholder="Max Value"
                value={randomMax}
                onChange={(e) => setRandomMax(parseFloat(e.target.value))}
                className={`border rounded px-2 py-1 w-1/2 ${
                  darkMode
                    ? "bg-dracula-background-700 border-dracula-background-600"
                    : "bg-dracula-foreground border-dracula-background-300"
                }`}
              />
            </div>
          </div>

          <div
        className={`w-full mt-4 ${
          darkMode ? "text-dracula-foreground" : "text-dracula-background"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Generator</h2>
        <div className="mb-4 flex flex-col space-between">
          <div className="flex flex-row mb-4">
            <div className="relative w-1/2 mr-2">
              <label
                htmlFor="randomKeyframeCount"
                className="block text-sm font-medium mb-1"
              >
                Number of Keyframes
              </label>
              <input
                type="number"
                placeholder="Number of Keyframes"
                value={randomKeyframeCount}
                onChange={(e) =>
                  setRandomKeyframeCount(Math.max(1, parseInt(e.target.value)))
                }
                className={`border rounded px-2 py-1 w-full ${
                  darkMode
                    ? "bg-dracula-background-700 border-dracula-background-600"
                    : "bg-dracula-foreground border-dracula-background-300"
                }`}
                title="The number of random keyframes to generate"
              />
              <span className="absolute bottom-full left-0 bg-gray-700 text-white text-xs rounded px-2 py-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                The number of random keyframes to generate
              </span>
            </div>
            <div className="relative w-1/2 mr-2">
              <label
                htmlFor="maxFrameNumber"
                className="block text-sm font-medium mb-1"
              >
                Max Frame Number
              </label>
              <input
                type="number"
                placeholder="Max Frame Number"
                value={maxFrameNumber}
                onChange={(e) =>
                  setMaxFrameNumber(Math.max(1, parseInt(e.target.value)))
                }
                className={`border rounded px-2 py-1 w-full ${
                  darkMode
                    ? "bg-dracula-background-700 border-dracula-background-600"
                    : "bg-dracula-foreground border-dracula-background-300"
                }`}
                title="The maximum frame number for generated keyframes"
              />
              <span className="absolute bottom-full left-0 bg-gray-700 text-white text-xs rounded px-2 py-1 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                The maximum frame number for generated keyframes
              </span>
            </div>
          </div>
          <button
            onClick={generateRandomKeyframes}
            className={`px-4 py-2 w-full rounded ${
              darkMode
                ? "bg-dracula-purple-600 hover:bg-dracula-purple-700"
                : "bg-dracula-purple-500 hover:bg-dracula-purple-600"
            } text-dracula-foreground`}
          >
            Generate Random Keyframes
          </button>
        </div>
      </div>
        </div>

        <div
          className={`w-full lg:w-1/2 p-4 mx-auto bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600 ${
            darkMode ? "text-dracula-foreground" : "text-dracula-background"
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">Keyframes</h2>
          <div className="mb-4 overflow-auto max-h-96">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr
                  className={
                    darkMode
                      ? "bg-dracula-background-800"
                      : "bg-dracula-foreground-600"
                  }
                >
                  <th className="p-2 text-left text-md">Frame</th>
                  <th className="p-2 text-left text-md">Value</th>
                  <th className="p-2 text-left text-md">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keyframes.map((keyframe, index) => (
                  <tr
                    key={index}
                    className={
                      darkMode
                        ? "border-b border-dracula-background-700"
                        : "border-b"
                    }
                  >
                    <td className="p-2">
                      <input
                        type="number"
                        value={keyframe.time}
                        onChange={(e) =>
                          updateKeyframe(index, "time", e.target.value)
                        }
                        className={`border rounded px-2 py-1 w-full ${
                          darkMode
                            ? "bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground"
                            : "bg-dracula-foreground border-dracula-background-300"
                        }`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={keyframe.value}
                        onChange={(e) =>
                          updateKeyframe(index, "value", e.target.value)
                        }
                        className={`border rounded px-2 py-1 w-full ${
                          darkMode
                            ? "bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground"
                            : "bg-dracula-foreground border-dracula-background-300"
                        }`}
                      />
                    </td>
                    <td className="p-2 flex justify-center items-center">
                      <button
                        onClick={() => removeKeyframe(index)}
                        className={`px-2 py-1 rounded mr-2 ${
                          darkMode
                            ? "bg-dracula-red-800 hover:bg-dracula-red-700"
                            : "bg-dracula-red-500 hover:bg-dracula-red-600"
                        } text-dracula-foreground`}
                      >
                        <FaRegTrashAlt />
                      </button>
                      <button
                        onClick={() => randomizeKeyframe(index)}
                        className={`px-2 py-1 rounded ${
                          darkMode
                            ? "bg-dracula-purple-800 hover:bg-dracula-purple-700"
                            : "bg-dracula-purple-500 hover:bg-dracula-purple-600"
                        } text-dracula-foreground`}
                      >
                        <FaDice />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {keyframes.length > 0 && (
            <>
              <div className="flex mb-4">
                <button
                  onClick={() => updateKeyframesAndSave([])}
                  className={`w-1/2 px-4 py-2 mr-2 rounded ${
                    darkMode
                      ? "bg-dracula-red-800 hover:bg-dracula-red-700"
                      : "bg-dracula-red-500 hover:bg-dracula-red-600"
                  } text-dracula-foreground`}
                >
                  Remove All Keyframes
                </button>
                <button
                  onClick={randomizeAllKeyframes}
                  className={`px-4 py-2  w-1/2 rounded ${
                    darkMode
                      ? "bg-dracula-purple-600 hover:bg-dracula-purple-700"
                      : "bg-dracula-purple-500 hover:bg-dracula-purple-600"
                  } text-dracula-foreground`}
                >
                  Randomize All
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {keyframes.length > 0 && (
        <div className="w-full mt-4 bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600">
          <h2
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-dracula-foreground" : "text-dracula-background"
            }`}
          >
            Output
          </h2>
          <div className="relative">
            <pre
              className={`bg-dracula-foreground-100 p-4 rounded overflow-auto max-h-24 text-wrap ${
                darkMode
                  ? "text-dracula-background"
                  : "text-dracula-background-900"
              }`}
            >
              {generateJSON()}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateJSON());
              }}
              className={`absolute top-2 right-2 px-3 py-1 rounded ${
                darkMode
                  ? "bg-dracula-cyan-600 hover:bg-dracula-cyan-700"
                  : "bg-dracula-cyan-500 hover:bg-dracula-cyan-600"
              } text-dracula-foreground`}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyframeEditor;
