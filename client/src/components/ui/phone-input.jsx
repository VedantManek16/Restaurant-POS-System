import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const PhoneInput = React.forwardRef(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref}
        className={cn("flex rounded-xl bg-[#141414] border border-[#2d2d2d]/80 focus-within:border-[#f6b100]/50 transition-colors h-9 items-center overflow-hidden w-full", className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={value || undefined}
        onChange={(value) => onChange?.(value || "")}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef(({ className, ...props }, ref) => (
  <Input
    className={cn("rounded-none border-0 bg-transparent text-[#f5f5f5] text-xs! h-full w-full focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:border-0! shadow-none placeholder:text-xs! placeholder-[#555]!", className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}) => {
  const scrollAreaRef = React.useRef(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex gap-1 rounded-none border-0 border-r border-[#2d2d2d]/80 bg-transparent hover:bg-[#2d2d2d]/20! aria-expanded:bg-[#2d2d2d]/20! aria-expanded:text-white! px-3 h-full transition-colors cursor-pointer focus:z-10 text-[#ababab]"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-2 size-4 opacity-50 text-[#ababab]",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-[#1c1c1c] border border-[#2d2d2d]/80 z-[100]">
        <Command className="bg-transparent text-white">
          <CommandInput
            value={searchValue}
            onValueChange={(val) => {
              setSearchValue(val);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]"
                  );
                  if (viewportElement) {
                    viewportElement.scrollTop = 0;
                  }
                }
              }, 0);
            }}
            placeholder="Search country..."
            className="text-xs text-white placeholder-[#555] bg-transparent focus:outline-none"
          />
          <CommandList className="bg-[#1c1c1c]">
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty className="text-xs text-[#555] py-4 text-center">No country found.</CommandEmpty>
              <CommandGroup className="p-1">
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem
      className={cn(
        "gap-2 px-2.5 py-2 text-xs rounded-lg transition-colors cursor-pointer text-[#ababab] data-selected:bg-[#2d2d2d]/60! data-selected:text-[#f5f5f5]!",
        country === selectedCountry
          ? "text-[#f6b100]! font-semibold"
          : ""
      )}
      onSelect={handleSelect}
    >
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-xs">{countryName}</span>
      <span className="text-[10px] text-[#555] font-medium">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={cn(
          "ml-auto size-4 text-[#f6b100]",
          country === selectedCountry ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-transparent [&_svg:not([class*='size-']):not([class*='w-'])]:w-full [&_svg:not([class*='size-']):not([class*='h-'])]:h-full">
      {Flag ? <Flag title={countryName} /> : <span className="text-xs">🏳️</span>}
    </span>
  );
};

export { PhoneInput };
