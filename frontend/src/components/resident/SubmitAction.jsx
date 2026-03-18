import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { actionAPI, actionTypesAPI } from "../../services/api.js";
import {
  Send,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Camera,
  Video,
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function SubmitAction() {
  const navigate = useNavigate();

  const [actionTypes, setActionTypes] = useState([]);
  const [formData, setFormData] = useState({
    actionTypeId: "",
    description: "",
    proof_url: "",
  });

  const [timestampISO, setTimestampISO] = useState(() => new Date().toISOString());
  const [timestampHuman, setTimestampHuman] = useState(() => new Date().toLocaleString());
  const [location, setLocation] = useState(null);
  const [locError, setLocError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [cameraOn, setCameraOn] = useState(false);
  const [recording, setRecording] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadActionTypes();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimestampISO(now.toISOString());
      setTimestampHuman(now.toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocError("Geolocation not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLocError("");
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setLocError(err.message || "Location permission denied.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();

      if (photoPreview) URL.revokeObjectURL(photoPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [photoPreview, videoPreview]);

  const loadActionTypes = async () => {
    try {
      const response = await actionTypesAPI.getAll();
      setActionTypes(response.data || []);
    } catch (err) {
      console.error("Failed to load action types:", err);
    }
  };

  const selectedType =
    formData.actionTypeId &&
    actionTypes.find((t) => String(t.id) === String(formData.actionTypeId));

  const mapCenter = useMemo(() => {
    if (!location) return [51.5074, -0.1278];
    return [location.lat, location.lng];
  }, [location]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
    } catch (error) {
      alert("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    const stream = streamRef.current;
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    recorderRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setRecording(false);
  };

  const capturePhoto = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth || 1280;
    canvas.height = videoEl.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `evidence-photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        if (photoPreview) URL.revokeObjectURL(photoPreview);

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
      },
      "image/jpeg",
      0.92
    );
  };

  const startRecording = () => {
    const stream = streamRef.current;

    if (!stream) {
      alert("Start camera first.");
      return;
    }

    try {
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], `evidence-video-${Date.now()}.webm`, {
          type: "video/webm",
        });

        if (videoPreview) URL.revokeObjectURL(videoPreview);

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      };

      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch (error) {
      alert("Video recording not supported in this browser.");
    }
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    setRecording(false);
  };

  const clearEvidence = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setPhotoFile(null);
    setPhotoPreview("");
    setVideoFile(null);
    setVideoPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      // backend-friendly field name
      fd.append("actionTypeId", formData.actionTypeId);
      fd.append("description", formData.description);
      fd.append("proof_url", formData.proof_url || "");

      fd.append("timestamp_iso", timestampISO);
      fd.append("timestamp_human", timestampHuman);

      if (location) {
        fd.append("lat", String(location.lat));
        fd.append("lng", String(location.lng));
        fd.append("accuracy", String(location.accuracy || ""));
      }

      // IMPORTANT: backend expects upload.array("files", 8)
      if (photoFile) fd.append("files", photoFile);
      if (videoFile) fd.append("files", videoFile);

      await actionAPI.submit(fd);

      setSuccess(true);
      setTimeout(() => navigate("/my-actions"), 1500);
    } catch (err) {
      alert(
        err?.response?.data?.error ||
          "Failed to submit action. Please check backend multipart upload handling."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container">
        <div className="success-screen">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>Action Submitted Successfully! 🎉</h2>
          <p>Your submission is being reviewed by our admin team.</p>
          <p className="text-muted">Redirecting to your actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Submit New Action</h1>
        <p>Share your community contribution and earn respect points</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label>
              <FileText size={18} />
              <span>Action Type *</span>
            </label>

            <select
              value={formData.actionTypeId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  actionTypeId: e.target.value,
                }))
              }
              required
            >
              <option value="">Select an action type</option>
              {actionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title} ({type.pointsAwarded ?? type.points ?? 0} points)
                </option>
              ))}
            </select>

            {selectedType?.description && (
              <p className="field-hint">{selectedType.description}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              <FileText size={18} />
              <span>Description *</span>
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what you did and how it helped the community..."
              rows={5}
              required
            />

            <p className="field-hint">Be specific about your contribution</p>
          </div>

          <div className="form-group">
            <label>
              <ImageIcon size={18} />
              <span>Proof URL (optional)</span>
            </label>

            <input
              type="url"
              value={formData.proof_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proof_url: e.target.value,
                }))
              }
              placeholder="https://example.com/proof-image.jpg"
            />

            <p className="field-hint">
              Link to photo or document proving your action
            </p>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <div>
                <h3>Live Evidence</h3>
                <p>Location + timestamp captured automatically</p>
              </div>
            </div>

            <div className="card-content">
              <div className="actions-list">
                <div className="action-item">
                  <div className="action-info">
                    <h4>Timestamp</h4>
                    <div className="action-date">{timestampHuman}</div>
                    <div className="action-date">{timestampISO}</div>
                  </div>
                </div>

                <div className="action-item">
                  <div className="action-info">
                    <h4>Live Location</h4>

                    {locError ? (
                      <div
                        className="action-date"
                        style={{ color: "var(--danger)" }}
                      >
                        {locError}
                      </div>
                    ) : location ? (
                      <>
                        <div className="action-date">
                          Lat: {location.lat.toFixed(6)} | Lng:{" "}
                          {location.lng.toFixed(6)}
                        </div>
                        <div className="action-date">
                          Accuracy: ~{Math.round(location.accuracy || 0)}m
                        </div>
                      </>
                    ) : (
                      <div className="action-date">Getting location...</div>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={15}
                  style={{ height: 260, width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {location && (
                    <>
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>You are here</Popup>
                      </Marker>

                      <Circle
                        center={[location.lat, location.lng]}
                        radius={Math.max(10, location.accuracy || 30)}
                        pathOptions={{}}
                      />
                    </>
                  )}
                </MapContainer>
              </div>

              <p className="field-hint" style={{ marginTop: 10 }}>
                Tip: On mobile, allow location permission. For deployed version,
                use HTTPS.
              </p>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <div>
                <h3>Capture Evidence</h3>
                <p>Photo + video can be recorded directly</p>
              </div>
            </div>

            <div className="card-content">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--bg-tertiary)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 12,
                }}
              >
                {!cameraOn ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={startCamera}
                  >
                    <Camera size={18} /> Start Camera
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={stopCamera}
                  >
                    Stop Camera
                  </button>
                )}

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={capturePhoto}
                  disabled={!cameraOn}
                >
                  Capture Photo
                </button>

                {!recording ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={startRecording}
                    disabled={!cameraOn}
                  >
                    <Video size={18} /> Start Video
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={stopRecording}
                  >
                    Stop Video
                  </button>
                )}

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={clearEvidence}
                >
                  Clear Evidence
                </button>
              </div>

              <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                {photoPreview && (
                  <div>
                    <p className="field-hint">Captured Photo:</p>
                    <img
                      src={photoPreview}
                      alt="Evidence"
                      style={{
                        width: "100%",
                        maxHeight: 280,
                        objectFit: "cover",
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                )}

                {videoPreview && (
                  <div>
                    <p className="field-hint">Recorded Video:</p>
                    <video
                      src={videoPreview}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                      }}
                    />
                  </div>
                )}
              </div>

              <p className="field-hint" style={{ marginTop: 10 }}>
                Note: camera and recording require permissions. Localhost is
                fine; production should be HTTPS.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="btn-primary" disabled={loading}>
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Action"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}