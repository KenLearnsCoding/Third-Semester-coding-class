// Define the switchModel function
// Use this function simply to compare the src and with the selector from dom and change the display property of the mode-viewer.
    function switchModel(modelSrc) {
        if (modelSrc === 'assets/barrel_chair.glb') {
            modelViewer1.style.display = 'block';
            modelViewer2.style.display = 'none';
            modelViewer3.style.display = 'none';
        } else if (modelSrc === 'assets/chair.glb'){
            modelViewer1.style.display = 'none';
            modelViewer2.style.display = 'block';
            modelViewer3.style.display = 'none';
        } else if (modelSrc === 'assets/shelf.glb'){
            modelViewer1.style.display = 'none';
            modelViewer2.style.display = 'none';
            modelViewer3.style.display = 'block';
        }
    }