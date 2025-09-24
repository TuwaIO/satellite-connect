import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      group: any;
    }
  }
}
