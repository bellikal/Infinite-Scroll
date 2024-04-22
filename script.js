// Class definition: 'UnsplashLoader' manages the loading of images from Unsplash
class UnsplashLoader {
    constructor(container, loader) {
        // Set properties of the class with initial values
        this.container = container; // Element in which the images are displayed
        this.loader = loader; // Loading display element
        this.ready = false; // Status, whether new images can be loaded
        this.imagesLoaded = 0; // Counter for how many images have been loaded
        this.totalImages = 0; // Total number of images to be loaded
        this.photosArray = []; // Array that stores the data of the loaded images
        this.apiKey = '5NglnIt3WsxWk3lDa_mN0AryWgl-YQi3Z6Vugn7fVWQ'; // API key for Unsplash
        this.count = 5; //Number of images that are loaded the first time
        this.apiUrl = `https://api.unsplash.com/photos/random/?client_id=${this.apiKey}&count=${this.count}`; // URL of the API

        // Throttle Method for the Scroll-Event
        window.addEventListener('scroll', this.throttle(this.checkScroll, 500).bind(this));

        // Initial Calling to load Photos
        this.getPhotos();
    }

    // Throttle Function
    throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }

    // Get photos from Unsplash API
    async getPhotos() {
        if (!this.ready) {
            this.loader.hidden = false; // SHow Loader while Images are loading
        }
        try {
            const response = await fetch(this.apiUrl); // Sends HTTP-Request to Unsplash API
            this.photosArray = await response.json(); // Converts response into an JSON object
            this.displayPhotos(); // Calls the function to display images
        } catch (error) {
            console.error('Error fetching photos:', error); // Logs error if an error occurs when retrieving the data
        }
    }

    displayPhotos() {
        this.imagesLoaded = 0;
        this.totalImages = this.photosArray.length;
        this.photosArray.forEach(photo => {
            // Creating the link pointing to the Unsplash-Page
            const item = document.createElement('a');
            this.setAttributes(item, {
                href: photo.links.html,
                target: '_blank'
            });

            // Creating Image
            const img = document.createElement('img');
            this.setAttributes(img, {
                src: photo.urls.regular,
                alt: photo.alt_description,
                title: photo.alt_description
            });

            // Event-Listener for loading of the image
            img.addEventListener('load', () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.totalImages) {
                    this.ready = true; // Sets ready on true if all images are loaded
                    this.loader.hidden = true; // Hides loader
                }
            });

            item.appendChild(img); // Adds the image to the link-element
            this.container.appendChild(item); // Adds the link to the container
        });
    }

    setAttributes(element, attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
    }

    // CheckScroll Method
    checkScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && this.ready) {
            this.ready = false;
            this.getPhotos();
        }
    }
}

const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
new UnsplashLoader(imageContainer, loader);