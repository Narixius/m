import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown } from "lucide-react";
import React, { useState, type FC } from "react";

import type { NowPaymentCurrency } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";

export const CurrenciesList: FC<{
  currencies: NowPaymentCurrency[];
  onChange: (currency: string, item: NowPaymentCurrency) => void;
}> = ({ currencies, onChange }) => {
  const [selectedCurrency, setSelectedCurrency] =
    useState<NowPaymentCurrency | null>(null);

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const deferredSearchValue = React.useDeferredValue(searchValue);

  const scrollElementRef = React.useRef<HTMLDivElement | null>(null);

  const { contains } = BaseCombobox.useFilter({ value: selectedCurrency });

  const resolvedSearchValue =
    searchValue === "" || deferredSearchValue === ""
      ? searchValue
      : deferredSearchValue;

  const filteredItems = React.useMemo(() => {
    return currencies.filter(
      (item) =>
        contains(item, resolvedSearchValue, (i) => i.code) ||
        contains(item, resolvedSearchValue, (i) => i.name)
    );
  }, [contains, resolvedSearchValue]);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 32,
    overscan: 20,
    paddingStart: 8,
    paddingEnd: 8,
    scrollPaddingEnd: 8,
    scrollPaddingStart: 8,
  });
  const handleScrollElementRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      scrollElementRef.current = element;
      if (element) {
        virtualizer.measure();
      }
    },
    [virtualizer]
  );

  const totalSize = virtualizer.getTotalSize();

  return (
    <Combobox<NowPaymentCurrency>
      virtualized
      onOpenChange={setOpen}
      open={open}
      inputValue={searchValue}
      onInputValueChange={setSearchValue}
      filteredItems={filteredItems}
      items={currencies}
      filter={(item, query) =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
      }
      itemToStringValue={(i) => i.name}
      itemToStringLabel={(item) => item.name}
      onValueChange={(item) => {
        setSelectedCurrency(item);
        if (item) onChange(item.code, item);
      }}
      onItemHighlighted={(item, { reason, index }) => {
        if (!item) {
          return;
        }

        const isStart = index === 0;
        const isEnd = index === filteredItems.length - 1;
        const shouldScroll =
          reason === "none" || (reason === "keyboard" && (isStart || isEnd));

        if (shouldScroll) {
          queueMicrotask(() => {
            virtualizer.scrollToIndex(index, {
              align: isEnd ? "start" : "end",
            });
          });
        }
      }}
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            className="w-full font-normal flex justify-between group-[.invalid]:border-red-500"
          >
            {selectedCurrency && (
              <div className="flex justify-start gap-2 items-center">
                <img
                  className="w-4 h-4"
                  src={`https://nowpayments.io` + selectedCurrency.logo_url}
                  alt={selectedCurrency.name}
                />
                {selectedCurrency.name}
              </div>
            )}
            {!selectedCurrency && (
              <span className="text-muted-foreground">
                Select a currency...
              </span>
            )}
            <ChevronDown />
          </Button>
        }
      />
      <ComboboxContent className="rounded-sm">
        <ComboboxList className="p-0 box-border max-h-auto overflow-x-hidden rounded-sm">
          <ComboboxInput placeholder="Search..." className="m-1.5 rounded-sm" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          {filteredItems.length > 0 && (
            <div
              role="presentation"
              ref={handleScrollElementRef}
              className="px-1 overflow-y-auto overscroll-contain scroll-py-2 max-h-(--available-height) h-[min(22rem,var(--total-size))]"
              style={
                { "--total-size": `${totalSize}px` } as React.CSSProperties
              }
            >
              <div
                role="presentation"
                className="relative"
                style={{ height: totalSize }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const item = filteredItems[virtualItem.index];
                  if (!item) {
                    return null;
                  }

                  return (
                    <ComboboxItem
                      key={virtualItem.key}
                      index={virtualItem.index}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      value={item}
                      aria-setsize={filteredItems.length}
                      aria-posinset={virtualItem.index + 1}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: virtualItem.size,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <img
                        className="w-4 h-4"
                        src={`https://nowpayments.io` + item.logo_url}
                        alt={item.name}
                      />
                      {item.name}
                    </ComboboxItem>
                  );
                })}
              </div>
            </div>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
