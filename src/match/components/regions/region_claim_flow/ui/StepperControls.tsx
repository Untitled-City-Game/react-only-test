// import { GameBoardProps } from "@/scripts/types/types";
// import { Button, Group } from "@mantine/core";

// export default function StepperControls(claimForm: any, step: number, setStep: React.Dispatch<React.SetStateAction<number>>, closeClaim: () => void,  setLoading: React.Dispatch<React.SetStateAction<boolean>>
// , props: GameBoardProps) {
// 	return <Group justify="center" mt="xl">
// 		{step !== 2 ? (
// 			<>
// 				{step === 0 ? (
// 					<Button
// 						variant="outline"
// 						onClick={closeClaim}>
// 						Back
// 					</Button>
// 				) : (
// 					<Button
// 						variant="outline"
// 						onClick={() => setStep(step - 1)}>
// 						Back
// 					</Button>
// 				)}
// 				<Button
// 					onClick={() => {
// 						if (claimForm.validate().hasErrors)
// 							return;
// 						setStep(step + 1);
// 					} }>
// 					Next step
// 				</Button>
// 			</>
// 		) : (
// 			<>
// 				<Button
// 					variant="outline"
// 					onClick={() => setStep(step - 1)}>
// 					Back
// 				</Button>
// 				<Button type="submit">
// 					Claim
// 				</Button>
// 			</>
// 		)}
// 	</Group>;
// }
