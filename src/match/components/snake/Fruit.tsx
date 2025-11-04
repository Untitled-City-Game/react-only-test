import { config } from "@/scripts/games/snake/config";
import { Fruit, FruitVariant } from "@/scripts/games/snake/types";
import { Circle } from "@/src/match/googleMaps/shapes/Circle";
import { ZoomContext } from "@/src/match/googleMaps/VisGLMapElement";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { useContext } from "react";
import { BsCCircleFill, BsCircle } from "react-icons/bs";
import { FaAppleAlt } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { GiBananaBunch, GiGrapes } from "react-icons/gi";

export default function FruitMarker({fruitData, onClick} : {fruitData : Fruit, onClick : () => void}) {

	const icon = FruitIcon(fruitData.challenge.variant)
	const zoom = useContext(ZoomContext)
	// console.log("creating icon", fruitData.challenge.variant)
	return (
		<>
		<AdvancedMarker onClick={onClick} position={fruitData.coords} >
			<FaCircle size="2rem" fill="white" style={{position: "absolute", top: "-1rem", left: "-1rem"}}/>
			{icon}
		</AdvancedMarker>
		{zoom > 15 ? <Circle onClick={onClick} center={fruitData.coords} radius={config.fruitClaimDistance} strokeColor={"red"} fillColor={"orange"} fillOpacity={0.2} /> : null}
		
		</>
	)
}

export function FruitIcon(variant: FruitVariant){
		const iconSize = "1.5rem"
		const iconstyle : React.CSSProperties = { position: "absolute", top: "-0.75rem", left: "-0.75rem"}
		switch(variant){
		case "there":
			return <FaAppleAlt color="red" size={iconSize} style={iconstyle} />
		case "bring":
			return <GiBananaBunch color="orange" size={iconSize} style={iconstyle} />
		case "go_come_back":
			return <GiGrapes color="purple" size={iconSize} style={iconstyle} />
	}

}