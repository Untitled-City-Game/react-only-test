import { Image, ImageProps, PolymorphicComponentProps } from "@mantine/core";
export default function ImageMantine(props: PolymorphicComponentProps<'img', ImageProps>) {
	return <Image {...props} />;
}