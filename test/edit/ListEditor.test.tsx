import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { ListEditor, moveItem, removeItem, updateItem } from "@/app/_components/admin/ListEditor";

describe("list helpers", () => {
  it("moves, removes and updates items without mutating the original", () => {
    const items = ["a", "b", "c"];

    expect(moveItem(items, 0, 2)).toEqual(["b", "c", "a"]);
    expect(moveItem(items, 0, -1)).toBe(items);
    expect(removeItem(items, 1)).toEqual(["a", "c"]);
    expect(updateItem([{ n: 1 }, { n: 2 }], 1, { n: 5 })).toEqual([{ n: 1 }, { n: 5 }]);
    expect(items).toEqual(["a", "b", "c"]);
  });
});

function Harness({ max }: { max?: number }) {
  const [items, setItems] = useState([{ label: "first" }, { label: "second" }]);

  return (
    <>
      <ListEditor
        items={items}
        onChange={setItems}
        createItem={() => ({ label: "new" })}
        itemLabel={(item) => item.label}
        addLabel="Add item"
        max={max}
        renderItem={(item, update) => (
          <input aria-label={`edit ${item.label}`} value={item.label} onChange={(event) => update({ label: event.target.value })} />
        )}
      />
      <output>{items.map((item) => item.label).join(",")}</output>
    </>
  );
}

const shown = () => screen.getByRole("status").textContent;

describe("ListEditor", () => {
  it("adds, edits, reorders and removes items", () => {
    render(<Harness />);

    fireEvent.click(screen.getByText("Add item"));
    expect(shown()).toBe("first,second,new");

    fireEvent.change(screen.getByLabelText("edit new"), { target: { value: "third" } });
    expect(shown()).toBe("first,second,third");

    fireEvent.click(screen.getAllByText("Move up")[2]);
    expect(shown()).toBe("first,third,second");

    fireEvent.click(screen.getAllByText("Remove")[0]);
    expect(shown()).toBe("third,second");
  });

  it("disables moves past the ends", () => {
    render(<Harness />);

    expect(screen.getAllByText("Move up")[0].closest("button")?.disabled).toBe(true);
    expect(screen.getAllByText("Move down")[1].closest("button")?.disabled).toBe(true);
  });

  it("stops adding at the limit", () => {
    render(<Harness max={2} />);

    expect(screen.getByText("Limit of 2 reached").closest("button")?.disabled).toBe(true);
  });
});
