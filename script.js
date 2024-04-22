// Class definition: 'UnsplashLoader' manages the loading of images from Unsplash
function createUnsplashLoader(container, loader) {
    // Set properties of the class with initial values
    let ready = false; // Status, whether new images can be loaded
    let imagesLoaded = 0; // Counter for how many images have been loaded
    let totalImages = 0; // Total number of images to be loaded
    let photosArray = []; // Array that stores the data of the loaded images
    const apiKey = '5NglnIt3WsxWk3lDa_mN0AryWgl-YQi3Z6Vugn7fVWQ'; // API key for Unsplash
    let count = 5; //Number of images that are loaded the first time
    let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`; // URL of the API

    // Get photos from Unsplash API
    const getPhotos = async () => {
        if (imagesLoaded === 0) {
            loader.hidden = false; // Show Loader while Images are loading
        }
        try {
            const response = await fetch(apiUrl); // Sends HTTP-Request to Unsplash API
            photosArray = await response.json(); // Converts response into an JSON object
            displayPhotos(); // Calls the function to display images
        } catch (error) {
            console.error('Error fetching photos:', error); // Logs error if an error occurs when retrieving the data
        }
    };

    const displayPhotos = () => {
        imagesLoaded = 0;
        totalImages = photosArray.length;
        photosArray.forEach(photo => {
            // Creating the link pointing to the Unsplash-Page
            const item = document.createElement('a');
            setAttributes(item, {
                href: photo.links.html,
                target: '_blank'
            });

            // Creating Image
            const img = document.createElement('img');
            setAttributes(img, {
                src: photo.urls.regular,
                alt: photo.alt_description,
                title: photo.alt_description
            });

            // Event-Listener for loading of the image
            img.addEventListener('load', imageLoaded);
            item.appendChild(img); // Adds the image to the link-element
            container.appendChild(item); // Adds the link to the container
        });
    };

    const imageLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            ready = true;
            loader.hidden = true;
        }
    };

    const setAttributes = (element, attributes) => {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    };

    // Throttle Function
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

    // CheckScroll Method
    const checkScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
            ready = false;
            getPhotos();
        }
    };

    // Throttle Method for the Scroll-Event
    window.addEventListener('scroll', throttle(checkScroll, 500));

    // Initial Calling to load Photos
    return { getPhotos };
}

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const unsplashLoader = createUnsplashLoader(imageContainer, loader);
unsplashLoader.getPhotos();