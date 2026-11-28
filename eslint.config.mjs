import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/**']),
  {
    // Reglas de eslint-plugin-react-hooks 7 (orientadas al React Compiler) que
    // llegaron con eslint-config-next 16 y marcan patrones que ya existían
    // (cargar localStorage en un efecto, Date.now() al renderizar, un componente
    // definido dentro de otro...). Quedan como aviso para corregirlas aparte, sin
    // mezclar cambios de comportamiento con la actualización de Next.js.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
])
