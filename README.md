# 📻 MATTER & SOUND — [UNIT_MOD_02]
### R-DISQUETE ANALOG SYSTEMS | EXPERIMENTAL AUDIO DIVISION

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web_Audio_API](https://img.shields.io/badge/Web_Audio_API-000000?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**Matter & Sound** es una estación de trabajo de visualización generativa que transforma ondas mecánicas en materia digital. Diseñada bajo una estética de hardware analógico de mediados de los 70, esta unidad procesa señales en tiempo real mediante transformada de Fourier para modular un sistema de partículas de alta fidelidad.

---

## 🔬 STACK TECNOLÓGICO (TECH STACK)

La unidad ha sido ensamblada utilizando componentes de software de grado industrial para garantizar una latencia cero y una respuesta visual orgánica.

### 🎨 Frontend & UI
* **React 18 & TypeScript:** Estructura de componentes basada en tipos para un control de estado riguroso y una lógica de UI predecible.
* **Tailwind CSS:** Motor de estilos utilizado para la recreación de texturas metálicas, diales de baquelita y tipografías técnicas de laboratorio.
* **Framer Motion:** (Opcional) Implementado para las transiciones de polaridad cromática (Modo Oscuro/Claro).

### 🔊 Audio Engine
* **Web Audio API:** Núcleo de procesamiento de señal. Utiliza un nodo `AnalyserNode` para la captura de datos de frecuencia en tiempo real.
* **Fast Fourier Transform (FFT):** Algoritmo utilizado para descomponer la señal de audio en un espectro de frecuencias manejable (Bins).

### 🌌 Visual Engine
* **HTML5 Canvas API:** Renderizado de alto rendimiento. Se ha optado por Canvas frente a DOM puro para permitir la manipulación de miles de partículas a **60 FPS** sin sobrecargar el hilo principal de React.
* **Referential Integrity:** Uso intensivo de `useRef` para manejar los buffers de las barras de frecuencia, evitando ciclos de re-renderizado infinito y maximizando la eficiencia de la GPU.

---

## ⚙️ ARQUITECTURA DEL SISTEMA

El flujo de datos sigue un protocolo circular estrictamente controlado:



1.  **Entrada (Source):** El flujo comienza con el acceso al dispositivo de captura (Micrófono).
2.  **Procesado (Analysis):** La señal pasa por un aislador de ganancia (`GainNode`) y se analiza en tiempo real.
3.  **Filtrado (Frequency Modulators):** Los interruptores físicos en la UI filtran qué bandas de frecuencia se envían al motor de partículas.
4.  **Renderizado (Output):** El canvas traduce la energía de cada banda en radio, distancia y velocidad de las partículas.