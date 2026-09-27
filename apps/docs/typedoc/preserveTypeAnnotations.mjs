// @ts-check
/**
 * @file TypeDoc plugin that keeps explicit type annotations readable.
 *
 * TypeDoc converts property, parameter and return types from the type checker and only uses the
 * written annotation as a hint. Some library types (e.g. viem's `PublicClient` and `WalletClient`,
 * which are wrapped in `Prettify<...>`) resolve to anonymous object types, so the generated pages
 * inline their entire member list (hundreds of KB per page) instead of printing the type name.
 *
 * When a converted type contains such an anonymous object but the source annotation does not
 * contain an inline type literal, this plugin re-converts the type from the annotation node, so
 * `publicClient: PublicClient` is rendered as `PublicClient` again.
 */

import { Converter } from 'typedoc';
import ts from 'typescript';

/**
 * Checks whether a converted TypeDoc type contains an anonymous object type.
 *
 * @param {import('typedoc').SomeType | undefined} type - Converted TypeDoc type.
 * @returns {boolean} `true` if the type, or any union/intersection/array member, is a reflection type.
 */
function containsReflectionType(type) {
  if (!type) return false;
  switch (type.type) {
    case 'reflection':
      return true;
    case 'union':
    case 'intersection':
      return type.types.some(containsReflectionType);
    case 'array':
      return containsReflectionType(type.elementType);
    default:
      return false;
  }
}

/**
 * Checks whether an annotation node declares an object shape inline.
 *
 * @param {ts.Node} node - Type annotation node from the source.
 * @returns {boolean} `true` if the annotation contains a type literal or mapped type.
 */
function containsInlineObjectType(node) {
  if (ts.isTypeLiteralNode(node) || ts.isMappedTypeNode(node)) return true;
  return ts.forEachChild(node, (child) => (containsInlineObjectType(child) ? true : undefined)) ?? false;
}

/**
 * Collects the reflections owned by anonymous object types so they can be removed from the project.
 *
 * @param {import('typedoc').SomeType | undefined} type - Converted TypeDoc type.
 * @returns {import('typedoc').DeclarationReflection[]} Declarations that back reflection types.
 */
function collectReflectionDeclarations(type) {
  if (!type) return [];
  switch (type.type) {
    case 'reflection':
      return [type.declaration];
    case 'union':
    case 'intersection':
      return type.types.flatMap(collectReflectionDeclarations);
    case 'array':
      return collectReflectionDeclarations(type.elementType);
    default:
      return [];
  }
}

/**
 * Re-converts a type from its annotation node when the checker expanded it into an anonymous object.
 * Side effect: removes the discarded anonymous declarations from the project.
 *
 * @param {import('typedoc').Context} context - Converter context of the owning reflection.
 * @param {import('typedoc').SomeType | undefined} type - Type produced by TypeDoc.
 * @param {ts.TypeNode | undefined} annotation - Explicit type annotation written in the source.
 * @returns {import('typedoc').SomeType | undefined} The replacement type, or `undefined` to keep the original.
 */
function convertFromAnnotation(context, type, annotation) {
  if (!annotation || !containsReflectionType(type) || containsInlineObjectType(annotation)) return undefined;
  for (const declaration of collectReflectionDeclarations(type)) {
    context.project.removeReflection(declaration);
  }
  return context.converter.convertType(context, annotation);
}

/**
 * Returns the explicit type annotation of a declaration, if it has one.
 *
 * @param {ts.Declaration | undefined} declaration - Source declaration.
 * @returns {ts.TypeNode | undefined} The annotation node.
 */
function getAnnotation(declaration) {
  if (!declaration || !('type' in declaration) || !declaration.type) return undefined;
  const annotation = /** @type {ts.Node} */ (declaration.type);
  return ts.isTypeNode(annotation) ? annotation : undefined;
}

/**
 * TypeDoc plugin entry point.
 *
 * @param {import('typedoc').Application} app - TypeDoc application instance.
 * @returns {void}
 */
export function load(app) {
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, (context, reflection) => {
    // Nothing to replace. This also skips class constructors: TypeDoc finalizes them with the context of the
    // enclosing module instead of the class, so `context.withScope(reflection)` would fail its scope assertion.
    if (!containsReflectionType(reflection.type)) return;
    const declaration = context.getSymbolFromReflection(reflection)?.declarations?.[0];
    const replacement = convertFromAnnotation(
      context.withScope(reflection),
      reflection.type,
      getAnnotation(declaration),
    );
    if (replacement) reflection.type = replacement;
  });

  app.converter.on(Converter.EVENT_CREATE_SIGNATURE, (context, signature, declaration) => {
    const replacement = convertFromAnnotation(context.withScope(signature), signature.type, getAnnotation(declaration));
    if (replacement) signature.type = replacement;
  });

  app.converter.on(Converter.EVENT_CREATE_PARAMETER, (context, parameter, declaration) => {
    const replacement = convertFromAnnotation(context, parameter.type, getAnnotation(declaration));
    if (replacement) parameter.type = replacement;
  });
}
