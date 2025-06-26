"use client";
import { useRef, useState } from "react";
import Papa from "papaparse";
import { Product } from "@/lib/mockProducts";

interface InventorySyncProps {
  onSync: (updates: { id: string; stock: number }[]) => void;
}

export default function InventorySync({ onSync }: InventorySyncProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ id: string; stock: number }[]>([]);
  const [error, setError] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const updates = (results.data as any[]).map(row => ({
          id: row.id,
          stock: Number(row.stock),
        })).filter(r => r.id && !isNaN(r.stock));
        setPreview(updates);
      },
      error: (err) => setError(err.message),
    });
  };

  return (
    <div className="mb-6">
      <label className="font-semibold mb-2 block">Inventory Sync (CSV)</label>
      <input
        type="file"
        accept=".csv"
        ref={fileInput}
        onChange={handleFile}
        className="mb-2"
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {preview.length > 0 && (
        <>
          <div className="mb-2">Preview:</div>
          <table className="w-full mb-2">
            <thead>
              <tr><th>ID</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {preview.map(row => (
                <tr key={row.id}><td>{row.id}</td><td>{row.stock}</td></tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" onClick={() => onSync(preview)}>Sync Inventory</button>
        </>
      )}
    </div>
  );
} 