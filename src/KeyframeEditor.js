import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import dragData from 'chartjs-plugin-dragdata';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  dragData
);

const KeyframeEditor = ({ darkMode }) => {
  const [keyframes, setKeyframes] = useState(() => {
    const savedKeyframes = localStorage.getItem('keyframes');
    return savedKeyframes ? JSON.parse(savedKeyframes) : [];
  });
  const [currentTime, setCurrentTime] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [pastedJSON, setPastedJSON] = useState('');

  useEffect(() => {
    localStorage.setItem('keyframes', JSON.stringify(keyframes));
  }, [keyframes]);

  const updateKeyframesAndSave = (newKeyframes) => {
    setKeyframes(newKeyframes);
  };

  const addKeyframe = () => {
    if (currentTime !== '' && currentValue !== '') {
      const newKeyframe = { time: parseFloat(currentTime), value: parseFloat(currentValue) };
      updateKeyframesAndSave([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
      setCurrentTime('');
      setCurrentValue('');
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

  const generateJSON = () => {
    const formattedJSON = keyframes.reduce((acc, keyframe) => {
      acc[keyframe.time.toFixed(0)] = `(${keyframe.value.toFixed(3)})`;
      return acc;
    }, {});
    return JSON.stringify(formattedJSON).replace(/"/g, '').replace(/^\{/, '').replace(/\}$/, '');
  };

  const parseAndAddKeyframes = () => {
    try {
      // Remove all whitespace and split by commas
      const keyframePairs = pastedJSON.replace(/\s/g, '').split(',');
      const newKeyframes = keyframePairs.map(pair => {
        const [time, value] = pair.split(':');
        return {
          time: parseFloat(time),
          value: parseFloat(value.replace(/[()]/g, ''))
        };
      });

      updateKeyframesAndSave([...keyframes, ...newKeyframes].sort((a, b) => a.time - b.time));
      setPastedJSON('');
    } catch (error) {
      alert('Error parsing input. Please check your format and try again.');
      console.error('Error parsing keyframes:', error);
    }
  };

  const handleDrag = (e, datasetIndex, index, value) => {
    const updatedKeyframes = [...keyframes];
    updatedKeyframes[index] = {
      ...updatedKeyframes[index],
      value: parseFloat(value.toFixed(3))
    };
    updateKeyframesAndSave(updatedKeyframes);
  };

  const prepareChartData = useCallback(() => {
    const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);
    return {
      labels: sortedKeyframes.map(kf => kf.time),
      datasets: [
        {
          label: 'Keyframes',
          data: sortedKeyframes.map(kf => kf.value),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
        text: 'Keyframe Editor',
      },
      dragData: {
        round: 3,
        showTooltip: true,
        onDrag: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing';
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'default';
          handleDrag(e, datasetIndex, index, value);
        },
      },
      legend: {
        display: true,
        labels: {
          color: darkMode ? '#f8f8f2' : '#282a36',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Keyframes',
          color: darkMode ? '#f8f8f2' : '#282a36',
        },
        ticks: {
          color: darkMode ? '#f8f8f2' : '#282a36',
        },
        grid: {
          color: darkMode ? '#484a69' : 'rgba(68, 71, 90, 0.1)',
        },
      },
      y: {
        title: {
          display: false,
          text: 'Value',
          color: darkMode ? '#f8f8f2' : '#282a36',
        },
        ticks: {
          color: darkMode ? '#f8f8f2' : '#282a36',
        },
        grid: {
          color: darkMode ? '#484a69' : 'rgba(68, 71, 90, 0.1)',
        },
      },
    },
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 0,
    },
    defaults: {
      backgroundColor: darkMode ? '#282a36' : '#f8f8f2',
      borderColor: '#ff0000'
    }
  };

  return (
    <>
      <div className="mb-4">
        <Line className='max-h-64' data={chartData} options={chartOptions} />
      </div>
      <div className="flex flex-row">
        <div className={`w-1/2 p-4 max-w-4xl mx-auto ${darkMode ? 'text-dracula-foreground' : 'text-dracula-background'}`}>
          <h2 className="text-2xl font-bold mb-4">Add Keyframes</h2>
          <div className='mb-4 flex space-x-2'>
            <input
              type="number"
              placeholder="Time"
              value={currentTime}
              onChange={(e) => setCurrentTime(e.target.value)}
              className={`border rounded px-2 py-1 ${darkMode ? 'bg-dracula-background-700 border-dracula-background-600' : 'bg-dracula-foreground border-dracula-background-300'}`}
            />
            <input
              type="number"
              placeholder="Value"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className={`border rounded px-2 py-1 ${darkMode ? 'bg-dracula-background-700 border-dracula-background-600' : 'bg-dracula-foreground border-dracula-background-300'}`}
            />
            <button 
              onClick={addKeyframe}
              className={`px-4 py-1 rounded ${darkMode ? 'bg-dracula-cyan-600 hover:bg-dracula-cyan-700' : 'bg-dracula-cyan-500 hover:bg-dracula-cyan-600'} text-dracula-foreground`}
            >
              Add Keyframe
            </button>
          </div>

          <div className="mb-4 flex flex-col">
            <label htmlFor="pastedJSON" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-dracula-foreground-300' : 'text-dracula-background-700'}`}>
              Paste existing keyframes:
            </label>
            <textarea
              id="pastedJSON"
              value={pastedJSON}
              onChange={(e) => setPastedJSON(e.target.value)}
              className={`w-full border rounded p-2 ${darkMode ? 'bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground' : 'bg-dracula-foreground border-dracula-background-300'}`}
              rows={4}
            />
            <button
              onClick={parseAndAddKeyframes}
              className={`mt-2 px-4 py-2 rounded ${darkMode ? 'bg-dracula-cyan-600 hover:bg-dracula-cyan-700' : 'bg-dracula-cyan-500 hover:bg-dracula-cyan-600'} text-dracula-foreground`}
            >
              Parse and Add Keyframes
            </button>
          </div>
        </div>

        <div className={`w-1/2 p-4 max-w-4xl mx-auto ${darkMode ? 'text-dracula-foreground' : 'text-dracula-background'}`}>
          <h2 className="text-xl font-semibold mb-2">Keyframes</h2>
          <div className="mb-4 overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="w-full">
              <thead className="sticky top-0">
                <tr className={darkMode ? 'bg-dracula-background-800' : 'bg-dracula-foreground-600'}>
                  <th className="p-2 text-left">Time</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {keyframes.map((keyframe, index) => (
                  <tr key={index} className={darkMode ? 'border-b border-dracula-background-700' : 'border-b'}>
                    <td className="p-2">
                      <input
                        type="number"
                        value={keyframe.time}
                        onChange={(e) => updateKeyframe(index, 'time', e.target.value)}
                        className={`border rounded px-2 py-1 w-full ${darkMode ? 'bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground' : 'bg-dracula-foreground border-dracula-background-300'}`}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={keyframe.value}
                        onChange={(e) => updateKeyframe(index, 'value', e.target.value)}
                        className={`border rounded px-2 py-1 w-full ${darkMode ? 'bg-dracula-background-700 border-dracula-background-600 text-dracula-foreground' : 'bg-dracula-foreground border-dracula-background-300'}`}
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => removeKeyframe(index)}
                        className={`px-2 py-1 rounded ${darkMode ? 'bg-dracula-red-800 hover:bg-dracula-red-700' : 'bg-dracula-red-500 hover:bg-dracula-red-600'} text-dracula-foreground`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      <div>
        <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-dracula-foreground' : 'text-dracula-background'}`}>JSON Output</h2>
        <div className="relative">
          <pre
            className={`bg-dracula-foreground-100 p-4 rounded overflow-auto max-h-64 text-wrap ${darkMode ? 'text-dracula-background' : 'text-dracula-background-900'}`}
          >
            {generateJSON()}
          </pre>
          {generateJSON() && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateJSON());
              }}
              className={`absolute top-2 right-2 px-3 py-1 rounded ${
                darkMode ? 'bg-dracula-cyan-600 hover:bg-dracula-cyan-700' : 'bg-dracula-cyan-500 hover:bg-dracula-cyan-600'
              } text-dracula-foreground`}
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default KeyframeEditor;