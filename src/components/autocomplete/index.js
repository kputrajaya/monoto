import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { useShortcut } from '../utils';
import style from './style';

// eslint-disable-next-line react/display-name
const Autocomplete = forwardRef(({ fetch, label, select, maxHeight }, ref) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const choices = useMemo(() => fetch(query), [fetch, query]);

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
    select(choice);
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
        placeholder="Search ..."
        ref={ref}
      />
      {
        query && choices.length > 0 &&
        <div class={style.result} style={{maxHeight}}>
          {
            choices.map((choice, index) => (
              <div
                class={`${style.item} ${selectedIndex === index ? style.selected : ''}`}
                onClick={() => actionSelect(choice)}
              >
                {label(choice)}
              </div>
            ))
          }
        </div>
      }
    </div>
  );
});

export default Autocomplete;
