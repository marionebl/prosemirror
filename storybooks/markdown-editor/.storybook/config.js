import { configure, addParameters } from '@storybook/html';
import { themes } from '@storybook/theming';

addParameters({
  options: {
    theme: themes.light,
  },
});
// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.stories\.js$/), module);
