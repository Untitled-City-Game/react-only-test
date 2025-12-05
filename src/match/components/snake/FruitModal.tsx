import { config } from "@/scripts/games/snake/config";
import { PlayStateMoves_Snake } from "@/scripts/games/snake/snake";
import { Fruit, SnakeChallenge } from "@/scripts/games/snake/types";
import { GameContext, SnakeContext } from "@/src/match/Board";
import { uploadEvidence } from "@/src/match/components/regions/region_claim_flow/claimZone";
import { FruitIcon } from "@/src/match/components/snake/Fruit";
import useMyLocation from "@/src/match/interfaces/useMyLocation";
import Loading from "@/src/match/screens/game_status/Loading";
import P from "@/src/userInterface/P";
import {  Button, FileInput, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { hasLength, useForm, UseFormReturnType } from "@mantine/form";
import { useContext, useState } from "react";
import { FaAppleAlt } from "react-icons/fa";


function ChallengeBody(props : {
	fruit : Fruit,
	distance : number,
	disabled? : boolean
}) {
	const fruitForm = useForm({
	mode: "controlled",
	initialValues: {
		fruit: props.fruit,
		evidence: "",
	},
	validate: {
		evidence: hasLength({ min: 1 }, 'Please include evidence!'),
	}
	});
	const [loading, setLoading] = useState(false);
	const context = useContext(GameContext);
	const moves = context.moves as PlayStateMoves_Snake;

	async function handleSubmit(values: { evidence: string }) {
		setLoading(true);
		const evidenceUrls = await uploadEvidence(values.evidence as unknown as File[], context.playerID)
		moves.completeChallengeAndEatFruit(props.fruit, evidenceUrls)
		setLoading(false);
		close();
	}

	return (<Stack align="center">
		<LoadingOverlay visible={loading} loaderProps={{ children: <Loading message="Growing Snake..." /> }} />
		<P>{props.fruit.challenge.title}</P>
		<P>{props.fruit.challenge.variant}</P>
		<P>{props.fruit.challenge.description}</P>
		<P>{props.distance}</P>
		<form onSubmit={fruitForm.onSubmit(handleSubmit)}>
			<FileInput label="Evidence" multiple {...fruitForm.getInputProps("evidence")} />

			<Button type="submit" disabled={props.disabled}>Complete and eat!</Button>
		</form>
	</Stack>);
}


export default function FruitModal({ opened, close, fruit, distance }: { opened: boolean, close: () => void, fruit: Fruit, distance: number }) {
	const inRange = config.fruitClaimDistance > distance
	const variant = fruit.challenge.variant
	let modalBody;

	if(inRange){
		modalBody = <ChallengeBody fruit={fruit} distance={distance}></ChallengeBody> 
	} else if(variant == "bring"){
		modalBody = <ChallengeBody fruit={fruit} distance={distance} disabled={true}></ChallengeBody> 
	} else {
		modalBody = <P>Reach the fruit to see this challenge!</P>
	}

	return (
		<Modal opened={opened} centered onClose={close}>
			<Stack align="center">
			{FruitIcon(fruit.challenge.variant)}
			{modalBody}
			</Stack>
		</Modal>)
}

