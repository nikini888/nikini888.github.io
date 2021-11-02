mapboxgl.accessToken = accessToken;

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    types: 'country,region,place,postcode,locality,neighborhood,address,poi',
    mapboxgl: mapboxgl
});

geocoder.addTo('#geocoder');

// Get the geocoder results container.
const spanLocation = document.querySelector('.span-location');
const inputLocation = document.getElementById('location');
const inputCoordinates = document.getElementById('coordinates');

// Add geocoder result to container.
geocoder.on('result', (e) => {
    if (spanLocation) {
        spanLocation.innerHTML = e.result.place_name;
    }
    inputLocation.setAttribute("value", e.result.place_name)
    inputCoordinates.setAttribute("value", e.result.geometry.coordinates)
});

// Clear results container when search is cleared.
geocoder.on('clear', () => {
    results.innerText = '';
});