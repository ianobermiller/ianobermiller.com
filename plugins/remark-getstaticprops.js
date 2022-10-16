import {name as isValidIdentifierName} from 'estree-util-is-identifier-name';
import {valueToEstree} from 'estree-util-value-to-estree';
import {load} from 'js-yaml';

/**
 * A remark plugin to expose frontmatter data as getStaticProps.
 *
 * Based on https://github.com/omidantilong/remark-mdx-next.
 *
 * @param options - Optional options to configure the output.
 * @returns A unified transformer.
 */
export function remarkGetStaticProps() {
  return ast => {
    const imports = [];

    for (const node of ast.children) {
      let data;
      const {value} = node;
      if (node.type === 'yaml') {
        data = load(value);
      }

      if (data == null) {
        continue;
      }

      if (typeof data !== 'object') {
        throw new Error(
          `Expected frontmatter data to be an object, got:\n${value}`,
        );
      }

      // TODO: since we can get file.path (arg after ast), we can actually scrape the related paths

      imports.push({
        type: 'mdxjsEsm',
        value: '',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExportNamedDeclaration',
                source: null,
                specifiers: [],
                declaration: {
                  type: 'FunctionDeclaration',
                  id: {type: 'Identifier', name: 'getStaticProps'},
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: valueToEstree({props: data}),
                      },
                    ],
                  },
                  generator: false,
                },
              },
              {
                type: 'ExportNamedDeclaration',
                source: null,
                specifiers: [],
                declaration: {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: Object.entries(data).map(
                    ([identifier, val]) => {
                      if (!isValidIdentifierName(identifier)) {
                        throw new Error(
                          `Frontmatter keys should be valid identifiers, got: ${JSON.stringify(
                            identifier,
                          )}`,
                        );
                      }
                      return {
                        type: 'VariableDeclarator',
                        id: {type: 'Identifier', name: identifier},
                        init: valueToEstree(val),
                      };
                    },
                  ),
                },
              },
            ],
          },
        },
      });
    }
    ast.children.unshift(...imports);
  };
}
