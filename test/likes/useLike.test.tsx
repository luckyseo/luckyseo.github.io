import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { LikesProvider } from "@/services/likes/LikesProvider";
import { likeIdFor, type LikesRepository } from "@/services/likes/LikesRepository";
import { useLike } from "@/services/likes/useLike";

function fakeRepository(start: number, overrides: Partial<LikesRepository> = {}): LikesRepository {
  return {
    getCount: vi.fn(async () => start),
    like: vi.fn(async () => undefined),
    ...overrides,
  };
}

function renderLike(repository: LikesRepository) {
  const wrapper = ({ children }: { children: ReactNode }) => <LikesProvider repository={repository}>{children}</LikesProvider>;
  return renderHook(() => useLike("project-portfolio"), { wrapper });
}

describe("useLike", () => {
  it("loads the saved count", async () => {
    const { result } = renderLike(fakeRepository(4));

    expect(result.current.ready).toBe(false);
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.count).toBe(4);
    expect(result.current.liked).toBe(false);
  });

  it("adds one per click, as many times as the visitor wants", async () => {
    const repository = fakeRepository(4);
    const { result } = renderLike(repository);
    await waitFor(() => expect(result.current.ready).toBe(true));

    await act(() => result.current.like());
    await act(() => result.current.like());
    await act(() => result.current.like());

    expect(result.current.count).toBe(7);
    expect(result.current.liked).toBe(true);
    expect(repository.like).toHaveBeenCalledTimes(3);
    expect(repository.like).toHaveBeenCalledWith("project-portfolio");
  });

  it("takes the like back off when saving fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { result } = renderLike(fakeRepository(4, { like: vi.fn(async () => Promise.reject(new Error("offline"))) }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    await act(() => result.current.like());

    expect(result.current.count).toBe(4);
  });

  it("stays hidden (not ready) without Firebase", () => {
    const { result } = renderHook(() => useLike("post-hi"));
    expect(result.current.ready).toBe(false);
  });
});

describe("likeIdFor", () => {
  it("prefixes the item id with its kind", () => {
    expect(likeIdFor("project", "portfolio")).toBe("project-portfolio");
    expect(likeIdFor("post", "hi")).toBe("post-hi");
  });
});
