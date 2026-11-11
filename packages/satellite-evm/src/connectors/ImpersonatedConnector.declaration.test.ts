import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const SOURCE = fileURLToPath(new URL('./ImpersonatedConnector.ts', import.meta.url));
const DECLARATION = SOURCE.replace(/\.ts$/, '.emitted.d.ts');

const OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  strict: true,
  skipLibCheck: true,
};

function emitDeclaration(): string {
  let text = '';
  const program = ts.createProgram([SOURCE], { ...OPTIONS, declaration: true, emitDeclarationOnly: true });
  const errors = program.getSemanticDiagnostics(program.getSourceFile(SOURCE));
  expect(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([]);
  program.emit(program.getSourceFile(SOURCE), (fileName, data) => {
    if (fileName.endsWith('.d.ts')) text = data;
  });
  return text;
}

function checkDeclaration(text: string): string[] {
  const options = { ...OPTIONS, noEmit: true, skipLibCheck: false };
  const host = ts.createCompilerHost(options);
  const { getSourceFile, fileExists, readFile } = host;
  host.fileExists = (fileName) => fileName === DECLARATION || fileExists(fileName);
  host.readFile = (fileName) => (fileName === DECLARATION ? text : readFile(fileName));
  host.getSourceFile = (fileName, languageVersion, ...rest) =>
    fileName === DECLARATION
      ? ts.createSourceFile(fileName, text, languageVersion, true)
      : getSourceFile(fileName, languageVersion, ...rest);
  const program = ts.createProgram([DECLARATION], options, host);
  return program
    .getSemanticDiagnostics(program.getSourceFile(DECLARATION))
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
}

// tsup builds the published types of the package from this file and does not fail on type errors. When
// `createConnector` gets only its first type argument, TypeScript keeps the default of the fourth with wagmi's own
// type parameter names (`CreateConnectorFn<provider, properties, storageItem>`), and an app that checks library types
// (`skipLibCheck: false`) fails on names it cannot resolve.
describe('impersonated declaration', () => {
  it('compiles on its own, with every name it uses resolved', () => {
    const text = emitDeclaration();

    expect(text).toContain('export declare function impersonated(');
    expect(checkDeclaration(text)).toEqual([]);
  }, 60_000);
});
