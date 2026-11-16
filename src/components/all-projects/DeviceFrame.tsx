import React from "react";
import type { ShotDevice } from "../../constants/projects";

interface DeviceFrameProps {
  device: ShotDevice;
  children: React.ReactNode;
}

/** Wraps a screenshot in minimal browser or phone chrome. */
export const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, children }) => {
  if (device === "phone") {
    return (
      <div className="mx-auto aspect-[9/19.5] w-full max-w-[300px] overflow-hidden rounded-[2rem] border-4 border-core-graphite bg-core-obsidian">
        {children}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-core-graphite bg-core-obsidian">
      <div className="flex items-center gap-1.5 border-b border-core-graphite px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-core-graphite" />
        <span className="h-2.5 w-2.5 rounded-full bg-core-graphite" />
        <span className="h-2.5 w-2.5 rounded-full bg-core-graphite" />
      </div>
      <div className="aspect-[16/10] w-full">{children}</div>
    </div>
  );
};
