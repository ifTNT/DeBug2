

//放在抓取完資料後，傳入座標
((latitude,longitude) => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 17
    });
    var marker = new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: map });
});

