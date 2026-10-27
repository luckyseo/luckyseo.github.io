import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EducationEditor } from "@/app/_sections/education/EducationEditor";
import { sampleContent } from "@/test/fixtures";

describe("EducationEditor (save flow shared by every editor)", () => {
  it("saves valid, trimmed edits", async () => {
    const onSave = vi.fn(async () => undefined);
    render(<EducationEditor value={sampleContent().education} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("School / place"), { target: { value: "  UTS Sydney  " } });
    fireEvent.change(screen.getByLabelText("Details"), { target: { value: "Major\n\nDean's List\n" } });
    fireEvent.click(screen.getByText("Save education"));

    await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Saved ✓"));
    expect(onSave).toHaveBeenCalledWith([{ place: "UTS Sydney", degree: "Bachelor of IT", detail: ["Major", "Dean's List"], date: "2026" }]);
  });

  it("blocks saving and shows errors when a required field is empty", async () => {
    const onSave = vi.fn(async () => undefined);
    render(<EducationEditor value={sampleContent().education} onSave={onSave} />);

    fireEvent.change(screen.getByLabelText("School / place"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Save education"));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("#1 › place: Required"));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows the error when the save itself fails", async () => {
    const onSave = vi.fn(async () => Promise.reject(new Error("Missing or insufficient permissions.")));
    render(<EducationEditor value={sampleContent().education} onSave={onSave} />);

    fireEvent.click(screen.getByText("Save education"));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("insufficient permissions"));
  });

  it("discards unsaved changes", () => {
    render(<EducationEditor value={sampleContent().education} onSave={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("School / place"), { target: { value: "Changed" } });
    fireEvent.click(screen.getByText("Discard changes"));

    expect((screen.getByLabelText("School / place") as HTMLInputElement).value).toBe("UTS");
  });
});
