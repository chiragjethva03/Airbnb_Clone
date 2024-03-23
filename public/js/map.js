
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v9',
    center: coordinates, // starting position [lng, lat]
    zoom: 4 // starting zoom
});


const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}).setHTML(
                `<h4>${coordinates}</h4><p>Exact Location will be providing after Booking</p>`
            )
        )
        .addTo(map);
