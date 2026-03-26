import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from './components/Layout';
import api from './api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_SHORT = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

function Availability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get('/availability');
        if (res.data && res.data.length > 0) {
          const dbData = res.data;
          const merged = [];
          DAYS.forEach((day) => {
            const daySlots = dbData.filter((d) => d.day === day);
            if (daySlots.length > 0) merged.push(...daySlots);
            else merged.push({ day, startTime: '09:00', endTime: '17:00', isActive: false });
          });
          setAvailability(merged);
        } else {
          setAvailability(
            DAYS.map((day) => ({
              day,
              startTime: '09:00',
              endTime: '17:00',
              isActive: day !== 'Saturday' && day !== 'Sunday',
            }))
          );
        }
      } catch (err) {
        toast.error('Failed to load availability settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const markChanged = () => setHasChanges(true);

  const handleToggle = (day) => {
    markChanged();
    const dayExists = availability.filter((item) => item.day === day && item.isActive);
    if (dayExists.length > 0) {
      setAvailability(availability.map((item) => (item.day === day ? { ...item, isActive: false } : item)));
    } else {
      let foundFirst = false;
      setAvailability(
        availability.map((item) => {
          if (item.day === day && !foundFirst) {
            foundFirst = true;
            return { ...item, isActive: true };
          }
          return item;
        })
      );
    }
  };

  const handleTimeChange = (id, field, value) => {
    markChanged();
    setAvailability(
      availability.map((item, index) =>
        item._id === id || (!item._id && index === id) ? { ...item, [field]: value } : item
      )
    );
  };

  const addSlot = (day) => {
    markChanged();
    const newSlot = { day, startTime: '09:00', endTime: '17:00', isActive: true };
    const lastIndex = availability.map((item) => item.day).lastIndexOf(day);
    const newAvailability = [...availability];
    newAvailability.splice(lastIndex + 1, 0, newSlot);
    setAvailability(newAvailability);
  };

  const removeSlot = (index) => {
    markChanged();
    const day = availability[index].day;
    const sameDaySlots = availability.filter((item) => item.day === day);
    if (sameDaySlots.length > 1) {
      setAvailability(availability.filter((_, i) => i !== index));
    } else {
      setAvailability(availability.map((item, i) => (i === index ? { ...item, isActive: false } : item)));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/availability', availability);
      toast.success('Availability saved successfully!');
      setHasChanges(false);
      const res = await api.get('/availability');
      if (res.data.length > 0) {
        const dbData = res.data;
        const merged = [];
        DAYS.forEach((day) => {
          const daySlots = dbData.filter((d) => d.day === day);
          if (daySlots.length > 0) merged.push(...daySlots);
          else merged.push({ day, startTime: '09:00', endTime: '17:00', isActive: false });
        });
        setAvailability(merged);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save availability.');
    } finally {
      setSaving(false);
    }
  };

  const activeDayCount = DAYS.filter((day) => availability.some((s) => s.day === day && s.isActive)).length;
  const totalSlots = availability.filter((s) => s.isActive).length;

  const formatTimeLabel = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const renderDayGroup = (day) => {
    const daySlots = availability.filter((item) => item.day === day);
    const isActive = daySlots.some((s) => s.isActive);
    const activeSlots = daySlots.filter((s) => s.isActive);
    const isWeekend = day === 'Saturday' || day === 'Sunday';

    return (
      <div
        key={day}
        className={`group/day relative transition-all duration-300 ${
          isActive
            ? 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]'
            : 'bg-transparent border border-transparent hover:bg-white/[0.01] hover:border-white/[0.04]'
        } rounded-2xl p-4 sm:p-5`}
      >
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">

          <div className="flex items-center gap-3 md:min-w-[160px] md:pt-1">
            <button
              onClick={() => handleToggle(day)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0c] ${
                isActive
                  ? 'bg-indigo-600 focus:ring-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-700/80 focus:ring-slate-500 hover:bg-slate-600/80'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex flex-col">
              <span
                className={`text-sm font-bold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {day}
              </span>
              {isActive && activeSlots.length > 0 && (
                <span className="text-[10px] text-slate-600 font-medium mt-0.5 hidden md:block">
                  {activeSlots.length} slot{activeSlots.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

<div className="flex-1 flex flex-col gap-2.5">
            {isActive ? (
              activeSlots.map((slot, sIdx) => {
                const globalIdx = availability.indexOf(slot);
                return (
                  <div
                    key={slot._id || `new-${day}-${sIdx}`}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="flex items-center gap-0 bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden transition-all duration-200 focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/10 hover:border-white/[0.12]">
                      <input
                        type="time"
                        className="bg-transparent border-none text-white text-sm font-semibold w-[100px] sm:w-[110px] px-3 py-2.5 outline-none [color-scheme:dark] text-center"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleTimeChange(slot._id || globalIdx, 'startTime', e.target.value)
                        }
                      />
                      <div className="flex items-center justify-center px-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-slate-600"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                      <input
                        type="time"
                        className="bg-transparent border-none text-white text-sm font-semibold w-[100px] sm:w-[110px] px-3 py-2.5 outline-none [color-scheme:dark] text-center"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleTimeChange(slot._id || globalIdx, 'endTime', e.target.value)
                        }
                      />
                    </div>

<button
                      onClick={() => removeSlot(globalIdx)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent text-slate-600 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 shrink-0"
                      title="Remove slot"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-2 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                <span className="text-xs text-slate-600 font-medium">Unavailable</span>
              </div>
            )}

{isActive && (
              <button
                onClick={() => addSlot(day)}
                className="flex items-center gap-2 py-1.5 px-3 w-fit rounded-lg text-[11px] font-bold text-indigo-400/70 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 mt-0.5"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add time slot
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-indigo-600/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[5%] w-[400px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto py-8 px-6 sm:px-10 lg:px-12">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
              <p className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-[0.25em]">
                Schedule
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Availability
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium max-w-md">
              Set your weekly hours. Guests can only book during these windows.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || !hasChanges}
            className={`group relative flex items-center gap-2.5 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 active:scale-[0.97] overflow-hidden whitespace-nowrap ${
              hasChanges
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30'
                : 'bg-white/[0.04] border border-white/[0.06] text-slate-500 cursor-default'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {hasChanges ? 'Save Changes' : 'Saved'}
              </>
            )}
            {hasChanges && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>

{!loading && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-white tabular-nums">{activeDayCount}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Active Days
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-white tabular-nums">{totalSlots}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Time Slots
              </p>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-400 tabular-nums flex items-center justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Live
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Status
              </p>
            </div>
          </div>
        )}

{loading ? (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-3 animate-pulse">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02]">
                <div className="w-11 h-6 bg-white/[0.06] rounded-full" />
                <div className="w-20 h-4 bg-white/[0.06] rounded-lg" />
                <div className="flex-1" />
                <div className="w-48 h-10 bg-white/[0.04] rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-xl">

            <div className="flex items-center gap-3 px-2 sm:px-3 py-3 mb-2">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Weekly Schedule
                </span>
              </div>
              <div className="flex-1 h-px bg-white/[0.04]" />

<div className="hidden sm:flex items-center gap-1">
                {DAYS.map((day) => {
                  const isActive = availability.some((s) => s.day === day && s.isActive);
                  return (
                    <div
                      key={day}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold uppercase transition-colors ${
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                          : 'bg-white/[0.02] text-slate-700 border border-transparent'
                      }`}
                      title={day}
                    >
                      {DAY_SHORT[day].charAt(0)}
                    </div>
                  );
                })}
              </div>
            </div>

<div className="space-y-1.5">{DAYS.map((day) => renderDayGroup(day))}</div>
          </div>
        )}

{!loading && (
          <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-0.5">Timezone Note</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                These hours are in your local timezone. Guests will see them converted to their own timezone automatically when booking.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Availability;
