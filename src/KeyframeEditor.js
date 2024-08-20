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

const KeyframeEditor = ({ darkMode, keyframes, setKeyframes, settings, setSettings }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [pastedJSON, setPastedJSON] = useState("0:(1.000),1:(0.950),2:(0.810),3:(0.590),4:(0.310),5:(0.000),6:(-0.310),7:(-0.590),8:(-0.810),9:(-0.950),10:(-1.000),11:(-0.950),12:(-0.810),13:(-0.590),14:(-0.310),15:(0.000),16:(0.310),17:(0.590),18:(0.810),19:(0.950),20:(1.000),21:(0.950),22:(0.810),23:(0.590),24:(0.310),25:(0.000),26:(-0.310),27:(-0.590),28:(-0.810),29:(-0.950),30:(-1.000),31:(-0.950),32:(-0.810),33:(-0.590),34:(-0.310),35:(0.000),36:(0.310),37:(0.590),38:(0.810),39:(0.950),40:(1.000),41:(0.950),42:(0.810),43:(0.590),44:(0.310),45:(0.000),46:(-0.310),47:(-0.590),48:(-0.810),49:(-0.950),50:(-1.000),51:(-0.950),52:(-0.810),53:(-0.590),54:(-0.310),55:(0.000),56:(0.310),57:(0.590),58:(0.810),59:(0.950),60:(1.000),61:(0.950),62:(0.810),63:(0.590),64:(0.310),65:(0.000),66:(-0.310),67:(-0.590),68:(-0.810),69:(-0.950),70:(-1.000),71:(-0.950),72:(-0.810),73:(-0.590),74:(-0.310),75:(0.000),76:(0.310),77:(0.590),78:(0.810),79:(0.950),80:(1.000),81:(0.950),82:(0.810),83:(0.590),84:(0.310),85:(0.000),86:(-0.310),87:(-0.590),88:(-0.810),89:(-0.950),90:(-1.000),91:(-0.950),92:(-0.810),93:(-0.590),94:(-0.310),95:(0.000),96:(0.310),97:(0.590),98:(0.810),99:(0.950),100:(1.000),101:(0.950),102:(0.810),103:(0.590),104:(0.310),105:(0.000),106:(-0.310),107:(-0.590),108:(-0.810),109:(-0.950),110:(-1.000),111:(-0.950),112:(-0.810),113:(-0.590),114:(-0.310),115:(0.000),116:(0.310),117:(0.590),118:(0.810),119:(0.950)");

  const { randomMin, randomMax, randomKeyframeCount, maxFrameNumber } = settings;

  useEffect(() => {
    localStorage.setItem("keyframes", JSON.stringify(keyframes));
  }, [keyframes]);

  useEffect(() => {
    localStorage.setItem("keyframeSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const addKeyframe = () => {
    if (currentTime !== "" && currentValue !== "") {
      const newKeyframe = {
        time: parseFloat(currentTime),
        value: parseFloat(currentValue),
      };
      setKeyframes(
        [...keyframes, newKeyframe].sort((a, b) => a.time - b.time)
      );
      setCurrentTime("");
      setCurrentValue("");
    }
  };

  const removeKeyframe = (index) => {
    const updatedKeyframes = keyframes.filter((_, i) => i !== index);
    setKeyframes(updatedKeyframes);
  };

  const updateKeyframe = (index, field, value) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index][field] = parseFloat(value);
    setKeyframes(updatedKeyframes.sort((a, b) => a.time - b.time));
  };

  const randomizeKeyframe = (index) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index] = {
      ...updatedKeyframes[index],
      value: parseFloat(
        (Math.random() * (randomMax - randomMin) + randomMin).toFixed(3)
      ),
    };
    setKeyframes(updatedKeyframes);
  };

  const randomizeAllKeyframes = () => {
    const updatedKeyframes = keyframes.map((keyframe) => ({
      ...keyframe,
      value: parseFloat(
        (Math.random() * (randomMax - randomMin) + randomMin).toFixed(3)
      ),
    }));
    setKeyframes(updatedKeyframes);
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

    const updatedKeyframes = [...keyframes, ...newKeyframes].sort(
      (a, b) => a.time - b.time
    );

    const uniqueKeyframes = updatedKeyframes.filter(
      (keyframe, index, self) =>
        index === self.findIndex((t) => t.time === keyframe.time)
    );

    setKeyframes(uniqueKeyframes);
  };

  const parseAndAddKeyframes = () => {
    try {
      const keyframePairs = pastedJSON.replace(/\s/g, "").split(",");
      const newKeyframes = keyframePairs.map((pair) => {
        const [time, value] = pair.split(":");
        return {
          time: parseFloat(time),
          value: parseFloat(value.replace(/[()]/g, "")),
        };
      }).filter(keyframe => keyframe.time >= 0);

      const updatedKeyframes = [...keyframes];
      newKeyframes.forEach((newKeyframe) => {
        const existingIndex = updatedKeyframes.findIndex(kf => kf.time === newKeyframe.time);
        if (existingIndex !== -1) {
          updatedKeyframes[existingIndex].value = newKeyframe.value;
        } else {
          updatedKeyframes.push(newKeyframe);
        }
      });

      setKeyframes(updatedKeyframes.sort((a, b) => a.time - b.time));
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
    setKeyframes(updatedKeyframes);
  };

  const prepareChartData = useCallback(() => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    return {
      labels: sortedKeyframes.map((kf) => kf.time),
      datasets: [
        {
          label: "Value",
          data: sortedKeyframes.map((kf) => kf.value),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          pointHitRadius: 20,
        },
      ],
    };
  }, [keyframes]);

  const chartData = useMemo(() => prepareChartData(), [prepareChartData]);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    // Trigger chart re-render when keyframes are updated
    setChartKey(prevKey => prevKey + 1);
  }, [keyframes]);

  const chartAnimation = {
    duration: 800,
    easing: 'easeOutQuart',
    from: (ctx) => {
      if (ctx.type === 'data') {
        return {
          x: ctx.xCenter,
          y: ctx.yCenter,
          opacity: 0
        };
      }
    }
  };

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
        '"Space Mono", monospace',
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
          className={`w-full mb-4 lg:mb-0 lg:w-1/2 p-4 mx-auto mr-4 bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600 ${
            darkMode ? "text-dracula-foreground" : "text-dracula-background"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Setup</h2>

          <div className="mb-4 flex flex-col">
            <label
              htmlFor="pastedJSON"
              className={`block text-md font-medium mb-2 ${
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
                  ? "bg-dracula-cyan-700 hover:bg-dracula-cyan-600"
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
            <h2 className="text-md font-medium mb-2">Randomization Range</h2>
            <div className="mb-4 flex space-between">
              <input
                type="number"
                inputMode="numeric"
                placeholder="Min Value"
                value={randomMin}
                onChange={(e) => updateSettings({ randomMin: parseFloat(e.target.value) })}
                className={`border rounded px-2 py-1 w-1/2 mr-2 ${
                  darkMode
                    ? "bg-dracula-background-700 border-dracula-background-600"
                    : "bg-dracula-foreground border-dracula-background-300"
                }`}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Max Value"
                value={randomMax}
                onChange={(e) => updateSettings({ randomMax: parseFloat(e.target.value) })}
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
                    inputMode="numeric"
                    placeholder="Number of Keyframes"
                    value={randomKeyframeCount}
                    onChange={(e) =>
                      updateSettings({ randomKeyframeCount: Math.max(1, parseInt(e.target.value)) })
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
                    inputMode="numeric"
                    placeholder="Max Frame Number"
                    value={maxFrameNumber}
                    onChange={(e) =>
                      updateSettings({ maxFrameNumber: Math.max(1, parseInt(e.target.value)) })
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
          <h2 className="text-xl font-semibold mb-4">Keyframes</h2>
          <div className="mb-2 flex space-between">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Frame"
              min={0}
              value={currentTime}
              onChange={(e) => setCurrentTime(e.target.value)}
              className={`border rounded px-2 py-1 w-1/3 mr-2 ${
                darkMode
                  ? "bg-dracula-background-700 border-dracula-background-600"
                  : "bg-dracula-foreground border-dracula-background-300"
              }`}
            />
            <input
              type="number"
              inputMode="decimal"
              step=".5"
              placeholder="Value"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`border rounded px-2 py-1 w-1/3 mr-2 ${
                darkMode
                  ? "bg-dracula-background-700 border-dracula-background-600"
                  : "bg-dracula-foreground border-dracula-background-300"
              }`}
            />
            <button
              onClick={addKeyframe}
              className={`px-4 py-1 w-1/3 rounded ${
                darkMode
                  ? "bg-dracula-cyan-700 hover:bg-dracula-cyan-600"
                  : "bg-dracula-cyan-500 hover:bg-dracula-cyan-600"
              } text-dracula-foreground`}
            >
              Add Keyframe
            </button>
          </div>
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
                  <th className="p-2 text-left text-md w-2/5">Frame</th>
                  <th className="p-2 text-left text-md w-2/5">Value</th>
                  <th className="p-2 text-left text-md w-1/5">Actions</th>
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
                    <td className="p-2 w-2/5">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
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
                    <td className="p-2 w-2/5">
                      <input
                        type="number"
                        inputMode="decimal"
                        step=".1"
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
                    <td className="p-2 w-1/5 text-center">
                      <button
                        onClick={() => removeKeyframe(index)}
                        className={`px-2 py-1 rounded mr-1 sm:mr-2 ${
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
                  onClick={() => setKeyframes([])}
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
        <div className="w-full mt-4 mb-8 bg-dracula-background-800 rounded-lg p-4 border border-dracula-background-600">
          <h2
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-dracula-foreground" : "text-dracula-background"
            }`}
          >
            Output
          </h2>
          <div className="relative">
            <pre
              className={`bg-dracula-background-100 p-4 rounded overflow-auto max-h-24 text-wrap ${
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
                  ? "bg-dracula-cyan-700 hover:bg-dracula-cyan-600"
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