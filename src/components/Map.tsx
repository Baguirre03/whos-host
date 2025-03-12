import { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { UserBase } from "API/types";

interface MapProps {
  members: UserBase[];
  currentUser: UserBase | null;
  host: UserBase | null;
}

const Map = ({ members, currentUser, host }: MapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);

  // Custom marker icon for host
  const hostMarkerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#ec4899",
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: "#ffffff",
    scale: 12,
  };

  // Custom label style for host
  const hostLabelStyle = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
  };

  useEffect(() => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds();

      if (members)
        members.forEach((member) => {
          if (member.lattitude && member.longitude) {
            bounds.extend({
              lat: member.lattitude,
              lng: member.longitude,
            });
          }
        });

      if (host?.lattitude && host?.longitude) {
        bounds.extend({
          lat: host.lattitude,
          lng: host.longitude,
        });
      }

      map.fitBounds(bounds);
    }
  }, [map, members, currentUser]);

  const center =
    host?.lattitude && host?.longitude
      ? { lat: host.lattitude, lng: host.longitude }
      : currentUser?.lattitude && currentUser?.longitude
      ? { lat: currentUser.lattitude, lng: currentUser.longitude }
      : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      onLoad={onLoad}
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={12}
      options={{
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        ],
      }}
    >
      {/* Draw lines to host if host and members exists */}
      {host?.lattitude &&
        host.longitude &&
        members &&
        members.map((member) =>
          member.lattitude &&
          member.longitude &&
          host.lattitude &&
          host.longitude ? (
            <Polyline
              key={`line-${member.id}`}
              path={[
                { lat: member.lattitude, lng: member.longitude },
                { lat: host.lattitude, lng: host.longitude },
              ]}
              options={{
                strokeColor: "#ec4899",
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
          ) : null
        )}

      {members &&
        members.map((member) =>
          member.lattitude && member.longitude ? (
            <Marker
              key={member.id}
              position={{
                lat: member.lattitude,
                lng: member.longitude,
              }}
              title={member.name}
              label={member.username.charAt(0).toUpperCase()}
            />
          ) : null
        )}
      {host?.lattitude && host?.longitude && (
        <Marker
          key={host.id}
          position={{
            lat: host.lattitude,
            lng: host.longitude,
          }}
          title={`${host.name} (Host)`}
          icon={hostMarkerIcon}
          label={{
            text: host.username.charAt(0).toUpperCase(),
            ...hostLabelStyle,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default Map;
