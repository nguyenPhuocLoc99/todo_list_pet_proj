import React, { useEffect, useState } from "react";

interface InitDataProps {
  initText?: string;
  itemsList?: string[];
}

interface TextWithTagsProps {
  id?: string;
  inputClass?: string;
  initData?: InitDataProps;
  placeHolder?: string;
  suggestionFunc?: (data: any) => any;
  isEditMode: boolean;
}

const TextWithTag = ({
  id,
  inputClass,
  initData = {},
  placeHolder,
  suggestionFunc = () => {},
  isEditMode = false,
}: TextWithTagsProps) => {
  // Input states
  const [textInput, setTextInput] = useState(initData.initText || "");
  const [tags, setTags] = useState<string[]>(initData.itemsList || []);
  const [suggestionsList, setSuggestionsList] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get info
  useEffect(() => {
    setTextInput(initData.initText || "");
    setTags(initData.itemsList || []);
  }, [initData]);

  // Suggestion function
  useEffect(() => {
    // get suggestions function
    const fetchSuggestions = async () => {
      const suggestions = await suggestionFunc(textInput);
      if (suggestions.length) {
        setSuggestionsList(suggestions);
        setShowSuggestions(true);
      } else setShowSuggestions(false);
    };

    fetchSuggestions();
  }, [textInput, suggestionFunc]);

  // handle press Tab to add a tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Tab" && textInput.length > 0) {
      e.preventDefault();
      addTag(textInput);
    }
  };

  // Add a tag
  const addTag = (tag: string) => {
    if (!initData.itemsList?.includes(tag)) initData.itemsList?.push(tag);
    setTextInput("");
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    // Update tasks list
    const index = initData.itemsList?.indexOf(tag);
    if (index) initData.itemsList?.splice(index, 1);

    // Refresh the UI
    setTags((prevTags) => {
      const newTags = prevTags.filter((t) => t !== tag); // Create a new array without the removed tag
      return newTags; // Return the new array
    });
  };

  return (
    <div className=" row">
      <textarea
        className={inputClass}
        id={id}
        value={textInput}
        rows={1}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeHolder}
        disabled={!isEditMode}
      ></textarea>

      {showSuggestions && (
        <ul
          className="dropdown-menu position-static d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px"
          data-bs-theme="light"
        >
          {suggestionsList.map((suggestion, index) => (
            <li
              className="dropdown-item round-2"
              key={index}
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      <ul className="custom-tag-ul mt-1">
        {tags.map((tag, index) => (
          <li className="mb-1" key={index}>
            <button
              className="btn btn-danger me-1"
              type="button"
              onClick={() => removeTag(tag)}
              disabled={!isEditMode}
            >
              x
            </button>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextWithTag;
