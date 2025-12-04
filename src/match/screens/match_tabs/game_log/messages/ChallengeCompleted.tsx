import { LogMetadata } from "@/scripts/types/types";
import ImageMantine from "@/src/userInterface/ImageMantine";
import { Box, Stack } from "@mantine/core";
import ReactPlayer from "react-player";
import mime from "mime-types"
import P from "@/src/userInterface/P";

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

export function ChallengeEvidence({ metadata, myMessage }: { metadata: LogMetadata; myMessage?: boolean }) {
	const evidenceImages = metadata.evidence?.map(imageLink => {
		const fileName = imageLink.split('?')[0]
		 const fileMime = mime.lookup(fileName)
		 const [fileCategory, fileType] = fileMime ? fileMime.split('/') : [undefined]
		if (!fileType) {
			return (
				null
			)
		}
		
		DEBUG && console.warn("file type checker", mime.lookup(fileName))
		DEBUG && console.warn("my message?", myMessage)
		if (fileCategory === "image") {
			return (
				<ImageMantine
					style={{
						borderRadius: "10px",
					}}
					key={imageLink}
					src={imageLink}
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
					<ReactPlayer width={"300px"} url={imageLink} controls />
					</Box>
					</>
			);
		}
		return (
		<Box key={imageLink}>
			<P>I don't know how to display this data!</P>
		</Box>)
	});

	return (
		<Stack align={myMessage ? "flex-end" : "flex-start"} justify={myMessage ? "flex-end" : "flex-start"}>
			{metadata.evidence && evidenceImages}
		</Stack>
	)

}
