import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDineFlow, type ReservationStatus } from '../../context/DineFlowContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  ArrowLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone,
  Sparkles,
  Check
} from 'lucide-react';

export default function ReservationManagement() {
  const { reservations, updateReservationStatus, createReservation } = useDineFlow();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newRes, setNewRes] = useState({
    guestName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: 2,
    seatingArea: 'Main Hall',
    specialNotes: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newRes.guestName || !newRes.phone) return;
    createReservation(newRes);
    setIsAddModalOpen(false);
    setNewRes({
      guestName: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      guests: 2,
      seatingArea: 'Main Hall',
      specialNotes: ''
    });
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">Table Reservation Management</h1>
              <p className="text-xs text-slate-400">View upcoming table bookings and seat guests</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4" />
            Book Table (Manual)
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guest, ID, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Confirmed', 'Seated', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  statusFilter === st
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reservation Table */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Res ID</th>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Guests</th>
                  <th className="py-3.5 px-4">Seating Section</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 font-bold text-orange-400">{res.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{res.guestName}</td>
                    <td className="py-3 px-4 text-slate-400">{res.phone}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {res.date} at <strong className="text-white">{res.time}</strong>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{res.guests} Persons</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium">
                        {res.seatingArea}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          res.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : res.status === 'Seated'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={res.status}
                        onChange={(e) => updateReservationStatus(res.id, e.target.value as ReservationStatus)}
                        className="bg-slate-950 border border-slate-800 text-[11px] rounded-lg p-1 text-slate-300 focus:outline-none"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Seated">Seated</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Reservation Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 max-w-lg w-full space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                Manual Table Booking (Staff Phone Order)
              </h3>

              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={newRes.guestName}
                    onChange={(e) => setNewRes({ ...newRes, guestName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newRes.phone}
                      onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Guests Count</label>
                    <input
                      type="number"
                      min={1}
                      value={newRes.guests}
                      onChange={(e) => setNewRes({ ...newRes, guests: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={newRes.date}
                      onChange={(e) => setNewRes({ ...newRes, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Time</label>
                    <input
                      type="time"
                      value={newRes.time}
                      onChange={(e) => setNewRes({ ...newRes, time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
