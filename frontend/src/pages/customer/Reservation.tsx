import React, { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Phone,
  Search,
  User,
} from "lucide-react";

import { useReservationStore } from "../../stores/reservationStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

import type { ReservationResponse } from "../../types/reservation";

export default function Reservation() {
  const {
    tables,
    reservations,
    loading,
    selectedReservation,
    fetchTables,
    fetchReservationsByDate,
    createReservation,
    clearSelectedReservation,
    clearError,
    fetchReservationByReference,
  } = useReservationStore();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("20:00");
  const [tableId, setTableId] = useState("");

  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [reservationReference, setReservationReference] =
    useState("");

  const [searchedReservation, setSearchedReservation] =
    useState<ReservationResponse | null>(null);

  const [searching, setSearching] = useState(false);

  // ========================================
  // SAFELY HANDLE API DATA
  // ========================================
  //
  // Prevents:
  // "filter is not a function"
  // "map is not a function"
  //
  const safeTables = Array.isArray(tables) ? tables : [];
  const safeReservations = Array.isArray(reservations)
    ? reservations
    : [];

  // ========================================
  // Load all restaurant tables
  // ========================================

  useEffect(() => {
    fetchTables().catch((error) => {
      console.error("Failed to load tables:", error);

      toast.add({
        title: "Failed to load tables",
        description:
          error instanceof Error
            ? error.message
            : "Unable to load tables.",
        type: "error",
      });
    });
  }, [fetchTables]);

  // ========================================
  // Load reservations for selected date
  // ========================================

  useEffect(() => {
    if (!date) {
      return;
    }

    setCheckingAvailability(true);

    fetchReservationsByDate(date)
      .catch((error) => {
        console.error(
          "Failed to load reservations:",
          error
        );

        toast.add({
          title: "Failed to check availability",
          description:
            error instanceof Error
              ? error.message
              : "Unable to load reservations.",
          type: "error",
        });
      })
      .finally(() => {
        setCheckingAvailability(false);
      });
  }, [date, fetchReservationsByDate]);

  // ========================================
  // Calculate available tables
  // ========================================

  const availableTables = useMemo(() => {
    if (!date || !startTime || !endTime) {
      return [];
    }

    if (endTime <= startTime) {
      return [];
    }

    // Reservations that actually block a table
    const activeReservations = safeReservations.filter(
      (reservation) =>
        reservation.status === "PENDING" ||
        reservation.status === "CONFIRMED"
    );

    // Find table IDs that have overlapping reservations
    const blockedTableIds = activeReservations
      .filter((reservation) => {
        /*
         * Overlap condition:
         *
         * existing.start < requested.end
         * AND
         * existing.end > requested.start
         *
         * Example:
         *
         * Existing: 19:00 - 20:00
         *
         * 19:30 - 20:30 => overlap
         * 19:00 - 20:00 => overlap
         * 18:00 - 19:00 => no overlap
         * 20:00 - 21:00 => no overlap
         */

        return (
          reservation.startTime < endTime &&
          reservation.endTime > startTime
        );
      })
      .map((reservation) => reservation.tableId);

    // Return only tables that are not blocked
    return safeTables.filter(
      (table) => !blockedTableIds.includes(table.id)
    );
  }, [
    safeTables,
    safeReservations,
    date,
    startTime,
    endTime,
  ]);

  // ========================================
  // Clear selected table when time changes
  // ========================================

  useEffect(() => {
    setTableId("");
  }, [date, startTime, endTime]);

  // ========================================
  // Generate time slots
  // ========================================

  const timeSlots = useMemo(() => {
    const slots: string[] = [];

    for (let hour = 11; hour <= 22; hour++) {
      for (const minute of [0, 30]) {
        if (hour === 22 && minute > 0) {
          continue;
        }

        slots.push(
          `${String(hour).padStart(2, "0")}:${String(
            minute
          ).padStart(2, "0")}`
        );
      }
    }

    return slots;
  }, []);

  // ========================================
  // Create reservation
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    clearError();

    // ----------------------------------------
    // Validate customer name
    // ----------------------------------------

    if (!customerName.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter your full name.",
        type: "warning",
      });

      return;
    }

    // ----------------------------------------
    // Validate phone number
    // ----------------------------------------

    if (!phoneNumber.trim()) {
      toast.add({
        title: "Phone number required",
        description: "Please enter your phone number.",
        type: "warning",
      });

      return;
    }

    // ----------------------------------------
    // Validate date
    // ----------------------------------------

    if (!date) {
      toast.add({
        title: "Date required",
        description:
          "Please select a reservation date.",
        type: "warning",
      });

      return;
    }

    // ----------------------------------------
    // Validate time
    // ----------------------------------------

    if (!startTime || !endTime) {
      toast.add({
        title: "Time required",
        description:
          "Please select a start and end time.",
        type: "warning",
      });

      return;
    }

    if (endTime <= startTime) {
      toast.add({
        title: "Invalid time",
        description:
          "End time must be later than the start time.",
        type: "warning",
      });

      return;
    }

    // ----------------------------------------
    // Validate table
    // ----------------------------------------

    if (!tableId) {
      toast.add({
        title: "Table required",
        description: "Please select a table.",
        type: "warning",
      });

      return;
    }

    // ----------------------------------------
    // Make sure selected table is still
    // available before submitting
    // ----------------------------------------

    const selectedTableIsAvailable =
      availableTables.some(
        (table) => table.id === Number(tableId)
      );

    if (!selectedTableIsAvailable) {
      toast.add({
        title: "Table unavailable",
        description:
          "The selected table is no longer available for this time.",
        type: "warning",
      });

      setTableId("");

      return;
    }

    // ========================================
    // Create Reservation
    // ========================================

    try {
      await createReservation({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        date,
        startTime,
        endTime,
        tableId: Number(tableId),
      });

      toast.add({
        title: "Reservation submitted",
        description:
          "Your table reservation has been submitted successfully.",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Failed to create reservation:",
        error
      );

      toast.add({
        title: "Reservation failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create reservation.",
        type: "error",
      });
    }
  };

  // ========================================
  // Search reservation by reference
  // ========================================

  const handleSearchReservation = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!reservationReference.trim()) {
      toast.add({
        title: "Reference required",
        description:
          "Please enter your reservation reference.",
        type: "warning",
      });

      return;
    }

    try {
      setSearching(true);
      setSearchedReservation(null);

      const reservation =
        await fetchReservationByReference(
          reservationReference.trim().toUpperCase()
        );

      setSearchedReservation(reservation);

      toast.add({
        title: "Reservation found",
        description:
          "Your reservation details have been loaded.",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Failed to find reservation:",
        error
      );

      toast.add({
        title: "Reservation not found",
        description:
          error instanceof Error
            ? error.message
            : "Unable to find the reservation.",
        type: "error",
      });
    } finally {
      setSearching(false);
    }
  };

  // ========================================
  // Reservation submitted successfully
  // ========================================

  if (selectedReservation) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
        <div className="mx-auto max-w-lg">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="pt-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>

              <h2 className="text-2xl font-bold">
                Reservation Submitted
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Your reservation has been submitted
                successfully.
              </p>

              <div className="mt-6 space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Reservation
                  </span>

                  <span className="font-semibold text-orange-400">
                    {
                      selectedReservation.reservationReference
                    }
                  </span>
                </div>

                <Separator className="bg-slate-800" />

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Name
                  </span>

                  <span>
                    {selectedReservation.customerName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Date
                  </span>

                  <span>
                    {selectedReservation.date}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Time
                  </span>

                  <span>
                    {selectedReservation.startTime} -{" "}
                    {selectedReservation.endTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Table
                  </span>

                  <span>
                    Table {selectedReservation.tableNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Status
                  </span>

                  <span className="font-semibold text-amber-400">
                    {selectedReservation.status}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  clearSelectedReservation();

                  setCustomerName("");
                  setPhoneNumber("");
                  setTableId("");
                  setStartTime("19:00");
                  setEndTime("20:00");
                  setSearchedReservation(null);
                  setReservationReference("");
                }}
              >
                Make Another Reservation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ========================================
  // Reservation Form
  // ========================================

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Table Reservations
          </div>

          <h1 className="text-4xl font-extrabold">
            Reserve Your Table
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Choose your preferred date, time and table.
          </p>
        </div>

        {/* ========================================
            Reservation Status Lookup
        ======================================== */}

        <Card className="mb-6 border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-400" />
              Check Reservation Status
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSearchReservation}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={reservationReference}
                onChange={(e) =>
                  setReservationReference(e.target.value)
                }
                placeholder="Enter reservation reference (e.g. RES-A1B2C3D4)"
                className="border-slate-800 bg-slate-950"
              />

              <Button
                type="submit"
                disabled={searching}
                className="bg-orange-500 hover:bg-orange-600 sm:w-40"
              >
                {searching
                  ? "Searching..."
                  : "Check Status"}
              </Button>
            </form>

            {searchedReservation && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Reservation Reference
                    </p>

                    <p className="font-bold text-orange-400">
                      {
                        searchedReservation.reservationReference
                      }
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      searchedReservation.status ===
                      "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : searchedReservation.status ===
                            "CANCELLED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {searchedReservation.status}
                  </span>
                </div>

                <Separator className="mb-4 bg-slate-800" />

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">
                      Customer
                    </p>

                    <p>
                      {searchedReservation.customerName}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Table
                    </p>

                    <p>
                      Table {searchedReservation.tableNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Date
                    </p>

                    <p>{searchedReservation.date}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Time
                    </p>

                    <p>
                      {searchedReservation.startTime} -{" "}
                      {searchedReservation.endTime}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ========================================
            Reservation Form
        ======================================== */}

        <form onSubmit={handleSubmit}>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>
                Reservation Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* CUSTOMER DETAILS */}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Name */}

                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      Full Name
                    </Label>

                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                      <Input
                        id="customerName"
                        value={customerName}
                        onChange={(e) =>
                          setCustomerName(e.target.value)
                        }
                        placeholder="John Doe"
                        required
                        className="border-slate-800 bg-slate-950 pl-10"
                      />
                    </div>
                  </div>

                  {/* Phone */}

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Phone Number
                    </Label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value)
                        }
                        placeholder="0771234567"
                        required
                        className="border-slate-800 bg-slate-950 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* DATE & TIME */}

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-300">
                  Date & Time
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  {/* Date */}

                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date
                    </Label>

                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

                      <Input
                        id="date"
                        type="date"
                        value={date}
                        min={new Date()
                          .toISOString()
                          .split("T")[0]}
                        onChange={(e) =>
                          setDate(e.target.value)
                        }
                        required
                        className="border-slate-800 bg-slate-950 pl-10"
                      />
                    </div>
                  </div>

                  {/* Start Time */}

                  <div className="space-y-2">
                    <Label>Start Time</Label>

                    <Select
                      value={startTime}
                      onValueChange={setStartTime}
                    >
                      <SelectTrigger className="border-slate-800 bg-slate-950">
                        <Clock className="mr-2 h-4 w-4 text-slate-500" />

                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="bg-slate-800">
                        {timeSlots
                          .slice(0, -1)
                          .map((time) => (
                            <SelectItem
                              key={time}
                              value={time}
                              className="cursor-pointer hover:bg-slate-500"
                            >
                              {time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* End Time */}

                  <div className="space-y-2">
                    <Label>End Time</Label>

                    <Select
                      value={endTime}
                      onValueChange={setEndTime}
                    >
                      <SelectTrigger className="border-slate-800 bg-slate-950">
                        <Clock className="mr-2 h-4 w-4 text-slate-500" />

                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent className="bg-slate-800">
                        {timeSlots
                          .filter(
                            (time) => time > startTime
                          )
                          .map((time) => (
                            <SelectItem
                              key={time}
                              value={time}
                              className="cursor-pointer hover:bg-slate-500"
                            >
                              {time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-800" />

              {/* TABLE SELECTION */}

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300">
                    Select a Table
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Available tables are calculated from
                    existing reservations for your
                    selected date and time.
                  </p>
                </div>

                {checkingAvailability ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
                    Checking table availability...
                  </div>
                ) : !date ||
                  !startTime ||
                  !endTime ||
                  endTime <= startTime ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
                    Please select a valid date and time.
                  </div>
                ) : availableTables.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
                    No tables are available for this
                    date and time.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {availableTables.map((table) => (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() =>
                          setTableId(String(table.id))
                        }
                        className={`rounded-xl border p-4 text-center transition ${
                          tableId === String(table.id)
                            ? "border-orange-500 bg-orange-500/10 text-orange-400"
                            : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="text-lg font-bold">
                          {table.tableNumber}
                        </div>

                        <div className="text-xs text-slate-500">
                          Table
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SUBMIT */}

              <Button
                type="submit"
                disabled={
                  loading ||
                  checkingAvailability ||
                  !customerName.trim() ||
                  !phoneNumber.trim() ||
                  !tableId ||
                  endTime <= startTime ||
                  availableTables.length === 0
                }
                className="w-full bg-orange-500 py-6 font-bold hover:bg-orange-600"
              >
                {loading
                  ? "Submitting Reservation..."
                  : checkingAvailability
                    ? "Checking Availability..."
                    : "Confirm Table Reservation"}
              </Button>

            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

