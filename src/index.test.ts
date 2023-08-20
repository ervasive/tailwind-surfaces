import { describe, expect, it } from "@jest/globals";
import { run } from "../test/helpers";

describe("first", () => {
  it("should", async () => {
    const result = await run(
      '<div class="surface-test hover:surface-test">content</div>',
      "first.first",
    );

    expect(result.css).toBe("hi");
  });

  it("should 2", () => {
    expect("boop").toBe("hi");
  });
});
