document.addEventListener('DOMContentLoaded', () => {
            
    // Get element with attributes Rive kuzo-rive-container
    const riveContainers = document.querySelectorAll('[kuzo-rive-container]');
     
     // Loop through each rive container element
    riveContainers.forEach(riveContainer => {
         // Get the 'rive-url' attribute value
        const riveUrl = riveContainer.getAttribute('kuzo-rive-url');
        const stateMachine = riveContainer.getAttribute('state-machine');
        // create a canvas element
        const canvas = document.createElement('canvas');    
        canvas.width =  500;
        canvas.height =  500;
         
         // Check if the rive-url is valid
        if (riveUrl) {
             // Create a new Rive instance for this container
             const r = new rive.Rive({
                 src: riveUrl,
                 canvas: canvas,
                 autoplay: true,
                 stateMachines: stateMachine, // Optional: Adjust if needed
                 onLoad: () => {
                     r.resizeDrawingSurfaceToCanvas();
                 }
             });
             riveContainer.appendChild(canvas);  
        } else {
             console.error('Missing rive-url attribute for rive container:', riveContainer);
        }
    });
});