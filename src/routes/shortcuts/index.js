import { Fragment, h } from 'preact';
import { Helmet } from 'react-helmet';

import style from './style';

const Shortcuts = () => {
  const data = [
    {
      title: 'Global',
      keys: [
        {
          mac: ['Cmd + Alt + S'],
          pc: ['Ctrl + Alt + S'],
          action: 'Search notes',
        },
        {
          mac: ['Cmd + Alt + E'],
          pc: ['Ctrl + Alt + E'],
          action: 'New note',
        },
        {
          mac: ['Cmd + Alt + F'],
          pc: ['Ctrl + Alt + F'],
          action: 'New folder',
        },
      ],
    },
    {
      title: 'Operations',
      keys: [
        {
          mac: ['Cmd + K', 'Cmd + K'],
          pc: ['Ctrl + K', 'Ctrl + K'],
          action: 'Delete until line end',
        },
        {
          mac: ['Cmd + K', 'Cmd + Bksp'],
          pc: ['Ctrl + K', 'Ctrl + Bksp'],
          action: 'Delete until line start',
        },
        {
          mac: ['Cmd + K', 'Cmd + U'],
          pc: ['Ctrl + K', 'Ctrl + U'],
          action: 'Uppercase selection',
        },
        {
          mac: ['Cmd + K', 'Cmd + L'],
          pc: ['Ctrl + K', 'Ctrl + L'],
          action: 'Lowercase selection',
        },
      ],
    },
    {
      title: 'Line operations',
      keys: [
        {
          mac: ['Cmd + Ctrl + Up'],
          pc: ['Shift + Ctrl + Up'],
          action: 'Swap line up',
        },
        {
          mac: ['Cmd + Ctrl + Down'],
          pc: ['Shift + Ctrl + Down'],
          action: 'Swap line down',
        },
        {
          mac: ['Cmd + Enter'],
          pc: ['Ctrl + Enter'],
          action: 'Insert line after',
        },
        {
          mac: ['Shift + Cmd + Enter'],
          pc: ['Shift + Ctrl + Enter'],
          action: 'Insert line before',
        },
        {
          mac: ['Cmd + L'],
          pc: ['Ctrl + L'],
          action: 'Select line',
        },
        {
          mac: ['Shift + Ctrl + K'],
          pc: ['Shift + Ctrl + K'],
          action: 'Delete line',
        },
        {
          mac: ['Shift + Cmd + D'],
          pc: ['Shift + Ctrl + D'],
          action: 'Duplicate line',
        },
        {
          mac: ['Cmd + J'],
          pc: ['Ctrl + J'],
          action: 'Join lines',
        },
        {
          mac: ['F5'],
          pc: ['F9'],
          action: 'Sort lines',
        },
        {
          mac: ['Cmd + F5'],
          pc: ['Ctrl + F9'],
          action: 'Sort lines (case insensitive)',
        },
      ],
    },
    {
      title: 'Multicursors',
      keys: [
        {
          mac: ['Cmd + Click'],
          pc: ['Ctrl + Click'],
          action: 'New cursor at pointer',
        },
        {
          mac: ['Cmd + D'],
          pc: ['Ctrl + D'],
          action: 'New selection at next occurrence',
        },
        {
          mac: ['Cmd + K', 'Cmd + D'],
          pc: ['Ctrl + K', 'Ctrl + D'],
          action: 'Skip then new selection at next occurrence',
        },
        {
          mac: ['Ctrl + Shift + Up'],
          pc: ['Ctrl + Alt + Up'],
          action: 'New cursor at previous line',
        },
        {
          mac: ['Ctrl + Shift + Down'],
          pc: ['Ctrl + Alt + Down'],
          action: 'New cursor at next line',
        },
      ],
    },
  ];

  const platformInfo = window.navigator.userAgentData?.platform || window.navigator.userAgent;
  const keyType = platformInfo.indexOf('Mac') > -1 ? 'mac' : 'pc';

  return (
    <div class={style.shortcuts}>
      <Helmet>
        <title>Shortcuts</title>
      </Helmet>

      <div class={style.tableWrapper}>
        <table class={style.table}>
          {data.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              <tr>
                <th />
                <th class={style.title}>{group.title}</th>
              </tr>
              {group.keys.map((key, keyIndex) => (
                <tr key={keyIndex}>
                  <td class={style.keys}>
                    {key[keyType].map((step, stepIndex) => (
                      <span class={style.step} key={stepIndex}>
                        {step}
                      </span>
                    ))}
                  </td>
                  <td>{key.action}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </table>
      </div>
    </div>
  );
};

export default Shortcuts;
