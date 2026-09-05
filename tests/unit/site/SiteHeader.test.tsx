import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/site/components/SiteHeader";
import { getSiteContent } from "@/site/content";

describe("SiteHeader menu", () => {
  it("opens with focus inside the menu and locks page scroll", async () => {
    const user = userEvent.setup();
    render(<SiteHeader content={getSiteContent("en")} />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger).toHaveAttribute("data-hydrated", "true");
    await user.click(trigger);

    const menu = screen.getByRole("navigation", { name: "Menu navigation" });
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByRole("link", { name: "Objects" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("traps keyboard focus within the open menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader content={getSiteContent("en")} />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const menu = screen.getByRole("navigation", { name: "Menu navigation" });
    const firstLink = within(menu).getByRole("link", { name: "Objects" });
    const lastLink = within(menu).getByRole("link", { name: "Bag" });

    lastLink.focus();
    await user.tab();
    expect(firstLink).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastLink).toHaveFocus();
  });

  it("closes on Escape, restores trigger focus, and unlocks page scroll", async () => {
    const user = userEvent.setup();
    render(<SiteHeader content={getSiteContent("en")} />);

    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("navigation", { name: "Menu navigation" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });
});
