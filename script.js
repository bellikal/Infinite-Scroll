// Factory function to manage the loading of images from Unsplash
function createUnsplashLoader(container, loader) {
    // State variables to track the loading status and image data
    let ready = false; // Indicates if more images can be loaded
    let imagesLoaded = 0; // Counter for how many images have been loaded
    let totalImages = 0; // Stores the total number of images to be loaded
    let photosArray = []; // Array that stores the data of the loaded images
    const apiKey = '5NglnIt3WsxWk3lDa_mN0AryWgl-YQi3Z6Vugn7fVWQ'; // API key for Unsplash
    let count = 5; //Number of images that are loaded the first time
    let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`; // URL of the API

    // Async function to fetch photos from the Unsplash API
    const getPhotos = async () => {
        // Display the loader on the first load
        if (imagesLoaded === 0) {
            loader.hidden = false; // Shows the loader while images are loading
        }
        try {
            const response = await fetch(apiUrl); // Sends network request to Unsplash API
            photosArray = await response.json(); // Parses the JSON response into an object
            displayPhotos(); // Invokes function to display the fetched images
        } catch (error) {
            console.error('Error fetching photos:', error); // Logs any error during fetch operation
        }
    };

    // Function to create and display images in the DOM
    const displayPhotos = () => {
        imagesLoaded = 0;
        totalImages = photosArray.length;
        photosArray.forEach(photo => {
            // Create a hyperlink element that links to the Unsplash page of the photo
            const item = document.createElement('a');
            setAttributes(item, {
                href: photo.links.html,
                target: '_blank'
            });

            // Creating and configure an image element
            const img = document.createElement('img');
            setAttributes(img, {
                src: photo.urls.regular,
                alt: photo.alt_description,
                title: photo.alt_description
            });

            // Attach an event listener to track when the image has loaded
            img.addEventListener('load', imageLoaded);
            item.appendChild(img); // Adds the image to the link-element
            container.appendChild(item); // Adds the link to the container
        });
    };

    // Updates the state when an image is fully loaded
    const imageLoaded = () => {
        imagesLoaded++;
        // Check if all images are loaded and update the state
        if (imagesLoaded === totalImages) {
            ready = true;
            loader.hidden = true; // Hide the loader when all images are loaded
        }
    };

    // Helper function to set multiple attributes on a DOM element
    const setAttributes = (element, attributes) => {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    };

    // Throttle function to limit the frequency of function execution
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    // Method to check if the user has scrolled near the bottom of the page
    const checkScroll = () => {
        // Trigger new photo load when nearing the bottom of the page and ready
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
            ready = false;
            getPhotos();
        }
    };

    // Attach the throttled scroll event handler to the window's scroll event
    window.addEventListener('scroll', throttle(checkScroll, 500));

    // Expose the getPhotos method to allow external invocation
    return { getPhotos };
}

// Initialize the Unsplash loader with the specified container and loader elements
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const unsplashLoader = createUnsplashLoader(imageContainer, loader);
unsplashLoader.getPhotos(); // Initial call to load photos