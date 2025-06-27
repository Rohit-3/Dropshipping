"use client";
import { useState } from "react";
import Papa from "papaparse";

interface InventorySyncProps {
  onSync: (updates: { id: string; stock: number }[]) => void;
}

export default function InventorySync({ onSync }: InventorySyncProps) {
  const [preview, setPreview] = useState<{ id: string; stock: number }[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    if (preview.length === 0) {
      setError("No items to sync");
      return;
    }
    setSyncing(true);
    onSync(preview);
    setSuccess("Inventory synced successfully!");
    setPreview([]);
    setSyncing(false);
  };

  return (
    <div className="bg-white rounded shadow-lg p-6 mt-8 animate-fade-in">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Inventory Sync</h2>
      {syncing ? (
        <div className="text-blue-600">Syncing inventory...</div>
      ) : (
        <button className="btn btn-primary" onClick={handleSync}>Sync Inventory</button>
      )}
      {error && <div className="text-red-500 mt-2 animate-shake">{error}</div>}
      {success && <div className="text-green-600 mt-2 animate-fade-in">{success}</div>}
    </div>
  );
} 