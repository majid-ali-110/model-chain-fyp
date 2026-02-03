import React, { useState, useRef, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';

const LineChart = ({
  data = [],
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 60 },
  xKey = 'x',
  yKey = 'y',
  lines = [],
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showDots = true,
  smooth = true,
  glowEffect = true,
  responsive = true,
  animate = true,
  className = '',
  xAxisLabel = '',
  yAxisLabel = '',
  tooltipFormatter,
  onPointHover,
  onPointClick
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width, height });

  // Handle responsive resizing
  useEffect(() => {
    if (!responsive) return;

    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = height / width;
        setDimensions({
          width: containerWidth,
          height: containerWidth * aspectRatio
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive, width, height]);

  // Calculate chart dimensions
  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;

  // Create smooth path for line - define before useMemo
  const createSmoothPath = (points, useSmooth) => {
    if (points.length === 0) return '';
    
    if (!useSmooth || points.length < 3) {
      // Simple line path
      return points.reduce((path, point, index) => {
        return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
      }, '');
    }

    // Smooth curve using quadratic Bézier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const curr = points[i];
      const next = points[i + 1];
      
      if (next) {
        const cpX = curr.x;
        const cpY = curr.y;
        const endX = (curr.x + next.x) / 2;
        const endY = (curr.y + next.y) / 2;
        path += ` Q ${cpX} ${cpY} ${endX} ${endY}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  // Process data and create scales
  const { processedLines, xTicks, yTicks } = useMemo(() => {
    if (!data.length) return { processedLines: [], xTicks: [], yTicks: [] };

    // Determine if we have single line or multiple lines
    const dataLines = lines.length > 0 ? lines : [{ key: yKey, color: colors[0], label: 'Data' }];
    
    // Get all x values
    const allXValues = data.map(d => d[xKey]);
    const xMin = Math.min(...allXValues);
    const xMax = Math.max(...allXValues);
    
    // Get all y values across all lines
    const allYValues = data.reduce((acc, d) => {
      dataLines.forEach(line => {
        if (d[line.key] !== undefined && d[line.key] !== null) {
          acc.push(d[line.key]);
        }
      });
      return acc;
    }, []);
    
    if (allYValues.length === 0) return { processedLines: [], xTicks: [], yTicks: [] };
    
    const yMin = Math.min(...allYValues);
    const yMax = Math.max(...allYValues);
    
    // Handle case where all values are the same (including all zeros)
    const yRange = yMax - yMin;
    const yPadding = yRange > 0 ? yRange * 0.1 : 1; // Use default padding of 1 if range is 0
    const adjustedYMin = yRange > 0 ? yMin - yPadding : yMin - 0.5;
    const adjustedYMax = yRange > 0 ? yMax + yPadding : yMax + 0.5;

    // Create scales
    const xScale = (value) => {
      const range = xMax - xMin;
      return range > 0 ? ((value - xMin) / range) * chartWidth : chartWidth / 2;
    };
    const yScale = (value) => {
      const range = adjustedYMax - adjustedYMin;
      return range > 0 ? chartHeight - ((value - adjustedYMin) / range) * chartHeight : chartHeight / 2;
    };

    // Generate tick values
    const xTickCount = Math.min(8, allXValues.length);
    const yTickCount = 6;
    
    const xTicks = [];
    for (let i = 0; i <= xTickCount; i++) {
      const value = xMin + (i / xTickCount) * (xMax - xMin);
      xTicks.push(value);
    }
    
    const yTicks = [];
    for (let i = 0; i <= yTickCount; i++) {
      const value = adjustedYMin + (i / yTickCount) * (adjustedYMax - adjustedYMin);
      yTicks.push(value);
    }

    // Process lines
    const processedLines = dataLines.map((line, index) => {
      const points = data
        .filter(d => d[line.key] !== undefined && d[line.key] !== null)
        .map(d => ({
          x: xScale(d[xKey]),
          y: yScale(d[line.key]),
          originalX: d[xKey],
          originalY: d[line.key],
          data: d
        }));

      return {
        ...line,
        color: line.color || colors[index % colors.length],
        points,
        path: createSmoothPath(points, smooth)
      };
    });

    return { processedLines, xTicks, yTicks };
  }, [data, lines, xKey, yKey, colors, chartWidth, chartHeight, smooth]);

  // Handle mouse events
  const handleMouseMove = (event) => {
    if (!showTooltip || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - margin.left;
    const mouseY = event.clientY - rect.top - margin.top;

    // Find closest point
    let closestPoint = null;
    let minDistance = Infinity;

    processedLines.forEach((line, lineIndex) => {
      line.points.forEach((point, pointIndex) => {
        const distance = Math.sqrt(
          Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
        );
        
        if (distance < 20 && distance < minDistance) {
          minDistance = distance;
          closestPoint = {
            ...point,
            lineIndex,
            pointIndex,
            line: line,
            color: line.color
          };
        }
      });
    });

    if (closestPoint) {
      setHoveredPoint(closestPoint);
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY
      });
      onPointHover?.(closestPoint);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handlePointClick = (point) => {
    onPointClick?.(point);
  };

  // Format values for display
  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      } else if (value % 1 === 0) {
        return value.toString();
      } else {
        return value.toFixed(2);
      }
    }
    return value.toString();
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    return (
      <g className="grid">
        {/* Vertical grid lines */}
        {xTicks.map((tick, index) => {
          const x = ((tick - Math.min(...data.map(d => d[xKey]))) / 
                    (Math.max(...data.map(d => d[xKey])) - Math.min(...data.map(d => d[xKey])))) * chartWidth;
          return (
            <line
              key={`vgrid-${index}`}
              x1={x}
              y1={0}
              x2={x}
              y2={chartHeight}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Horizontal grid lines */}
        {yTicks.map((tick, index) => {
          const allYValues = data.reduce((acc, d) => {
            processedLines.forEach(line => {
              if (d[line.key] !== undefined && d[line.key] !== null) {
                acc.push(d[line.key]);
              }
            });
            return acc;
          }, []);
          const yMin = Math.min(...allYValues);
          const yMax = Math.max(...allYValues);
          const yPadding = (yMax - yMin) * 0.1;
          const adjustedYMin = yMin - yPadding;
          const adjustedYMax = yMax + yPadding;
          
          const y = chartHeight - ((tick - adjustedYMin) / (adjustedYMax - adjustedYMin)) * chartHeight;
          return (
            <line
              key={`hgrid-${index}`}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}
      </g>
    );
  };

  const renderAxes = () => {
    return (
      <g className="axes">
        {/* X Axis */}
        <line
          x1={0}
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
        
        {/* Y Axis */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={chartHeight}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
        
        {/* X Axis Labels */}
        {xTicks.map((tick, index) => {
          const x = ((tick - Math.min(...data.map(d => d[xKey]))) / 
                    (Math.max(...data.map(d => d[xKey])) - Math.min(...data.map(d => d[xKey])))) * chartWidth;
          return (
            <text
              key={`xlabel-${index}`}
              x={x}
              y={chartHeight + 20}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.7)"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              {formatValue(tick)}
            </text>
          );
        })}
        
        {/* Y Axis Labels */}
        {yTicks.map((tick, index) => {
          const allYValues = data.reduce((acc, d) => {
            processedLines.forEach(line => {
              if (d[line.key] !== undefined && d[line.key] !== null) {
                acc.push(d[line.key]);
              }
            });
            return acc;
          }, []);
          const yMin = Math.min(...allYValues);
          const yMax = Math.max(...allYValues);
          const yRange = yMax - yMin;
          const yPadding = yRange > 0 ? yRange * 0.1 : 0.5;
          const adjustedYMin = yMin - yPadding;
          const adjustedYMax = yMax + yPadding;
          const adjustedRange = adjustedYMax - adjustedYMin;
          
          const y = adjustedRange > 0 ? chartHeight - ((tick - adjustedYMin) / adjustedRange) * chartHeight : chartHeight / 2;
          return (
            <text
              key={`ylabel-${index}`}
              x={-10}
              y={y + 4}
              textAnchor="end"
              fill="rgba(255, 255, 255, 0.7)"
              fontSize="12"
              fontFamily="Inter, sans-serif"
            >
              {formatValue(tick)}
            </text>
          );
        })}
        
        {/* Axis Labels */}
        {xAxisLabel && (
          <text
            x={chartWidth / 2}
            y={chartHeight + 40}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="14"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
          >
            {xAxisLabel}
          </text>
        )}
        
        {yAxisLabel && (
          <text
            x={-40}
            y={chartHeight / 2}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.8)"
            fontSize="14"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            transform={`rotate(-90, -40, ${chartHeight / 2})`}
          >
            {yAxisLabel}
          </text>
        )}
      </g>
    );
  };

  const renderLines = () => {
    return processedLines.map((line, index) => (
      <g key={`line-${index}`} className={animate ? 'animate-draw' : ''}>
        {/* Glow effect */}
        {glowEffect && (
          <path
            d={line.path}
            stroke={line.color}
            strokeWidth="6"
            fill="none"
            opacity="0.3"
            filter="blur(3px)"
          />
        )}
        
        {/* Main line */}
        <path
          d={line.path}
          stroke={line.color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: glowEffect ? `drop-shadow(0 0 8px ${line.color}40)` : 'none'
          }}
        />
        
        {/* Data points */}
        {showDots && line.points.map((point, pointIndex) => (
          <g key={`point-${index}-${pointIndex}`}>
            {/* Glow effect for dots */}
            {glowEffect && (
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill={line.color}
                opacity="0.2"
                filter="blur(2px)"
              />
            )}
            
            {/* Main dot */}
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={line.color}
              stroke="#1F2937"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all duration-200"
              style={{
                filter: glowEffect ? `drop-shadow(0 0 6px ${line.color}60)` : 'none'
              }}
              onClick={() => handlePointClick({ ...point, line, lineIndex: index, pointIndex })}
            />
            
            {/* Hover effect */}
            {hoveredPoint && 
             hoveredPoint.lineIndex === index && 
             hoveredPoint.pointIndex === pointIndex && (
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="none"
                stroke={line.color}
                strokeWidth="2"
                opacity="0.8"
                className="animate-pulse"
              />
            )}
          </g>
        ))}
      </g>
    ));
  };

  const renderLegend = () => {
    if (!showLegend || processedLines.length <= 1) return null;

    return (
      <div className="flex flex-wrap justify-center mt-4 space-x-6">
        {processedLines.map((line, index) => (
          <div key={`legend-${index}`} className="flex items-center space-x-2">
            <div
              className="w-4 h-0.5 rounded"
              style={{
                backgroundColor: line.color,
                boxShadow: glowEffect ? `0 0 6px ${line.color}60` : 'none'
              }}
            />
            <span className="text-sm text-dark-text-secondary">
              {line.label || `Series ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderTooltip = () => {
    if (!showTooltip || !hoveredPoint) return null;

    const tooltipContent = tooltipFormatter 
      ? tooltipFormatter(hoveredPoint)
      : (
          <div className="space-y-1">
            <div className="font-medium text-dark-text-primary">
              {hoveredPoint.line.label || 'Value'}
            </div>
            <div className="text-sm text-dark-text-secondary">
              X: {formatValue(hoveredPoint.originalX)}
            </div>
            <div className="text-sm text-dark-text-secondary">
              Y: {formatValue(hoveredPoint.originalY)}
            </div>
          </div>
        );

    return (
      <div
        className="fixed z-50 bg-dark-surface-elevated border border-dark-surface-elevated rounded-lg shadow-xl p-3 pointer-events-none"
        style={{
          left: tooltipPosition.x + 10,
          top: tooltipPosition.y - 10,
          transform: 'translateY(-100%)'
        }}
      >
        {tooltipContent}
      </div>
    );
  };

  if (!data.length || !processedLines.length) {
    return (
      <div className={clsx('flex items-center justify-center bg-dark-surface-elevated rounded-lg', className)}
           style={{ width: dimensions.width, height: dimensions.height }}>
        <div className="text-center">
          <div className="text-dark-text-muted mb-2">No data available</div>
          <div className="text-sm text-dark-text-muted">Add data to display the chart</div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('relative', className)} ref={containerRef}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-dark-surface-elevated rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {renderGrid()}
          {renderAxes()}
          {renderLines()}
        </g>
      </svg>
      
      {renderLegend()}
      {renderTooltip()}
    </div>
  );
};

export default LineChart;