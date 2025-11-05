// Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // Contexto 2D para dibujar en el Canvas

let stream = null; // Variable para almacenar el MediaStream de la cámara

// Función para activar la cámara
async function openCamera() {
    try {
        // Definición de restricciones (Constraints)
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' }, // Solicita la cámara trasera
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };

        // Obtener el Stream de Medios
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Asignar el Stream al Elemento <video>
        video.srcObject = stream;
        
        // Actualización de la UI
        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;
        
        console.log('Cámara abierta exitosamente');
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
}

// Función para capturar la foto
function takePhoto() {
    if (!stream) {
        alert('Primero debes abrir la cámara');
        return;
    }

    // Dibujar el Frame de Video en el Canvas
    // El método drawImage() es clave: toma el <video> como fuente.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Conversión a Data URL (Base64)
    const imageDataURL = canvas.toDataURL('image/png');
    
    // ⭐ AQUÍ ES DONDE SE MUESTRA LA FOTO EN BASE64 EN CONSOLA
    console.log('📸 Foto capturada en base64:');
    console.log(imageDataURL);
    console.log(`Tamaño de la imagen: ${imageDataURL.length} caracteres`);
    
    // También mostrar una alerta para confirmar que se tomó la foto
    alert('¡Foto capturada! Revisa la consola para ver el base64');
    
    // Cerrar la cámara después de tomar la foto
    closeCamera();
}

// Función para cerrar la cámara
function closeCamera() {
    if (stream) {
        // Detener todos los tracks del stream (video, audio, etc.)
        stream.getTracks().forEach(track => track.stop());
        stream = null; // Limpiar la referencia

        // Limpiar y ocultar UI
        video.srcObject = null;
        cameraContainer.style.display = 'none';
        
        // Restaurar el botón 'Abrir Cámara'
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        
        console.log('Cámara cerrada');
    }
}

// Event listeners para la interacción del usuario
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);

// Limpiar stream cuando el usuario cierra o navega fuera de la página
window.addEventListener('beforeunload', () => {
    closeCamera();
});

// Mensaje de bienvenida en consola
console.log('📱 PWA Cámara cargada. Presiona F12 para abrir las herramientas de desarrollador y ver la consola.');