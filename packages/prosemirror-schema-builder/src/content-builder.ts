export interface ExpressionBuilder {
  build: (exclude?: string[]) => string;
}

export interface NodeBuilder extends ExpressionBuilder {
  names: string[];
}

function buildNode(names: string[], exclude?: string[]): string {
  const filteredNames = exclude ? names.filter(name => exclude.indexOf(name) === -1) : names;

  const length = filteredNames.length;
  if (length === 1) {
    return filteredNames[0];
  }

  if (filteredNames.length > 1) {
    return `(${filteredNames.join('|')})`;
  }

  return '';
}

export const node = (name: string): NodeBuilder => {
  return {
    names: [name],
    build: buildNode.bind(null, [name]),
  };
};

export const group = (...nodeName: string[]): NodeBuilder => {
  return {
    names: nodeName,
    build: buildNode.bind(null, nodeName),
  };
};

export const atLeast = (times: number, nodeBuilder: NodeBuilder): ExpressionBuilder => {
  return {
    build: exclude => {
      const expression = nodeBuilder.build(exclude);
      if (!expression) {
        return '';
      }

      return `${expression}{${times},}`;
    },
  };
};

export const maybeA = (nodeBuilder: NodeBuilder): ExpressionBuilder => {
  return {
    build: exclude => {
      const expression = nodeBuilder.build(exclude);
      if (!expression) {
        return '';
      }

      return `${expression}*`;
    },
  };
};

export const atLeastOne = (nodeBuilder: NodeBuilder): ExpressionBuilder => {
  return {
    build: exclude => {
      const expression = nodeBuilder.build(exclude);
      if (!expression) {
        return '';
      }

      return `${expression}+`;
    },
  };
};

export const sequence = (...expressionBuilders: ExpressionBuilder[]): ExpressionBuilder => {
  return {
    build: exclude => {
      const expressions = expressionBuilders.map(eb => eb.build(exclude)).filter(e => !!e);

      return expressions.join(' ');
    },
  };
};
