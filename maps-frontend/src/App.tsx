import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent, useMap } from "react-leaflet";

type House = {
  id: string;
  lat: number;
  lng: number;
  properties?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
};

type LatLng = { lat: number; lng: number };

// Sydney coordinates: -33.8688, 151.2093

const API_BASE =
  typeof (import.meta as any).env !== "undefined" && (import.meta as any).env.VITE_API_BASE
    ? (import.meta as any).env.VITE_API_BASE
    : "";

function ClickToAdd({ onClick }: { onClick: (coords: LatLng) => void }) {
  useMapEvent("click", (e) => {
    onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

function ConfirmationDialog({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  coordinates 
}: { 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
  coordinates: LatLng | null;
}) {
  const [suburbName, setSuburbName] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);

  // Function to get suburb name from coordinates using reverse geocoding
  const getSuburbName = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API (free and no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      // Extract suburb/locality from the address components
      const address = data.address || {};
      return address.suburb || 
             address.village || 
             address.town || 
             address.city || 
             address.locality || 
             address.neighbourhood ||
             address.hamlet ||
             'Unknown Location';
    } catch (error) {
      console.error('Error fetching suburb name:', error);
      return 'Unknown Location';
    }
  };

  useEffect(() => {
    if (isOpen && coordinates) {
      setIsLoadingLocation(true);
      getSuburbName(coordinates.lat, coordinates.lng)
        .then(setSuburbName)
        .finally(() => setIsLoadingLocation(false));
    } else {
      setSuburbName("");
    }
  }, [isOpen, coordinates]);

  if (!isOpen || !coordinates) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <h3>Add New Point</h3>
        <p>Do you want to add a new point at this location?</p>
        <div className="location-info">
          {isLoadingLocation ? (
            <p className="coordinates loading-text">Loading location...</p>
          ) : (
            <p className="coordinates">
              📍 {suburbName}
            </p>
          )}
        </div>
        <div className="dialog-buttons">
          <button className="btn btn-primary" onClick={onConfirm} disabled={isLoadingLocation}>
            Yes, Add Point
          </button>
          <button className="btn btn-secondary" onClick={onCancel} disabled={isLoadingLocation}>
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function MapZoomToLocation({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], zoom);
    }
  }, [lat, lng, zoom, map]);
  
  return null;
}

export default function App() {
  const [houses, setHouses] = useState<House[]>([]);
  const [pending, setPending] = useState<LatLng | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<House[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [confirmationCoords, setConfirmationCoords] = useState<LatLng | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const api = useMemo(() => {
    return {
      async list(): Promise<House[]> {
        const res = await fetch(`${API_BASE}/api/places`);
        if (!res.ok) throw new Error("Failed to load houses");
        return res.json();
      },
      async create(payload: {
        lat: number;
        lng: number;
        properties?: Record<string, any>;
      }): Promise<House> {
        const res = await fetch(`${API_BASE}/api/places`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "" }));
          throw new Error(data.error || "Failed to create house");
        }
        return res.json();
      },
      async remove(id: string): Promise<void> {
        const res = await fetch(`${API_BASE}/api/places/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) throw new Error("Failed to delete house");
      },
    };
  }, [API_BASE]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const data = await api.list();
        if (!cancelled) setHouses(data);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.trim()) {
      const results = houses.filter(house => 
        house.properties?.suburb?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      
      // Auto-zoom to first result if available
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedLocation({
          lat: firstResult.lat,
          lng: firstResult.lng,
          zoom: 15 // Zoom in closer when searching
        });
      }
    } else {
      setSearchResults([]);
      setSelectedLocation(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedLocation(null);
  };

  // Update search results when houses data changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = houses.filter(house => 
        house.properties?.suburb?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [houses, searchTerm]);

  return (
    <div className="map-page">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Map Places</h1>
            <div className="hint">Click on the map to add a place.</div>
          </div>
        </div>
      </header>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search suburb..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-search-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.slice(0, 5).map((house, index) => (
              <div
                key={house.id}
                className="search-result-item"
                onClick={() => {
                  setSelectedLocation({
                    lat: house.lat,
                    lng: house.lng,
                    zoom: 15
                  });
                  setSearchTerm(house.properties?.suburb || "");
                  setSearchResults([]);
                }}
              >
                {house.properties?.suburb} - {house.properties?.projectApplicant}
              </div>
            ))}
          </div>
        )}
      </div>
      <MapContainer 
        center={[-33.8688, 151.2093]} 
        zoom={10} 
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickToAdd onClick={(coords) => {
          setConfirmationCoords(coords);
          setShowConfirmation(true);
        }} />
        
        {selectedLocation && (
          <MapZoomToLocation 
            lat={selectedLocation.lat} 
            lng={selectedLocation.lng} 
            zoom={selectedLocation.zoom} 
          />
        )}

        {pending && (
          <Marker position={[pending.lat, pending.lng]}>
            <Popup>
              <AddForm
                latlng={pending}
                onCancel={() => setPending(null)}
                onSaved={(house) => {
                  setHouses((prev) => [house, ...prev]);
                  setPending(null);
                }}
                create={api.create}
              />
            </Popup>
          </Marker>
        )}

        {houses.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <div className="popup">
                <div className="popup-title">Location</div>
                {p.properties && (
                  <div className="popup-props">
                    {renderProperties(p.properties)}
                  </div>
                )}
                <div className="popup-actions">
                  <a
                    href={`https://www.google.com/maps?q=${p.lat},${p.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-link"
                  >
                    Open in Google Maps
                  </a>
                  <button
                    className="btn btn-danger"
                    onClick={async () => {
                      if (!confirm("Delete this place?")) return;
                      try {
                        await api.remove(p.id);
                        setHouses((prev) => prev.filter((x) => x.id !== p.id));
                      } catch (err) {
                        // eslint-disable-next-line no-alert
                        alert((err as Error).message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {isLoading && <div className="loading">Loading houses…</div>}
      
      <ConfirmationDialog
        isOpen={showConfirmation}
        coordinates={confirmationCoords}
        onConfirm={() => {
          if (confirmationCoords) {
            setPending(confirmationCoords);
          }
          setShowConfirmation(false);
          setConfirmationCoords(null);
        }}
        onCancel={() => {
          setShowConfirmation(false);
          setConfirmationCoords(null);
        }}
      />
    </div>
  );
}

function AddForm({
  latlng,
  onCancel,
  onSaved,
  create,
}: {
  latlng: LatLng;
  onCancel: () => void;
  onSaved: (house: House) => void;
  create: (payload: { lat: number; lng: number; properties?: Record<string, any> }) => Promise<House>;
}) {
  const [fundingAgreementStatus, setFundingAgreementStatus] = useState("");
  const [projectApplicant, setProjectApplicant] = useState("");
  const [totalDwellings, setTotalDwellings] = useState("");
  const [stateField, setStateField] = useState("");
  const [suburb, setSuburb] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="add-form"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          setSaving(true);
          const created = await create({
            lat: latlng.lat,
            lng: latlng.lng,
            properties: buildProperties({
              fundingAgreementStatus,
              projectApplicant,
              totalDwellings,
              stateField,
              suburb,
              projectStatus,
            }),
          });
          onSaved(created);
        } catch (err) {
          // eslint-disable-next-line no-alert
          alert((err as Error).message);
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="field">
        <label>Funding Agreement Status</label>
        <input value={fundingAgreementStatus} onChange={(e) => setFundingAgreementStatus(e.target.value)} placeholder="e.g. Approved / Pending" />
      </div>
      <div className="field">
        <label>Project applicant</label>
        <input value={projectApplicant} onChange={(e) => setProjectApplicant(e.target.value)} placeholder="Applicant name" />
      </div>
      <div className="field">
        <label>Total dwellings proposed</label>
        <input value={totalDwellings} onChange={(e) => setTotalDwellings(e.target.value)} placeholder="e.g. 25" />
      </div>
      <div className="field">
        <label>State</label>
        <input value={stateField} onChange={(e) => setStateField(e.target.value)} placeholder="e.g. NSW" />
      </div>
      <div className="field">
        <label>Suburb</label>
        <input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Parramatta" />
      </div>
      <div className="field">
        <label>Project Status</label>
        <input value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} placeholder="e.g. Under construction" />
      </div>
      <div className="row">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function buildProperties(input: {
  fundingAgreementStatus: string;
  projectApplicant: string;
  totalDwellings: string;
  stateField: string;
  suburb: string;
  projectStatus: string;
}) {
  const props: Record<string, string> = {};
  if (input.fundingAgreementStatus.trim()) props["fundingAgreementStatus"] = input.fundingAgreementStatus.trim();
  if (input.projectApplicant.trim()) props["projectApplicant"] = input.projectApplicant.trim();
  if (input.totalDwellings.trim()) props["totalDwellingsProposed"] = input.totalDwellings.trim();
  if (input.stateField.trim()) props["state"] = input.stateField.trim();
  if (input.suburb.trim()) props["suburb"] = input.suburb.trim();
  if (input.projectStatus.trim()) props["projectStatus"] = input.projectStatus.trim();
  return Object.keys(props).length ? props : undefined;
}

function renderProperties(properties: Record<string, any>) {
  const labels: Record<string, string> = {
    fundingAgreementStatus: "Funding Agreement Status",
    status: "Funding Agreement Status",
    projectApplicant: "Project applicant",
    organizationName: "Project applicant",
    totalDwellingsProposed: "Total dwellings proposed",
    numericalId: "Total dwellings proposed",
    state: "State",
    suburb: "Suburb",
    projectStatus: "Project Status",
    projectStage: "Project Status",
  };
  const entries = Object.entries(properties).filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "");
  if (!entries.length) return null;
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {entries.map(([key, value]) => (
        <div key={key} style={{ display: "grid", gap: 2 }}>
          <div style={{ fontSize: 12, color: "#9fb0d9" }}>{labels[key] || key}</div>
          <div>{String(value)}</div>
        </div>
      ))}
    </div>
  );
}


