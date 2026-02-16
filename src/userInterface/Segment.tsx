import { defaultColor, LocalColorContext, ThemeColor } from "@/src/styles/theme";
import { CardProps } from "@mantine/core";
import { createContext } from "vm";

export default function Segment({ children, color, ...rest }: { children: React.ReactNode, color?: ThemeColor } & React.HTMLAttributes<HTMLDivElement> & CardProps) {
    return (
        <LocalColorContext.Provider value={color}>
            <div style={{
                border: `2px dashed ${defaultColor({ color })}`,
                padding: '1rem',
                borderRadius: `10px`
            }}>
                {children}
            </div>
        </LocalColorContext.Provider>
    )
}