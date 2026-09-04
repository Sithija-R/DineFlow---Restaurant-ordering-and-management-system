import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Table2,
  Loader2,
} from "lucide-react";


import type {
  ReservationRequest,
  ReservationStatus,
} from "../../types/reservation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { useReservationStore } from "@/stores/reservationStore";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const emptyForm: ReservationRequest = {
  date: getToday(),
  startTime: "19:00",
  endTime: "20:00",
  tableId: 0,
  customerName: "",
  phoneNumber: "",
};

export default function ReservationManagement() {
  const {
    tables,
    reservations,
    loading,
    fetchTables,
    fetchAllReservations,
    createReservation,
    updateStatus,
  } = useReservationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReservationStatus>(
    "ALL"
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newRes, setNewRes] = useState<ReservationRequest>(emptyForm);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Load tables and reservations when page opens.
   */
  useEffect(() => {
    fetchTables().catch(() => {
      toast.add({
        title: "Failed to load tables",
        description: "Could not load restaurant tables.",
        type: "error",
      });
    });

    fetchAllReservations().catch(() => {
      toast.add({
        title: "Failed to load reservations",
        description: "Could not load reservations.",
        type: "error",
      });
    });
  }, [fetchTables, fetchAllReservations]);

  /*
   * Tables that are available for the manually selected
   * date and time.
   *
   * Availability is calculated locally using the already
   * fetched tables and reservations.
   */
  const availableTables = useMemo(() => {
    if (
      !newRes.date ||
      !newRes.startTime ||
      !newRes.endTime ||
      newRes.endTime <= newRes.startTime
    ) {
      return [];
    }

    const activeReservations = reservations.filter(
      (reservation) =>
        reservation.date === newRes.date &&
        (reservation.status === "PENDING" ||
          reservation.status === "CONFIRMED") &&
        reservation.startTime < newRes.endTime &&
        reservation.endTime > newRes.startTime
    );

    const blockedTableIds = new Set(
      activeReservations.map((reservation) => reservation.tableId)
    );

    return tables.filter((table) => !blockedTableIds.has(table.id));
  }, [tables, reservations, newRes.date, newRes.startTime, newRes.endTime]);

  /*
   * Clear selected table whenever date/time changes.
   */
  useEffect(() => {
    setNewRes((current) => ({
      ...current,
      tableId: 0,
    }));
  }, [newRes.date, newRes.startTime, newRes.endTime]);

  /*
   * Filter reservations.
   */
  const filteredReservations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const matchesStatus =
        statusFilter === "ALL" || reservation.status === statusFilter;

      const matchesSearch =
        !query ||
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.phoneNumber.toLowerCase().includes(query) ||
        reservation.reservationReference.toLowerCase().includes(query) ||
        String(reservation.tableNumber).includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [reservations, searchQuery, statusFilter]);

  /*
   * Manual reservation submit.
   */
  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newRes.customerName.trim()) {
      toast.add({
        title: "Name required",
        description: "Please enter the customer's name.",
        type: "warning",
      });
      return;
    }

    if (!newRes.phoneNumber.trim()) {
      toast.add({
        title: "Phone number required",
        description: "Please enter the customer's phone number.",
        type: "warning",
      });
      return;
    }

    if (!newRes.date) {
      toast.add({
        title: "Date required",
        description: "Please select a reservation date.",
        type: "warning",
      });
      return;
    }

    if (!newRes.startTime || !newRes.endTime) {
      toast.add({
        title: "Time required",
        description: "Please select a start and end time.",
        type: "warning",
      });
      return;
    }

    if (newRes.endTime <= newRes.startTime) {
      toast.add({
        title: "Invalid time",
        description: "End time must be later than the start time.",
        type: "warning",
      });
      return;
    }

    if (!newRes.tableId) {
      toast.add({
        title: "Table required",
        description: "Please select an available table.",
        type: "warning",
      });
      return;
    }

    /*
     * Final frontend availability check.
     *
     * Backend will perform the real validation again.
     */
    const selectedTableAvailable = availableTables.some(
      (table) => table.id === newRes.tableId
    );

    if (!selectedTableAvailable) {
      toast.add({
        title: "Table unavailable",
        description: "This table is already reserved for the selected time.",
        type: "warning",
      });

      setNewRes((current) => ({
        ...current,
        tableId: 0,
      }));

      return;
    }

    try {
      setIsSubmitting(true);

      await createReservation(newRes);

      toast.add({
        title: "Reservation created",
        description: "The table reservation was successfully created.",
        type: "success",
      });

      setIsAddModalOpen(false);
      setNewRes({
        ...emptyForm,
        date: newRes.date,
      });

      /*
       * Refresh reservations so the new booking immediately
       * appears in the admin table.
       */
      await fetchAllReservations();
    } catch (error: any) {
      toast.add({
        title: "Reservation failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Could not create the reservation.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * Update reservation status.
   */
  const handleStatusChange = async (
    reservationId: number,
    status: ReservationStatus
  ) => {
    try {
      await updateStatus(reservationId, status);

      toast.add({
        title: "Status updated",
        description: `Reservation status changed to ${status}.`,
        type: "success",
      });
    } catch (error: any) {
      toast.add({
        title: "Update failed",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Could not update reservation status.",
        type: "error",
      });
    }
  };

  /*
   * Reservation status badge.
   */
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );

      case "PENDING":
        return (
          <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );

      case "CANCELLED":
        return (
          <Badge className="border-red-500/20 bg-red-500/10 text-red-400">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );

      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation */}
        <Card className="border-slate-800 bg-slate-900/90">
          <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div>
                <h1 className="text-lg font-bold text-white">
                  Table Reservation Management
                </h1>

                <p className="text-xs text-slate-400">
                  View upcoming bookings and manage table reservations
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Book Table
            </Button>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search reference, guest, phone, table..."
              className="border-slate-800 bg-slate-900 pl-10 text-sm text-white placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() =>
                  setStatusFilter(status as "ALL" | ReservationStatus)
                }
                className={
                  statusFilter === status
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              >
                {status === "ALL"
                  ? "All"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Reservation Table */}
        <Card className="overflow-hidden border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-base text-white">Reservations</CardTitle>

            <CardDescription className="text-xs text-slate-400">
              {filteredReservations.length} reservation
              {filteredReservations.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/80 uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5">Reservation</th>

                    <th className="px-4 py-3.5">Guest</th>

                    <th className="px-4 py-3.5">Contact</th>

                    <th className="px-4 py-3.5">Date</th>

                    <th className="px-4 py-3.5">Time</th>

                    <th className="px-4 py-3.5">Table</th>

                    <th className="px-4 py-3.5">Status</th>

                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-orange-400" />

                        <p className="text-slate-400">
                          Loading reservations...
                        </p>
                      </td>
                    </tr>
                  ) : filteredReservations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-slate-500"
                      >
                        No reservations found.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr
                        key={res.id}
                        className="transition-colors hover:bg-slate-950/40"
                      >
                        {/* Reference */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-orange-400">
                            {res.reservationReference}
                          </div>

                          <div className="mt-0.5 text-[10px] text-slate-600">
                            ID #{res.id}
                          </div>
                        </td>

                        {/* Guest */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800">
                              <User className="h-3.5 w-3.5 text-slate-400" />
                            </div>

                            <span className="font-semibold text-white">
                              {res.customerName}
                            </span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3 text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {res.phoneNumber}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                            {res.date}
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Clock className="h-3.5 w-3.5 text-orange-400" />
                            {res.startTime} – {res.endTime}
                          </div>
                        </td>

                        {/* Table */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className="border-slate-700 bg-slate-800 text-slate-300"
                          >
                            <Table2 className="mr-1 h-3 w-3" />
                            Table {res.tableNumber}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {getStatusBadge(res.status)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <Select
                            value={res.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                res.id,
                                value as ReservationStatus
                              )
                            }
                          >
                            <SelectTrigger className="ml-auto h-8 w-[125px] border-slate-700 bg-slate-950 text-[11px] text-slate-300">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent className="border-slate-700 bg-slate-900 text-slate-200">
                              <SelectItem value="PENDING">Pending</SelectItem>

                              <SelectItem value="CONFIRMED">
                                Confirmed
                              </SelectItem>

                              <SelectItem value="CANCELLED">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Manual Reservation Dialog */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="border-slate-800 bg-slate-900 text-slate-100 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                Manual Table Booking
              </DialogTitle>

              <DialogDescription className="text-slate-400">
                Create a reservation on behalf of a customer.
              </DialogDescription>
            </DialogHeader>

            <Separator className="bg-slate-800" />

            <form onSubmit={handleAddSubmit} className="space-y-5">
              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customerName">Guest Name</Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    id="customerName"
                    required
                    value={newRes.customerName}
                    onChange={(event) =>
                      setNewRes({
                        ...newRes,
                        customerName: event.target.value,
                      })
                    }
                    placeholder="Enter guest name"
                    className="border-slate-700 bg-slate-950 pl-10 text-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={newRes.phoneNumber}
                    onChange={(event) =>
                      setNewRes({
                        ...newRes,
                        phoneNumber: event.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                    className="border-slate-700 bg-slate-950 pl-10 text-white"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="reservationDate">Date</Label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                  <Input
                    id="reservationDate"
                    type="date"
                    min={getToday()}
                    value={newRes.date}
                    onChange={(event) =>
                      setNewRes({
                        ...newRes,
                        date: event.target.value,
                      })
                    }
                    className="border-slate-700 bg-slate-950 pl-10 text-white"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>

                  <Input
                    id="startTime"
                    type="time"
                    value={newRes.startTime}
                    onChange={(event) =>
                      setNewRes({
                        ...newRes,
                        startTime: event.target.value,
                      })
                    }
                    className="border-slate-700 bg-slate-950 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>

                  <Input
                    id="endTime"
                    type="time"
                    value={newRes.endTime}
                    onChange={(event) =>
                      setNewRes({
                        ...newRes,
                        endTime: event.target.value,
                      })
                    }
                    className="border-slate-700 bg-slate-950 text-white"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="space-y-2">
                <Label>Table</Label>

                <Select
                  value={newRes.tableId ? String(newRes.tableId) : ""}
                  onValueChange={(value) =>
                    setNewRes({
                      ...newRes,
                      tableId: Number(value),
                    })
                  }
                  disabled={
                    !newRes.date ||
                    !newRes.startTime ||
                    !newRes.endTime ||
                    newRes.endTime <= newRes.startTime ||
                    availableTables.length === 0
                  }
                >
                  <SelectTrigger className="border-slate-700 bg-slate-950 text-white">
                    <SelectValue
                      placeholder={
                        newRes.endTime <= newRes.startTime
                          ? "Select valid times first"
                          : availableTables.length === 0
                          ? "No tables available"
                          : "Select a table"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent className="border-slate-700 bg-slate-900 text-slate-200">
                    {availableTables.map((table) => (
                      <SelectItem key={table.id} value={String(table.id)}>
                        Table {table.tableNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {newRes.date &&
                  newRes.startTime &&
                  newRes.endTime &&
                  newRes.endTime > newRes.startTime && (
                    <p className="text-[11px] text-slate-500">
                      {availableTables.length} table
                      {availableTables.length !== 1 ? "s" : ""} available for
                      this time.
                    </p>
                  )}
              </div>

              {/* Footer */}
              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !newRes.customerName.trim() ||
                    !newRes.phoneNumber.trim() ||
                    !newRes.tableId ||
                    newRes.endTime <= newRes.startTime
                  }
                  className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
