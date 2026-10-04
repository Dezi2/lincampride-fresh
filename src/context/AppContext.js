import React, { createContext, useContext, useState } from 'react';
import { USER } from '../data/user';
import { SHUTTLES } from '../data/shuttles';

const AppContext = createContext(null);

const makeRef = () => 'BKG-' + Math.floor(1000 + Math.random() * 9000);

export function AppProvider({ children }) {
  const [balance, setBalance] = useState(USER.startingBalance);
  const [shuttles, setShuttles] = useState(SHUTTLES);
  const [activeTrip, setActiveTrip] = useState(null);
  const [history, setHistory] = useState([]);

  const ridesCompleted = USER.ridesCompleted + history.length;

  // Returns { ok, message } so the screen can show the right alert.
  const reserveSeat = (shuttleId) => {
    const shuttle = shuttles.find((s) => s.id === shuttleId);
    if (!shuttle) return { ok: false, message: 'That shuttle is no longer available.' };
    if (activeTrip) {
      return { ok: false, message: 'You already have an active booking. Cancel it on the Dashboard before booking another ride.' };
    }
    if (shuttle.seats <= 0) return { ok: false, message: 'This shuttle is full.' };
    if (balance < shuttle.fare) return { ok: false, message: 'Your wallet balance is too low for this ride.' };

    const trip = {
      ref: makeRef(),
      shuttleId: shuttle.id,
      driver: shuttle.driver,
      vehicle: shuttle.vehicle,
      from: shuttle.from,
      to: shuttle.to,
      fare: shuttle.fare,
      eta: shuttle.eta,
      bookedAt: new Date(),
    };

    setBalance((b) => b - shuttle.fare);
    setShuttles((list) => list.map((s) => (s.id === shuttleId ? { ...s, seats: s.seats - 1 } : s)));
    setActiveTrip(trip);
    setHistory((h) => [trip, ...h]);
    return { ok: true, message: `Seat reserved on ${shuttle.driver}'s shuttle!` };
  };

  const cancelTrip = () => {
    if (!activeTrip) return;
    setBalance((b) => b + activeTrip.fare);
    setShuttles((list) =>
      list.map((s) => (s.id === activeTrip.shuttleId ? { ...s, seats: s.seats + 1 } : s))
    );
    setHistory((h) => h.filter((t) => t.ref !== activeTrip.ref));
    setActiveTrip(null);
  };

  const value = { user: USER, balance, shuttles, activeTrip, history, ridesCompleted, reserveSeat, cancelTrip };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
