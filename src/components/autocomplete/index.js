import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { useShortcut } from '../utils';
import style from './style';

const Autocomplete = forwardRef(({ placeholder, getChoices, getLabel, setChoice, resultMaxHeight }, ref) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const choices = useMemo(() => getChoices(query), [getChoices, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const actionClear = () => {
    setQuery('');
    if (ref.current) {
      ref.current.blur();
    }
  };

  const actionSelect = (choice) => {
    if (!choice) return;
    setChoice(choice);
    actionClear();
  };

  const actionMoveSelection = (increment) => {
    setSelectedIndex((oldSelectedIndex) => {
      let newSelectedIndex = oldSelectedIndex + increment;
      if (newSelectedIndex >= choices.length) {
        newSelectedIndex = 0;
      } else if (newSelectedIndex < 0) {
        newSelectedIndex = Math.max(0, choices.length - 1);
      }
      return newSelectedIndex;
    });
  };

  const actionSelectSelection = () => {
    if (selectedIndex >= choices.length) return;
    actionSelect(choices[selectedIndex]);
  };

  useShortcut('up', () => actionMoveSelection(-1), [choices]);
  useShortcut('down', () => actionMoveSelection(1), [choices]);
  useShortcut('enter', actionSelectSelection, [selectedIndex, choices]);
  useShortcut('esc', actionClear, [ref]);

  return (
    <div class={style.container}>
      <input
        class={style.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        ref={ref}
      />
      {query && choices.length > 0 && (
        <div class={style.result} style={resultMaxHeight ? { maxHeight: resultMaxHeight } : null}>
          {choices.map((choice, index) => (
            <div
              class={`${style.item} ${selectedIndex === index ? style.selected : ''}`}
              onClick={() => actionSelect(choice)}
              key={index}
            >
              {getLabel(choice)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Autocomplete;
