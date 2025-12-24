import {ChangeEvent, FC, useState, useEffect} from "react";
import {axiosInstance} from "@common/utils/axiosInstance";
import {AxiosError} from "axios";

interface EventItem {
    id: string;
    alias?: string;
    title: string;
    logo?: string;
    created_at?: string;
    ticket_price?: number;
    status?: string;
}

interface Attendee {
    attendee_name: string;
    attendee_email: string;
    customer_name: string;
    customer_email: string;
    invoice: {
        date: string;
        status: string;
        gateway: string;
        amount_paid: number;
        ticket_bought: string;
        quantity: number;
    };
}

const SearchSales: FC = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<
        null | "idle" | "loading" | "error" | "notfound" | "empty" | "found"
    >(null);
    const [message, setMessage] = useState<string | null>(null);
    const [csvLoading, setCsvLoading] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>([])

    const { AppAxios } = axiosInstance();

    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadEvents = async () => {
            setEventsLoading(true);
            setEventsError(null);
            try {
                const res = await AppAxios({ url: "/events/user" });
                // Response shape: { data: { events: [...] }, message, status }
                const ev = res?.data?.data?.events ?? res?.data?.events ?? [];
                if (!mounted) return;
                setEvents(Array.isArray(ev) ? ev : []);
                if (Array.isArray(ev) && ev.length > 0) {
                    setSelectedEventId(ev[0].id);
                }
            } catch (err) {
                setEventsError("Failed to load events");
            } finally {
                if (mounted) setEventsLoading(false);
            }
        };
        loadEvents();
        return () => { mounted = false; };
    }, []);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setStatus(null);
        setMessage(null);
    };

    const isValidEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleVerify = async () => {
        setMessage(null);
        if (!isValidEmail(email)) {
            setStatus("error");
            setMessage("Please enter a valid email address.");
            return;
        }
        setStatus("loading");

        try {
            const res = await AppAxios({url: `/verify-sales-email/${selectedEventId}/${encodeURIComponent(email)}`});
            setAttendees(res?.data?.data ?? [])
            setStatus("found");
        } catch (error : AxiosError | any) {
            setStatus("error")
            setMessage(error.response?.data?.message || "An error occurred while verifying the email.");
            return;
        }


    };

    const handleDownloadCSV = async () => {
        setCsvLoading(true);
        // Simulate preparing CSV (UI only)
        await new Promise((r) => setTimeout(r, 800));
        // Create a small mock CSV. In a real integration this would stream server data.
        const header = ["customer_email", "order_id", "event", "total"];
        const selectedEvent = events.find((e) => e.id === selectedEventId);
        const rows = [
            [
                email || "example@example.com",
                "ORDER1234",
                selectedEvent?.title || "Sample Event",
                selectedEvent?.ticket_price ? String(selectedEvent.ticket_price) : "100.00",
            ],
        ];
        const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales_${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setCsvLoading(false);
    };

    return (
        <div className="w-fullflex flex-col gap-2 bg-white border border-slate-200 rounded-lg shadow-sm p-3">

            <div className="w-full md:w-5/12 flex flex-col sm:flex-row items-center gap-2 ">
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Verify customer by email"
                    className="w-full sm:w-48 rounded-md border px-3 py-2 text-sm"
                    aria-label="Verify customer by email"
                />

                <select
                    value={selectedEventId ?? ""}
                    onChange={(e) => setSelectedEventId(e.target.value || null)}
                    className="w-full sm:w-56 rounded-md border px-3 py-2 text-sm bg-white"
                    aria-label="Select event"
                >
                    {eventsLoading && <option value="" disabled>Loading events...</option>}
                    {eventsError && <option value="" disabled>{eventsError}</option>}
                    {!eventsLoading && !eventsError && events.map((ev) => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                </select>

                <button
                    onClick={handleVerify}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                >
                    {status === "loading" ? (
                        <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : null}
                    Verify
                </button>

                <button
                    onClick={handleDownloadCSV}
                    disabled={csvLoading}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 ${
                        csvLoading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    title="Download all records as CSV (mock UI-only)"
                >
                    {csvLoading ? (
                        <svg className="animate-spin h-4 w-4 mr-2 text-slate-700" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : null}
                    Download CSV
                </button>
            </div>

            {/* Status messages */}
            <div className="w-full mt-4">
                {status === "error" && (
                    <p className="text-sm text-red-600">{message}</p>
                )}
                {status === "notfound" && (
                    <p className="text-sm text-yellow-700">{message}</p>
                )}
                {status === "empty" && (
                    <p className="text-sm text-yellow-700">{message}</p>
                )}
                {status === "found" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left px-2 py-1 border-b">Attendee</th>
                            <th className="text-left px-2 py-1 border-b">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendees.map((a, i) => (
                            <tr key={`${a.attendee_email}-${i}`} className="odd:bg-slate-50">
                              <td className="px-2 py-2 align-top">
                                {a.attendee_name} [{a.attendee_email}]
                              </td>
                              <td className="px-2 py-2">
                                <ul className="list-disc ml-5 space-y-1">
                                  <li>
                                    <strong>via customer:</strong> {a.customer_name} [{a.customer_email}]
                                  </li>
                                  <li>
                                    <strong>invoice date:</strong> {a.invoice?.date ?? "—"}
                                  </li>
                                  <li>
                                    <strong>status:</strong> {a.invoice?.status ?? "—"}
                                  </li>
                                  <li>
                                    <strong>gateway:</strong> {a.invoice?.gateway ?? "—"}
                                  </li>
                                  <li>
                                    <strong>amount:</strong>{" "}
                                    {typeof a.invoice?.amount_paid === "number"
                                      ? `$${a.invoice.amount_paid.toFixed(2)}`
                                      : "—"}
                                  </li>
                                  <li>
                                    <strong>ticket bought:</strong> {a.invoice?.ticket_bought ?? "—"}
                                  </li>
                                  <li>
                                    <strong>quantity:</strong> {a.invoice?.quantity ?? "—"}
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchSales;
