import LocationMarker from "@/src/match/googleMaps/LocationMarker";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import { Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { useUncontrolled } from '@mantine/hooks';
export type MapAreaSelectorValue = {
	gameLocation: google.maps.LatLngLiteral,
	gameRadius: number,
}
interface CustomInputProps {
  value?: MapAreaSelectorValue;
  defaultValue?: MapAreaSelectorValue;
  onChange?: (value: MapAreaSelectorValue) => void;
}
export function MapAreaSelector({mapAreaCallback}: {mapAreaCallback: React.Dispatch<React.SetStateAction<MapAreaSelectorValue>>}){
	const myLocation = useMyLocation({lat: 0, lng: 0});
	//console.log("rendering areamap selector")
	return(
	<Input.Wrapper label="Game Area">
		<div className="map-area-selector" style={{height: 400, width: "80%"}}>
			{/* <AreaMap initialpos={{lat: 0, lng: 0}} mapAreaCallback={mapAreaCallback}/> */}
			{myLocation.lat === 0 ? <span>Loading player location...</span> : 
			<AreaMap initialpos={myLocation} mapAreaCallback={mapAreaCallback}/>
			}
		</div>
	</Input.Wrapper>
	)
}

function AreaMap({initialpos, mapAreaCallback} : {initialpos: google.maps.LatLngLiteral, mapAreaCallback: React.Dispatch<React.SetStateAction<MapAreaSelectorValue>>
}){
		const [gameLocation, setGameLocation] = useState(initialpos);
		const [gameRadius, setGameRadius] = useState(3000);
		const [offset, setOffset] = useState<google.maps.LatLngLiteral>()
		useEffect(() => {
			mapAreaCallback({gameLocation, gameRadius})
		}, [])
		 const changeRadius = (newRadius : number | null | undefined) => {
			if (!newRadius) return;
			setGameRadius(newRadius);
			//updateFormValue({gameLocation, gameRadius})
		 }

		 const startDrag = (e: google.maps.MapMouseEvent) => {
			if (!e) return;
			if (!e.latLng) return;
			setOffset({lat: e.latLng.lat() - gameLocation.lat, lng: e.latLng.lng() - gameLocation.lng});
		 }

		 const changeCenter = (e : google.maps.MapMouseEvent) => {
   			 if (!e) return;
			 if(!e.latLng) return;
   			 setGameLocation({lat: e.latLng.lat() - (offset?.lat ?? 0), lng: e.latLng.lng() - (offset?.lng ?? 0)});
			 mapAreaCallback({gameLocation, gameRadius})
 		 };
		return (
			<VisGlMapElement center={gameLocation}>
						<Circle 
							center={gameLocation}
							radius={gameRadius}
							onRadiusChanged={changeRadius}
							onDragStart={startDrag}
          					onDragEnd={changeCenter}
							editable
							draggable
							strokeColor={'#008f58ff'}
							strokeOpacity={1}
							strokeWeight={3}
							fillColor={'#009b4bff'}
							fillOpacity={0.3}
			/>

			</VisGlMapElement>
		)

}