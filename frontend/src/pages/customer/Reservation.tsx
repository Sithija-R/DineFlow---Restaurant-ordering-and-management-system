import React, { useState } from 'react';
import { useDineFlow } from '../../context/DineFlowContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Award,
  Sun,
  ShieldAlert
} from 'lucide-react';

const seatingAreas = [
  { id: 'Main Hall', label: 'Main Dining Hall', desc: 'Warm ambiance with live music', icon: Award },
  { id: 'Patio Outdoor', label: 'Garden Patio', desc: 'Alfresco dining under fairy lights', icon: Sun },
  { id: 'VIP Lounge', label: 'VIP Private Lounge', desc: 'Plush seating & dedicated service', icon: Sparkles },
  { id: 'Rooftop Deck', label: 'Rooftop Skylounge', desc: 'Panoramas & handcrafted cocktails', icon: MapPin }
];

export default function Reservation() {
  const { createReservation, reservations } = useDineFlow();

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Main Hall');
  const [specialNotes, setSpecialNotes] = useState('');
  const [confirmedRes, setConfirmedRes] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !phone) {
      alert('Please provide your name and phone number for table confirmation.');
      return;
    }

    const created = createReservation({
      guestName,
      email,
      phone,
      date,
      time,
      guests,
      seatingArea,
      specialNotes
    });

    setConfirmedRes(created);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Table Reservations
          </div>
          <h1 className="text-4xl font-extrabold text-white">Reserve Your Dining Table</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Experience exceptional culinary artistry. Reserve a table in advance to guarantee an unforgettable evening.
          </p>
        </div>

        {/* Confirmation Modal Overlay if created */}
        {confirmedRes ? (
          <div className="bg-slate-900/90 rounded-3xl p-8 border border-emerald-500/40 text-center space-y-4 max-w-lg mx-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Reservation Confirmed!</h2>
            <p className="text-xs text-slate-300">
              We look forward to hosting you, <strong className="text-white">{confirmedRes.guestName}</strong>.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Confirmation ID:</span>
                <strong className="text-orange-400">{confirmedRes.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <strong className="text-white">{confirmedRes.date} at {confirmedRes.time}</strong>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <strong className="text-white">{confirmedRes.guests} Person(s)</strong>
              </div>
              <div className="flex justify-between">
                <span>Seating Section:</span>
                <strong className="text-white">{confirmedRes.seatingArea}</strong>
              </div>
            </div>

            <button
              onClick={() => setConfirmedRes(null)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column Form */}
            <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              
              {/* Guest Count */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Number of Guests
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                        guests === num
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500/50"
                    >
                      {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
                        <option key={t} value={t}>
                          {t} PM
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seating Area Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Preferred Seating Ambience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {seatingAreas.map((area) => {
                    const Icon = area.icon;
                    const selected = seatingArea === area.id;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => setSeatingArea(area.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          selected
                            ? 'bg-orange-500/10 border-orange-500 text-white ring-1 ring-orange-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${selected ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{area.label}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{area.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Contact Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Special Occasions / Notes</label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Birthday celebration, anniversary, highchair needed..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                Confirm Table Reservation
              </button>

            </div>

            {/* Right Column: Existing Reservations & Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-orange-400" />
                  Upcoming Reservations Log
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{res.guestName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            res.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>📅 {res.date}</span>
                        <span>⏰ {res.time}</span>
                        <span>👥 {res.guests} guests</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Area: {res.seatingArea}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy note */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Reservation Policy
                </h4>
                <p className="text-[11px]">
                  Tables are held for up to 15 minutes past scheduled reservation time. For group parties larger than 10, please contact our events team.
                </p>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
