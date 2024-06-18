import {
  getHumanLabelsThisMonth,
  getHumanLabelsThisWeek,
  getHumanLabelsThisYear,
  getHumanLabelsToday,
} from "./data";
import HumanLabelsSection from "./human-labels-table";

export default async function Home() {
  const humanLabelsToday = getHumanLabelsToday();
  const humanLabelsThisWeek = getHumanLabelsThisWeek();
  const humanLabelsThisMonth = getHumanLabelsThisMonth();
  const humanLabelsThisYear = getHumanLabelsThisYear();
  return (
    <div className="space-y-8">
      <HumanLabelsSection name="Today" dataSource={humanLabelsToday} />
      <HumanLabelsSection name="This week" dataSource={humanLabelsThisWeek} />
      <HumanLabelsSection name="This month" dataSource={humanLabelsThisMonth} />
      <HumanLabelsSection name="This year" dataSource={humanLabelsThisYear} />
    </div>
  );
}
