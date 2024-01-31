const template = (variables, { tpl }) => {
  const prefixedComponentName = `${variables.componentName}Icon`;

  return tpl`

${variables.imports};

${variables.interfaces};

const ${prefixedComponentName} = (${variables.props}) => (
  ${variables.jsx}
);

export default ${prefixedComponentName};
`;
};

module.exports = template;