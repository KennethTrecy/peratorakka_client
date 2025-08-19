export default function censorLabel(label: string): string {
	return label.split("").map(_ => "*").join("")
}
