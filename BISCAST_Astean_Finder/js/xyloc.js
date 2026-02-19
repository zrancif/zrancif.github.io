canvas.onmousemove = function(e) {
    const rect = canvas.getBoundingClientRect();

    // Mouse position inside the canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Optionally scale back to image coordinates (if needed)
    const scaleX = mapImg.width / canvas.width;
    const scaleY = mapImg.height / canvas.height;

    const imageX = Math.round(mouseX * scaleX);
    const imageY = Math.round(mouseY * scaleY);

    // You can toggle which one to show here:
    console.log(`imageX: ${imageX}, imageY: ${imageY}`);
    // Or for canvas-space: canvas.title = `x: ${mouseX}, y: ${mouseY}`;
};