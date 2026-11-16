import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project, ShotDevice } from "../../constants/projects";
import { DeviceFrame } from "./DeviceFrame";
import { ProjectCover } from "./ProjectCover";
import { ProjectLightbox } from "./ProjectLightbox";
import { galleryDevices, shotsFor, stepIndex } from "./projectGallery";

interface ProjectGalleryProps {
  project: Project;
}

const DEVICE_LABEL: Record<ShotDevice, string> = {
  desktop: "Desktop",
  phone: "Phone",
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  const devices = galleryDevices(project);
  const [device, setDevice] = useState<ShotDevice>(devices[0] ?? "desktop");
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const enlargeRef = useRef<HTMLButtonElement>(null);

  // Reset when switching project (adjusting state during render, keyed on slug).
  const [slug, setSlug] = useState(project.slug);
  if (slug !== project.slug) {
    setSlug(project.slug);
    setDevice(devices[0] ?? "desktop");
    setIndex(0);
    setLightboxOpen(false);
  }

  const activeDevice = devices.includes(device) ? device : (devices[0] ?? "desktop");
  const shots = shotsFor(project, activeDevice);

  if (devices.length === 0 || shots.length === 0) {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-lg border border-core-graphite">
        <ProjectCover src={project.image} title={project.title} className="h-full w-full" />
      </div>
    );
  }

  const current = shots[Math.min(index, shots.length - 1)];
  const count = shots.length;
  const arrow =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-core-graphite text-core-chrome transition-colors hover:border-core-icy hover:text-core-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-icy";

  return (
    <div className="space-y-3">
      {devices.length > 1 && (
        <div className="flex gap-2">
          {devices.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={d === activeDevice}
              onClick={() => {
                setDevice(d);
                setIndex(0);
              }}
              className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-icy ${
                d === activeDevice
                  ? "border-core-icy text-core-icy"
                  : "border-core-graphite text-core-mist hover:text-core-ink"
              }`}
            >
              {DEVICE_LABEL[d]}
            </button>
          ))}
        </div>
      )}

      <button
        ref={enlargeRef}
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={current.caption ? `Enlarge: ${current.caption}` : "Enlarge screenshot"}
        className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-icy"
      >
        <DeviceFrame device={activeDevice}>
          <img
            src={current.src}
            alt={current.caption ?? `${project.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </DeviceFrame>
      </button>

      {current.caption && <p className="text-sm text-core-mist">{current.caption}</p>}

      {count > 1 && (
        <>
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => setIndex(stepIndex(index, -1, count))}
              className={arrow}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-mono text-xs text-core-mist">
              {index + 1} / {count}
            </span>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => setIndex(stepIndex(index, 1, count))}
              className={arrow}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {shots.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-12 w-16 shrink-0 overflow-hidden rounded border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-core-icy ${
                  i === index ? "border-core-icy" : "border-core-graphite opacity-70 hover:opacity-100"
                }`}
              >
                <img src={s.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </button>
            ))}
          </div>
        </>
      )}

      {lightboxOpen && (
        <ProjectLightbox
          shots={shots}
          index={index}
          onIndex={setIndex}
          onClose={() => {
            setLightboxOpen(false);
            enlargeRef.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </div>
  );
};
