import { schema, serialize } from '@marduke182/prosemirror-markdown';
import React from 'react';
import { render } from '@testing-library/react';

import { Editor } from '../editor';

const emptyDocument = serialize(`
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5

Hello *world* how __are__

1. first
2. second
   1. second first
   
\`\`\`javascript
function tmp() {}
\`\`\`

[title](http://google.com)

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")
`);

test('should render a react view', async () => {
  const { findByText } = render(<Editor schema={schema} initialDoc={emptyDocument} />);

  // await waitForElement(() => findByText(/Hello/i));
  // debug();

  await expect(findByText(/Hello/i)).resolves.toBeInTheDocument();
});
