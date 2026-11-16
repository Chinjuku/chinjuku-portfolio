import { describe, expect, it } from "vitest";
import { all_projects, type Project } from "../../constants/projects";
import { galleryDevices, projectBySlug, shotsFor, stepIndex } from "./projectGallery";

const base = all_projects[0];
const withShots: Project = {
  ...base,
  gallery: [
    { src: "/p/a.webp", device: "phone" },
    { src: "/p/b.webp", device: "desktop" },
    { src: "/p/c.webp", device: "desktop" },
  ],
};

describe("slugs", () => {
  it("every project has a unique kebab-case slug", () => {
    const slugs = all_projects.map((p) => p.slug);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("projectBySlug", () => {
  it("finds fintax", () => expect(projectBySlug("fintax")?.title).toBe("FinTax"));
  it("returns undefined for unknown or null", () => {
    expect(projectBySlug("nope")).toBeUndefined();
    expect(projectBySlug(null)).toBeUndefined();
  });
});

describe("galleryDevices / shotsFor", () => {
  it("is empty without a gallery", () => expect(galleryDevices({ ...base, gallery: undefined })).toEqual([]));
  it("orders desktop before phone, unique", () => expect(galleryDevices(withShots)).toEqual(["desktop", "phone"]));
  it("filters by device", () => expect(shotsFor(withShots, "desktop").map((s) => s.src)).toEqual(["/p/b.webp", "/p/c.webp"]));
});

describe("stepIndex", () => {
  it("wraps both ways", () => {
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
  });
  it("is 0 for a single or empty list", () => {
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 0)).toBe(0);
  });
});
