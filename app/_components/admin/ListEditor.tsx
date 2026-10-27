"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "@/app/_components/core/Button";

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function removeItem<T>(items: T[], index: number) {
  return items.filter((_, position) => position !== index);
}

export function updateItem<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, position) => (position === index ? { ...item, ...patch } : item));
}

/** React keys that follow items when they are moved or removed (items have no ids of their own). */
function useStableKeys(length: number) {
  const keys = useRef<number[]>([]);
  const nextKey = useRef(0);

  while (keys.current.length < length) keys.current.push(nextKey.current++);
  if (keys.current.length > length) keys.current = keys.current.slice(0, length);

  return keys;
}

type ListEditorProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  itemLabel: (item: T, index: number) => string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  max?: number;
};

/** Generic add / remove / reorder for any list of objects. */
export function ListEditor<T>({ items, onChange, createItem, itemLabel, renderItem, addLabel, max }: ListEditorProps<T>) {
  const full = max !== undefined && items.length >= max;
  const keys = useStableKeys(items.length);

  function move(from: number, to: number) {
    keys.current = moveItem(keys.current, from, to);
    onChange(moveItem(items, from, to));
  }

  function remove(index: number) {
    keys.current = removeItem(keys.current, index);
    onChange(removeItem(items, index));
  }

  return (
    <div className="admin-list">
      {items.map((item, index) => (
        <fieldset className="admin-list__item" key={keys.current[index]}>
          <legend>{itemLabel(item, index) || `Item ${index + 1}`}</legend>
          <div className="admin-list__controls">
            <Button type="button" size="sm" variant="ghost" disabled={index === 0} onClick={() => move(index, index - 1)}>
              Move up
            </Button>
            <Button type="button" size="sm" variant="ghost" disabled={index === items.length - 1} onClick={() => move(index, index + 1)}>
              Move down
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
          {renderItem(item, (patch) => onChange(updateItem(items, index, patch)))}
        </fieldset>
      ))}
      <Button type="button" variant="outline" iconLeading="plus" disabled={full} onClick={() => onChange([...items, createItem()])}>
        {full ? `Limit of ${max} reached` : addLabel}
      </Button>
    </div>
  );
}
