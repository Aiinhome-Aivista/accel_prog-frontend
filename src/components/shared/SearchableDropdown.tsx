import React, { useMemo, useState } from "react";
import Select, {
  components,
  type MenuListProps,
  type StylesConfig,
} from "react-select";
import { Search } from "lucide-react";

type SelectOption = {
  value: string;
  label: string;
};

export interface SearchableDropdownProps {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  menuKey: string;
  openDropdownKey: string | null;
  setOpenDropdownKey: (key: string | null) => void;
}

const selectStyles = (
  hasError: boolean
): StylesConfig<SelectOption, false> => ({
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: hasError
      ? "#f87171"
      : state.isFocused
      ? "#E87A2E"
      : "#E5DDD4",
    boxShadow: "none",
    "&:hover": {
      borderColor: hasError ? "#f87171" : "#E87A2E",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 12px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9597A6",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#2B2D42",
    fontSize: "14px",
  }),
  input: (base) => ({
    ...base,
    color: "#2B2D42",
    fontSize: "14px",
    caretColor: "transparent",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "none",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#F9F5F0" : "#ffffff",
    color: "#2B2D42",
    cursor: "pointer",
    padding: "8px 12px",
  }),
});

const CustomMenuList = (props: MenuListProps<SelectOption, false>) => {
  const { selectProps } = props;

  return (
    <components.MenuList {...props}>
      {/* Search Header inside the dropdown list */}
      <div className="sticky top-0 bg-white z-20 p-2 border-b border-[#E5DDD4]">
        <div className="flex items-center bg-[#F9F5F0] rounded-md px-2.5 py-1.5 border border-[#E5DDD4] focus-within:border-[#E87A2E] transition-colors">
          <Search size={14} className="text-[#9597A6] mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            className="w-full bg-transparent border-none outline-none text-[13px] text-[#2B2D42] placeholder-[#9597A6]"
            onMouseDown={(e) => e.stopPropagation()}
            value={selectProps.inputValue}
            onChange={(e) =>
              selectProps.onInputChange(e.currentTarget.value, {
                action: "input-change",
                prevInputValue: selectProps.inputValue,
              })
            }
          />
        </div>
      </div>
      <div className="py-1">{props.children}</div>
    </components.MenuList>
  );
};

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  required = false,
  value,
  options,
  placeholder,
  onChange,
  error,
  menuKey,
  openDropdownKey,
  setOpenDropdownKey,
}) => {
  const [inputValue, setInputValue] = useState("");

  const selectOptions: SelectOption[] = useMemo(
    () =>
      options.map((option) => ({
        value: option,
        label: option,
      })),
    [options]
  );

  const selectedOption =
    selectOptions.find((opt) => opt.value === value) ?? null;

  return (
    <div>
      <label className="block text-[12px] font-semibold text-[#6B6D7B] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        options={selectOptions}
        value={selectedOption}
        menuIsOpen={openDropdownKey === menuKey}
        inputValue={inputValue}
        onMenuOpen={() => setOpenDropdownKey(menuKey)}
        onInputChange={(val) => setInputValue(val)}
        onChange={(option) => {
          onChange(option?.value ?? "");
        }}
        onMenuClose={() => {
          setOpenDropdownKey(null);
          setInputValue("");
        }}
        placeholder={placeholder}
        isSearchable={true}
        // blurInputOnSelect ensures the focus leaves the component after picking an item
        blurInputOnSelect={true}
        components={{
          MenuList: CustomMenuList,
          // The input is required for the control to be clickable. readOnly prevents typing.
          Input: (props) => <components.Input {...props} readOnly />,
        }}
        noOptionsMessage={() => "No matching options"}
        styles={selectStyles(!!error)}
      />

      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableDropdown;this 