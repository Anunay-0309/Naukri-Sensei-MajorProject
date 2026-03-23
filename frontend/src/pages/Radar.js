import { useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

export default function RadarPage() {
  const location = useLocation();
  const data = location.state;

  if (!data || !data.radar) {
    return (
      <MainLayout>
        <div className="text-center mt-20 text-gray-500">
          No radar data available.
        </div>
      </MainLayout>
    );
  }

  const radarData = Object.entries(data.radar).map(([key, value]) => ({
    skill: key.replace("_", " "),
    value: value
  }));

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto mt-16 text-center">

        <h2 className="text-4xl font-semibold mb-10">
          Skill Radar
        </h2>

        <div className="w-full h-[400px]">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#555", fontSize: 14 }}
              />
              <Radar
                dataKey="value"
                stroke="#000"
                fill="#000"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </MainLayout>
  );
}