"use client";

import { ReactNode, use } from "react";
import { getSummaryForLabelSet } from "./data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarList } from "@/components/ui/bar-list";

export default function DataComponent({
  name,
  dataSource,
}: {
  name: ReactNode;
  dataSource: ReturnType<typeof getSummaryForLabelSet>;
}) {
  const data = use(dataSource);
  return (
    <div className="space-y-4 w-full my-8">
      <h1 className="text-3xl font-bold">{name}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-md space-y-4">
          <h2 className="text-muted-foreground">Graph</h2>
          <BarList
            onValueChange={(v) => console.log(v)}
            data={data.map((d) => ({
              name: d.labelSetClassName,
              value: d._count,
            }))}
          />
        </div>
        <div className="p-4 border rounded-md space-y-4">
          <h2 className="text-muted-foreground">Table</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(({ labelSetClassName, labelSetClassId, _count }) => {
                return (
                  <TableRow key={labelSetClassId}>
                    <TableCell className="font-medium">
                      {labelSetClassName}
                    </TableCell>
                    <TableCell>{_count}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
