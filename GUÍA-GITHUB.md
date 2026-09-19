# 📚 Guía para Subir Cambios a GitHub Pages

## ✅ Cambios Realizados

Se corrigieron los problemas de renderizado donde el texto se mezclaba con las fórmulas matemáticas:

1. **Separación de texto y matemáticas**: Ahora el texto normal (como "Función:", "Intervalo:", etc.) se muestra con fuente normal y las fórmulas con fuente KaTeX
2. **Mejor estructura visual**: Los pasos ahora tienen etiquetas claras en azul/amarillo seguidas de las fórmulas
3. **Estilos CSS mejorados**: Se agregó CSS para asegurar que el texto no se vea afectado por KaTeX

---

## 🚀 Paso a Paso para Subir a GitHub

### Opción 1: Usando GitHub Desktop (Recomendado para principiantes)

1. **Descarga GitHub Desktop**
   - Ve a https://desktop.github.com/
   - Descarga e instala la aplicación

2. **Clona tu repositorio**
   - Abre GitHub Desktop
   - Click en "File" → "Clone Repository"
   - Selecciona la pestaña "URL"
   - Pega: `https://github.com/jhfrgonzalez/IntegraLabMath.git`
   - Elige una carpeta local en tu computadora
   - Click en "Clone"

3. **Copia los archivos actualizados**
   - Abre la carpeta clonada en tu explorador de archivos
   - Copia todos los archivos del proyecto actual (excepto `node_modules` y `.git`)
   - Pégalos en la carpeta clonada, reemplazando los archivos existentes

4. **Confirma los cambios**
   - En GitHub Desktop, verás los archivos modificados
   - Escribe un mensaje como: "Corrección de renderizado matemático y agregada evaluación"
   - Click en "Commit to main"

5. **Sube los cambios**
   - Click en "Push origin" (botón azul arriba)
   - Espera a que termine la subida

6. **Espera el despliegue**
   - GitHub Pages tarda 1-2 minutos en actualizar
   - Tu sitio estará en: https://jhfrgonzalez.github.io/IntegraLabMath/

---

### Opción 2: Usando Git en Terminal (Para usuarios avanzados)

```bash
# 1. Navega a la carpeta de tu proyecto
cd ruta/a/tu/proyecto

# 2. Inicializa git (si no lo has hecho)
git init

# 3. Agrega el repositorio remoto
git remote add origin https://github.com/jhfrgonzalez/IntegraLabMath.git

# 4. Agrega todos los cambios
git add .

# 5. Crea un commit
git commit -m "Corrección de renderizado matemático y agregada evaluación"

# 6. Sube los cambios
git push -u origin main
```

---

### Opción 3: Usando la Interfaz Web de GitHub

1. **Ve a tu repositorio**
   - Abre: https://github.com/jhfrgonzalez/IntegraLabMath

2. **Sube archivos individualmente**
   - Click en "Add file" → "Upload files"
   - Arrastra los archivos que modificaste:
     - `src/components/Graphs.tsx`
     - `src/components/IntegralCalculator.tsx`
     - `src/components/IntegrationMethods.tsx`
     - `src/components/Dashboard.tsx`
     - `src/components/Evaluation.tsx`
     - `src/App.tsx`
     - `src/index.css`
   - Escribe un mensaje: "Corrección de renderizado matemático"
   - Click en "Commit changes"

3. **Espera el despliegue**
   - GitHub Pages se actualiza automáticamente
   - Verifica en: https://jhfrgonzalez.github.io/IntegraLabMath/

---

## 🔍 Verificar que Todo Funciona

Después de subir los cambios:

1. **Espera 1-2 minutos** para que GitHub Pages se actualice
2. **Abre tu sitio**: https://jhfrgonzalez.github.io/IntegraLabMath/
3. **Verifica las correcciones**:
   - Ve a "Gráficas" → Visualizador de Riemann
   - Cambia los parámetros y observa el "Desarrollo Paso a Paso"
   - El texto "Función:", "Intervalo:", etc. debe verse con fuente normal
   - Las fórmulas deben verse con fuente matemática (KaTeX)

4. **Verifica la evaluación**:
   - En el Dashboard, debe aparecer el banner rojo de "Evaluación"
   - Click en él para ver los detalles
   - O busca "Evaluación" en el menú lateral

---

## 📋 Archivos que se Modificaron

```
src/
├── App.tsx                          (Agregada navegación a Evaluación)
├── index.css                        (Mejorados estilos CSS)
└── components/
    ├── Dashboard.tsx                (Agregado banner de Evaluación)
    ├── Evaluation.tsx               (NUEVO - Componente de evaluación)
    ├── Graphs.tsx                   (Corregido renderizado paso a paso)
    ├── IntegralCalculator.tsx       (Corregido renderizado de pistas)
    └── IntegrationMethods.tsx       (Corregido renderizado de resultados)

public/
└── evaluacion-calculo-integral.html (NUEVO - Documento imprimible)
```

---

## 🐛 Solución de Problemas

### El sitio no se actualiza
- Espera 2-3 minutos
- Limpia la caché del navegador (Ctrl + Shift + R)
- Verifica que GitHub Pages esté habilitado en Settings → Pages

### Error de build
- Verifica que todos los archivos estén correctos
- Ejecuta `npm run build` localmente para probar
- Revisa la pestaña "Actions" en GitHub para ver errores

### Las fórmulas no se ven bien
- Verifica que KaTeX esté cargando correctamente
- Abre la consola del navegador (F12) y busca errores
- Asegúrate de que el archivo `index.html` incluya los estilos de KaTeX

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la pestaña "Actions" en GitHub para ver logs de error
2. Verifica que todos los archivos estén en la rama `main`
3. Asegúrate de que GitHub Pages esté configurado correctamente

---

## 🎉 ¡Listo!

Una vez subidos los cambios, tu sitio estará actualizado en:
**https://jhfrgonzalez.github.io/IntegraLabMath/**

Los estudiantes ahora podrán:
- Ver las fórmulas matemáticas correctamente renderizadas
- Acceder a la sección de Evaluación
- Imprimir el documento de evaluación desde `evaluacion-calculo-integral.html`
