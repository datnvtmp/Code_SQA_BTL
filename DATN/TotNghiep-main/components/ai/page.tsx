'use client';

import { calculateNutrition } from '@utils/nutritionCalculator';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/* ================= TYPES ================= */

export type Ingredient = {
  quantity: number;
  unit: string;
  rawName: string;
  note?: string;
  displayOrder: number;
};

type Props = {
  initialIngredients?: Ingredient[];
};



/* ================= COMPONENT ================= */

export default function NutritionCalculatorPage({
  initialIngredients = [],
}: Props) {
  console.log(initialIngredients)
  const data = useMemo(() => {
    const items = calculateNutrition(initialIngredients);

    const totalCalories = items.reduce(
      (sum, item) => sum + item.calories,
      0
    );

    return { items, totalCalories };
  }, [initialIngredients]);

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">
          🍗 Nutrition Calculator
        </h1>

        <div className="rounded-3xl bg-gradient-to-r from-red-500 to-orange-400 text-white px-6 py-3 shadow-lg">
          <div className="text-sm opacity-80">
            Tổng năng lượng
          </div>
          <div className="text-3xl font-bold">
            {data.totalCalories} cal
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Nguyên liệu</th>
                <th className="p-2 text-right">Gram</th>
                <th className="p-2 text-right">Calories</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-gray-400"
                  >
                    Chưa có nguyên liệu
                  </td>
                </tr>
              ) : (
                data.items.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">
                      {item.grams}
                    </td>
                    <td className="p-2 text-right font-semibold">
                      {item.calories} cal
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CHART */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-lg p-5">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">
            🔥 Phân bố Calories
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.items}
                barSize={48}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient
                    id="caloGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 6"
                  vertical={false}
                  stroke="#e5e7eb"
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(239,68,68,0.1)' }}
                  contentStyle={{
                    borderRadius: 16,
                    border: 'none',
                    backgroundColor: '#111827',
                    color: '#fff',
                    fontSize: 13,
                  }}
                  formatter={(value) => {
                    if (typeof value !== 'number') return '';
                    return `${value} kcal`;
                  }}
                />

                <Bar
                  dataKey="calories"
                  fill="url(#caloGradient)"
                  radius={[16, 16, 8, 8]}
                  label={{
                    position: 'top',
                    fill: '#991b1b',
                    fontSize: 12,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
