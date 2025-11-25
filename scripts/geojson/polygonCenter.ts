export default function findPolygonCenter(coords: google.maps.LatLngLiteral[]) : google.maps.LatLngLiteral {
	var bounds = new google.maps.LatLngBounds();
	for (let i = 0; i < coords.length; i++) {
		bounds.extend(coords[i]);
	}

	const center = bounds.getCenter()
	return ({lat : center.lat(), lng: center.lng()});
}