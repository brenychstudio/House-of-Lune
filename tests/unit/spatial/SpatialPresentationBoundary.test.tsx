import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SpatialPresentationBoundary } from "@/spatial/SpatialPresentationBoundary";
import type { SpatialPresentationManifest } from "@/spatial/contracts/SpatialPresentationManifest";

const manifest: SpatialPresentationManifest = {
  id: "mask-01-foundation",
  objectSlug: "mask-01",
  version: 1,
  fallback: {
    label: "MASK 01 material study",
    description: "A static study standing in for the future spatial presentation.",
  },
};

describe("SpatialPresentationBoundary", () => {
  it("keeps semantic product content and the fallback available without a renderer", () => {
    const { container } = render(
      <SpatialPresentationBoundary manifest={manifest}>
        <h1>MASK 01</h1>
        <p>Development presentation</p>
      </SpatialPresentationBoundary>,
    );

    expect(screen.getByRole("heading", { name: "MASK 01" })).toBeVisible();
    expect(screen.getByLabelText("MASK 01 material study")).toBeVisible();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-spatial-capability", "fallback-only");
  });
});
