import { formatCurrency, formatSignedCurrency, clampPercentage } from "./utils";

describe("Formatting and Math Utilities", () => {
  it("formats positive USD currency properly", () => {
    expect(formatCurrency(1250.5)).toContain("1,250.50");
  });

  it("formats signed income and expense numbers", () => {
    expect(formatSignedCurrency(50, "income")).toContain("+");
    expect(formatSignedCurrency(50, "expense")).toContain("-");
  });
});
