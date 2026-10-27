import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContentProvider, useContent, useSaveSection } from "@/services/content/ContentProvider";
import type { ContentRepository } from "@/services/content/ContentRepository";
import { sampleContent } from "@/test/fixtures";

function fakeRepository(overrides: Partial<ContentRepository> = {}): ContentRepository {
  return {
    load: vi.fn(async () => sampleContent()),
    saveSection: vi.fn(async () => undefined),
    ...overrides,
  };
}

function Probe() {
  const { status, profile } = useContent();
  const save = useSaveSection();

  return (
    <>
      <p data-testid="status">{status}</p>
      <p data-testid="name">{profile.name}</p>
      <button onClick={() => void save("profile", { ...profile, name: "Renamed" })}>rename</button>
    </>
  );
}

describe("ContentProvider", () => {
  it("loads content from the repository", async () => {
    render(
      <ContentProvider repository={fakeRepository()}>
        <Probe />
      </ContentProvider>,
    );

    expect(screen.getByTestId("status").textContent).toBe("loading");
    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("ready"));
    expect(screen.getByTestId("name").textContent).toBe("Test Person");
  });

  it("saves through the repository and updates what is shown", async () => {
    const repository = fakeRepository();
    render(
      <ContentProvider repository={repository}>
        <Probe />
      </ContentProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("ready"));

    await act(async () => screen.getByText("rename").click());

    expect(repository.saveSection).toHaveBeenCalledWith("profile", expect.objectContaining({ name: "Renamed" }));
    expect(screen.getByTestId("name").textContent).toBe("Renamed");
  });

  it("reports an error when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const repository = fakeRepository({ load: vi.fn(async () => Promise.reject(new Error("offline"))) });
    render(
      <ContentProvider repository={repository}>
        <Probe />
      </ContentProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("error"));
  });

  it("is 'unconfigured' when Firebase env values are missing", async () => {
    render(
      <ContentProvider>
        <Probe />
      </ContentProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("unconfigured"));
  });
});
