"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FilterComponent({
  labelSets,
  initialLabelSetId,
}: {
  labelSets: { id: number; name: string }[];
  initialLabelSetId?: string;
}) {
  const [selectedLabelSet, setSelectedLabelSet] = useState<string | undefined>(
    initialLabelSetId
  );
  const router = useRouter();
  return (
    <>
      <Select
        defaultValue={initialLabelSetId}
        onValueChange={(value) => setSelectedLabelSet(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a label set" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Label sets</SelectLabel>
            {labelSets.map((labelSet) => (
              <SelectItem key={labelSet.id} value={labelSet.id.toString()}>
                {labelSet.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        onClick={() => {
          router.push(`/summary?labelSetId=${selectedLabelSet}`);
        }}
      >
        Submit
      </Button>
    </>
  );
}
