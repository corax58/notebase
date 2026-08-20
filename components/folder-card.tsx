import Link from "next/link";
import {
  ArchiveIcon,
  ClockIcon,
  FolderIcon,
  LinkSimpleIcon,
  GlobeIcon,
  DotsThreeCircleVerticalIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRelativeDate } from "@/lib/utils";
import { Button } from "./ui/button";

type FolderCardProps = {
  folder: {
    id: string;
    name: string;
    color: string | null;
    noteCount: number;
  };
};

export function FolderCard({ folder }: FolderCardProps) {
  return (
    <Card key={folder.id} size="sm" className="rounded-md py-0">
      <CardContent className="p-0">
        <div className="bg-secondary flex aspect-video w-full items-center justify-center">
          <div className="relative size-32">
            <FolderIcon
              weight="fill"
              className="size-32"
              style={folder.color ? { color: folder.color } : undefined}
            />
            {/* highlight: same icon, white, faded top-to-bottom via mask */}
            <FolderIcon
              weight="fill"
              className="absolute inset-0 size-32 text-white opacity-50"
              style={{
                maskImage: "linear-gradient(to bottom, black, transparent 75%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black, transparent 75%)",
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex w-full gap-4 p-4">
            <div
              className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={
                folder.color
                  ? {
                      backgroundColor: `${folder.color}1a`,
                      color: folder.color,
                    }
                  : undefined
              }
            >
              <FolderIcon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{folder.name}</p>
              <p className="text-muted-foreground text-xs">
                {folder.noteCount} {folder.noteCount === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
          <Button variant={"ghost"}>
            <DotsThreeVerticalIcon className="size-6" weight="bold" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
