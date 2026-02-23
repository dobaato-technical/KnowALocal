"use client";

import {
  createShift,
  deleteShift,
  getAllShifts,
  updateShift,
  type Shift,
} from "@/api";
import Button from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "10:00:00",
    endTime: "20:00:00",
    type: "hourly" as "whole_day" | "hourly",
    isActive: true,
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch shifts on mount
  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    setLoading(true);
    const response = await getAllShifts();
    if (response.success) {
      setShifts(response.data || []);
    } else {
      console.error("Failed to fetch shifts:", response.message);
    }
    setLoading(false);
  };

  const handleEdit = (shift: Shift) => {
    setEditingId(shift.id);
    setFormData({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type,
      isActive: shift.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this shift?")) {
      const response = await deleteShift(id);
      if (response.success) {
        setShifts(shifts.filter((s) => s.id !== id));
        alert("Shift deleted successfully");
      } else {
        alert("Failed to delete shift");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a shift name");
      return;
    }

    if (editingId) {
      // Update existing shift
      const response = await updateShift(editingId, formData);
      if (response.success && response.data) {
        setShifts(shifts.map((s) => (s.id === editingId ? response.data! : s)));
        alert("Shift updated successfully");
      } else {
        alert("Failed to update shift");
      }
    } else {
      // Create new shift
      const response = await createShift(formData);
      if (response.success && response.data) {
        setShifts([response.data, ...shifts]);
        alert("Shift created successfully");
      } else {
        alert("Failed to create shift");
      }
    }

    // Reset form
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      startTime: "10:00:00",
      endTime: "20:00:00",
      type: "hourly",
      isActive: true,
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      startTime: "10:00:00",
      endTime: "20:00:00",
      type: "hourly",
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-secondary/70">Loading shifts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Manage Shifts
            </h1>
            <p className="text-secondary/70">
              Create and manage work shifts for your team
            </p>
          </div>
          <Button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Shift"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#bcd2c2]/30">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {editingId ? "Edit Shift" : "Create New Shift"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Shift Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Morning Shift, Shift 1"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "whole_day" | "hourly",
                      })
                    }
                    className="w-full px-3 py-2 border border-[#bcd2c2]/30 rounded-lg bg-white text-secondary"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="whole_day">Whole Day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={formData.startTime.substring(0, 5)}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={formData.endTime.substring(0, 5)}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-secondary"
                >
                  Active
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {editingId ? "Update Shift" : "Create Shift"}
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  className="bg-secondary/20 hover:bg-secondary/30 text-secondary"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Shifts Table */}
        {shifts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-[#bcd2c2]/30">
            <p className="text-secondary/70 text-lg mb-4">No shifts found</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-accent hover:bg-accent/90"
            >
              Create First Shift
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#bcd2c2]/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8f1dd]/40 border-b border-[#bcd2c2]/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Shift Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Start Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      End Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr
                      key={shift.id}
                      className="border-b border-[#bcd2c2]/20 hover:bg-[#f8f1dd]/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-secondary">
                        {shift.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary">
                        {shift.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {shift.type === "whole_day" ? "Whole Day" : "Hourly"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {shift.startTime}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {shift.endTime}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            shift.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {shift.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary/70">
                        {new Date(shift.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(shift)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          title="Edit shift"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          title="Delete shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {shifts.length > 0 && (
          <div className="mt-6 bg-[#f8f1dd]/40 rounded-lg p-4 border border-[#bcd2c2]/30">
            <p className="text-sm text-secondary/70">
              <strong className="text-secondary">{shifts.length}</strong> shift
              {shifts.length !== 1 ? "s" : ""} total |{" "}
              <strong className="text-secondary">
                {shifts.filter((s) => s.isActive).length}
              </strong>{" "}
              active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
