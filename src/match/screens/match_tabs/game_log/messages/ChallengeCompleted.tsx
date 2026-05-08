import { LogMetadata } from "@/scripts/types/types";
import ImageMantine from "@/src/userInterface/ImageMantine";
import { Box, Stack } from "@mantine/core";
import ReactPlayer from "react-player";
import P from "@/src/userInterface/P";
import { useEffect, useState } from "react";
import getMime from "@/scripts/helpers/mime";
const DEBUG = true;

export function ClaimChallengeCompleted({ metadata }: { metadata: LogMetadata; }) {
	return (
		<>
			<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> to {metadata.claimType || "claim"} <strong>{metadata.zoneName || metadata.zone}</strong> {metadata.stealFrom ? `from ${metadata.stealFrom}` : null}
		</>
	);
}


export function FruitEaten({ metadata }: { metadata: LogMetadata; }) {
	return (
		<>
			<span className="capitalize">{metadata.team} team</span> completed challenge <strong>{metadata.challenge}</strong> and grew {metadata.growth}m
		</>
	);
}

type EvidenceMime = {
	link: string,
	fileType: string,
	fileCategory: string,
} | undefined

export function ChallengeEvidence({ metadata, myMessage }: { metadata: LogMetadata; myMessage?: boolean }) {
	const [evidenceMime, setEvidenceMime] = useState<EvidenceMime[]>([])
		useEffect(() => {
			metadata.evidence ? findEvidenceType(metadata.evidence) : null
		}, [metadata])

	async function findEvidenceType(evidence : string[]){
		const mimedEvidence : Array<EvidenceMime>= await Promise.all(evidence.map(async imageLink => {
			const fileName = imageLink.split('?')[0]
			const fileMime = getMime(fileName)
			if(fileMime){
				const [fileCategory, fileType] = fileMime.split('/')
				return {
					link: imageLink,
					fileType,
					fileCategory
				}
			}
		}))
		setEvidenceMime(mimedEvidence)
	}
	const evidenceImages = evidenceMime?.map(imageData => {
		if(!imageData) return null
		const {link, fileType, fileCategory} = imageData;
		
		DEBUG && console.warn("my message?", myMessage)
		
		if (fileCategory === "image") {
			return (
				<ImageMantine
					style={{
						borderRadius: "10px",
					}}
					key={link}
					src={link}
					alt={`${metadata.team} team completed challenge ${metadata.challenge} to claim zone ${metadata.zone}`}
					w="min(80%, 300px)"
					mb="4px"
				/>
			);
		}
		if(fileCategory === "video"){
			return (
				<>
					{/* <video style={{maxWidth: "min(80%, 300px)", marginBottom: "4px"}} controls>
						<source src={imageLink} type={fileMime as string} />
					</video> */}
					<Box>
					<ReactPlayer width={"300px"} url={link} controls />
					</Box>
					</>
			);
		}
		return (
		<Box key={link}>
			<P>I don't know how to display this data!</P>
		</Box>)
	});

	return (
		<Stack align={myMessage ? "flex-end" : "flex-start"} justify={myMessage ? "flex-end" : "flex-start"}>
			{metadata.evidence && evidenceImages}
		</Stack>
	)

}
