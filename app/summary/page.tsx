import { prismaClient } from "@/prisma/prisma-client";
import { format } from "date-fns";
import FilterComponent from "./filter-component";
import { getSummaryForLabelSet } from "./data";
import DataComponent from "./data-component";
import { getPredefinedTimeRanges } from "./time-range";

export default async function Page({
  searchParams,
}: {
  searchParams?: { labelSetId?: string };
}) {
  const labelSets = await prismaClient.labelSet.findMany();
  const timeRange = getPredefinedTimeRanges();

  // if there is a labelSetId in the searchParams, we want to show the data for that label set.
  // so here we start the data fetching then pass down the promise to the DataComponent to be awaited.
  const dataSources =
    searchParams && searchParams.labelSetId
      ? timeRange.map(([, start, end]) => {
          // TODO: use getSummaryForLabelSetFromMaterializedView
          return getSummaryForLabelSet(
            parseInt(searchParams.labelSetId!, 10),
            start,
            end
          );
        })
      : null;

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl">Summary</h1>
      <div className="flex flex-row space-x-4">
        <FilterComponent
          labelSets={labelSets}
          initialLabelSetId={searchParams?.labelSetId}
        />
      </div>
      <div>
        {dataSources
          ? dataSources.map((d, i) => {
              return (
                <DataComponent
                  key={i}
                  name={
                    <div className="flex flex-row items-baseline space-x-2">
                      <h2>{`${timeRange[i][0]}`}</h2>
                      <span className="text-sm text-muted-foreground font-normal">{`(${format(
                        timeRange[i][1],
                        "yyyy-MM-dd"
                      )} - ${format(timeRange[i][2], "yyyy-MM-dd")})`}</span>
                    </div>
                  }
                  dataSource={d}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}
