// Haritayı Balçova'nın koordinatları ile başlat
var map = L.map('map').setView([38.4333, 27.1500], 14);

// OpenStreetMap tile layer ekle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// GeoJSON dosyasını yükleyip haritaya ekle
fetch('export (1).geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error('GeoJSON verisi yüklenemedi:', error));

// Değişkenler
var startMarker, endMarker;
var routingControl;

// Haritaya tıklanma olayı ekle
map.on('click', function (e) {
    var latLng = e.latlng;

    if (!startMarker) {
        startMarker = L.marker(latLng).addTo(map).bindPopup("Başlangıç Noktası").openPopup();
        $('#start-point').text("Başlangıç: " + latLng.lat.toFixed(5) + ", " + latLng.lng.toFixed(5));
    } else if (!endMarker) {
        endMarker = L.marker(latLng).addTo(map).bindPopup("Bitiş Noktası").openPopup();
        $('#end-point').text("Bitiş: " + latLng.lat.toFixed(5) + ", " + latLng.lng.toFixed(5));
        $('#calculate-button').show();
        calculateRoute();
    } else {
        map.removeLayer(startMarker);
        map.removeLayer(endMarker);
        startMarker = endMarker = null;
        $('#start-point').text("Başlangıç: Henüz Seçilmedi");
        $('#end-point').text("Bitiş: Henüz Seçilmedi");
        $('#calculate-button').hide();
        $('#distance').hide();
        if (routingControl) map.removeControl(routingControl);
    }
});

// Mesafe hesaplama butonuna tıklama
$('#calculate-button').click(function () {
    if (startMarker && endMarker) {
        var distance = map.distance(startMarker.getLatLng(), endMarker.getLatLng());
        $('#distance').text("İki nokta arasındaki mesafe: " + (distance / 1000).toFixed(2) + " km").show();
    }
});

// Rota hesaplama ve çizim fonksiyonu
function calculateRoute() {
    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startMarker.getLatLng().lat, startMarker.getLatLng().lng),
            L.latLng(endMarker.getLatLng().lat, endMarker.getLatLng().lng)
        ],
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: 'blue', opacity: 0.7, weight: 5 }]
        },
        createMarker: function() { return null; }
    }).addTo(map);
}
