import { expect, it } from "vitest";
import { odometerDigits } from "./odometerDigits";

it("splits into digits", () => {
  expect(odometerDigits(2023)).toEqual([2, 0, 2, 3]);
  expect(odometerDigits(7)).toEqual([7]);
  expect(odometerDigits(0)).toEqual([0]);
});
