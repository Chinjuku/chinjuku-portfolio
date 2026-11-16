import { expect, it } from "vitest";
import { CURRENTLY_BUILDING } from "../../constants/currentlyBuilding";
import { all_projects } from "../../constants/projects";
import { nextShot } from "./previewTimer";

it("every item links to a real project", () => {
  const slugs = new Set(all_projects.map((p) => p.slug));
  CURRENTLY_BUILDING.items.forEach((i) => expect(slugs.has(i.slug)).toBe(true));
});

it("only BeatDrop is embeddable", () => {
  expect(CURRENTLY_BUILDING.items.filter((i) => i.embeddable).map((i) => i.slug)).toEqual(["beatdrop"]);
});

it("every item has at least one shot", () => {
  CURRENTLY_BUILDING.items.forEach((i) => expect(i.shots.length).toBeGreaterThan(0));
});

it("nextShot wraps and stays at 0 for a single shot", () => {
  expect(nextShot(3, 4)).toBe(0);
  expect(nextShot(1, 4)).toBe(2);
  expect(nextShot(0, 1)).toBe(0);
});
