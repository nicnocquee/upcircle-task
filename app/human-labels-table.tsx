"use client";

import { Suspense, use } from "react";
import { getHumanLabelsThisMonth } from "./data";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default function HumanLabelsSection({
  name,
  dataSource,
}: {
  name: string;
  dataSource: ReturnType<typeof getHumanLabelsThisMonth>;
}) {
  return (
    <div>
      <h1 className="font-bold text-3xl">{name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <HumanLabelsTable dataSource={dataSource} />
      </Suspense>
    </div>
  );
}

function HumanLabelsTable({
  dataSource,
}: {
  dataSource: ReturnType<typeof getHumanLabelsThisMonth>;
}) {
  const result = use(dataSource);
  const [data, count] = result;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Bale</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((humanLabel) => (
          <TableRow key={humanLabel.id}>
            <TableCell className="font-medium">{humanLabel.id}</TableCell>
            <TableCell>
              <a target="_blank" href={humanLabel.bale?.url}>
                {humanLabel.bale?.url}
              </a>
            </TableCell>
            <TableCell>
              <Link
                className="underline"
                href={`/summary?labelSetId=${humanLabel.category.labelSet.id}`}
              >
                {humanLabel.category.labelSet.name}
              </Link>{" "}
              {`${humanLabel.category.labelSetClass.name}`}
            </TableCell>
            <TableCell>{format(humanLabel.createdAt, "yyyy-MM-dd")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {data.length === count ? data.length : `${data.length} / ${count}`}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
