

//放在抓取完資料後，傳入座標
((lati,lngi) => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lati, lng: lngi },
        zoom: 17
    });
    var marker = new google.maps.Marker({ position: { lat: lati, lng: lngi }, map: map });
});

