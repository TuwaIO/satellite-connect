import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import { describe, expect, it } from 'vitest';

// TypeScript hands the host forward-slash paths on every OS, so the paths compared below use the same form.
const SOURCE = fileURLToPath(new URL('./ImpersonatedConnector.ts', import.meta.url)).replace(/\\/g, '/');
const DECLARATION = SOURCE.replace(/\.ts$/, '.emitted.d.ts');

const OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
  strict: true,
  skipLibCheck: true,
};

function messages(diagnostics: readonly ts.Diagnostic[]): string[] {
  return diagnostics.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
}

function emitDeclaration(): string {
  let text = '';
  const program = ts.createProgram([SOURCE], { ...OPTIONS, declaration: true, emitDeclarationOnly: true });
  const file = program.getSourceFile(SOURCE);
  expect(file).toBeDefined();
  expect(messages([...program.getOptionsDiagnostics(), ...program.getSemanticDiagnostics(file)])).toEqual([]);
  program.emit(file, (fileName, data) => {
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
  const file = program.getSourceFile(DECLARATION);
  // Without the file in the program, TypeScript would check only its libraries and report nothing.
  expect(file).toBeDefined();
  return messages([...program.getOptionsDiagnostics(), ...program.getSemanticDiagnostics(file)]);
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
