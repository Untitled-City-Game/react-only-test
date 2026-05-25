import { gameLocationCenters } from "@/scripts/consts";
import { fetchMapData } from "@/scripts/fetchMapData";
import { City, MatchMapData } from "@/scripts/types/types";
import VisGlMapElement from "@/src/match/googleMaps/VisGLMapElement";
import { GenericMapZones } from "@/src/match/screens/connect_four/GenericMapZones";
import P from "@/src/userInterface/P";
import { Box, Loader, Select, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function StartingZonePicker({
    city,
    value,
    onChange,
    onMapDataLoaded,
}: {
    city: City;
    value?: string;
    onChange: (zone: string) => void;
    onMapDataLoaded?: (mapData: MatchMapData) => void;
}) {
    const [mapData, setMapData] = useState<MatchMapData | undefined>();

    useEffect(() => {
        let cancelled = false;
        setMapData(undefined);
        fetchMapData(city).then((data) => {
            if (cancelled) return;
            setMapData(data);
            onMapDataLoaded?.(data);
        });
        return () => {
            cancelled = true;
        };
    }, [city]);

    if (!mapData) {
        return (
            <Stack align="center" gap="xs">
                <Loader />
                <P fz="sm">Loading map...</P>
            </Stack>
        );
    }

    const options = mapData.zonePolygons.map((zone) => ({
        value: zone.featureName,
        label: zone.featureName,
    }));

    return (
        <Stack gap="0.5rem">
            <div>
                <P fz="sm">The starting neighbourhood cannot be claimed first.</P>
                <P fz="sm">Teams must leave the starting neighbourhood, and claim another neighbourhood.</P>
            </div>
            <Select
                label="Starting neighbourhood"
                data={options}
                value={value || null}
                onChange={(v) => onChange(v ?? "")}
            />
            <Box style={mapContainerStyle}>
                <VisGlMapElement center={gameLocationCenters[city]} gestureHandling="cooperative">
                    <GenericMapZones
                        MapData={mapData}
                        selectedZone={value ?? ""}
                        onClick={onChange}
                    />
                </VisGlMapElement>
            </Box>
        </Stack>
    );
}

const mapContainerStyle: React.CSSProperties = {
    minHeight: "40vh",
    width: "100%",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    position: "relative",
    height: 0,
};
