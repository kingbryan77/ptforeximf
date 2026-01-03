import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_OHLC_DATA } from '../../constants';

// Custom Shape for Candlestick
const Candlestick = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    low,
    high,
    open,
    close,
  } = props;

  const isBullish = close > open;
  const color = isBullish ? '#10B981' : '#EF4444'; // Green (Success) or Red (Danger)
  const ratio = Math.abs(height / (high - low));

  // Calculate positions
  // Note: y is the top position of the bar in pixels
  // We need to map prices to pixels. 
  // Recharts passes the scaled values for y if we bind data properly, 
  // but for custom shapes, it often passes the bounding box of the "bar" value.
  // Instead, we can calculate offsets relative to the high/low passed in.
  
  // However, simpler math with Recharts custom shape:
  // The `y` prop usually corresponds to the top of the plotted value. 
  // If we plot [min, max], `y` is the pixel of `max`, and `height` is `pixel(min) - pixel(max)`.
  
  // Let's calculate pixel positions manually based on the YAxis scale provided by Recharts context if available,
  // OR assume the dataKey was [low, high].
  
  // Better Approach for Recharts Candlestick:
  // The `y` received is the top pixel. `height` is the height of the bar [low, high].
  // We need to draw the body [open, close] and wick [high, low] inside this box.
  
  // Pixel coordinate of Top Price (High) = y
  // Pixel coordinate of Bottom Price (Low) = y + height
  // Range = High - Low
  
  const pixelHeight = height;
  const priceRange = high - low;
  
  if (priceRange === 0) return null;

  const priceToPixel = (price: number) => {
    // Relative to the High (which is at 'y')
    const diffFromHigh = high - price;
    return y + (diffFromHigh / priceRange) * pixelHeight;
  };

  const yOpen = priceToPixel(open);
  const yClose = priceToPixel(close);
  const yHigh = y;
  const yLow = y + height;

  const bodyTop = Math.min(yOpen, yClose);
  const bodyHeight = Math.abs(yOpen - yClose);

  return (
    <g>
      {/* Wick (Line from High to Low) */}
      <line
        x1={x + width / 2}
        y1={yHigh}
        x2={x + width / 2}
        y2={yLow}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body (Rect from Open to Close) */}
      <rect
        x={x}
        y={bodyTop}
        width={width}
        height={Math.max(bodyHeight, 1)} // Ensure at least 1px visibility
        fill={color}
        stroke={color}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg text-xs">
        <p className="text-gray-400 mb-1">{`Time: ${data.time}`}</p>
        <p className="text-green-400">{`Open: ${data.open.toFixed(2)}`}</p>
        <p className="text-blue-400">{`High: ${data.high.toFixed(2)}`}</p>
        <p className="text-red-400">{`Low: ${data.low.toFixed(2)}`}</p>
        <p className="text-yellow-400">{`Close: ${data.close.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const MarketOverviewChart: React.FC = () => {
  // Prepare data for Recharts
  // Recharts doesn't take [low, high] natively in Bar dataKey.
  // We need to construct a data array where we pass full objects.
  
  // We calculate domain min/max for YAxis
  const minPrice = Math.min(...MOCK_OHLC_DATA.map(d => d.low));
  const maxPrice = Math.max(...MOCK_OHLC_DATA.map(d => d.high));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={MOCK_OHLC_DATA}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
        <XAxis dataKey="time" hide />
        <YAxis 
          domain={[minPrice - padding, maxPrice + padding]} 
          orientation="right" 
          tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
        <Bar
          shape={(props: any) => {
             // Recharts passes the value of 'dataKey' (high) as properties, 
             // but we need to trick it to give us the full height from High to Low.
             // Actually, the easiest way in Recharts is to bind `dataKey` to an array `[low, high]`.
             return <Candlestick {...props} 
                open={props.payload.open} 
                close={props.payload.close} 
                high={props.payload.high} 
                low={props.payload.low} 
             />;
          }}
          // Important: We need to trick the Bar to render from Low to High so the "height" prop in shape covers the full range.
          // Recharts allows dataKey to be an array [min, max]
          dataKey={(item: any) => [item.low, item.high]}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MarketOverviewChart;