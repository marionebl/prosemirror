import React from 'react';
import { MarkdownEditor } from '@marduke182/react-markdown-editor';
import './editor.css';

export default {
  title: 'Editor',
};

const md = `
# Heading 1
## Heading 2
## Heading 3
### Heading 4
#### Heading 5



**Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at pretium leo, et ullamcorper magna. Donec lobortis ex ex, eu laoreet lectus molestie tempor. Vestibulum venenatis lorem urna, facilisis tempus libero placerat tempor. Aliquam eleifend faucibus lacus nec lobortis. Cras tristique quam velit, sed eleifend tellus blandit sit amet. Praesent facilisis sed velit blandit sagittis. Morbi varius hendrerit maximus. Praesent malesuada lacinia velit, ac tincidunt risus posuere ut. In commodo congue lobortis. Donec vitae lorem condimentum, dapibus massa nec, ultricies ex. Proin maximus felis sed nisi dapibus, a eleifend turpis mattis. Nunc elementum nulla at lectus dignissim semper.**

_Proin lacinia diam vitae arcu aliquam, vitae pretium dolor vehicula. Phasellus non aliquam nibh. Donec eget laoreet dui, ac feugiat libero. Integer et nunc quam. Curabitur sit amet vulputate odio. Mauris ac condimentum ligula, non rutrum ante. Suspendisse vel sapien porta, efficitur ex in, mollis nunc. Quisque feugiat rhoncus diam, at pharetra purus feugiat vitae. Sed interdum tincidunt purus condimentum tincidunt. Cras nec sagittis nulla, eu mattis risus. In ac ultricies tortor. Vestibulum egestas quis elit et blandit. In posuere malesuada pellentesque._

\`\`\`Aliquam sollicitudin nisi quis massa venenatis, vitae pharetra sem auctor. Quisque fringilla vitae quam at blandit. Vivamus tristique tincidunt facilisis. Duis at nunc finibus, dictum nibh ac, rhoncus tortor. Phasellus sit amet magna eu dolor ultricies aliquet vitae non quam. Praesent aliquet ac ipsum vitae efficitur. Donec accumsan tortor mauris. Sed in pharetra leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\`\`\`

![](https://i.ytimg.com/vi/NCZ0eg1zEvw/maxresdefault.jpg)

Morbi ullamcorper in massa sed tincidunt. Nam ut nunc molestie, luctus enim sit amet, blandit velit. Duis tincidunt commodo euismod. Quisque nec convallis orci, eget facilisis mi. Vestibulum vel risus et elit consequat convallis. Nullam ornare, nibh nec tristique placerat, tortor purus pretium mauris, quis euismod leo arcu sed felis. Proin rhoncus mi at volutpat eleifend. Proin eget porta nulla.

Pellentesque ac risus nunc. Vivamus porta hendrerit risus, at fringilla nibh vulputate vel. Aenean ullamcorper ipsum vel odio venenatis, id vehicula velit euismod. Duis ante lacus, fermentum vel augue id, tristique blandit sem. Phasellus eget sem in mi euismod sollicitudin sit amet et nulla. Donec dignissim, lorem vitae tempor laoreet, leo tellus efficitur odio, nec accumsan tellus dolor eu neque. Nulla feugiat id augue quis faucibus. Nulla ut metus tincidunt, lobortis felis a, aliquet lacus. Praesent et urna dui. Vivamus ac lorem ut urna euismod vestibulum a quis neque. Ut mollis, augue non malesuada condimentum, lectus sem sodales arcu, tristique tincidunt sapien neque tempus lorem. Phasellus ac lacus ultrices, accumsan lorem in, dignissim nunc. Mauris quis diam gravida, varius neque at, tincidunt turpis. Sed viverra volutpat lectus a maximus. Suspendisse eleifend odio quis neque aliquam, sed molestie erat finibus. Proin et ante ut lacus viverra ornare non ut eros. 
`;
export const basic = () => <MarkdownEditor md={md} />;
